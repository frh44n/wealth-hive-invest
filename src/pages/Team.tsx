
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Users } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  phone: string;
  created_at: string;
}

const Team = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user) return;
      
      try {
        if (profile?.referral_code) {
          setReferralCode(profile.referral_code);
          setReferralLink(`${window.location.origin}/register?ref=${profile.referral_code}`);
        }
        
        // Fetch team members (users referred by this user)
        const { data: teamData, error: teamError } = await supabase
          .from('profiles')
          .select('id, email, phone, created_at')
          .eq('referred_by', user.id);
          
        if (teamError) throw teamError;
        
        setTeamMembers(teamData || []);
      } catch (error) {
        console.error('Error fetching team data:', error);
        toast({
          title: "Failed to load team data",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamData();
  }, [user, profile]);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: `${type === 'code' ? 'Invitation code' : 'Referral link'} copied`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <Layout requireAuth>
      <Header title="My Team" />
      
      <div className="container p-4 mb-16">
        {/* Referral Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Referral Code</h2>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-gray-500 mb-1">Invitation Code</p>
                <div className="flex items-center">
                  <div className="bg-gray-50 border rounded-l-md px-3 py-2 flex-1 font-mono">
                    {referralCode}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => copyToClipboard(referralCode, 'code')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-gray-500 mb-1">Referral Link</p>
                <div className="flex items-center">
                  <div className="bg-gray-50 border rounded-l-md px-3 py-2 flex-1 truncate text-xs sm:text-sm">
                    {referralLink}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => copyToClipboard(referralLink, 'link')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Team Statistics Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Team Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-white/70 text-sm">Total Members</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : teamMembers.length}
                </p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-white/70 text-sm">New This Month</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : 
                    teamMembers.filter(member => {
                      const date = new Date(member.created_at);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && 
                             date.getFullYear() === now.getFullYear();
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Team Members List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">You haven't referred anyone yet. Share your invitation code to grow your team!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {teamMembers.map(member => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <p className="text-gray-500 text-sm">{member.phone}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Team;
