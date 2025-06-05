export const ROUTES = {
  CULTURE: "/culture",
  ENTERTAINMENT: "/entertainment",
  FOOD: "/food",
  LANGUAGE: "/language",
  NEARBY: "/nearby",
  STAY: "/stay",
  TOP_PICKS: "/top-picks",
  EMERGENCY: "/emergency",
  PLANNER: "/planner",
} as const;

export type RouteKey = keyof typeof ROUTES;
