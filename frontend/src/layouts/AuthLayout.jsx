import { Outlet, Link } from 'react-router-dom';
import { Notebook, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export const AuthLayout = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <section className="flex min-h-screen items-center justify-center pastel-mesh-bg p-4 relative overflow-hidden">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-6 top-6 z-50 rounded-full p-2.5 bg-white/20 hover:bg-white/40 border border-white/30 backdrop-blur-md text-gray-700 shadow-sm transition dark:bg-black/20 dark:border-white/10 dark:text-gray-300 dark:hover:bg-black/40"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Floating 3D Balloon Structures in Background */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
        {/* Soft Lavender Sphere */}
        <div className="absolute top-[12%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-tr from-purple-400/50 to-pink-300/40 backdrop-blur-[1px] animate-float-slow shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.4),_0_10px_30px_rgba(168,85,247,0.15)]" />

        {/* Soft Orange Sphere */}
        <div className="absolute top-[22%] right-[10%] w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400/60 to-yellow-200/40 backdrop-blur-[1px] animate-float-medium shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.4),_0_10px_25px_rgba(249,115,22,0.15)]" />

        {/* Lime Torus (Ring) representation */}
        <div className="absolute bottom-[15%] left-[8%] w-28 h-28 rounded-full border-[16px] border-lime-400/35 bg-transparent backdrop-blur-[1px] animate-float-fast shadow-[0_10px_25px_rgba(132,204,22,0.12)]" />

        {/* Pink Capsule representation */}
        <div className="absolute bottom-[20%] right-[12%] w-36 h-16 rounded-full bg-gradient-to-tr from-rose-400/50 to-pink-200/30 rotate-[35deg] animate-float-slow shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.4),_0_10px_25px_rgba(244,63,94,0.15)]" />

        {/* Large glass-like bubble */}
        <div className="absolute top-[48%] left-[6%] w-16 h-16 rounded-full bg-white/20 border border-white/40 backdrop-blur-md animate-float-medium shadow-[inset_-3px_-3px_10px_rgba(255,255,255,0.5),_0_8px_20px_rgba(255,255,255,0.1)]" />

        {/* Medium glass-like bubble */}
        <div className="absolute bottom-[40%] right-[6%] w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm animate-float-fast shadow-[inset_-3px_-3px_10px_rgba(255,255,255,0.3),_0_8px_20px_rgba(255,255,255,0.05)]" />

        {/* Small warm bubble */}
        <div className="absolute top-[8%] right-[32%] w-10 h-10 rounded-full bg-amber-300/30 animate-float-slow" />

        {/* Small lavender bubble */}
        <div className="absolute bottom-[8%] left-[38%] w-12 h-12 rounded-full bg-purple-300/30 animate-float-medium" />
      </div>

      {/* Form Container Card - centered in middle (z-10 to be above balloons) */}
      <section className="w-full max-w-4xl animate-slide-in z-10 relative px-4 sm:px-0">
        <section className="glass-panel rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
          
          {/* Left panel (Illustration) */}
          <section className="hidden md:flex md:w-1/2 bg-[#f8fafc] dark:bg-black/35 p-10 flex-col items-center justify-center border-r border-white/20 dark:border-white/10 relative overflow-hidden">
            {/* Ambient subtle glow inside left panel */}
            <div className="absolute top-[-20%] left-[-15%] w-60 h-60 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-15%] w-60 h-60 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
            
            {/* Custom vector illustration with float animation */}
            <div className="animate-float z-10 w-full flex justify-center">
              <svg viewBox="0 0 400 400" className="w-full max-w-[280px] h-auto drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background circle */}
                <circle cx="200" cy="200" r="160" fill="url(#bgGradient)" opacity="0.08" />
                
                {/* Clouds */}
                <path d="M70,120 C70,105 85,95 100,95 C110,95 120,100 125,108 C130,102 140,100 148,105 C158,110 160,122 155,130 C155,130 70,130 70,120 Z" fill="#cbd5e1" opacity="0.6" />
                <path d="M280,100 C280,85 295,75 310,75 C320,75 330,80 335,88 C340,82 350,80 358,85 C368,90 370,102 365,110 C365,110 280,110 280,100 Z" fill="#cbd5e1" opacity="0.4" />

                {/* Big Lock Icon in matching lavender/blue */}
                <rect x="220" y="140" width="100" height="80" rx="16" fill="url(#lockBodyGrad)" />
                <path d="M240,140 V105 C240,85 256,70 270,70 C284,70 300,85 300,105 V140" stroke="url(#lockShackleGrad)" strokeWidth="10" strokeLinecap="round" />
                {/* Checkmark inside lock */}
                <path d="M255,185 L268,198 L295,170" stroke="#a3e635" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

                {/* Character */}
                {/* Legs & Pants (Indigo/Blue) */}
                <path d="M165,225 L165,330 C165,335 155,335 150,335 C145,335 145,325 150,325 L150,225" fill="#4338ca" />
                {/* Walking right leg */}
                <path d="M165,225 L245,260 C250,262 252,268 250,272 C248,276 242,278 238,275 L165,238" fill="#4338ca" />
                
                {/* Right foot skin */}
                <path d="M242,274 L250,277 C254,279 256,283 252,286 C248,289 244,286 242,284 Z" fill="#fed7aa" />
                {/* Left foot skin */}
                <path d="M150,328 L142,333 C138,335 135,332 138,328 C140,325 145,325 150,325" fill="#fed7aa" />

                {/* Shirt (Lavender/Purple - Matching background) */}
                <path d="M152,175 C140,175 125,185 132,225 C135,245 178,245 180,225 C182,185 165,175 152,175 Z" fill="#818cf8" />
                
                {/* Arm holding phone */}
                <path d="M172,195 L220,205 C224,206 226,211 224,215 C222,219 217,221 213,220 L172,210" fill="#818cf8" stroke="#6366f1" strokeWidth="2" />
                {/* Hand skin */}
                <circle cx="222" cy="214" r="6" fill="#fed7aa" />
                {/* Smart Phone */}
                <rect x="223" y="202" width="10" height="20" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                <rect x="225" y="205" width="6" height="11" rx="1" fill="#f8fafc" />

                {/* Head & Neck */}
                <rect x="148" y="155" width="8" height="22" fill="#fed7aa" />
                <circle cx="152" cy="142" r="16" fill="#fed7aa" />
                
                {/* Glasses */}
                <circle cx="147" cy="142" r="6" stroke="#1e293b" strokeWidth="2" />
                <circle cx="159" cy="142" r="6" stroke="#1e293b" strokeWidth="2" />
                <line x1="153" y1="142" x2="153" y2="142" stroke="#1e293b" strokeWidth="2" />

                {/* Hair (Indigo/Dark Blue) */}
                <path d="M136,140 C136,128 144,120 156,120 C162,120 168,124 168,132 C168,136 166,140 162,140 C164,136 156,134 150,138 C144,142 136,144 136,140 Z" fill="#312e81" />

                {/* Ground circle */}
                <ellipse cx="165" cy="335" rx="55" ry="8" fill="#e2e8f0" />

                {/* Plant/Leaves details at bottom */}
                <path d="M70,320 C65,305 50,300 45,305 C40,310 42,325 55,330" fill="#cbd5e1" />
                <path d="M80,315 C75,300 85,295 90,300 C95,305 92,320 80,325" fill="#94a3b8" opacity="0.6" />
                <path d="M295,310 C290,300 280,295 275,300 C270,305 275,315 285,320" fill="#cbd5e1" />
                <path d="M305,315 C305,305 315,300 320,305 C325,310 320,320 310,325" fill="#94a3b8" opacity="0.4" />

                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                  <linearGradient id="lockBodyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="lockShackleGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c7d2fe" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <span className="mt-8 text-sm font-semibold text-gray-500 dark:text-gray-400 z-10 text-center px-4">
              Securely access your notes on any device
            </span>
          </section>

          {/* Right panel (Translucent Form Container) */}
          <section className="w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-between relative bg-white/5 dark:bg-black/10 backdrop-blur-md">
            {/* Glowing orb matching style from user attachment */}
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-cyan-400/20 dark:bg-cyan-500/15 blur-3xl pointer-events-none z-0" />
            
            <div className="z-10 w-full">
              <header className="mb-6 flex items-center justify-center gap-2.5">
                <Notebook className="h-9 w-9 text-primary-600 dark:text-primary-400" />
                <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Notes</span>
              </header>



              <main>
                <Outlet />
              </main>
            </div>

            <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 z-10">
              <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition">
                About
              </Link>
            </footer>
          </section>

        </section>
      </section>
    </section>
  );
};
