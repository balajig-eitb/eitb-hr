import React, { useState,useEffect } from 'react';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

// High-quality mock avatars for the animated background
const AVATARS = [
  '/images/adi.gif?w=200&h=200&fit=crop',
  '/images/candace.gif?w=200&h=200&fit=crop',
  '/images/malini.gif?w=200&h=200&fit=crop',
  '/images/ashwin.gif?w=200&h=200&fit=crop',
  '/images/stalin.gif?w=200&h=200&fit=crop',
  '/images/jency.gif?w=200&h=200&fit=crop',
  '/images/malini.gif?w=200&h=200&fit=crop',
  '/images/candace.gif?w=200&h=200&fit=crop',
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
  setIsLoading(true);

  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    `${import.meta.env.VITE_API_URL}/auth/google`,
    "GoogleSSO",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (!popup) {
    setIsLoading(false);
    alert("Popup blocked. Please allow popups.");
    return;
  }
};

useEffect(() => {
  const handleMessage = async (event: MessageEvent) => {
    console.log("MESSAGE RECEIVED:", event);
    if (event.origin !== import.meta.env.VITE_API_URL) return;

    if (event.data?.type === "GOOGLE_LOGIN_SUCCESS") {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.authenticated) {
          setIsLoading(false);
          onLogin(); // ✅ REAL LOGIN
        }
      } catch (err) {
        setIsLoading(false);
        console.error("Auth check failed", err);
      }
    }
    else if (event.data?.type === "GOOGLE_LOGIN_FAILED") {
      setIsLoading(false);
      alert("Only company emails are allowed");
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);



  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      {/* Left Side - Animated Visuals (The "Office Window") */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Deep Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 z-0"></div>
        
        {/* Atmospheric Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[150px] opacity-10"></div>

        {/* Floating Avatars Grid (The "Rounded Level Animated Window") */}
        <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-40">
             <div className="grid grid-cols-3 gap-6 transform -rotate-12 scale-110">
                {[...AVATARS, ...AVATARS].map((src, idx) => (
                    <div 
                        key={idx} 
                        className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 animate-float hover:scale-105 transition-transform duration-500 hover:border-white/20 hover:opacity-100"
                        style={{ 
                            animationDelay: `${idx * 0.7}s`,
                            animationDuration: `${6 + (idx % 3)}s`,
                            backgroundImage: `url(${src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    ></div>
                ))}
             </div>
        </div>

        {/* Branding Content Overlay */}
        <div className="relative z-20 mt-auto backdrop-blur-sm bg-black/10 p-6 rounded-3xl border border-white/5">
             <div className="filter brigtness-0 invert w-56 mb-5"><img src="/images/logo.png" /></div>
             <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
               Empower your team with <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Intelligent HR</span>
             </h1>
             <p className="text-slate-300 text-lg max-w-md leading-relaxed">
               Experience the next generation of workforce management. AI-driven insights, seamless recruitment, and organized team structures.
             </p>
             
             {/* <div className="mt-8 flex items-center gap-4 text-sm text-slate-300 font-medium">
                <div className="flex -space-x-3">
                    {AVATARS.slice(0,4).map((src, i) => (
                        <img key={i} src={src} className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" alt="User" />
                    ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold">Trusted by Leaders</span>
                  <span className="text-xs text-slate-400">Join 500+ companies</span>
                </div>
             </div> */}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4 text-indigo-600">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 mt-2 text-base">Please sign in to access the dashboard</p>
            </div>

            <div className="space-y-6">
                 <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold py-4 px-4 rounded-xl transition-all duration-200 group relative overflow-hidden shadow-sm hover:shadow-md"
                 >
                    {isLoading ? (
                        <Loader2 className="animate-spin text-indigo-600" size={24} />
                    ) : (
                        <>
                           <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                           <span className="text-lg">Sign in with Google</span>
                        </>
                    )}
                 </button>
                 
                 <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-bold tracking-widest">Secure Access</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                 </div>

                 <div className="bg-indigo-50/50 rounded-2xl p-5 flex gap-4 items-start border border-indigo-100">
                    <CheckCircle2 className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900 mb-1">Restricted Area</h4>
                      <p className="text-xs text-indigo-800/80 leading-relaxed">
                          This portal is for authorized EITB HR personnel only. Unauthorized access attempts are monitored and logged.
                      </p>
                    </div>
                 </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-xs text-slate-400 font-medium">
                  &copy; {new Date().getFullYear()} EITB AI. All rights reserved.
              </p>
            </div>
        </div>
      </div>
      
      {/* Custom Animations Styles */}
      <style>{`
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
