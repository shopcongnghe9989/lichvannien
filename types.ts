export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: number; // 0 or 1 (boolean like)
  jd?: number;
}

export interface DateInfo {
  solar: SolarDate;
  lunar: LunarDate;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  zodiacDay: string; // Tí, Sửu...
  isGoodDay: boolean; // Hoàng đạo
  goodHours: string[]; // List of zodiac hours
  badHours: string[];
  stars: string[]; // Sao tốt/xấu
  festival?: string; // Special events like Tet
}

export interface Quote {
  content: string;
  author: string;
}

export interface AiAdvice {
  text: string;
  category: 'work' | 'love' | 'health' | 'general';
}
