
import { supabase } from '@/integrations/supabase/client'; // Use the main client
import { toast } from '@/hooks/use-toast';

export interface SignupData {
  email: string;
  mobile: string;
  password: string;
  invitationCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Sign up a new user
export const signUp = async (data: SignupData) => {
  try {
    const { email, password, mobile, invitationCode } = data;
    
    // Check if invitation code exists
    const { data: inviterData, error: inviterError } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', invitationCode)
      .single();
    
    if (inviterError || !inviterData) {
      toast({ 
        title: "Invalid invitation code", 
        description: "Please enter a valid invitation code to continue", 
        variant: "destructive" 
      });
      return null;
    }
    
    // Create the user
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          mobile,
          referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          referred_by: inviterData.id
        }
      }
    });
    
    if (error) throw error;
    
    // Create profile for new user
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          deposit_balance: 0,
          withdrawal_balance: 0,
          total_withdrawn: 0,
          referral_code: authData.user.user_metadata.referral_code,
          referred_by: authData.user.user_metadata.referred_by,
          phone: mobile
        });
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Continue despite profile error as auth was successful
      }
    }
    
    toast({
      title: "Verification email sent",
      description: "Please check your email to verify your account"
    });
    
    return authData;
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
};

// Sign in a user
export const signIn = async (data: LoginData) => {
  try {
    const { email, password } = data;
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    toast({
      title: "Login successful",
      description: "Welcome back!"
    });
    
    return authData;
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    toast({
      title: "Login failed",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
};

// Sign out a user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    toast({
      title: "Sign out failed",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};

// Get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
