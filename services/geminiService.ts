import { GoogleGenAI } from "@google/genai";
import { DateInfo, AiAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyAdvice = async (dateInfo: DateInfo, topic: string): Promise<AiAdvice> => {
  try {
    // Construct a culturally relevant prompt
    const prompt = `
      Bạn là một chuyên gia phong thủy và văn hóa Việt Nam uyên bác.
      Hãy đưa ra một lời khuyên ngắn gọn (khoảng 50-70 từ) về chủ đề "${topic}" cho ngày hôm nay.
      
      Thông tin ngày:
      - Dương lịch: ${dateInfo.solar.day}/${dateInfo.solar.month}/${dateInfo.solar.year}
      - Âm lịch: ${dateInfo.lunar.day}/${dateInfo.lunar.month}/${dateInfo.lunar.year}
      - Ngày Can Chi: ${dateInfo.canChiDay}, Tháng ${dateInfo.canChiMonth}, Năm ${dateInfo.canChiYear}
      - Trực/Sao: ${dateInfo.isGoodDay ? 'Ngày Hoàng Đạo' : 'Ngày bình thường'}

      Lời khuyên nên mang tính tích cực, triết lý, dựa trên ngũ hành hoặc văn hóa dân gian nếu phù hợp.
      Trả về định dạng JSON thuần túy: { "text": "...", "category": "..." }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    const data = JSON.parse(text);
    return {
      text: data.text || "Hãy sống vui vẻ và lạc quan.",
      category: (data.category as any) || 'general'
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Tâm an vạn sự an. Hãy giữ tinh thần lạc quan cho ngày mới tốt lành.",
      category: 'general'
    };
  }
};
