import { Restaurant, RestaurantFilter } from "@/types/food";
import { calcDistanceKm } from "@/lib/walkTime";

export const defaultFilter: RestaurantFilter = {
  universityId: "nuaa",
  maxBudget: 80,
  minRating: 4,
  onlyOpenNow: false,
  onlyLateNight: false,
  selectedTags: [],
  selectedCuisines: [],
  sortBy: "recommend",
};

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isOpenNow(openHours: string, date = new Date()): boolean {
  const [start, end] = openHours.split("-");
  if (!start || !end) {
    return false;
  }
  const current = date.getHours() * 60 + date.getMinutes();
  const startM = parseTimeToMinutes(start);
  const endM = parseTimeToMinutes(end);
  if (endM >= startM) {
    return current >= startM && current <= endM;
  }
  return current >= startM || current <= endM;
}

export function filterRestaurants(
  restaurants: Restaurant[],
  filter: RestaurantFilter,
  universityCenter: { x: number; y: number },
  date = new Date(),
): Restaurant[] {
  return restaurants.filter((restaurant) => {
    const withinBudget = restaurant.avgPrice <= filter.maxBudget;
    const ratingMatched = restaurant.rating >= filter.minRating;
    const tagsMatched = filter.selectedTags.every((tag) =>
      restaurant.tags.includes(tag),
    );
    const cuisineMatched =
      filter.selectedCuisines.length === 0 ||
      filter.selectedCuisines.includes(restaurant.cuisine);
    const openNowMatched =
      !filter.onlyOpenNow || isOpenNow(restaurant.openHours, date);
    const lateNightMatched = !filter.onlyLateNight || restaurant.isOpenLate;
    const distanceKm = calcDistanceKm(universityCenter, restaurant.position);
    const maxDistanceMatched = distanceKm <= 3.5;
    return (
      withinBudget &&
      ratingMatched &&
      tagsMatched &&
      cuisineMatched &&
      openNowMatched &&
      lateNightMatched &&
      maxDistanceMatched
    );
  });
}

