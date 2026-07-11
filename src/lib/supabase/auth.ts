import { supabase } from './client';
import type { User } from '@supabase/supabase-js';

// Sign in with Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Check if user is admin
export const isAdmin = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("admins")
    .select("email")
    .eq("email", email)
    .single();

  if (error || !data) return false;

  return true;
};
