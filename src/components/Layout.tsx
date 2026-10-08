import { Outlet } from "react-router-dom";
import { NavbarCom } from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-100">
      <NavbarCom />
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}