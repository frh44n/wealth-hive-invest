
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import { WalletCard } from '@/components/ui/wallet-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  Package, 
  MessageCircle, 
  ExternalLink, 
  LogOut
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Menu = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    await signOut();
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Layout requireAuth>
      <Header title="Menu" />
      
      <div className="container p-4 mb-16">
        {/* Wallet Balances */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Wallet Balances</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <WalletCard 
              title="Deposit Wallet" 
              amount={profile?.deposit_wallet || 0} 
              type="deposit" 
            />
            
            <WalletCard 
              title="Withdrawal Wallet" 
              amount={profile?.withdrawal_wallet || 0} 
              type="withdrawal" 
            />
            
            <WalletCard 
              title="Total Withdrawn" 
              amount={profile?.total_withdrawn || 0} 
              type="total" 
            />
          </div>
        </div>
        
        {/* Menu Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/deposit">
              <Button 
                variant="outline" 
                className="w-full justify-start h-14" 
              >
                <ArrowDownToLine className="mr-2 h-5 w-5 text-primary" />
                <span>Deposit</span>
              </Button>
            </Link>
            
            <Link to="/withdraw">
              <Button 
                variant="outline" 
                className="w-full justify-start h-14" 
              >
                <ArrowUpFromLine className="mr-2 h-5 w-5 text-investment-red" />
                <span>Withdraw</span>
              </Button>
            </Link>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <Link to="/plans">
              <Button 
                variant="outline" 
                className="w-full justify-start h-14" 
              >
                <Package className="mr-2 h-5 w-5 text-gray-700" />
                <span>My Purchased Plans</span>
              </Button>
            </Link>
            
            <Link to="/transactions">
              <Button 
                variant="outline" 
                className="w-full justify-start h-14" 
              >
                <History className="mr-2 h-5 w-5 text-gray-700" />
                <span>Transaction History</span>
              </Button>
            </Link>
            
            <Separator className="my-6" />
            
            <h3 className="font-medium">Customer Support</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => openExternalLink('https://wa.me/1234567890')}
              >
                <svg 
                  className="mr-2 h-5 w-5 text-green-600" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M22 12.136C22 6.591 17.532 2.1 12 2.1S2 6.591 2 12.136C2 16.412 4.903 20.081 9 21.321V15.5h-2v-3h2v-2c0-2 1-3 3-3h2v3h-1c-.553 0-1 .447-1 1v1h2l-.5 3H12v5.83c5.005-1.267 9-5.612 9-11.294z" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
                <span>WhatsApp Support</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => openExternalLink('https://t.me/username')}
              >
                <svg 
                  className="mr-2 h-5 w-5 text-blue-500" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.04.01-.19-.08-.27s-.23-.05-.33-.03c-.14.03-2.29 1.45-6.46 4.26-.61.42-1.17.63-1.66.61-.55-.03-1.6-.31-2.38-.57-.96-.32-1.72-.49-1.65-.98.04-.26.32-.51.85-.76.5-.25 6.21-2.62 6.77-2.86 2.62-1.17 3.17-1.38 3.53-1.38.08 0 .24.03.35.16.12.14.14.34.12.47z"/>
                </svg>
                <span>Telegram Support</span>
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
