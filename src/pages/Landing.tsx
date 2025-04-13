
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';

const Landing = () => {
  return (
    <>
      <Header />
      
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Build Your Wealth with Smart Investments
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Join thousands of investors earning daily returns with our curated investment plans.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link to="/register">Get Started</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/login">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose WealthHive?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Returns</h3>
              <p className="text-gray-600">
                Earn daily passive income with our carefully selected investment plans.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your investments are protected with industry-leading security measures.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Referral Rewards</h3>
              <p className="text-gray-600">
                Earn bonuses by inviting friends and building your investment network.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create an account with your email</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
              <h3 className="font-semibold mb-2">Add Funds</h3>
              <p className="text-gray-600 text-sm">Deposit via UPI or USDT</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
              <h3 className="font-semibold mb-2">Choose Plans</h3>
              <p className="text-gray-600 text-sm">Select investment plans that suit you</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
              <h3 className="font-semibold mb-2">Earn Daily</h3>
              <p className="text-gray-600 text-sm">Collect your earnings every day</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join WealthHive today and start growing your wealth with our high-yield investment plans.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-primary hover:bg-primary-dark"
          >
            <Link to="/register">Create an Account</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Landing;
