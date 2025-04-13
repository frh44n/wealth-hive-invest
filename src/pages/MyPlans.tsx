
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

const MyPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_plans')
          .select(`
            id,
            purchase_date,
            expiry_date,
            last_claimed,
            active,
            total_claimed,
            plans (
              id,
              name,
              price,
              validity,
              daily_earning,
              description,
              image_url
            )
          `)
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });
          
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
  }, [user]);

  const getTimeRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const isClaimableToday = (lastClaimed: string | null) => {
    if (!lastClaimed) return true;
    
    const lastDate = new Date(lastClaimed);
    const today = new Date();
    
    return lastDate.getDate() !== today.getDate() || 
           lastDate.getMonth() !== today.getMonth() || 
           lastDate.getFullYear() !== today.getFullYear();
  };

  return (
    <Layout requireAuth>
      <Header title="My Plans" showBack />
      
      <div className="container p-4 mb-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <p>You haven't purchased any investment plans yet.</p>
              <Badge variant="outline" className="mt-2">
                <a href="/buy">View Available Plans</a>
              </Badge>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {plans.map(plan => (
              <Card key={plan.id} className={plan.active ? '' : 'opacity-75'}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.plans?.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {new Date(plan.purchase_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={plan.active ? 'default' : 'outline'} className={plan.active ? 'bg-green-600' : 'text-gray-500'}>
                      {plan.active ? 'Active' : 'Expired'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Daily Earning</p>
                      <p className="font-semibold">₹{plan.plans?.daily_earning}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Earned</p>
                      <p className="font-semibold">₹{plan.total_claimed}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Plan Status</p>
                      <div className="flex justify-between text-sm">
                        <span>Valid Till: {new Date(plan.expiry_date).toLocaleDateString()}</span>
                        {plan.active && <span>{getTimeRemaining(plan.expiry_date)}</span>}
                      </div>
                    </div>
                  </div>
                  
                  {plan.active && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50 mt-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Daily Rewards</p>
                        <div className="flex justify-between items-center text-sm">
                          <span>
                            {isClaimableToday(plan.last_claimed) 
                              ? 'Ready to claim today!' 
                              : `Last claimed: ${new Date(plan.last_claimed).toLocaleDateString()}`}
                          </span>
                          {isClaimableToday(plan.last_claimed) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPlans;
