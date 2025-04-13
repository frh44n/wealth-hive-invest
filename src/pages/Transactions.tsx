
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowDownToLine, ArrowUpFromLine, Package, Check, XCircle, Clock } from 'lucide-react';

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Failed to load transactions",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);

  const getTransactionsByCategory = (category: string) => {
    if (category === 'all') return transactions;
    return transactions.filter(txn => txn.type === category);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="h-5 w-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpFromLine className="h-5 w-5 text-red-500" />;
      case 'plan_purchase':
        return <Package className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'plan_purchase':
        return 'Plan Purchase';
      case 'daily_earning':
        return 'Daily Earning';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout requireAuth>
      <Header title="Transactions" showBack />
      
      <div className="container p-4 mb-16">
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposit">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            <TabsTrigger value="plan_purchase">Purchases</TabsTrigger>
          </TabsList>
          
          {['all', 'deposit', 'withdrawal', 'plan_purchase'].map(category => (
            <TabsContent key={category} value={category}>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : getTransactionsByCategory(category).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No {category === 'all' ? 'transactions' : category} found.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {getTransactionsByCategory(category).map(txn => (
                    <Card key={txn.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-gray-100 mr-3">
                              {getTypeIcon(txn.type)}
                            </div>
                            <div>
                              <p className="font-medium">{getTypeLabel(txn.type)}</p>
                              <p className="text-xs text-gray-500">{formatDate(txn.created_at)}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center">
                              <p className="font-semibold mr-2">
                                ₹{txn.amount.toFixed(2)}
                              </p>
                              {getStatusIcon(txn.status)}
                            </div>
                            <p className="text-xs text-gray-500 capitalize">{txn.status}</p>
                          </div>
                        </div>
                        
                        {txn.details && txn.type === 'plan_purchase' && (
                          <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                            <p>Plan: {txn.details.plan_name}</p>
                          </div>
                        )}
                        
                        {txn.details && txn.type === 'deposit' && txn.details.method === 'UPI' && (
                          <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                            <p>UTR: {txn.details.utr_number}</p>
                            <p>UPI: {txn.details.upi_id}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Transactions;
