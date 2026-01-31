import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const registerSchema = z.object({
  name: z.string()
    .min(2, 'กรุณากรอกชื่อ-นามสกุล')
    .regex(/^[ก-๙a-zA-Z\s]+$/, 'กรุณากรอกชื่อ-นามสกุลเป็นภาษาไทยหรืออังกฤษเท่านั้น'),
  phone: z.string()
    .min(10, 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก')
    .regex(/^0[0-9]{9}$/, 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'),
  password: z.string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  confirmPassword: z.string()
    .min(6, 'กรุณายืนยันรหัสผ่าน'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      login(response.user, response.token);
      toast.success('สมัครสมาชิกสำเร็จ!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      toast.error(errorMessage);
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-8 animate-fade-in">
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-dark-green to-[#1a331a] p-6 rounded-[2.5rem] shadow-2xl rotate-3">
             <div className="border-2 border-primary/30 rounded-[1.8rem] p-1.5">
                <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                </div>
             </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-dark-green mb-2">สมัครสมาชิก</h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">เริ่มต้นสะสมคะแนนและรับสิทธิพิเศษ</p>
        </div>

        <form className="w-full space-y-8 mt-4" onSubmit={handleSubmit(onSubmit)}>
           <div className="space-y-1 relative">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] absolute -top-2 left-0 bg-white pr-2 z-10">ชื่อ-นามสกุล</label>
             <div className="flex items-center border-b-2 border-primary/20 focus-within:border-primary transition-all py-3 relative">
                <span className="material-symbols-outlined text-gray-400 mr-4">badge</span>
                <input 
                  {...register('name')}
                  type="text" 
                  placeholder="สมชาย ใจดี" 
                  className="bg-transparent border-none focus:ring-0 w-full text-xl font-bold p-0 placeholder-gray-200"
                  disabled={isLoading}
                />
             </div>
             {errors.name && (
               <p className="text-red-500 text-xs font-bold mt-1">{errors.name.message}</p>
             )}
           </div>

           <div className="space-y-1 relative">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] absolute -top-2 left-0 bg-white pr-2 z-10">เบอร์โทรศัพท์มือถือ</label>
             <div className="flex items-center border-b-2 border-primary/20 focus-within:border-primary transition-all py-3">
                <span className="material-symbols-outlined text-gray-400 mr-4">smartphone</span>
                <input 
                  {...register('phone')}
                  type="tel" 
                  placeholder="08X XXX XXXX" 
                  maxLength={10}
                  className="bg-transparent border-none focus:ring-0 w-full text-xl font-bold p-0 placeholder-gray-200"
                  disabled={isLoading}
                />
             </div>
             {errors.phone && (
               <p className="text-red-500 text-xs font-bold mt-1">{errors.phone.message}</p>
             )}
           </div>

           <div className="space-y-1 relative">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] absolute -top-2 left-0 bg-white pr-2 z-10">รหัสผ่าน</label>
             <div className="flex items-center border-b-2 border-primary/20 focus-within:border-primary transition-all py-3">
                <span className="material-symbols-outlined text-gray-400 mr-4">lock</span>
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••" 
                  className="bg-transparent border-none focus:ring-0 w-full text-xl font-bold p-0 placeholder-gray-200"
                  disabled={isLoading}
                />
                <span 
                  className="material-symbols-outlined text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
             </div>
             {errors.password && (
               <p className="text-red-500 text-xs font-bold mt-1">{errors.password.message}</p>
             )}
           </div>

           <div className="space-y-1 relative">
             <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] absolute -top-2 left-0 bg-white pr-2 z-10">ยืนยันรหัสผ่าน</label>
             <div className="flex items-center border-b-2 border-primary/20 focus-within:border-primary transition-all py-3">
                <span className="material-symbols-outlined text-gray-400 mr-4">lock</span>
                <input 
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••" 
                  className="bg-transparent border-none focus:ring-0 w-full text-xl font-bold p-0 placeholder-gray-200"
                  disabled={isLoading}
                />
                <span 
                  className="material-symbols-outlined text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
             </div>
             {errors.confirmPassword && (
               <p className="text-red-500 text-xs font-bold mt-1">{errors.confirmPassword.message}</p>
             )}
           </div>

           <button 
             type="submit"
             disabled={isLoading}
             className="w-full bg-primary hover:bg-primary-dark text-dark-green font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isLoading ? (
               <>
                 <div className="w-5 h-5 border-2 border-dark-green border-t-transparent rounded-full animate-spin"></div>
                 กำลังสมัครสมาชิก...
               </>
             ) : (
               <>
                 สมัครสมาชิก
                 <span className="material-symbols-outlined font-black">arrow_forward</span>
               </>
             )}
           </button>

           <div className="text-center pt-4">
             <button
               type="button"
               onClick={() => navigate('/login')}
               className="text-primary hover:text-primary-dark font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
             >
               <span className="material-symbols-outlined text-sm">arrow_back</span>
               มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
