import { describe, expect, it } from "vitest";
import { calcDistanceKm, estimateWalkMinutes } from "@/lib/walkTime";

describe("walkTime", () => {
  it("calculates positive distances", () => {
    const distance = calcDistanceKm({ x: 20, y: 20 }, { x: 30, y: 35 });
    expect(distance).toBeGreaterThan(0);
  });

  it("converts distance to walk minutes with minimum floor", () => {
    expect(estimateWalkMinutes(0.01)).toBe(2);
    expect(estimateWalkMinutes(1.2)).toBeGreaterThan(2);
  });
});

