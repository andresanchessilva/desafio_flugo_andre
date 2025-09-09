import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
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
  {
    path: "/departamentos",
    name: "Departamentos",
    icon: <CorporateFareIcon />,
  },
];
