
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Transaction } from '../types';

interface WalletProps {
  user: User;
}

const Wallet: React.FC<WalletProps> = ({ user }) => {
  const navigate = useNavigate();

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'สตาร์บัคส์ คอฟฟี่',
      subtitle: 'ชำระเงิน • 09:41 น.',
      amount: -5.50,
      type: 'Payment',
      date: 'วันนี้, 24 ต.ค.',
      time: '09:41 น.',
      status: 'Successful',
      icon: 'coffee'
    },
    {
      id: '2',
      title: 'เติมเงินเข้าวอลเล็ต',
      subtitle: 'โอนผ่านธนาคาร • 08:15 น.',
      amount: 50.00,
      type: 'Top-up',
      date: 'วันนี้, 24 ต.ค.',
      time: '08:15 น.',
      status: 'Successful',
      icon: 'account_balance'
    },
    {
      id: '3',
      title: 'ซาร่า แฟชั่น',
      subtitle: 'ชำระเงิน • 18:22 น.',
      amount: -89.90,
      type: 'Payment',
      date: 'เมื่อวาน, 23 ต.ค.',
      time: '18:22 น.',
      status: 'Successful',
      icon: 'shopping_bag'
    },
    {
      id: '4',
      title: 'เครดิตเงินคืน Jespark',
      subtitle: 'รางวัลพิเศษ • 12:00 น.',
      amount: 1.20,
      type: 'Rewards',
      date: 'เมื่อวาน, 23 ต.ค.',
      time: '12:00 น.',
      status: 'Earned',
      icon: 'stars'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in">
      <header className="bg-dark-green text-white pt-10 pb-8 px-4 rounded-b-[2.5rem] shadow-xl relative z-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold tracking-tight">กระเป๋าเงินของฉัน</h2>
          </div>
          <button onClick={() => navigate('/notifications')} className="size-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white">notifications</span>
          </button>
        </div>
        
        <div className="text-center pb-2">
          <p className="text-primary/80 text-xs font-bold tracking-[0.2em] uppercase mb-1">ยอดเงินทั้งหมด</p>
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4">฿{user.walletBalance.toLocaleString()}</h1>
          <div 
            className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 cursor-pointer"
            onClick={() => navigate('/history')}
          >
            <span className="material-symbols-outlined text-primary text-sm">stars</span>
            <span className="text-xs font-semibold">{user.points.toLocaleString()} คะแนน Jespark</span>
          </div>
        </div>
      </header>

      <div className="px-4 -mt-8 mb-6 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl p-5 flex justify-between items-center gap-4 border border-gray-100">
          {[
            { label: 'เติมเงิน', icon: 'add_circle', color: 'bg-primary/10 text-primary' },
            { label: 'โอนเงิน', icon: 'send', color: 'bg-primary text-dark-green shadow-lg shadow-primary/20' },
            { label: 'ถอนเงิน', icon: 'account_balance_wallet', color: 'bg-primary/10 text-primary' },
          ].map((action) => (
            <div key={action.label} className="flex flex-col items-center flex-1 gap-2 cursor-pointer">
              <div className={`size-12 rounded-2xl flex items-center justify-center ${action.color}`}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <p className="text-gray-600 text-[11px] font-bold uppercase tracking-tighter">{action.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">รายการล่าสุด</h3>
          <button onClick={() => navigate('/history')} className="text-primary text-sm font-bold">ดูทั้งหมด</button>
        </div>

        <div className="space-y-8">
          {['วันนี้, 24 ต.ค.', 'เมื่อวาน, 23 ต.ค.'].map(dateGroup => (
            <div key={dateGroup} className="space-y-4">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{dateGroup}</p>
              {transactions.filter(t => t.date === dateGroup).map(tx => (
                <div key={tx.id} className="flex items-center gap-4 group">
                  <div className={`size-12 rounded-xl flex items-center justify-center transition-transform group-active:scale-95 ${tx.amount > 0 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="material-symbols-outlined">{tx.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">{tx.title}</h4>
                    <p className="text-gray-500 text-xs font-medium">{tx.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-primary' : ''}`}>
                      {tx.amount > 0 ? '+' : ''}฿{Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-[9px] font-medium uppercase tracking-wider">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;