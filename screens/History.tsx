
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Points', 'Wallet'];

  const activities = [
    { id: '1', title: 'Purchase at Jespark Shop', date: 'June 12, 14:30', amount: '+50 pts', type: 'Points', icon: 'shopping_bag', isGain: true },
    { id: '2', title: 'Coffee Reward Redeemed', date: 'June 10, 09:15', amount: '-200 pts', type: 'Points', icon: 'coffee', isGain: false },
    { id: '3', title: 'Wallet Top-up', date: 'June 08, 11:20', amount: '+$20.00', type: 'Wallet', icon: 'account_balance_wallet', isGain: true },
    { id: '4', title: 'Referral Bonus', date: 'May 28, 18:05', amount: '+100 pts', type: 'Points', icon: 'loyalty', isGain: true },
    { id: '5', title: 'In-store Payment', date: 'May 24, 12:45', amount: '-$15.40', type: 'Wallet', icon: 'local_mall', isGain: false }
  ];

  const filteredActivities = activeTab === 'All' ? activities : activities.filter(a => a.type === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in pb-24">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center p-4 justify-between">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">Activity History</h2>
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
        {['June 2024', 'May 2024'].map(month => (
          <div key={month}>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-5 py-4 bg-gray-50/50">{month}</h3>
            <div className="divide-y divide-gray-50">
              {filteredActivities.filter(a => a.date.includes(month.split(' ')[0])).map(item => (
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
                  <p className={`text-base font-black ${item.isGain ? 'text-primary' : 'text-dark-green'}`}>
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default History;