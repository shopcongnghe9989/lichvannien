import React, { useState, useEffect } from 'react';
import { DateInfo, AiAdvice } from '../types';
import { X, Sparkles, Moon, Sun, Clock, Star, Calendar } from 'lucide-react';
import { getDailyAdvice } from '../services/geminiService';

interface DateDetailModalProps {
  dateInfo: DateInfo | null;
  onClose: () => void;
}

const DateDetailModal: React.FC<DateDetailModalProps> = ({ dateInfo, onClose }) => {
  const [advice, setAdvice] = useState<AiAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'ai'>('info');

  useEffect(() => {
    setAdvice(null); // Reset advice when date changes
    if (dateInfo) {
        // Automatically fetch general advice or wait for user? Let's wait for user to click to save tokens
    }
  }, [dateInfo]);

  if (!dateInfo) return null;

  const handleGetAdvice = async (topic: string) => {
    setLoadingAdvice(true);
    const result = await getDailyAdvice(dateInfo, topic);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col items-center mr-6">
               <span className="text-sm font-medium opacity-90 uppercase tracking-wider">Dương Lịch</span>
               <span className="text-6xl font-bold font-serif">{dateInfo.solar.day}</span>
               <span className="text-lg font-medium">Tháng {dateInfo.solar.month}, {dateInfo.solar.year}</span>
            </div>
            
            <div className="h-16 w-px bg-white/30"></div>
            
            <div className="flex flex-col items-center ml-6 flex-1">
               <span className="text-sm font-medium opacity-90 uppercase tracking-wider">Âm Lịch</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-bold font-serif">{dateInfo.lunar.day}</span>
                 <span className="text-xl">/ {dateInfo.lunar.month}</span>
               </div>
               <span className="text-sm mt-1 opacity-90">{dateInfo.canChiYear}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-stone-200 shrink-0">
            <button 
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'info' ? 'text-red-600 border-b-2 border-red-600' : 'text-stone-500 hover:bg-stone-50'}`}
            >
                <Calendar size={18} />
                Chi Tiết Ngày
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-stone-500 hover:bg-stone-50'}`}
            >
                <Sparkles size={18} />
                Góc Phong Thủy AI
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar grow">
           {activeTab === 'info' ? (
               <div className="space-y-6">
                   {/* Can Chi Info */}
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-stone-50 p-4 rounded-2xl">
                           <div className="text-xs uppercase text-stone-400 font-bold mb-1">Ngày</div>
                           <div className="font-semibold text-stone-800">{dateInfo.canChiDay} ({dateInfo.zodiacDay})</div>
                       </div>
                       <div className="bg-stone-50 p-4 rounded-2xl">
                           <div className="text-xs uppercase text-stone-400 font-bold mb-1">Tháng</div>
                           <div className="font-semibold text-stone-800">{dateInfo.canChiMonth}</div>
                       </div>
                   </div>

                   {/* Good/Bad Hours */}
                   <div>
                       <div className="flex items-center gap-2 mb-3 text-stone-800 font-bold">
                           <Clock size={18} className="text-red-500" />
                           Giờ Hoàng Đạo
                       </div>
                       <div className="flex flex-wrap gap-2">
                           {dateInfo.goodHours.map(h => (
                               <span key={h} className="px-3 py-1 bg-yellow-50 text-yellow-800 text-xs rounded-full border border-yellow-200 font-medium">
                                   {h}
                               </span>
                           ))}
                       </div>
                   </div>

                   {/* Stars */}
                   <div>
                       <div className="flex items-center gap-2 mb-3 text-stone-800 font-bold">
                           <Star size={18} className="text-indigo-500" />
                           Sao Tốt
                       </div>
                       <div className="flex flex-wrap gap-2">
                            {dateInfo.stars.map(s => (
                                <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-800 text-xs rounded-full border border-indigo-100 font-medium">
                                    {s}
                                </span>
                            ))}
                       </div>
                   </div>

                   {/* Status */}
                   <div className={`p-4 rounded-xl border ${dateInfo.isGoodDay ? 'bg-green-50 border-green-200 text-green-800' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>
                       <div className="font-bold flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${dateInfo.isGoodDay ? 'bg-green-500' : 'bg-stone-400'}`}></div>
                           {dateInfo.isGoodDay ? 'Ngày Hoàng Đạo (Tốt)' : 'Ngày Bình Thường'}
                       </div>
                       <div className="text-sm mt-1 opacity-80">
                           {dateInfo.isGoodDay ? 'Mọi việc hanh thông, thuận lợi.' : 'Nên thận trọng trong các việc lớn.'}
                       </div>
                   </div>
               </div>
           ) : (
               <div className="space-y-6">
                   <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                       <h3 className="text-indigo-900 font-bold text-lg mb-2 flex items-center gap-2">
                           <Sparkles size={20} />
                           Lời khuyên từ AI
                       </h3>
                       <p className="text-indigo-700/80 text-sm mb-4">
                           Chọn chủ đề để nhận lời khuyên phong thủy hoặc chiêm nghiệm cho ngày này.
                       </p>
                       
                       <div className="grid grid-cols-2 gap-2 mb-4">
                           <button onClick={() => handleGetAdvice('công việc')} className="py-2 px-4 bg-white hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition border border-indigo-200">
                               Công Việc
                           </button>
                           <button onClick={() => handleGetAdvice('tình cảm')} className="py-2 px-4 bg-white hover:bg-pink-50 text-pink-600 rounded-lg text-sm font-semibold transition border border-pink-200">
                               Tình Cảm
                           </button>
                           <button onClick={() => handleGetAdvice('sức khỏe')} className="py-2 px-4 bg-white hover:bg-green-50 text-green-600 rounded-lg text-sm font-semibold transition border border-green-200">
                               Sức Khỏe
                           </button>
                           <button onClick={() => handleGetAdvice('tổng quát')} className="py-2 px-4 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-sm font-semibold transition border border-stone-200">
                               Tổng Quát
                           </button>
                       </div>
                   </div>

                   {loadingAdvice ? (
                       <div className="flex flex-col items-center justify-center py-8 space-y-4">
                           <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                           <p className="text-stone-500 text-sm animate-pulse">Đang luận giải...</p>
                       </div>
                   ) : advice ? (
                       <div className="animate-in slide-in-from-bottom-2 duration-500">
                            <div className="relative p-6 bg-white border border-stone-200 rounded-2xl shadow-sm">
                                <span className="absolute -top-3 left-6 bg-white px-2 text-indigo-600 text-4xl leading-none font-serif">“</span>
                                <p className="text-stone-700 font-serif text-lg leading-relaxed italic text-center px-4">
                                    {advice.text}
                                </p>
                                <span className="absolute -bottom-5 right-6 bg-white px-2 text-indigo-600 text-4xl leading-none font-serif rotate-180">“</span>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Góc Nhìn Phong Thủy</span>
                            </div>
                       </div>
                   ) : (
                       <div className="flex flex-col items-center justify-center py-12 text-stone-300">
                           <Sun size={48} className="mb-2 opacity-50" />
                           <p>Hãy chọn một chủ đề phía trên</p>
                       </div>
                   )}
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DateDetailModal;
