import React, { useMemo } from 'react';
import { getFullDateInfo } from '../services/lunarService';
import { DateInfo } from '../types';

interface CalendarGridProps {
  currentMonth: number;
  currentYear: number;
  onSelectDate: (dateInfo: DateInfo) => void;
  selectedDate: DateInfo | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentMonth, currentYear, onSelectDate, selectedDate }) => {
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const startDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is Sunday
  
  // Adjust so Monday is first day of week if preferred, but standard VN calendars usually start Monday. 
  // Let's stick to Sunday start for classic look, or Monday for modern. 
  // VN standard: Monday is usually first.
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const dates = useMemo(() => {
    const arr: (DateInfo | null)[] = [];
    
    // Empty slots
    for (let i = 0; i < adjustedStartDay; i++) {
      arr.push(null);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      arr.push(getFullDateInfo(i, currentMonth, currentYear));
    }

    return arr;
  }, [currentMonth, currentYear]);

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200">
      {/* Header Days */}
      <div className="grid grid-cols-7 bg-red-50 border-b border-red-100">
        {weekDays.map((day, idx) => (
          <div key={day} className={`py-3 text-center text-sm font-bold ${idx === 6 ? 'text-red-600' : 'text-stone-700'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {dates.map((dateInfo, idx) => {
          if (!dateInfo) return <div key={`empty-${idx}`} className="bg-stone-50/50 min-h-[100px] border-b border-r border-stone-100 last:border-r-0"></div>;
          
          const isToday = new Date().getDate() === dateInfo.solar.day && 
                          new Date().getMonth() + 1 === dateInfo.solar.month && 
                          new Date().getFullYear() === dateInfo.solar.year;

          const isSelected = selectedDate?.solar.day === dateInfo.solar.day &&
                             selectedDate?.solar.month === dateInfo.solar.month &&
                             selectedDate?.solar.year === dateInfo.solar.year;

          const isWeekend = (idx % 7 === 6); // Sunday column in this grid logic? No, logic above puts Sunday at end.

          return (
            <div 
              key={dateInfo.solar.day}
              onClick={() => onSelectDate(dateInfo)}
              className={`
                relative min-h-[100px] p-2 border-b border-r border-stone-100 cursor-pointer transition-all duration-200
                hover:bg-red-50/60
                ${isSelected ? 'bg-red-50 ring-2 ring-inset ring-red-400 z-10' : ''}
                ${isToday ? 'bg-yellow-50' : ''}
              `}
            >
              {/* Solar Day */}
              <div className={`text-xl font-semibold ${isWeekend ? 'text-red-600' : 'text-stone-800'}`}>
                {dateInfo.solar.day}
              </div>

              {/* Lunar Day */}
              <div className="mt-1 flex flex-col items-center">
                 <span className={`text-xs font-medium ${dateInfo.lunar.day === 1 || dateInfo.festival ? 'text-red-600 font-bold' : 'text-stone-500'}`}>
                   {dateInfo.lunar.day === 1 ? `${dateInfo.lunar.day}/${dateInfo.lunar.month}` : dateInfo.lunar.day}
                 </span>
                 {dateInfo.festival && (
                   <span className="mt-1 text-[10px] leading-tight text-center text-red-500 font-bold line-clamp-2">
                     {dateInfo.festival}
                   </span>
                 )}
                 {dateInfo.isGoodDay && !dateInfo.festival && (
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400" title="Ngày Hoàng Đạo"></span>
                 )}
              </div>
              
              {isToday && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
