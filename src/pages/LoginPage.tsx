import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [identifier, setIdentifier] = useState('aarav.sharma@college.edu');
  const [password, setPassword] = useState('College@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'STUDENT') {
      setIdentifier('aarav.sharma@college.edu');
      setPassword('Student@2026');
    } else {
      setIdentifier('arvind.sharma@college.edu');
      setPassword('Faculty@2026');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your College ID or registered email.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter a valid password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(selectedRole, identifier, password);
      setIsLoading(false);

      // Strict role-specific routing: Student to /student/dashboard, Faculty to /faculty/dashboard
      if (selectedRole === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF0F9] via-[#F4F7FC] to-[#E8F0FE] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Soft neumorphic ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#4D8DFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#E8F0FE] rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4D8DFF] to-[#5687F6] text-white shadow-[0px_8px_20px_rgba(77,141,255,0.35)] mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] tracking-tight">
            CAMPUS ERP PORTAL
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#718096] font-medium">
            Academic Management & Student Information System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-[0px_10px_30px_rgba(112,144,176,0.14)] rounded-[24px] border border-white/80">
          <div className="mb-6">
            <label className="block text-[11px] font-bold text-[#718096] uppercase tracking-wider mb-2.5 text-center">
              Select Your Portal Role
            </label>

            {/* TWO ROLE SELECTION CARDS */}
            <div className="grid grid-cols-2 gap-3">
              {/* Student Role Button */}
              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'STUDENT'
                    ? 'border-[#4D8DFF] bg-[#E8F0FE]/70 shadow-[0px_4px_14px_rgba(77,141,255,0.20)]'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === 'STUDENT' ? 'bg-[#4D8DFF] text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  {selectedRole === 'STUDENT' && (
                    <CheckCircle2 className="w-4 h-4 text-[#4D8DFF]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2C3E50] block">Student</span>
                  <span className="text-[10px] text-[#718096] block mt-0.5">Scholars Desk</span>
                </div>
              </button>

              {/* Faculty Role Button */}
              <button
                type="button"
                onClick={() => handleRoleChange('FACULTY')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'FACULTY'
                    ? 'border-[#4D8DFF] bg-[#E8F0FE]/70 shadow-[0px_4px_14px_rgba(77,141,255,0.20)]'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === 'FACULTY' ? 'bg-[#4D8DFF] text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  {selectedRole === 'FACULTY' && (
                    <CheckCircle2 className="w-4 h-4 text-[#4D8DFF]" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2C3E50] block">Faculty</span>
                  <span className="text-[10px] text-[#718096] block mt-0.5">Professors & HODs</span>
                </div>
              </button>
            </div>

            {/* Quick Test Accounts Switcher */}
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Quick Test Accounts ({selectedRole === 'STUDENT' ? 'Student' : 'Faculty'}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole === 'STUDENT' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('aarav.sharma@college.edu'); setPassword('Student@2026'); }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${identifier.includes('aarav') ? 'bg-[#4D8DFF] text-white border-[#4D8DFF] font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    >
                      Aarav (CS2023001)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('31001'); setPassword('Student@2026'); }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${identifier === '31001' ? 'bg-[#4D8DFF] text-white border-[#4D8DFF] font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    >
                      Kavya (31001)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('31002'); setPassword('Student@2026'); }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${identifier === '31002' ? 'bg-[#4D8DFF] text-white border-[#4D8DFF] font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    >
                      Siddharth (31002)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('arvind.sharma@college.edu'); setPassword('Faculty@2026'); }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${identifier.includes('arvind') ? 'bg-[#4D8DFF] text-white border-[#4D8DFF] font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    >
                      Dr. Arvind (HOD)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('faculty1@example.edu'); setPassword('Faculty@2026'); }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${identifier === 'faculty1@example.edu' ? 'bg-[#4D8DFF] text-white border-[#4D8DFF] font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    >
                      Prof. Ashwini (faculty1)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('faculty2@example.edu'); setPassword('Faculty@2026'); }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${identifier === 'faculty2@example.edu' ? 'bg-[#4D8DFF] text-white border-[#4D8DFF] font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    >
                      Prof. Varun (faculty2)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 flex items-center gap-2 text-xs text-[#FF6B4A] font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">
                {selectedRole === 'STUDENT' ? 'Student Email / Roll Number *' : 'Faculty Email / Employee Code *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={selectedRole === 'STUDENT' ? 'e.g. CS2023001 or aarav@college.edu' : 'e.g. FAC-CSE-001 or arvind@college.edu'}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D8DFF] focus:bg-white text-[#2C3E50] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#2C3E50]">
                  Password *
                </label>
                <span className="text-[11px] text-[#4D8DFF] hover:underline cursor-pointer font-medium">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D8DFF] focus:bg-white text-[#2C3E50] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#2C3E50] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#4D8DFF] hover:bg-[#3A7AEB] text-white text-xs font-bold rounded-full shadow-[0px_6px_20px_rgba(77,141,255,0.35)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to {selectedRole === 'STUDENT' ? 'Student Dashboard' : 'Faculty Workspace'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer credentials reminder */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-[#718096] flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4D8DFF]" />
              <span>Academic Prototype Session • Credentials pre-filled</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
