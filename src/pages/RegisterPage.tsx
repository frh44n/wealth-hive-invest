
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
  const { user } = useAuth();
  
  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <Header title="Create Account" showBack />
      <div className="container p-4 mt-8 mb-8">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
