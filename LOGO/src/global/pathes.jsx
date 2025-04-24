import Reviews from "../pages/Reviews";
import NoPage from "../pages/NoPage";
import Dashboard from "../pages/Dashboard";

const Pathes = [
  {
    path: "/",
    label: "Dashboard",
    icon: "home",
    element: Dashboard,
  },
  {
    path: "/Reviews",
    label: "Reviews",
    icon: "quote-down-square",
    element: Reviews,
  },
  {
    path: "/Keywords",
    label: "Keywords",
    icon: "keyword",
    element: NoPage,
  },
  {
    path: "/Web-crawler",
    label: "Web crawler",
    icon: "web",
    element: NoPage,
  },
  {
    path: "/Notifications",
    label: "Notifications",
    icon: "notification",
    element: NoPage,
  },
  {
    path: "/Settings",
    label: "Settings",
    icon: "setting",
    element: NoPage,
  },
  {
    path: "/User-management",
    label: "User management",
    icon: "user",
    element: NoPage,
  },
];

export default Pathes;
