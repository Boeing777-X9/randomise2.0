import { supabase } from '@/lib/supabase/client';

export const logAction = async (adminEmail: string, action: string, details: Record<string, any> = {}) => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([
        { 
          admin_email: adminEmail, 
          action: action, 
          details: details 
        }
      ]);

    if (error) {
      console.error('Failed to save audit log:', error);
    }
  } catch (err) {
    console.error('Audit logger error:', err);
  }
};