import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoupons } from '../contexts/CouponsContext';
import SkeletonCard from '../components/SkeletonCard';

const Coupons: React.FC = () => {
  const navigate = useNavigate();
  const { coupons, isLoading, useCoupon, fetchCoupons } = useCoupons();
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Food', 'Retail', 'Travel'];

  const handleUseCoupon = async (couponId: string) => {
    await useCoupon(couponId);
  };

  const handleTabChange = (tab: 'available' | 'used') => {
    setActiveTab(tab);
    fetchCoupons({ status: tab === 'available' ? 'available' : 'used' });
  };

  const filteredCoupons = coupons.filter(c => {
    if (activeTab === 'available' && c.isUsed) return false;
    if (activeTab === 'used' && !c.isUsed) return false;
    if (activeCategory !== 'All' && c.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in pb-32">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-xl font-black tracking-tight">My Coupons</h1>
          </div>
          <button className="size-10 flex items-center justify-center rounded-full text-gray-400">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
        <div className="flex border-b border-gray-50 px-4">
          <button 
            onClick={() => handleTabChange('available')}
            className={`flex-1 py-4 text-sm font-black ${activeTab === 'available' ? 'text-primary border-b-[3px] border-primary' : 'text-gray-400'}`}
          >
            Available
          </button>
          <button 
            onClick={() => handleTabChange('used')}
            className={`flex-1 py-4 text-sm font-bold ${activeTab === 'used' ? 'text-primary border-b-[3px] border-primary' : 'text-gray-400'}`}
          >
            Used/Expired
          </button>
        </div>
      </header>

      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar pt-6">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`h-10 px-6 rounded-full font-bold text-[11px] uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-primary border-transparent text-dark-green shadow-md shadow-primary/20' : 'bg-white border-gray-100 text-gray-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="p-4 space-y-5">
        {isLoading ? (
          <SkeletonCard variant="default" count={3} />
        ) : filteredCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">confirmation_number</span>
            <p className="text-gray-400 font-bold">ไม่มีคูปองในหมวดหมู่นี้</p>
          </div>
        ) : filteredCoupons.map(coupon => (
          <div key={coupon.id} className={`relative flex items-stretch bg-white rounded-2xl overflow-hidden shadow-xl border ${new Date(coupon.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'border-primary/50' : 'border-gray-100'}`}>
            {new Date(coupon.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && !coupon.isUsed && <div className="absolute top-0 right-0 bg-primary text-dark-green text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Ending Soon</div>}
            
            <div className="flex flex-[1.8_1.8_0px] flex-col gap-4 p-5">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{coupon.title}</p>
              </div>
              <div>
                <p className="text-2xl font-black leading-none">{coupon.discount}</p>
                <p className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${new Date(coupon.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'text-orange-500' : 'text-gray-400'}`}>
                  {coupon.isUsed ? `Used on ${new Date(coupon.usedAt!).toLocaleDateString('th-TH')}` : `Valid until ${new Date(coupon.expiryDate).toLocaleDateString('th-TH')}`}
                </p>
              </div>
              <button 
                onClick={() => handleUseCoupon(coupon.id)}
                disabled={coupon.isUsed}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform ${coupon.isUsed ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-dark-green shadow-primary/20'}`}
              >
                {coupon.isUsed ? 'Used' : 'Use Now'}
              </button>
            </div>

            <div className="coupon-tear-off my-6"></div>

            <div 
              className="flex-1 min-w-[120px] bg-center bg-no-repeat bg-cover m-3 rounded-xl shadow-inner border border-gray-50" 
              style={{ backgroundImage: `url(${coupon.image})` }}
            />
          </div>
        ))}
      </main>
    </div>
  );
};

export default Coupons;