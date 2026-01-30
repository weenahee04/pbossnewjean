
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const navigate = useNavigate();

  const notificationList: Notification[] = [
    {
      id: '1',
      title: 'Double Points Weekend!',
      message: 'Get 2x Jespark points on all beverage orders placed through the app this weekend.',
      time: '25m ago',
      category: 'Promotions',
      isUnread: true,
      icon: 'local_offer',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: '2',
      title: 'Security Alert',
      message: 'New login detected from iPhone 13 Pro in San Francisco, CA. Was this you?',
      time: '2h ago',
      category: 'System',
      isUnread: true,
      icon: 'security',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      id: '3',
      title: 'Points Credited',
      message: 'You earned 350 points from your visit to Jespark Central Mall.',
      time: '1d ago',
      category: 'General',
      isUnread: false,
      icon: 'stars',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      id: '4',
      title: 'New Store Opening',
      message: 'Come visit our newest location at Westside Plaza and get a free cookie!',
      time: '1d ago',
      category: 'Promotions',
      isUnread: false,
      icon: 'storefront',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in pb-24">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold">Notifications</h1>
          <button className="text-primary text-xs font-bold uppercase tracking-wider">Mark all read</button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Promotions', 'General', 'System'].map((cat, i) => (
            <button 
              key={cat}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${i === 0 ? 'bg-dark-green text-white border-transparent' : 'bg-gray-100 text-gray-500 border-transparent'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col">
        {['Today', 'Yesterday'].map(group => (
          <div key={group}>
            <div className="px-5 py-3 bg-gray-50/50">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{group}</h2>
            </div>
            {notificationList.filter(n => group === 'Today' ? n.time.includes('h') || n.time.includes('m') : n.time.includes('d')).map(notif => (
              <div 
                key={notif.id} 
                className={`p-5 flex gap-4 border-b border-gray-100 transition-colors active:bg-gray-50 relative ${notif.isUnread ? 'bg-white' : 'bg-transparent opacity-80'}`}
              >
                {notif.isUnread && <div className="absolute right-5 top-6 size-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(19,236,19,0.4)]" />}
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`}>
                  <span className="material-symbols-outlined">{notif.icon}</span>
                </div>
                <div className="flex-1 pr-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold leading-tight">{notif.title}</h3>
                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-2 whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;