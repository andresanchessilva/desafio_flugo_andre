import AccountBoxIcon from "@mui/icons-material/AccountBox";
import type { JSX } from "react";

export interface NavRoute {
  path: string;
  name: string;
  icon: JSX.Element;
}

export const navigationRoutes: NavRoute[] = [
  {
    path: "/colaboradores",
    name: "Colaboradores",
    icon: <AccountBoxIcon />,
  },
];
