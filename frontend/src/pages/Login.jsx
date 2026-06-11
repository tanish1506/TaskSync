import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Google OAuth hash listener & session parsing
  useEffect(() => {
    const handleGoogleHashRedirect = () => {
      const hash = window.location.hash;
      if (hash && hash.includes("id_token=")) {
        const params = new URLSearchParams(hash.replace("#", "?"));
        const idToken = params.get("id_token");
        if (idToken) {
          try {
            // Decode Google JWT Token
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const profile = JSON.parse(jsonPayload);
            
            // Set user data
            const mockUser = {
              name: profile.name,
              email: profile.email,
              picture: profile.picture
            };
            
            localStorage.setItem('token', 'google_session_mock_' + idToken.substring(0, 20));
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            // Redirect to dashboard
            window.location.hash = "";
            window.location.href = '/dashboard';
          } catch (err) {
            console.error("Google authentication parsing error:", err);
            setErrorMsg("Failed to synchronize details from Google Identity Services.");
          }
        }
      }
    };
    handleGoogleHashRedirect();
  }, []);

  // Warning helper for unfinished logins
  const handleOAuthAlert = (provider) => {
    alert(`⚡ [TaskSync Secure Gateway]\n\nThe ${provider} OAuth2 integration node is currently locked and will be constructed in a future sprint!\n\nPlease register or login manually using your workspace credentials.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your institutional email and access key.');
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden selection:bg-primary selection:text-on-primary relative">

      {/* Ambient background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Background glow filters */}
        <div className="absolute top-[20%] left-[40%] w-[450px] h-[450px] bg-primary/4 rounded-full filter blur-[120px] animate-ambient-glow"></div>

        <div className="absolute bottom-[10%] left-[15%] w-[300px] h-[300px] bg-primary/2 rounded-full filter blur-[90px] animate-ambient-glow [animation-delay:3s]"></div>
      </div>

      {/* Left panel brand details */}
      <div className="hidden md:flex w-[45%] flex-col justify-between p-12 h-full border-r border-outline-variant/30 relative z-10 bg-background/50 backdrop-blur-md">
        <div className="mt-4">
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">TaskSync.</h1>
          <p className="text-on-surface-variant font-label-md text-label-md tracking-widest mt-1">PREMIUM MANAGEMENT</p>
        </div>

        <div className="max-w-sm border-l border-primary pl-6 py-1">
          <p className="font-headline-sm text-headline-sm text-on-surface italic leading-relaxed text-[20px]">
            "Efficiency is not just a tool; it is a standard of excellence."
          </p>
          <span className="block font-label-sm text-label-sm text-primary tracking-widest uppercase mt-3">
            The Executive Suite
          </span>
        </div>
      </div>

      {/* Right panel login form */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-6 md:p-12 h-full bg-surface-container-lowest/40 backdrop-blur-md z-10">

        <div className="w-full max-w-[380px] flex flex-col justify-center">

          <div className="mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-wide text-[28px]">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 text-[14px]">Sign in to your private workspace.</p>
          </div>

          {errorMsg && (
            <div className="mb-5 bg-error-container/10 border-l border-error p-3 text-error font-body-md text-[13px]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-label-sm text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2.5 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-body-md text-[14px] placeholder:text-on-surface-variant/30"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-label-sm text-[11px] text-on-surface uppercase tracking-widest font-semibold">
                  Access Key
                </label>
                <button type="button" className="text-[10px] text-primary tracking-wider uppercase hover:underline">
                  Forgot Key?
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2.5 px-3.5 pr-10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-body-md text-[14px] placeholder:text-on-surface-variant/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-on-surface-variant/60 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <input
                type="checkbox"
                id="keepActive"
                className="w-3.5 h-3.5 rounded-none border-outline-variant bg-background text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="keepActive" className="text-[11px] text-on-surface-variant uppercase tracking-wider cursor-pointer select-none">
                Keep Session Active
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-on-primary font-label-md text-[13px] uppercase font-bold tracking-widest rounded-none hover:opacity-95 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Authenticate Access'
              )}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-outline-variant/30 text-center">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3.5 font-bold">
              Or access via secure partner
            </p>
            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button 
                type="button" 
                onClick={() => handleOAuthAlert('Google')}
                className="flex items-center justify-center py-2.5 border border-outline-variant/40 hover:border-primary/50 bg-[#1c1c1e] hover:bg-[#242426] text-on-surface-variant hover:text-primary transition-all duration-300 rounded-none cursor-pointer"
                title="Authenticate with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>

              {/* GitHub */}
              <button 
                type="button" 
                onClick={() => handleOAuthAlert('GitHub')}
                className="flex items-center justify-center py-2.5 border border-outline-variant/40 hover:border-primary/50 bg-[#1c1c1e] hover:bg-[#242426] text-on-surface hover:text-primary transition-all duration-300 rounded-none cursor-pointer"
                title="Authenticate with GitHub"
              >
                <svg className="w-4 h-4 text-on-surface" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </button>

              {/* Facebook */}
              <button 
                type="button" 
                onClick={() => handleOAuthAlert('Facebook')}
                className="flex items-center justify-center py-2.5 border border-outline-variant/40 hover:border-primary/50 bg-[#1c1c1e] hover:bg-[#242426] text-on-surface-variant hover:text-primary transition-all duration-300 rounded-none cursor-pointer"
                title="Authenticate with Facebook"
              >
                <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </div>


          <div className="mt-6 text-center">
            <p className="text-[13px] text-on-surface-variant">
              New to the platform?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create Key Pass
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Background watermark */}
      <div className="fixed -bottom-6 -right-6 pointer-events-none opacity-[0.02] select-none z-0">
        <h2 className="font-body-md text-[240px] leading-none text-on-surface font-black tracking-tighter">SYNC</h2>
      </div>
    </div>
  );
};

export default Login;