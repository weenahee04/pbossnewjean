import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import SkeletonCard from '../components/SkeletonCard';

type TabType = 'ทั้งหมด' | 'คะแนน' | 'กระเป๋าเงิน';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, isLoading } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('ทั้งหมด');

  const tabs: TabType[] = ['ทั้งหมด', 'คะแนน', 'กระเป๋าเงิน'];

  const activities = useMemo(() => [
    { id: '1', title: 'ซื้อสินค้าที่ Jespark Shop', date: 'มิ.ย. 12, 14:30', amount: '+50', type: 'คะแนน', icon: 'shopping_bag', isGain: true },
    { id: '2', title: 'แลกรับคูปองกาแฟ', date: 'มิ.ย. 10, 09:15', amount: '-200', type: 'คะแนน', icon: 'coffee', isGain: false },
    { id: '3', title: 'เติมเงินเข้ากระเป๋า', date: 'มิ.ย. 08, 11:20', amount: '+500', type: 'กระเป๋าเงิน', icon: 'account_balance_wallet', isGain: true },
    { id: '4', title: 'โบนัสแนะนำเพื่อน', date: 'พ.ค. 28, 18:05', amount: '+100', type: 'คะแนน', icon: 'loyalty', isGain: true },
    { id: '5', title: 'ชำระเงินในร้าน', date: 'พ.ค. 24, 12:45', amount: '-350', type: 'กระเป๋าเงิน', icon: 'local_mall', isGain: false },
    ...transactions.map(t => ({
      id: t.id,
      title: t.description,
      date: new Date(t.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: t.amount > 0 ? `+${t.amount}` : `${t.amount}`,
      type: t.type === 'earn' || t.type === 'spend' ? 'คะแนน' : 'กระเป๋าเงิน',
      icon: t.icon || 'receipt',
      isGain: t.amount > 0
    }))
  ], [transactions]);

  const filteredActivities = useMemo(() => {
    if (activeTab === 'ทั้งหมด') return activities;
    return activities.filter(a => a.type === activeTab);
  }, [activeTab, activities]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in pb-24">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center p-4 justify-between">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">ประวัติการใช้งาน</h2>
          <button className="size-10 flex items-center justify-center rounded-full">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
        
        <div className="flex border-b border-gray-100 px-4">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-400'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <SkeletonCard key={i} variant="list" />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-400 text-4xl" aria-hidden="true">history</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">ไม่มีประวัติ</h3>
            <p className="text-sm text-gray-500 text-center">คุณยังไม่มีประวัติการใช้งานในหมวดหมู่นี้</p>
          </div>
        ) : (
          ['มิถุนายน 2024', 'พฤษภาคม 2024'].map(month => (
          <div key={month}>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-5 py-4 bg-gray-50/50">{month}</h3>
            <div className="divide-y divide-gray-50">
              {filteredActivities.filter(a => a.date.includes(month.split(' ')[0].substring(0, 3))).map(item => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-white active:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${item.isGain ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${item.isGain ? 'text-primary' : 'text-dark-green'}`}>
                      {item.amount}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
        )}
      </main>
    </div>
  );
};

export default History;