import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import CalendarGrid from './components/CalendarGrid';
import DateDetailModal from './components/DateDetailModal';
import { DateInfo, Quote } from './types';
import { getQuote } from './services/lunarService';

const App: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
  const [dailyQuote, setDailyQuote] = useState<Quote>(getQuote());
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // Refresh quote occasionally or on mount
    setDailyQuote(getQuote());
  }, [currentMonth]); // Change quote when month changes for fun

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-900 selection:text-white">
      
      {/* Top Decoration */}
      <div className="h-2 w-full bg-gradient-to-r from-red-900 via-red-700 to-red-900 opacity-80"></div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-red-900/30 border border-red-900/50 text-red-400 text-xs font-bold uppercase tracking-wider rounded">Lịch Việt Nam</span>
            </div>
            <h1 className="text-4xl font-bold font-serif text-slate-100 tracking-tight">Lịch Vạn Niên</h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2">
               Hôm nay: <span className="font-semibold text-slate-300">{today.getDate()}/{today.getMonth() + 1}/{today.getFullYear()}</span>
            </p>
          </div>

          <div className="flex gap-2">
             <button 
               onClick={handleToday}
               className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
             >
               <CalendarIcon size={18} />
               Hôm nay
             </button>
             <button 
                onClick={() => setShowAbout(!showAbout)}
                className="p-2 text-slate-500 hover:text-slate-300 transition"
                title="Thông tin"
             >
                 <Info size={24} />
             </button>
          </div>
        </header>

        {/* Quote Section */}
        <div className="mb-8 p-6 bg-gradient-to-br from-red-950 to-red-900 border border-red-900/30 rounded-3xl text-slate-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>
            <p className="text-lg md:text-xl font-serif italic opacity-90 leading-relaxed max-w-2xl relative z-10 text-slate-200">
                "{dailyQuote.content}"
            </p>
            <p className="mt-3 text-sm font-medium text-red-300 uppercase tracking-widest relative z-10">
                — {dailyQuote.author}
            </p>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6 px-2">
          <button 
            onClick={handlePrevMonth} 
            className="p-3 bg-slate-900 border border-slate-800 rounded-full shadow hover:shadow-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-slate-100">Tháng {currentMonth}</h2>
            <span className="text-slate-500 font-medium">Năm {currentYear}</span>
          </div>

          <button 
            onClick={handleNextMonth} 
            className="p-3 bg-slate-900 border border-slate-800 rounded-full shadow hover:shadow-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Main Grid */}
        <CalendarGrid 
          currentMonth={currentMonth}
          currentYear={currentYear}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-600 text-sm pb-8">
            <p>© {new Date().getFullYear()} Lịch Vạn Niên - Kết hợp công nghệ AI & Văn hóa Việt</p>
            {showAbout && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-800 max-w-md mx-auto text-left shadow-sm animate-in slide-in-from-bottom-2">
                    <h4 className="font-bold text-slate-200 mb-2">Giới thiệu</h4>
                    <p className="mb-2 text-slate-400">Ứng dụng được xây dựng nhằm cung cấp công cụ tra cứu lịch Âm Dương nhanh chóng, chính xác.</p>
                    <p className="text-slate-400">Tính năng AI sử dụng mô hình Gemini để đưa ra lời khuyên mang tính chất tham khảo, giải trí dựa trên các yếu tố phong thủy chung.</p>
                </div>
            )}
        </div>

      </div>

      {/* Modal */}
      {selectedDate && (
        <DateDetailModal 
          dateInfo={selectedDate} 
          onClose={() => setSelectedDate(null)} 
        />
      )}
    </div>
  );
};

export default App;