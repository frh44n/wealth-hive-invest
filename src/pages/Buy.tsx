
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { PlanCard } from '@/components/ui/plan-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Buy = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Fetch investment plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .order('price', { ascending: true });
          
        if (error) throw error;
        
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast({
          title: "Failed to load plans",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Handle buy button click
  const handleBuyClick = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setSelectedPlan(plan);
      setIsDialogOpen(true);
    }
  };

  // Handle plan purchase
  const handlePurchase = async () => {
    if (!user || !profile || !selectedPlan) return;
    
    // Check if user has enough balance
    if ((profile.deposit_wallet || 0) < selectedPlan.price) {
      toast({
        title: "Insufficient balance",
        description: "Please add funds to your deposit wallet",
        variant: "destructive"
      });
      setIsDialogOpen(false);
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      // Calculate expiry date
      const purchaseDate = new Date();
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + selectedPlan.validity);
      
      // Add plan to user's purchased plans
      const { error: planError } = await supabase
        .from('user_plans')
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          purchase_date: purchaseDate.toISOString(),
          expiry_date: expiryDate.toISOString(),
          total_claimed: 0,
          active: true
        });
        
      if (planError) throw planError;
      
      // Deduct amount from deposit wallet
      const { error: walletError } = await supabase
        .from('profiles')
        .update({
          deposit_wallet: profile.deposit_wallet - selectedPlan.price
        })
        .eq('user_id', user.id);
        
      if (walletError) throw walletError;
      
      // Add transaction record
      const { error: txnError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'plan_purchase',
          amount: selectedPlan.price,
          status: 'completed',
          details: {
            plan_id: selectedPlan.id,
            plan_name: selectedPlan.name,
            validity: selectedPlan.validity,
            daily_earning: selectedPlan.daily_earning
          }
        });
        
      if (txnError) throw txnError;
      
      // Refresh user profile to get updated wallet balance
      await refreshProfile();
      
      toast({
        title: "Plan purchased successfully!",
        description: `You have successfully purchased ${selectedPlan.name}`,
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error purchasing plan:', error);
      toast({
        title: "Failed to purchase plan",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Layout requireAuth>
      <Header title="Investment Plans" />
      
      <div className="container p-4 mb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center p-10">
            <h3 className="text-xl font-semibold text-gray-600">No investment plans available</h3>
            <p className="text-gray-500 mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                price={plan.price}
                validity={plan.validity}
                dailyEarning={plan.daily_earning}
                image={plan.image_url}
                description={plan.description}
                onBuy={handleBuyClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Purchase confirmation dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">{selectedPlan.name}</span>
                <span className="text-xl font-bold">₹{selectedPlan.price}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Validity:</span>
                    <p>{selectedPlan.validity} days</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Daily Earning:</span>
                    <p>₹{selectedPlan.daily_earning}/day</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Earning:</span>
                    <p>₹{selectedPlan.daily_earning * selectedPlan.validity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">ROI:</span>
                    <p>{(((selectedPlan.daily_earning * selectedPlan.validity) - selectedPlan.price) / selectedPlan.price * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md text-amber-800 text-sm mb-4">
                <p>Amount will be deducted from your deposit wallet.</p>
                <p className="font-medium mt-1">Available balance: ₹{profile?.deposit_wallet || 0}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isPurchasing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isPurchasing || (profile?.deposit_wallet || 0) < (selectedPlan?.price || 0)}
              className="bg-primary hover:bg-primary-dark"
            >
              {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Buy;
