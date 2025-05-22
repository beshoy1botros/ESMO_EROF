import type { RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    element: require("./routes/home").default,
  },
  {
    path: "melodies",
    element: require("./routes/melodies").default,
  },
  {
    path: "about",
    element: require("./routes/about").default,
  },
];

export default routes;
