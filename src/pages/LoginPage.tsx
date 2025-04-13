
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';

const LoginPage = () => {
  const { user } = useAuth();
  
  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <Header title="Welcome Back" showBack />
      <div className="container p-4 mt-8 mb-8 grid md:grid-cols-2 gap-8">
        {/* Carousel Section */}
        <div className="hidden md:block">
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <Card className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1543161546-1f6b5173024d" 
                    alt="Investment Growth" 
                    className="w-64 h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Grow Your Wealth</h3>
                  <p className="text-gray-600">Smart investment strategies tailored to your financial goals.</p>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1579621970563-5169677e4c27" 
                    alt="Financial Freedom" 
                    className="w-64 h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Financial Freedom</h3>
                  <p className="text-gray-600">Unlock your potential with our innovative investment plans.</p>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1634017839376-5c3d1f4098a6" 
                    alt="Secure Investments" 
                    className="w-64 h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Secure Investments</h3>
                  <p className="text-gray-600">Transparent and secure investment platform with proven results.</p>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        {/* Login Form */}
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
