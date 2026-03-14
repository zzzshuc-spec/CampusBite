const cuisineImageMap: Record<string, string[]> = {
  粉面: [
    "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  川菜: [
    "https://images.pexels.com/photos/6646038/pexels-photo-6646038.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  火锅: [
    "https://images.pexels.com/photos/8438159/pexels-photo-8438159.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/11113197/pexels-photo-11113197.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  韩式: [
    "https://images.pexels.com/photos/6399850/pexels-photo-6399850.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  轻食: [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  盖饭: [
    "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  咖啡轻食: [
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  家常菜: [
    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
  烧烤: [
    "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/1482803/pexels-photo-1482803.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ],
};

const fallbackImages = [
  "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1400",
];

function stringHash(value: string): number {
  return value.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export function getCuisineImage(cuisine: string, seed: string): string {
  const images = cuisineImageMap[cuisine] ?? fallbackImages;
  const idx = stringHash(seed) % images.length;
  return images[idx] ?? fallbackImages[0];
}

export function getCampusHeroImages(universityId: string) {
  const group: Record<string, { main: string; side: string }> = {
    nuaa: {
      main: "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=1800",
      side: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1400",
    },
    nmu: {
      main: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1800",
      side: "https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=1400",
    },
    medu: {
      main: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1800",
      side: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1400",
    },
    fiu: {
      main: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1800",
      side: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1400",
    },
  };
  return group[universityId] ?? group.nuaa;
}

export function getCampusBannerSlides(universityId: string): string[] {
  const hero = getCampusHeroImages(universityId);
  return [
    hero.main,
    "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1800",
    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1800",
    hero.side,
  ];
}

