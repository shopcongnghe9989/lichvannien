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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col items-center mr-6">
               <span className="text-sm font-medium opacity-80 uppercase tracking-wider text-red-100">Dương Lịch</span>
               <span className="text-6xl font-bold font-serif text-white">{dateInfo.solar.day}</span>
               <span className="text-lg font-medium text-red-100">Tháng {dateInfo.solar.month}, {dateInfo.solar.year}</span>
            </div>
            
            <div className="h-16 w-px bg-white/20"></div>
            
            <div className="flex flex-col items-center ml-6 flex-1">
               <span className="text-sm font-medium opacity-80 uppercase tracking-wider text-red-100">Âm Lịch</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-bold font-serif text-white">{dateInfo.lunar.day}</span>
                 <span className="text-xl text-red-100">/ {dateInfo.lunar.month}</span>
               </div>
               <span className="text-sm mt-1 opacity-90 text-red-200">{dateInfo.canChiYear}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-slate-800 shrink-0">
            <button 
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'info' ? 'text-red-400 border-b-2 border-red-500' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
            >
                <Calendar size={18} />
                Chi Tiết Ngày
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
            >
                <Sparkles size={18} />
                Góc Phong Thủy AI
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar grow bg-slate-900">
           {activeTab === 'info' ? (
               <div className="space-y-6">
                   {/* Can Chi Info */}
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                           <div className="text-xs uppercase text-slate-500 font-bold mb-1">Ngày</div>
                           <div className="font-semibold text-slate-200">{dateInfo.canChiDay} ({dateInfo.zodiacDay})</div>
                       </div>
                       <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                           <div className="text-xs uppercase text-slate-500 font-bold mb-1">Tháng</div>
                           <div className="font-semibold text-slate-200">{dateInfo.canChiMonth}</div>
                       </div>
                   </div>

                   {/* Good/Bad Hours */}
                   <div>
                       <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold">
                           <Clock size={18} className="text-red-500" />
                           Giờ Hoàng Đạo
                       </div>
                       <div className="flex flex-wrap gap-2">
                           {dateInfo.goodHours.map(h => (
                               <span key={h} className="px-3 py-1 bg-yellow-900/20 text-yellow-200 text-xs rounded-full border border-yellow-900/50 font-medium">
                                   {h}
                                </span>
                           ))}
                       </div>
                   </div>

                   {/* Stars */}
                   <div>
                       <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold">
                           <Star size={18} className="text-indigo-400" />
                           Sao Tốt
                       </div>
                       <div className="flex flex-wrap gap-2">
                            {dateInfo.stars.map(s => (
                                <span key={s} className="px-3 py-1 bg-indigo-900/20 text-indigo-200 text-xs rounded-full border border-indigo-900/50 font-medium">
                                    {s}
                                </span>
                            ))}
                       </div>
                   </div>

                   {/* Status */}
                   <div className={`p-4 rounded-xl border ${dateInfo.isGoodDay ? 'bg-green-900/20 border-green-900/50 text-green-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                       <div className="font-bold flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${dateInfo.isGoodDay ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                           {dateInfo.isGoodDay ? 'Ngày Hoàng Đạo (Tốt)' : 'Ngày Bình Thường'}
                       </div>
                       <div className="text-sm mt-1 opacity-80">
                           {dateInfo.isGoodDay ? 'Mọi việc hanh thông, thuận lợi.' : 'Nên thận trọng trong các việc lớn.'}
                       </div>
                   </div>
               </div>
           ) : (
               <div className="space-y-6">
                   <div className="bg-indigo-950/30 p-4 rounded-2xl border border-indigo-900/50">
                       <h3 className="text-indigo-300 font-bold text-lg mb-2 flex items-center gap-2">
                           <Sparkles size={20} />
                           Lời khuyên từ AI
                       </h3>
                       <p className="text-indigo-200/70 text-sm mb-4">
                           Chọn chủ đề để nhận lời khuyên phong thủy hoặc chiêm nghiệm cho ngày này.
                       </p>
                       
                       <div className="grid grid-cols-2 gap-2 mb-4">
                           <button onClick={() => handleGetAdvice('công việc')} className="py-2 px-4 bg-slate-800 hover:bg-indigo-900/40 text-indigo-300 rounded-lg text-sm font-semibold transition border border-slate-700 hover:border-indigo-800">
                               Công Việc
                           </button>
                           <button onClick={() => handleGetAdvice('tình cảm')} className="py-2 px-4 bg-slate-800 hover:bg-pink-900/40 text-pink-300 rounded-lg text-sm font-semibold transition border border-slate-700 hover:border-pink-800">
                               Tình Cảm
                           </button>
                           <button onClick={() => handleGetAdvice('sức khỏe')} className="py-2 px-4 bg-slate-800 hover:bg-green-900/40 text-green-300 rounded-lg text-sm font-semibold transition border border-slate-700 hover:border-green-800">
                               Sức Khỏe
                           </button>
                           <button onClick={() => handleGetAdvice('tổng quát')} className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition border border-slate-700">
                               Tổng Quát
                           </button>
                       </div>
                   </div>

                   {loadingAdvice ? (
                       <div className="flex flex-col items-center justify-center py-8 space-y-4">
                           <div className="w-8 h-8 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
                           <p className="text-slate-500 text-sm animate-pulse">Đang luận giải...</p>
                       </div>
                   ) : advice ? (
                       <div className="animate-in slide-in-from-bottom-2 duration-500">
                            <div className="relative p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-sm">
                                <span className="absolute -top-3 left-6 bg-slate-800 px-2 text-indigo-500 text-4xl leading-none font-serif">“</span>
                                <p className="text-slate-300 font-serif text-lg leading-relaxed italic text-center px-4">
                                    {advice.text}
                                </p>
                                <span className="absolute -bottom-5 right-6 bg-slate-800 px-2 text-indigo-500 text-4xl leading-none font-serif rotate-180">“</span>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Góc Nhìn Phong Thủy</span>
                            </div>
                       </div>
                   ) : (
                       <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                           <Sun size={48} className="mb-2 opacity-30" />
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