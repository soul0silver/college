import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import Subjects from "./pages/subject/subject";
import Mark from "./pages/mark/mark";
import Classes from "./pages/class/Class";
import Attendance from "./pages/attendance/Attendance";
import Student from "./pages/students/Student";
import PrivateRoute from "./router/PrivateRoute";
import PrivateRouteAdmin from "./router/PrivateRouteAdmin";
import PrivateRouteHomeRoom from "./router/PrivateRouteHomeRoom";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const adminRoutes = [
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Quản lý giáo viên",
    path: "/user",
    element: <PrivateRouteAdmin><Tables /></PrivateRouteAdmin>,
  },
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Quản lý môn học",
    path: "/subject",
    element: <PrivateRouteAdmin><Subjects /></PrivateRouteAdmin>,
  },
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Quản lý lớp học",
    path: "/classes",
    element: <PrivateRouteAdmin><Classes /></PrivateRouteAdmin>,
  },
]

const homeRoom = [
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Quản lý điểm",
    path: "/mark",
    element: <PrivateRouteHomeRoom><Mark /></PrivateRouteHomeRoom>,
  },
  
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Chấm công",
    path: "/attend",
    element: <PrivateRouteHomeRoom><Attendance /></PrivateRouteHomeRoom>,
  },
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Quản lý học sinh",
    path: "/students",
    element: (
      <PrivateRoute><Student /></PrivateRoute>
    ),
  },
]

function getPages() {
  let role = localStorage.getItem('role');
  if (role === 'admin') 
    return adminRoutes;
  if (role === 'homeroom') 
    return homeRoom
  if (role === 'none') 
    return [homeRoom[0], homeRoom[1]]
  if (role === 'parent') {
    return [homeRoom[0], homeRoom[1]]
  }
  return role === undefined || role === null && [] ;
}
export const routes = [
  {
    layout: "dashboard",
    pages: getPages()
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: localStorage.getItem('login') === 'true' ? "Đăng xuất" : "Đăng nhập",
        path: "/sign-in",
        element: <SignIn />,
      }
    ],
  },
];

export default routes;
