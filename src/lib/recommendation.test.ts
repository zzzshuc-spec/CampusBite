import { describe, expect, it } from "vitest";
import { restaurants } from "@/data/restaurants";
import { universities } from "@/data/universities";
import { getRecommendations, pickRandomRestaurant } from "@/lib/recommendation";
import { defaultFilter } from "@/lib/restaurant-utils";

describe("recommendation", () => {
  it("returns ranked recommendations with descending scores", () => {
    const school = universities[0];
    const source = restaurants.filter((item) => item.universityId === school.id).slice(0, 6);
    const result = getRecommendations(
      source,
      { ...defaultFilter, universityId: school.id },
      school.center,
      new Date("2026-03-14T20:00:00"),
    );
    expect(result.length).toBe(source.length);
    expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
  });

  it("returns null when no candidates are available", () => {
    expect(pickRandomRestaurant([])).toBeNull();
  });
});

