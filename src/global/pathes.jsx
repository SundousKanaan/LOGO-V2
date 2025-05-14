import Reviews from "../pages/Reviews";
import NoPage from "../pages/NoPage";
import Dashboard from "../pages/Dashboard";

import {
  HomeIcon,
  QuoteDownIcon,
  HashIcon,
  WebIcon,
  NotificationBellIcon,
  SettingsIcon,
  UserIcon,
} from "./icons";

const Pathes = [
  {
    path: "/",
    label: "Dashboard",
    icon: HomeIcon,
    element: Dashboard,
  },
  {
    path: "/Reviews",
    label: "Reviews",
    icon: QuoteDownIcon,
    element: Reviews,
  },
  {
    path: "/Keywords",
    label: "Keywords",
    icon: HashIcon,
    element: NoPage,
  },
  {
    path: "/Web-crawler",
    label: "Web crawler",
    icon: WebIcon,
    element: NoPage,
  },
  {
    path: "/Notifications",
    label: "Notifications",
    icon: NotificationBellIcon,
    element: NoPage,
  },
  {
    path: "/Settings",
    label: "Settings",
    icon: SettingsIcon,
    element: NoPage,
  },
  {
    path: "/User-management",
    label: "User management",
    icon: UserIcon,
    element: NoPage,
  },
];

export default Pathes;
