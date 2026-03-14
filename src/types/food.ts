export type ThemeMode = "light" | "dark";

export type University = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  description: string;
  center: { x: number; y: number };
  campusGate: { x: number; y: number };
  hotSpots: string[];
};

export type PriceLevel = "low" | "mid" | "high";

export type Restaurant = {
  id: string;
  name: string;
  universityId: string;
  businessDistrict: string;
  cuisine: string;
  avgPrice: number;
  rating: number;
  reviewCount: number;
  openHours: string;
  isOpenLate: boolean;
  tags: string[];
  specialties: string[];
  position: { x: number; y: number };
  heat: number;
  quietLevel: number;
};

export type RestaurantFilter = {
  universityId: string;
  maxBudget: number;
  minRating: number;
  onlyOpenNow: boolean;
  onlyLateNight: boolean;
  selectedTags: string[];
  selectedCuisines: string[];
  sortBy: "recommend" | "rating" | "priceAsc" | "distance";
};

export type RecommendationResult = {
  restaurant: Restaurant;
  score: number;
  distanceKm: number;
  walkMinutes: number;
  reasons: string[];
};

