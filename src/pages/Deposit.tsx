
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CopyIcon, InfoIcon } from 'lucide-react';

const Deposit = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [depositMethods, setDepositMethods] = useState<any[]>([]);
  const [upiOptions, setUpiOptions] = useState<any[]>([]);
  const [usdtAddress, setUsdtAddress] = useState('');
  const [usdtQrCode, setUsdtQrCode] = useState('');
  const [selectedUpi, setSelectedUpi] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDepositMethods = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch deposit methods
        const { data, error } = await supabase
          .from('deposit_methods')
          .select('*')
          .eq('active', true);
          
        if (error) throw error;
        
        setDepositMethods(data || []);
        
        // Extract UPI options
        const upiMethods = data?.filter(method => method.method === 'UPI') || [];
        setUpiOptions(upiMethods.map(method => method.details));
        if (upiMethods.length > 0) {
          setSelectedUpi(upiMethods[0].details);
        }
        
        // Check if user has a USDT address
        const { data: userData, error: userError } = await supabase
          .from('user_crypto')
          .select('usdt_address, usdt_qr_code')
          .eq('user_id', user.id)
          .single();
          
        if (userError && userError.code !== 'PGRST116') {  // PGRST116 is "no rows returned" error
          throw userError;
        }
        
        if (userData) {
          setUsdtAddress(userData.usdt_address);
          setUsdtQrCode(userData.usdt_qr_code);
        } else {
          // Generate USDT address for new user
          // In a real implementation, this would call an API to generate a TRC-20 address
          // For demo purposes, we'll use a placeholder
          const mockAddress = `T${Array(33).fill(0).map(() => 
            "0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
              Math.floor(Math.random() * 58)
            ]).join('')}`;
          
          const { error: createError } = await supabase
            .from('user_crypto')
            .insert({
              user_id: user.id,
              usdt_address: mockAddress,
              usdt_qr_code: 'https://via.placeholder.com/300x300?text=USDT+QR+Code'
            });
            
          if (createError) throw createError;
          
          setUsdtAddress(mockAddress);
          setUsdtQrCode('https://via.placeholder.com/300x300?text=USDT+QR+Code');
        }
      } catch (error) {
        console.error('Error fetching deposit methods:', error);
        toast({
          title: "Failed to load deposit methods",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepositMethods();
  }, [user]);

  const handleUpiSelect = (upi: any) => {
    setSelectedUpi(upi);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(usdtAddress).then(
      () => {
        toast({
          title: "Address copied",
          description: "USDT address copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Please copy the address manually",
          variant: "destructive"
        });
      }
    );
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedUpi) return;
    
    if (!utrNumber) {
      toast({
        title: "UTR number required",
        description: "Please enter the UTR number of your transaction",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Valid amount required",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a deposit request
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: Number(amount),
          status: 'pending',
          details: {
            method: 'UPI',
            upi_id: selectedUpi.upi_id,
            utr_number: utrNumber,
            upi_name: selectedUpi.name
          }
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Deposit request submitted",
        description: "Your deposit request has been submitted for verification",
      });
      
      setUtrNumber('');
      setAmount('');
    } catch (error: any) {
      console.error('Error submitting deposit request:', error);
      toast({
        title: "Failed to submit deposit request",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout requireAuth>
      <Header title="Deposit" showBack />
      
      <div className="container p-4 mb-16 max-w-3xl mx-auto">
        <Tabs defaultValue="upi">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="upi">UPI Deposit</TabsTrigger>
            <TabsTrigger value="usdt">USDT Deposit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi">
            <Card>
              <CardHeader>
                <CardTitle>UPI Deposit</CardTitle>
                <CardDescription>
                  Make a payment to one of our UPI IDs and submit the UTR number.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : upiOptions.length === 0 ? (
                  <div className="text-center p-6">
                    <p className="text-gray-500">No UPI payment options available at the moment.</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <Label className="mb-2 block">Select UPI Account</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upiOptions.map((upi, index) => (
                          <div 
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedUpi?.upi_id === upi.upi_id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200'
                            }`}
                            onClick={() => handleUpiSelect(upi)}
                          >
                            <p className="font-medium">{upi.name}</p>
                            <p className="text-sm text-gray-600">{upi.upi_id}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedUpi && (
                      <div className="mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
                          {selectedUpi.qr_code ? (
                            <img 
                              src={selectedUpi.qr_code} 
                              alt="UPI QR Code" 
                              className="mx-auto max-w-[200px]"
                            />
                          ) : (
                            <div className="h-[200px] flex items-center justify-center bg-gray-200 rounded">
                              <p>QR Code not available</p>
                            </div>
                          )}
                          <p className="mt-2 text-sm font-medium">{selectedUpi.upi_id}</p>
                        </div>
                        
                        <div className="bg-amber-50 p-3 rounded-md flex text-amber-800 text-sm mb-6">
                          <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                          <p>Please make the payment to the above UPI ID and submit the UTR number. Your deposit will be credited after verification.</p>
                        </div>
                        
                        <form onSubmit={handleUpiSubmit}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="amount">Amount (₹)</Label>
                              <Input
                                id="amount"
                                type="number"
                                placeholder="Enter deposit amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="utr">UTR Number / Reference ID</Label>
                              <Input
                                id="utr"
                                placeholder="Enter UTR number after payment"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                You can find this in your bank's transaction history
                              </p>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full bg-primary hover:bg-primary-dark"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usdt">
            <Card>
              <CardHeader>
                <CardTitle>USDT Deposit (TRC-20)</CardTitle>
                <CardDescription>
                  Send USDT to your unique TRC-20 address. Funds will be automatically converted to INR and credited to your deposit wallet.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-50 p-6 rounded-lg text-center mb-6">
                      {usdtQrCode ? (
                        <img 
                          src={usdtQrCode} 
                          alt="USDT Address QR Code" 
                          className="mx-auto max-w-[200px] mb-4"
                        />
                      ) : (
                        <div className="h-[200px] flex items-center justify-center bg-gray-200 rounded mb-4">
                          <p>QR Code not available</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center">
                        <div className="bg-white border rounded px-3 py-2 text-sm font-mono overflow-auto max-w-full">
                          {usdtAddress}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md text-blue-800">
                        <InfoIcon className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">USDT deposits are automatically processed</p>
                          <p className="mt-1">Once confirmed on the blockchain, your deposit will be converted to INR and credited to your deposit wallet.</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-md text-amber-800">
                        <p className="font-medium">Important Notes:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Only send USDT (TRC-20) to this address</li>
                          <li>Minimum deposit: 5 USDT</li>
                          <li>Current conversion rate: 1 USDT ≈ ₹83.50</li>
                          <li>Processing time: 10-30 minutes after blockchain confirmation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Deposit;
