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
        heading: "category",
        route: "/category",
        svgIcon: getAssetPath("media/icons/duotune/general/gen019.svg"),
        fontIcon: "bi-layers",
      },
    ],
  },
];

export default MainMenuConfig;
