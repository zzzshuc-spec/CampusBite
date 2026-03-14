import { getCuisineImage } from "@/lib/food-visuals";
import { Restaurant } from "@/types/food";

export type MockReview = {
  id: string;
  userName: string;
  major: string;
  stars: number;
  content: string;
  likedCount: number;
  visitTime: string;
  tags: string[];
};

export type RestaurantDetailMock = {
  dishGallery: Array<{ name: string; image: string }>;
  reviewKeywords: string[];
  scoreBreakdown: Array<{ label: string; score: number }>;
  reviews: MockReview[];
};

function hashCode(seed: string): number {
  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

const majors = ["计科", "临床", "法学", "经管", "外语", "材料", "新闻", "护理"];
const namePool = ["小林", "阿泽", "Mia", "沐沐", "Yuki", "大宇", "秋同学", "Luna"];
const templates = [
  "出餐挺快，味道稳定，适合课间快速解决。",
  "性价比高，分量够，晚上来吃也不踩雷。",
  "环境比预期好，朋友聚餐反馈都不错。",
  "口味偏重但很香，下饭能力很强。",
  "这家在同价位里算很能打，愿意回购。",
  "高峰期稍微排队，但整体体验值得。",
];

const keywordPool = [
  "分量足",
  "回头客多",
  "夜宵友好",
  "口味稳定",
  "出餐快",
  "环境干净",
  "学生党推荐",
  "性价比高",
];

export function getRestaurantMockDetail(restaurant: Restaurant): RestaurantDetailMock {
  const seed = hashCode(restaurant.id);
  const dishGallery = restaurant.specialties.slice(0, 4).map((name, index) => ({
    name,
    image: getCuisineImage(restaurant.cuisine, `${restaurant.id}-dish-${index}`),
  }));

  const reviewKeywords = keywordPool
    .slice(seed % 3, (seed % 3) + 5)
    .concat(restaurant.tags.slice(0, 2))
    .slice(0, 6);

  const scoreBreakdown = [
    {
      label: "口味",
      score: Number((Math.min(5, restaurant.rating + 0.1)).toFixed(1)),
    },
    {
      label: "环境",
      score: Number((Math.max(3.8, 3.9 + restaurant.quietLevel * 0.2)).toFixed(1)),
    },
    {
      label: "服务",
      score: Number((Math.min(4.9, 4.1 + (restaurant.heat % 8) * 0.08)).toFixed(1)),
    },
    {
      label: "性价比",
      score: Number((Math.min(5, 4.0 + Math.max(0, 30 - restaurant.avgPrice) * 0.03)).toFixed(1)),
    },
  ];

  const reviews: MockReview[] = Array.from({ length: 6 }).map((_, index) => {
    const rowSeed = seed + index * 17;
    const stars = Math.max(3, Math.min(5, Math.round(restaurant.rating + ((rowSeed % 3) - 1) * 0.4)));
    return {
      id: `${restaurant.id}-review-${index}`,
      userName: namePool[rowSeed % namePool.length] ?? "同学",
      major: `${majors[rowSeed % majors.length] ?? "综合"}${22 + (rowSeed % 4)}级`,
      stars,
      content: templates[rowSeed % templates.length] ?? templates[0] ?? "味道不错。",
      likedCount: 6 + (rowSeed % 72),
      visitTime: `${1 + (rowSeed % 4)} 天前`,
      tags: [
        restaurant.tags[(rowSeed + 1) % restaurant.tags.length] ?? "学生推荐",
        keywordPool[(rowSeed + 2) % keywordPool.length] ?? "性价比高",
      ],
    };
  });

  return {
    dishGallery,
    reviewKeywords,
    scoreBreakdown,
    reviews,
  };
}

