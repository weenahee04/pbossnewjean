import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRewards } from '../contexts/RewardsContext';
import { useDebounce } from '../hooks';
import SkeletonCard from '../components/SkeletonCard';
import toast from 'react-hot-toast';
import { User, Reward } from '../types';

interface RewardsProps {
  user: User;
}

const Rewards: React.FC<RewardsProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rewards, isLoading, fetchRewards, redeemReward } = useRewards();
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const categories = ['ทั้งหมด', 'อาหาร', 'เครื่องดื่ม', 'ไอที', 'ไลฟ์สไตล์'];

  useEffect(() => {
    fetchRewards({ category: activeCategory !== 'ทั้งหมด' ? activeCategory : undefined });
  }, [activeCategory, fetchRewards]);

  const handleRedeem = (reward: Reward) => {
    if (!user || user.points < reward.points) {
      toast.error('คะแนนของคุณไม่เพียงพอ');
      return;
    }
    setSelectedReward(reward);
    setShowSuccessModal(true);
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;
    
    const success = await redeemReward(selectedReward.id);
    if (success) {
      setShowSuccessModal(false);
      setSelectedReward(null);
    }
  };

  const filteredRewards = useMemo(() => {
    let result = rewards;
    
    if (debouncedSearch) {
      result = result.filter(r => 
        r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    
    if (activeCategory !== 'ทั้งหมด') {
      result = result.filter(r => r.category === activeCategory);
    }
    
    if (sortOrder !== 'none') {
      result = [...result].sort((a, b) => sortOrder === 'asc' ? a.points - b.points : b.points - a.points);
    }
    
    return result;
  }, [activeCategory, sortOrder, debouncedSearch]);

  const toggleSort = () => {
    if (sortOrder === 'none') setSortOrder('asc');
    else if (sortOrder === 'asc') setSortOrder('desc');
    else setSortOrder('none');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in relative">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">รายการของรางวัล</h2>
        </div>
        
        <div className="px-4 py-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">ยอดคงเหลือของคุณ</p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-xl">database</span>
              <p className="text-primary text-2xl font-black">{user.points.toLocaleString()} <span className="text-sm">คะแนน</span></p>
            </div>
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.1em]">ระดับ {user.tier}</p>
          </div>
        </div>

        <div className="px-4 py-4 flex gap-2">
           <div className="flex-1 flex items-center rounded-xl bg-gray-100 px-4 h-12 shadow-inner">
             <span className="material-symbols-outlined text-gray-400">search</span>
             <input 
               className="bg-transparent border-none focus:ring-0 text-sm flex-1 ml-2 placeholder-gray-400" 
               placeholder="ค้นหาของรางวัล..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <button 
             onClick={toggleSort}
             className={`size-12 rounded-xl flex items-center justify-center border transition-all ${sortOrder !== 'none' ? 'bg-primary border-primary text-dark-green' : 'bg-white border-gray-100 text-gray-400'}`}
             title="เรียงลำดับตามคะแนน"
           >
             <span className="material-symbols-outlined">
               {sortOrder === 'asc' ? 'swap_vert' : sortOrder === 'desc' ? 'swap_vert' : 'sort'}
             </span>
             {sortOrder !== 'none' && (
               <span className="absolute -top-1 -right-1 size-4 bg-dark-green text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                 {sortOrder === 'asc' ? '↑' : '↓'}
               </span>
             )}
           </button>
        </div>

        <div className="px-4 flex items-center justify-between mb-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             {sortOrder === 'asc' ? 'เรียงลำดับ: คะแนนน้อยไปมาก' : sortOrder === 'desc' ? 'เรียงลำดับ: คะแนนมากไปน้อย' : 'หมวดหมู่'}
           </p>
           {sortOrder !== 'none' && (
             <button onClick={() => setSortOrder('none')} className="text-[10px] font-black text-primary uppercase tracking-widest">ล้างการจัดเรียง</button>
           )}
        </div>

        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-9 px-6 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-dark-green shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 p-4 pb-32 space-y-6">
        {isLoading ? (
          <SkeletonCard variant="default" count={3} />
        ) : filteredRewards.length > 0 ? filteredRewards.map(reward => (
          <div key={reward.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="relative aspect-[16/9]">
              <div 
                className="size-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${reward.image})` }}
              />
              {reward.isPopular && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg">
                  <p className="text-[10px] font-black text-dark-green uppercase tracking-tighter">ยอดนิยม</p>
                </div>
              )}
              {reward.isLimited && (
                <div className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-lg">
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter">เวลาจำกัด</p>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col gap-2">
              <h3 className="text-lg font-bold">{reward.title}</h3>
              <p className="text-sm text-gray-500 leading-snug">{reward.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className={`text-xl font-black ${user.points >= reward.points ? 'text-primary' : 'text-gray-300'}`}>
                    {reward.points.toLocaleString()} <span className="text-xs font-bold">คะแนน</span>
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    {user.points >= reward.points ? 'คะแนนที่ต้องใช้' : 'คะแนนไม่เพียงพอ'}
                  </p>
                </div>
                <button 
                  onClick={() => handleRedeem(reward)}
                  disabled={user.points < reward.points}
                  className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${user.points >= reward.points ? 'bg-primary text-dark-green shadow-primary/20 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
                >
                  แลกของรางวัล
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">sentiment_dissatisfied</span>
            <p className="text-gray-400 font-bold">ไม่พบของรางวัลในหมวดหมู่นี้</p>
          </div>
        )}
      </div>

      {/* Redemption Success Modal Overlay */}
      {showSuccessModal && selectedReward && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <div className="relative size-24 rounded-full bg-primary flex items-center justify-center shadow-2xl border-4 border-white">
                <span className="material-symbols-outlined text-dark-green text-5xl font-black">check</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-black mb-2 tracking-tight">แลกรางวัลสำเร็จ!</h1>
            <p className="text-sm text-gray-500 mb-10 max-w-[240px]">คุณได้ทำการแลกของรางวัลเรียบร้อยแล้ว ขอให้มีความสุขกับรางวัลของคุณ!</p>
            
            <div className="w-full bg-gray-50 rounded-3xl p-6 border border-gray-100 relative mb-8">
               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed border-gray-200">
                 <div className="size-16 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${selectedReward.image})` }} />
                 <div className="text-left">
                   <p className="font-bold text-lg leading-tight">{selectedReward.title}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">รายการเลขที่ #8823910</p>
                 </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold">คะแนนที่ใช้</span>
                    <span className="text-red-500 font-black">-{selectedReward.points.toLocaleString()} คะแนน</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold">คะแนนคงเหลือ</span>
                    <span className="text-primary font-black">{(user.points - selectedReward.points).toLocaleString()} คะแนน</span>
                  </div>
               </div>
            </div>
            
            <div className="w-full space-y-4">
              <button 
                onClick={confirmRedeem}
                className="w-full bg-dark-green text-white py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                ยืนยันการแลก
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-transparent border-2 border-gray-100 text-gray-500 py-3.5 rounded-2xl font-bold text-sm"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;