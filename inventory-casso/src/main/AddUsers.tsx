import { useEffect, useState } from 'react';
import { UserPlus, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/Toast';

export default function AddUser() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/', { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const rawRole = (!error && data?.role) ? data.role.toLowerCase().trim() : 'user';
      const isAdmin = rawRole === 'admin' || rawRole === 'administrator';

      if (!isAdmin) {
        showToast('Access denied: Admin privileges required', 'error');
        navigate('/dashboard', { replace: true });
        return;
      }

      setCheckingAccess(false);
    };

    checkAccess();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName || !formData.password || !formData.confirmPassword) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSaving(true);
    const { data: { session: adminSession } } = await supabase.auth.getSession();

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (signUpData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: signUpData.user.id, 
          email: formData.email,
          full_name: formData.fullName, 
          role: formData.role 
        }]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    if (adminSession) {
      const { error: restoreError } = await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });

      if (restoreError) {
        showToast('Created user, but failed to restore admin session. Please re-login.', 'error');
      } else {
        window.dispatchEvent(new Event('casso:refresh-role'));
      }
    }
    
    setSaving(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('User added successfully!', 'success');
      setIsModalOpen(false);
      navigate('/dashboard');
    }
  };

  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 font-[var(--heading)]">Add User</h2>
        <p className="text-sm text-gray-500">Create a new user account for the system.</p>
      </div>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="self-start flex items-center gap-3 px-4 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <UserPlus className="w-5 h-5" />
        <span className="font-medium">Add New User</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden relative transform scale-100 transition-transform border border-gray-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg">Add User</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
<div className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-black text-sm focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all outline-none font-medium"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-black text-sm focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all outline-none font-medium"
                      placeholder="e.g. user@domain.com"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-black text-sm focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all outline-none font-medium"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Password</label>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-black text-sm focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all outline-none font-medium"
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">Confirm Password</label>
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-black text-sm focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all outline-none resize-none"
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                </div>

              <div className="mt-8">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-[#166534] hover:bg-[#14532d] text-white py-3 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
