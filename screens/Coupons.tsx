
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Coupons: React.FC = () => {
  const navigate = useNavigate();

  const activeCoupons = [
    { id: 'c1', brand: 'Jespark Coffee', offer: '20% OFF', expiry: '31 Dec 2023', icon: 'coffee', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOkrrkrPaoAYrwTZjX7zCAYcHaou2cHClYHB6jcKvNOFfRr8-rB7ucRVWjNdwJiEh1IRYJVaBkPo-u5dFeVyi61Czwb92neJeBDKrBljIm4tSf6jdhEkCz7aXi8lheu55IAYyhoz2-IqW4Rgl804C1LeSDX4iiTyLcyINe17-Ik5s5VvA5KyKBJQatWdDM4OK2fOO0BXF7Xzc_uyKIZoVaQIXUphgGBslESzWaDUVGqbevHK9I8VqDk_43wkeQXULKtF4QMV6y_qMv' },
    { id: 'c2', brand: 'Fresh Grocer', offer: '$5.00 Off', expiry: '15 Jan 2024', icon: 'shopping_basket', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG37L70bR_WBhCnGfZIb4yXNNhIPCZoaRrZeKW2gsORJbZmucVKfkUAKX7gD0iZ1tgUIIE3rCkbiPZ2XmTRhfXzKXnn_FlOsyen70pSf9NzKNSwtBndBIfF0kZnjpwZlnCOgc8hMV7AKsZc5wcBJOzmivzLoUexPRIZuosVhv2NEUy7V1wIx4IAI8cL14i0i4jVnxhLrCg1ABE3n1J08m5K7QQgP_itD6WmvCaND3qsvKZHPF0tpwpWDXjjZQzdS93w9-vWszzx2e5' },
    { id: 'c3', brand: 'Style Hub', offer: '15% OFF', expiry: 'Ending Soon', urgent: true, icon: 'apparel', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMksrSYzQxxwOhIaiOrdGpCMKOBnT_fX1_rEh7tm6S_TNG1Pvfa0sF9SfIY63tx81PqORGYeygBgOF2TS13v6tafJtlR7jHZQRsLRDNxMq67mr8GOpYalhfiPe2YXCizl369CBuUb31myVrpJmrmNFeTO9rukNVYsJcY7xCcv5-n5kSJmykWwBFU_QDXcyLZpMpKmP7z2kX91bmHNW_2aqfe3k808rHZSUiTEsyb2BnKlbiQto8gO5ENnstlqeJ4gsjlk0R4XsXnT' },
  ];

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
           <button className="flex-1 py-4 text-sm font-black text-primary border-b-[3px] border-primary">Available</button>
           <button className="flex-1 py-4 text-sm font-bold text-gray-400">Used/Expired</button>
        </div>
      </header>

      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar pt-6">
        {['All', 'Food', 'Retail', 'Travel'].map((cat, i) => (
           <button key={cat} className={`h-10 px-6 rounded-full font-bold text-[11px] uppercase tracking-widest border transition-all ${i === 0 ? 'bg-primary border-transparent text-dark-green shadow-md shadow-primary/20' : 'bg-white border-gray-100 text-gray-500'}`}>
             {cat}
           </button>
        ))}
      </div>

      <main className="p-4 space-y-5">
        {activeCoupons.map(coupon => (
          <div key={coupon.id} className={`relative flex items-stretch bg-white rounded-2xl overflow-hidden shadow-xl border ${coupon.urgent ? 'border-primary/50' : 'border-gray-100'}`}>
            {coupon.urgent && <div className="absolute top-0 right-0 bg-primary text-dark-green text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Ending Soon</div>}
            
            <div className="flex flex-[1.8_1.8_0px] flex-col gap-4 p-5">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">{coupon.icon}</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{coupon.brand}</p>
              </div>
              <div>
                <p className="text-2xl font-black leading-none">{coupon.offer}</p>
                <p className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${coupon.urgent ? 'text-orange-500' : 'text-gray-400'}`}>
                  {coupon.urgent ? 'Expires in 2 days' : `Valid until ${coupon.expiry}`}
                </p>
              </div>
              <button className="w-full bg-primary text-dark-green py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                Use Now
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