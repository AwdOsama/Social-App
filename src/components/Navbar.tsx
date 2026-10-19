import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownItem,
} from "flowbite-react";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiBell,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSettings,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import { authContext } from "../context/auth.context";
import { useTheme } from "../features/GetInitialTheme";
import { getUnreadCount } from "../pages/Notifications/apis/GetNotfi";
import { useQuery } from "@tanstack/react-query";

const links = [
  { label: "Feed", path: "/feed", icon: FiHome },
  { label: "Profile", path: "/profile", icon: FiUser },
  { label: "Notifications", path: "/notifications", icon: FiBell },
];

export function NavbarCom() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const context = useContext(authContext);
  if (!context)
    throw new Error("NavbarCom must be used within AuthContextProvider");
  const { setisLogin } = context;
  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    enabled: !!context?.user,
    refetchInterval: 30000,
  });
  const unread: number = unreadData?.data?.unreadCount ?? 0;

  function logOut() {
    localStorage.removeItem("TKN");
    setisLogin(null);
    toast.success("you are logged out");
    navigate("/");
  }

  function goTo(path: string) {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-600 shadow-md dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <div className="flex md:flex-1">
          <span
            onClick={() => goTo("/")}
            className="cursor-pointer whitespace-nowrap text-xl font-bold text-white"
          >
            Route Posts
          </span>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            {links.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <button
                  type="button"
                  onClick={() => goTo(path)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/10 ${
                    pathname === path
                      ? "bg-white/20 font-semibold text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {path === "/notifications" && unread > 0 && (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-2 md:flex-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
          >
            {theme === "dark" ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={context.user?.photo} rounded />
            }
          >
            <DropdownItem icon={FiUser} onClick={() => navigate("/profile")}>
              Profile
            </DropdownItem>
            <DropdownItem icon={FiSettings} onClick={() => navigate("/settings")}>
              Setting
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={FiLogOut} onClick={logOut}>
              Log out
            </DropdownItem>
          </Dropdown>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 text-white transition hover:bg-white/20 md:hidden"
          >
            {menuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-blue-700 p-2 dark:bg-gray-900 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <button
                  type="button"
                  onClick={() => goTo(path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-white/10 ${
                    pathname === path
                      ? "bg-white/20 font-semibold text-white"
                      : "text-white/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {path === "/notifications" && unread > 0 && (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
