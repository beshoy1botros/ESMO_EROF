import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/melodies", "routes/melodies.tsx"),
  route("/about", "routes/about.tsx"),
  route("/preparatory", "routes/preparatory.tsx"),
  route("/help", "routes/help.tsx"),
] satisfies RouteConfig;