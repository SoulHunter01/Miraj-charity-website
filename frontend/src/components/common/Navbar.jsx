import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();

  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  // Avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // If mobile menu opens, close avatar menu (avoid double menus)
  useEffect(() => {
    if (isMenuOpen) setMenuOpen(false);
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Start Here", href: "/discover" },
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search:", query);
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const avatarUrl =
    user?.avatar && user.avatar.startsWith("http")
      ? user.avatar
      : user?.avatar
        ? `${API_BASE}${user.avatar}`
        : null;

  return (
    <nav className="sticky top-0 z-50 bg-emerald-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-emerald-100">
              <img src={logo} alt="Miraj Foundation" className="h-10 w-auto" />
            </div>

            <div className="leading-tight">
              <div className="text-base font-extrabold text-emerald-700">
                MIRAJ
              </div>
              <div className="text-xs font-semibold text-emerald-600 -mt-0.5">
                FOUNDATION
              </div>
            </div>
          </Link>

          {/* Search (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 justify-center"
          >
            <div className="relative w-full max-w-[560px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-10 pl-11 pr-4 rounded-full border border-emerald-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                           text-sm text-emerald-900 placeholder:text-emerald-400"
              />
            </div>
          </form>

          {/* Links + Right area (Desktop) */}
          <div className="hidden md:flex items-center gap-8 shrink-0">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-emerald-900"
                      : "text-emerald-700 hover:text-emerald-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth area */}
            {!isAuthed ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="h-10 px-7 rounded-full bg-sky-500 text-white text-sm font-semibold
                             inline-flex items-center justify-center leading-none
                             hover:bg-sky-600 transition-colors shadow-sm"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="h-10 px-7 rounded-full bg-white text-sky-600 text-sm font-semibold
                             border border-sky-200 inline-flex items-center justify-center leading-none
                             hover:bg-sky-50 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-10 pl-2 pr-3 rounded-full bg-white border border-emerald-200 shadow-sm
                             inline-flex items-center gap-2 hover:ring-2 hover:ring-emerald-200 transition"
                  aria-label="Open user menu"
                >
                  <span className="w-8 h-8 rounded-full overflow-hidden bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        {(user?.username?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </span>

                  <span className="text-sm font-semibold text-emerald-800 max-w-[120px] truncate">
                    {user?.username || "User"}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-emerald-700 transition-transform ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-emerald-700" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-emerald-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-emerald-800" />
            ) : (
              <Menu className="w-6 h-6 text-emerald-800" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-3 border-t border-emerald-100">
            <form onSubmit={handleSearchSubmit} className="px-1 py-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full h-10 pl-11 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
                />
              </div>
            </form>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md font-semibold text-sm ${
                    isActive(link.href)
                      ? "text-emerald-900 bg-emerald-100"
                      : "text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth area */}
              <div className="pt-4 mt-2 border-t border-emerald-100 flex flex-col gap-3">
                {!isAuthed ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="h-10 rounded-full bg-sky-500 text-white text-sm font-semibold
                                 inline-flex items-center justify-center leading-none
                                 hover:bg-sky-600 transition-colors"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="h-10 rounded-full bg-white text-sky-600 text-sm font-semibold
                                 border border-sky-200 inline-flex items-center justify-center leading-none
                                 hover:bg-sky-50 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="h-10 rounded-full bg-white text-emerald-800 text-sm font-semibold
                                 border border-emerald-200 inline-flex items-center justify-center gap-2
                                 hover:bg-emerald-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="h-10 rounded-full bg-white text-emerald-800 text-sm font-semibold
                                 border border-emerald-200 inline-flex items-center justify-center gap-2
                                 hover:bg-emerald-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-emerald-700" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
