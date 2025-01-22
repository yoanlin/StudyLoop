const ROUTES = {
  HOME: "/",
  LOG_IN: "/login",
  SIGN_UP: "/sign_up",
  ALL_FIELDS: "/all_fields",
  COLLECTIONS: "/collections",
  LEADERBOARD: "/leaderboard",
  PROFILE: (id: string) => `/profile/${id}`,
  SUBSCRIPTIONS: "/subscriptions",
  TRENDING: "/trending",
  LOG_IN_WITH_OAUTH: "login-with-oauth",
  POST: (id: string) => `/posts/${id}`,
};

export default ROUTES;
