
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AlertCircle, InfoIcon } from 'lucide-react';

const Withdraw = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const minWithdrawal = 100;
  const availableBalance = profile?.withdrawal_wallet || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setAmount(value);
    } else {
      setBankDetails(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const amountNum = Number(amount);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amountNum < minWithdrawal) {
      newErrors.amount = `Minimum withdrawal amount is ₹${minWithdrawal}`;
    } else if (amountNum > availableBalance) {
      newErrors.amount = 'Insufficient balance';
    }
    
    if (!bankDetails.accountHolder.trim()) {
      newErrors.accountHolder = 'Account holder name is required';
    }
    
    if (!bankDetails.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(bankDetails.accountNumber.trim())) {
      newErrors.accountNumber = 'Please enter a valid account number';
    }
    
    if (!bankDetails.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode.trim())) {
      newErrors.ifscCode = 'Please enter a valid IFSC code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const amountNum = Number(amount);
      
      // Create withdrawal request
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: amountNum,
          status: 'pending',
          details: {
            bank_details: {
              account_holder: bankDetails.accountHolder,
              account_number: bankDetails.accountNumber,
              ifsc_code: bankDetails.ifscCode
            }
          }
        })
        .select();
        
      if (error) throw error;
      
      // Deduct from withdrawal wallet temporarily
      const { error: walletError } = await supabase
        .from('profiles')
        .update({
          withdrawal_wallet: profile.withdrawal_wallet - amountNum
        })
        .eq('user_id', user.id);
        
      if (walletError) throw walletError;
      
      // Refresh profile to get updated wallet balance
      await refreshProfile();
      
      toast({
        title: "Withdrawal request submitted",
        description: "Your withdrawal request has been submitted for processing",
      });
      
      setAmount('');
      setBankDetails({
        accountHolder: '',
        accountNumber: '',
        ifscCode: ''
      });
    } catch (error: any) {
      console.error('Error submitting withdrawal request:', error);
      toast({
        title: "Failed to submit withdrawal request",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout requireAuth>
      <Header title="Withdraw" showBack />
      
      <div className="container p-4 mb-16 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>
              Withdraw your earnings to your bank account. Minimum withdrawal amount is ₹{minWithdrawal}.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Available Balance</p>
                <p className="text-2xl font-bold">₹{availableBalance.toFixed(2)}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleChange}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md flex text-blue-800 text-sm">
                <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>Bank transfers typically process within 24-48 hours after approval.</p>
              </div>
              
              <div>
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input
                  id="accountHolder"
                  name="accountHolder"
                  placeholder="Enter account holder name"
                  value={bankDetails.accountHolder}
                  onChange={handleChange}
                />
                {errors.accountHolder && (
                  <p className="text-red-500 text-xs mt-1">{errors.accountHolder}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={handleChange}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  name="ifscCode"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={handleChange}
                  className="uppercase"
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
                )}
              </div>
              
              {Number(amount) > availableBalance && (
                <div className="bg-red-50 p-3 rounded-md flex text-red-800 text-sm">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>Insufficient balance. Available balance: ₹{availableBalance.toFixed(2)}</p>
                </div>
              )}
            </form>
          </CardContent>
          
          <CardFooter>
            <Button
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={handleSubmit}
              disabled={isSubmitting || Number(amount) > availableBalance || Number(amount) < minWithdrawal}
            >
              {isSubmitting ? 'Processing...' : 'Submit Withdrawal Request'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Withdraw;
