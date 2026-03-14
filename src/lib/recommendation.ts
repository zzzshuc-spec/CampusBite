import { Restaurant, RestaurantFilter, RecommendationResult } from "@/types/food";
import { calcDistanceKm, estimateWalkMinutes } from "@/lib/walkTime";
import { isOpenNow } from "@/lib/restaurant-utils";

export function scoreRestaurant(
  restaurant: Restaurant,
  filter: RestaurantFilter,
  universityCenter: { x: number; y: number },
  date = new Date(),
): RecommendationResult {
  const distanceKm = calcDistanceKm(universityCenter, restaurant.position);
  const walkMinutes = estimateWalkMinutes(distanceKm);
  const budgetFit = Math.max(0, 1 - restaurant.avgPrice / Math.max(filter.maxBudget, 1));
  const ratingScore = restaurant.rating / 5;
  const heatScore = restaurant.heat / 100;
  const quietBonus =
    filter.selectedTags.includes("考试周推荐") && restaurant.quietLevel >= 4
      ? 0.15
      : 0;
  const openBonus = isOpenNow(restaurant.openHours, date) ? 0.1 : 0;
  const score =
    ratingScore * 0.38 +
    heatScore * 0.22 +
    budgetFit * 0.2 +
    Math.max(0, 1 - distanceKm / 3.5) * 0.2 +
    quietBonus +
    openBonus;

  const reasons = [
    `评分 ${restaurant.rating.toFixed(1)}，口碑稳定`,
    `人均 ${restaurant.avgPrice} 元，预算匹配度 ${(budgetFit * 100).toFixed(0)}%`,
    `步行约 ${walkMinutes} 分钟可达`,
  ];

  if (restaurant.isOpenLate) {
    reasons.push("支持深夜时段，夜宵友好");
  }
  if (restaurant.quietLevel >= 4) {
    reasons.push("环境安静，适合复习或独处");
  }
  if (restaurant.heat >= 85) {
    reasons.push("学生热度高，本周热门");
  }

  return {
    restaurant,
    score: Number(score.toFixed(4)),
    distanceKm,
    walkMinutes,
    reasons,
  };
}

export function getRecommendations(
  restaurants: Restaurant[],
  filter: RestaurantFilter,
  universityCenter: { x: number; y: number },
  date = new Date(),
): RecommendationResult[] {
  return restaurants
    .map((restaurant) => scoreRestaurant(restaurant, filter, universityCenter, date))
    .sort((a, b) => b.score - a.score);
}

export function pickRandomRestaurant(
  ranked: RecommendationResult[],
): RecommendationResult | null {
  if (ranked.length === 0) {
    return null;
  }
  const candidates = ranked.slice(0, Math.min(8, ranked.length));
  const random = Math.floor(Math.random() * candidates.length);
  return candidates[random] ?? null;
}

