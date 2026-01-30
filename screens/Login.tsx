
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-8 animate-fade-in">
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-dark-green to-[#1a331a] p-6 rounded-[2.5rem] shadow-2xl rotate-3">
             <div className="border-2 border-primary/30 rounded-[1.8rem] p-1.5">
                <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>loyalty</span>
                </div>
             </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-dark-green mb-2">Jespark</h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">รางวัลและไลฟ์สไตล์</p>
        </div>

        <form className="w-full space-y-8 mt-4" onSubmit={handleLoginSubmit}>
           <div className="space-y-1 relative">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] absolute -top-2 left-0 bg-white pr-2 z-10">เบอร์โทรศัพท์มือถือ</label>
             <div className="flex items-center border-b-2 border-primary/20 focus-within:border-primary transition-all py-3 relative">
                <span className="material-symbols-outlined text-gray-400 mr-4">smartphone</span>
                <input 
                  type="tel" 
                  placeholder="08X XXX XXXX" 
                  className="bg-transparent border-none focus:ring-0 w-full text-xl font-bold p-0 placeholder-gray-200"
                />
             </div>
           </div>

           <div className="space-y-1 relative">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] absolute -top-2 left-0 bg-white pr-2 z-10">รหัสผ่าน</label>
             <div className="flex items-center border-b-2 border-primary/20 focus-within:border-primary transition-all py-3">
                <span className="material-symbols-outlined text-gray-400 mr-4">lock</span>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-transparent border-none focus:ring-0 w-full text-xl font-bold p-0 placeholder-gray-200"
                />
                <span className="material-symbols-outlined text-gray-400 cursor-pointer">visibility_off</span>
             </div>
           </div>

           <div className="flex justify-end -mt-4">
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')} 
                className="text-primary text-xs font-bold"
              >
                ลืมรหัสผ่าน?
              </button>
           </div>

           <button 
             type="submit"
             className="w-full bg-primary hover:bg-primary-dark text-dark-green font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
           >
             เข้าสู่ระบบ
             <span className="material-symbols-outlined font-black">arrow_forward</span>
           </button>
        </form>
      </div>

      <div className="pb-10 w-full">
         <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-gray-100" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">หรือเชื่อมต่อด้วย</span>
            <div className="flex-1 h-[1px] bg-gray-100" />
         </div>

         <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Face ID', icon: 'face_unlock' },
              { label: 'Google', icon: 'language' },
              { label: 'Line', icon: 'chat_bubble' }
            ].map(social => (
              <button key={social.label} className="flex flex-col items-center justify-center gap-1.5 h-24 rounded-3xl bg-gray-50 border border-gray-100 active:bg-primary/10 transition-colors group">
                 <span className="material-symbols-outlined text-3xl text-gray-400 group-active:text-primary transition-colors">{social.icon}</span>
                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{social.label}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Login;