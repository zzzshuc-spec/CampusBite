import { University } from "@/types/food";

export const universities: University[] = [
  {
    id: "nuaa",
    name: "南江理工大学",
    shortName: "南江理工",
    city: "南江市",
    description: "工科氛围浓厚，周边夜宵和快餐密集，适合赶课间快速就餐。",
    center: { x: 30, y: 40 },
    campusGate: { x: 28, y: 45 },
    hotSpots: ["星湖美食街", "学林路", "南门夜市"],
  },
  {
    id: "nmu",
    name: "东川师范大学",
    shortName: "东川师大",
    city: "南江市",
    description: "文科与教育专业集中，咖啡轻食和安静简餐较多。",
    center: { x: 55, y: 58 },
    campusGate: { x: 52, y: 62 },
    hotSpots: ["知新广场", "书香巷", "东湖路"],
  },
  {
    id: "medu",
    name: "北河医学院",
    shortName: "北河医",
    city: "南江市",
    description: "值班学习节奏快，24 小时和深夜餐厅分布广。",
    center: { x: 72, y: 32 },
    campusGate: { x: 70, y: 36 },
    hotSpots: ["仁和街", "白杨路", "康宁广场"],
  },
  {
    id: "fiu",
    name: "西岭财经大学",
    shortName: "西岭财大",
    city: "南江市",
    description: "社团活动多，聚餐型餐厅和平价小馆并存。",
    center: { x: 42, y: 26 },
    campusGate: { x: 38, y: 29 },
    hotSpots: ["金枫商业街", "青木里", "西岭生活区"],
  },
];

export const defaultUniversityId = universities[0].id;

