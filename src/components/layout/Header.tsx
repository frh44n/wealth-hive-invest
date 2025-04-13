
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronLeft } from 'lucide-react';
import { signOut } from '@/lib/auth';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
}

const Header = ({ title, showBack = false, showLogout = false }: HeaderProps) => {
  const { user } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <div className="flex items-center">
          {showBack && (
            <Link to="/" className="mr-2">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          )}
          <h1 className="text-xl font-semibold">{title || 'WealthHive Invest'}</h1>
        </div>
        
        <div>
          {user ? (
            showLogout ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-gray-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : null
          ) : (
            <div className="space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary-dark">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
