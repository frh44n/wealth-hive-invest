
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user } = useAuth();
  
  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <Header title="Login" showBack />
      <div className="container p-4 mt-8">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
