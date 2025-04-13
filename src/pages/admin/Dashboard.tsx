
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Users, Wallet, Package, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalPlans: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // Get total users
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Get deposits stats
        const { data: depositData, error: depositError } = await supabase
          .from('transactions')
          .select('amount, status')
          .eq('type', 'deposit');
          
        if (depositError) throw depositError;
        
        const totalDeposits = depositData
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => sum + tx.amount, 0);
          
        const pendingDeposits = depositData
          .filter(tx => tx.status === 'pending')
          .length;
          
        // Get withdrawals stats
        const { data: withdrawalData, error: withdrawalError } = await supabase
          .from('transactions')
          .select('amount, status')
          .eq('type', 'withdrawal');
          
        if (withdrawalError) throw withdrawalError;
        
        const totalWithdrawals = withdrawalData
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => sum + tx.amount, 0);
          
        const pendingWithdrawals = withdrawalData
          .filter(tx => tx.status === 'pending')
          .length;
        
        // Get plans stats
        const { count: plansCount, error: plansError } = await supabase
          .from('plans')
          .select('id', { count: 'exact', head: true });
          
        if (plansError) throw plansError;
        
        setStats({
          totalUsers: usersCount || 0,
          totalDeposits,
          totalWithdrawals,
          totalPlans: plansCount || 0,
          pendingDeposits,
          pendingWithdrawals
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast({
          title: "Failed to load admin dashboard",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout requireAuth adminOnly>
      <Header title="Admin Dashboard" />
      
      <div className="container p-4 mb-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild>
              <Link to="/admin/requests">View Requests</Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Total Users</span>
                    <Users className="h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Total Deposits</span>
                    <ArrowDownToLine className="h-5 w-5 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₹{stats.totalDeposits.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Total Withdrawals</span>
                    <ArrowUpFromLine className="h-5 w-5 text-red-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₹{stats.totalWithdrawals.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Investment Plans</span>
                    <Package className="h-5 w-5 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.totalPlans}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Pending Requests */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Deposit Requests</CardTitle>
                    <CardDescription>Pending approval</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p className="text-3xl font-bold">{stats.pendingDeposits}</p>
                    <Button asChild>
                      <Link to="/admin/deposits">View All</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Withdrawal Requests</CardTitle>
                    <CardDescription>Pending approval</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p className="text-3xl font-bold">{stats.pendingWithdrawals}</p>
                    <Button asChild>
                      <Link to="/admin/withdrawals">View All</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/admin/plans">
                  <Card className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6 flex items-center">
                      <Package className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <p className="font-semibold">Manage Plans</p>
                        <p className="text-sm text-gray-500">Add or edit investment plans</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/admin/upi">
                  <Card className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6 flex items-center">
                      <Wallet className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <p className="font-semibold">Manage UPI</p>
                        <p className="text-sm text-gray-500">Configure UPI payment options</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/admin/usdt">
                  <Card className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6 flex items-center">
                      <svg 
                        className="h-6 w-6 mr-4 text-primary" 
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <div>
                        <p className="font-semibold">USDT Settings</p>
                        <p className="text-sm text-gray-500">Configure USDT conversion rate</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
