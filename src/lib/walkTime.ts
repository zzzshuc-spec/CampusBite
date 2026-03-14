export const averageWalkSpeedKmPerMin = 0.075;

export function calcDistanceKm(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
): number {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const gridDistance = Math.sqrt(dx * dx + dy * dy);
  return Number((gridDistance * 0.08).toFixed(2));
}

export function estimateWalkMinutes(distanceKm: number): number {
  return Math.max(2, Math.round(distanceKm / averageWalkSpeedKmPerMin));
}

