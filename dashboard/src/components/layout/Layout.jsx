import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function Layout() { return <div className="app-layout"><SideBar /><main className="content-area p-4"><Outlet /></main></div>; }
