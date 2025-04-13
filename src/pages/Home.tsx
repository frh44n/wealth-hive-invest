
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [posters, setPosters] = useState<any[]>([]);
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch announcements
        const { data: announcementsData } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (announcementsData) {
          setAnnouncements(announcementsData);
        }
        
        // Fetch posters
        const { data: postersData } = await supabase
          .from('posters')
          .select('*')
          .eq('active', true)
          .order('order');
          
        if (postersData) {
          setPosters(postersData);
        }
        
        // Fetch active plans
        const { data: plansData } = await supabase
          .from('user_plans')
          .select(`
            id,
            purchase_date,
            expiry_date,
            last_claimed,
            plans(name, daily_earning)
          `)
          .eq('user_id', user.id)
          .eq('active', true);
          
        if (plansData) {
          setActivePlans(plansData);
          
          // Check if claimed today
          const today = new Date().toISOString().split('T')[0];
          const hasAllClaimedToday = plansData.every(plan => {
            if (!plan.last_claimed) return false;
            const lastClaimedDate = new Date(plan.last_claimed).toISOString().split('T')[0];
            return lastClaimedDate === today;
          });
          
          setHasClaimedToday(hasAllClaimedToday && plansData.length > 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!user || !profile || hasClaimedToday || activePlans.length === 0) return;
    
    setIsClaimLoading(true);
    
    try {
      const today = new Date().toISOString();
      let totalClaimed = 0;
      
      // Update each plan with claim info
      for (const plan of activePlans) {
        const dailyEarning = plan.plans?.daily_earning || 0;
        
        const { error } = await supabase
          .from('user_plans')
          .update({
            last_claimed: today,
            total_claimed: plan.total_claimed + dailyEarning
          })
          .eq('id', plan.id);
          
        if (error) throw error;
        
        totalClaimed += dailyEarning;
      }
      
      // Add to withdrawal wallet
      if (totalClaimed > 0) {
        const { error } = await supabase
          .from('profiles')
          .update({
            withdrawal_wallet: profile.withdrawal_wallet + totalClaimed
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Rewards Claimed!",
        description: `₹${totalClaimed.toFixed(2)} has been added to your withdrawal wallet.`,
      });
      
      setHasClaimedToday(true);
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      toast({
        title: "Failed to claim rewards",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsClaimLoading(false);
    }
  };
  
  // Placeholder posters if none from DB
  const defaultPosters = [
    {
      id: '1',
      image_url: 'https://via.placeholder.com/800x400/9b87f5/ffffff?text=Special+Offer',
      title: 'Limited Time Offer'
    },
    {
      id: '2',
      image_url: 'https://via.placeholder.com/800x400/7E69AB/ffffff?text=New+Investment+Plan',
      title: 'New Investment Plans'
    },
    {
      id: '3',
      image_url: 'https://via.placeholder.com/800x400/F97316/ffffff?text=Referral+Bonus',
      title: 'Referral Bonus'
    }
  ];
  
  const displayPosters = posters.length > 0 ? posters : defaultPosters;
  
  return (
    <Layout requireAuth>
      <Header title="WealthHive" />
      
      <div className="container p-4 mb-6">
        {/* Carousel */}
        <Carousel className="mb-8">
          <CarouselContent>
            {displayPosters.map((poster) => (
              <CarouselItem key={poster.id}>
                <div className="p-1">
                  <img 
                    src={poster.image_url} 
                    alt={poster.title} 
                    className="rounded-lg w-full h-40 md:h-56 object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        
        {/* Claim Center */}
        <div className="mb-8 text-center">
          <Button
            onClick={handleClaimRewards}
            disabled={hasClaimedToday || activePlans.length === 0 || isClaimLoading}
            className={`${
              hasClaimedToday ? 'bg-gray-400' : 'bg-accent hover:bg-accent/90'
            } w-full md:max-w-xs mx-auto text-white font-semibold py-6 rounded-xl shadow-lg`}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {hasClaimedToday 
              ? "Rewards Claimed Today" 
              : activePlans.length === 0
                ? "Purchase Plans to Earn"
                : "Claim Daily Rewards"}
          </Button>
          
          {!hasClaimedToday && activePlans.length > 0 && (
            <p className="text-green-600 text-sm mt-2">
              You have {activePlans.length} active plan{activePlans.length > 1 ? 's' : ''} ready for rewards
            </p>
          )}
          
          {activePlans.length === 0 && (
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              <Link to="/buy">View Investment Plans</Link>
            </Button>
          )}
        </div>
        
        {/* Announcements */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
            Platform Updates
          </h2>
          
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center text-gray-500">
                Welcome to WealthHive! Start investing today.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
