import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useDeals } from '../contexts/DealsContext';
import { useBrands } from '../contexts/BrandsContext';
import { useAuth } from '../contexts/AuthContext';
import bannersService from '../services/bannersService';
import SkeletonCard from '../components/SkeletonCard';
import { User, Deal, Reward } from '../types';

interface HomeProps {
  user: User;
}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { latestDeals, specialOffers, fetchLatestDeals, fetchSpecialOffers, isLoading: dealsLoading } = useDeals();
  const { recommendedBrands, fetchRecommendedBrands, isLoading: brandsLoading } = useBrands();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bannersData = await bannersService.getActiveBanners();
        setBanners(bannersData.map((b: any) => ({
          ...b,
          color: 'from-dark-green/90 to-transparent'
        })));
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setBannersLoading(false);
      }
    };

    loadData();
    fetchLatestDeals(2);
    fetchSpecialOffers(2);
    fetchRecommendedBrands(8);
  }, [fetchLatestDeals, fetchSpecialOffers, fetchRecommendedBrands]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setCurrentBanner(index);
    }
  };

  return (
    <div className="flex flex-col pb-24 animate-fade-in relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-full p-1 border-2 border-primary cursor-pointer" onClick={() => navigate('/profile')}>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                style={{ backgroundImage: `url(${user.avatar})` }}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">ยินดีต้อนรับกลับ,</p>
              <h2 className="text-dark-green text-lg font-bold leading-tight">{user.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/notifications')}
              className="flex size-10 items-center justify-center rounded-full bg-gray-100/50 backdrop-blur-sm relative"
              aria-label={`การแจ้งเตือน${unreadCount > 0 ? ` ${unreadCount} รายการใหม่` : ''}`}
            >
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Smart Search Bar */}
      <div className="px-4 py-2 sticky top-[68px] z-30 bg-white/60 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-gray-100/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า ร้านค้า หรือดีลพิเศษ..." 
              className="bg-transparent border-none focus:ring-0 text-sm flex-1 ml-1 placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </button>
          </div>
          <button className="bg-primary/10 text-primary size-[48px] rounded-2xl flex items-center justify-center border border-primary/20 backdrop-blur-sm active:scale-90 transition-transform">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Slider */}
      <div className="px-4 py-2 relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4"
        >
          {bannersLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative min-w-full snap-center h-48 rounded-2xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  <div className="relative h-full flex flex-col justify-center p-6 gap-2">
                    <h3 className="text-white text-xl font-black leading-tight animate-pulse">Loading...</h3>
                    <p className="text-white/80 text-xs font-bold leading-snug max-w-[200px] animate-pulse">Loading...</p>
                    <button className="mt-2 w-fit bg-primary text-dark-green text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                      Loading...
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : banners.map((banner) => (
            <div 
              key={banner.id} 
              className="relative min-w-full snap-center h-48 rounded-2xl overflow-hidden shadow-lg"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.color}`} />
              <div className="relative h-full flex flex-col justify-center p-6 gap-2">
                <h3 className="text-white text-xl font-black leading-tight">{banner.title}</h3>
                <p className="text-white/80 text-xs font-bold leading-snug max-w-[200px]">{banner.subtitle}</p>
                <button className="mt-2 w-fit bg-primary text-dark-green text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                  {banner.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Membership Card */}
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden bg-gradient-to-br from-dark-green to-[#1a331a] rounded-2xl p-6 shadow-xl aspect-[1.6/1] flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #13ec13 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-primary font-bold tracking-[0.2em] text-xs mb-1">JESPARK {user.tier.toUpperCase()}</p>
              <p className="text-white/60 text-[10px] tracking-widest uppercase">เป็นสมาชิกตั้งแต่ปี {user.memberSince}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary scale-125">contactless</span>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-baseline gap-1">
              <p className="text-white text-4xl font-extrabold tracking-tight">{user.points.toLocaleString()}</p>
              <p className="text-primary text-sm font-bold">คะแนน</p>
            </div>
            <p className="text-white/80 text-sm font-medium mt-1">คะแนนสะสมคงเหลือ</p>
          </div>
          <div className="relative z-10 flex justify-between items-end mt-4">
            <p className="text-white/90 font-semibold tracking-wider uppercase">{user.name}</p>
            <button 
              onClick={() => navigate('/scan')}
              className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-dark-green font-bold text-sm shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
              <span>แสดงคิวอาร์</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 p-4">
        {[
          { icon: 'qr_code_scanner', label: 'สแกน', path: '/scan' },
          { icon: 'card_membership', label: 'ของรางวัล', path: '/rewards' },
          { icon: 'sell', label: 'โปรโมชัน', path: '/coupons' },
          { icon: 'distance', label: 'สาขา', path: '/stores' },
        ].map((action) => (
          <div 
            key={action.label} 
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => navigate(action.path)}
          >
            <div className="w-full aspect-square flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-active:bg-primary group-active:text-dark-green transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined text-primary group-active:text-dark-green" style={{ fontSize: '28px' }}>{action.icon}</span>
            </div>
            <span className="text-[11px] font-bold text-dark-green uppercase tracking-tighter">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Recommended Brands */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-dark-green text-xl font-bold tracking-tight">แบรนด์แนะนำ</h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-5 pb-2">
          {brandsLoading ? (
            <div className="flex gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                  <div className="size-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : recommendedBrands.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center gap-2 shrink-0 active:scale-90 transition-transform cursor-pointer">
              <div className="size-16 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white/80 backdrop-blur-sm">
                <div 
                  className="size-full bg-center bg-no-repeat bg-cover" 
                  style={{ backgroundImage: `url(${brand.logo})` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter whitespace-nowrap">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Deals */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2">
        <h2 className="text-dark-green text-xl font-bold tracking-tight">ดีลล่าสุด</h2>
        <button onClick={() => navigate('/rewards')} className="text-primary text-sm font-bold">ดูทั้งหมด</button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex px-4 pt-2 gap-4 pb-4">
          {dealsLoading ? (
            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="min-w-[280px]">
                  <div className="w-full aspect-[16/9] bg-gray-200 rounded-xl animate-pulse mb-3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          ) : latestDeals.map((deal) => (
            <div key={deal.id} className="flex flex-col gap-3 rounded-xl min-w-[280px] snap-center">
              <div 
                className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-xl shadow-md border border-gray-100 overflow-hidden" 
                style={{ backgroundImage: `url(${deal.image})` }}
              >
                <div className="p-3">
                  <span className="bg-primary text-dark-green text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">{deal.tag}</span>
                </div>
              </div>
              <div>
                <h4 className="text-dark-green text-base font-bold leading-tight">{deal.title}</h4>
                <p className="text-gray-500 text-sm font-medium mt-1">{deal.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special For You */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-dark-green text-xl font-bold tracking-tight">สิทธิพิเศษสำหรับคุณ</h2>
      </div>
      <div className="px-4 space-y-4">
        {dealsLoading ? (
          <SkeletonCard variant="horizontal" count={2} />
        ) : specialOffers.map((offer) => (
          <div key={offer.id} className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm">
            <div 
              className="size-20 bg-center bg-cover rounded-lg shrink-0 border border-gray-100" 
              style={{ backgroundImage: `url(${offer.image})` }}
            />
            <div className="flex-1">
              <p className="text-dark-green text-sm font-bold">{offer.title}</p>
              <p className="text-gray-500 text-xs font-medium">{offer.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-primary font-bold text-sm">{offer.points} คะแนน</span>
                <button 
                  onClick={() => navigate('/rewards')}
                  className="bg-dark-green text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  แลกคะแนน
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;