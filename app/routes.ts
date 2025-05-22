import type { RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    element: require("./routes/home.tsx").default,
  },
  {
    path: "melodies",
    element: require("./routes/melodies.tsx").default,
  },
  {
    path: "about",
    element: require("./routes/about.tsx").default,
  },
];

export default routes;
