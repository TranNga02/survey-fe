import { getAssetPath } from "@/core/helpers/assets";

export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  svgIcon?: string;
  fontIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        svgIcon: getAssetPath("media/icons/duotune/art/art002.svg"),
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "categories",
        route: "/categories",
        svgIcon: getAssetPath("media/icons/duotune/general/gen019.svg"),
        fontIcon: "bi-layers",
      },
      {
        heading: "questions",
        route: "/questions",
        svgIcon: getAssetPath("media/icons/duotune/art/art002.svg"),
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "users",
        route: "/users",
        svgIcon: getAssetPath("media/icons/duotune/general/gen014.svg"),
        fontIcon: "bi-calendar3-event",
      },
    ],
  },
];

export default MainMenuConfig;
