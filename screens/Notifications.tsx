import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import toast from 'react-hot-toast';

type CategoryFilter = 'All' | 'Promotions' | 'General' | 'System';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'All') return notifications;
    return notifications.filter(n => n.category === selectedCategory);
  }, [notifications, selectedCategory]);

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success('ทำเครื่องหมายทั้งหมดเป็นอ่านแล้ว');
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearNotification(id);
    toast.success('ลบการแจ้งเตือนแล้ว');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in pb-24">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="กลับไปหน้าก่อนหน้า"
          >
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold">การแจ้งเตือน {unreadCount > 0 && `(${unreadCount})`}</h1>
          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-primary text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="ทำเครื่องหมายทั้งหมดเป็นอ่านแล้ว"
          >
            อ่านทั้งหมด
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="กรองการแจ้งเตือนตามหมวดหมู่">
          {(['All', 'Promotions', 'General', 'System'] as CategoryFilter[]).map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
              aria-label={`แสดงการแจ้งเตือน${cat === 'All' ? 'ทั้งหมด' : cat}`}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${
                selectedCategory === cat 
                  ? 'bg-dark-green text-white border-transparent' 
                  : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'ทั้งหมด' : cat === 'Promotions' ? 'โปรโมชัน' : cat === 'General' ? 'ทั่วไป' : 'ระบบ'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col" role="list" aria-label="รายการการแจ้งเตือน">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-400 text-4xl" aria-hidden="true">notifications_off</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">ไม่มีการแจ้งเตือน</h3>
            <p className="text-sm text-gray-500 text-center">คุณไม่มีการแจ้งเตือนในหมวดหมู่นี้</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <article 
              key={notif.id}
              role="listitem"
              onClick={() => handleNotificationClick(notif.id)}
              className={`p-5 flex gap-4 border-b border-gray-100 transition-colors active:bg-gray-50 relative cursor-pointer ${
                notif.isUnread ? 'bg-white' : 'bg-transparent opacity-80'
              }`}
              aria-label={`${notif.title}. ${notif.message}. ${notif.time}`}
            >
              {notif.isUnread && (
                <div 
                  className="absolute right-5 top-6 size-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(19,236,19,0.4)]" 
                  aria-label="ยังไม่ได้อ่าน"
                />
              )}
              <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`} aria-hidden="true">
                <span className="material-symbols-outlined">{notif.icon}</span>
              </div>
              <div className="flex-1 pr-12">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold leading-tight">{notif.title}</h3>
                  <time className="text-[9px] font-bold text-gray-400 uppercase ml-2 whitespace-nowrap">{notif.time}</time>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
              </div>
              <button
                onClick={(e) => handleDeleteNotification(notif.id, e)}
                className="absolute right-5 bottom-5 size-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="ลบการแจ้งเตือนนี้"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;