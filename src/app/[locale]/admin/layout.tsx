"use client";

import { useAuth } from "@/hooks/useAuth";
import { adminLogout } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Megaphone,
  Newspaper,
  Image,
  Users,
  Heart,
  HandHelping,
  MessageSquare,
  UtensilsCrossed,
  Clock,
  BookOpen,
  Library,
  Settings,
  Shield,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Events", href: "/admin/events", icon: <Calendar size={18} /> },
      { label: "Blog", href: "/admin/blog", icon: <FileText size={18} /> },
      { label: "Announcements", href: "/admin/announcements", icon: <Megaphone size={18} /> },
      { label: "Newsletter", href: "/admin/newsletter", icon: <Newspaper size={18} /> },
      { label: "Gallery", href: "/admin/gallery", icon: <Image size={18} /> },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Members", href: "/admin/members", icon: <Users size={18} /> },
      { label: "Donations", href: "/admin/donations", icon: <Heart size={18} /> },
      { label: "Volunteers", href: "/admin/volunteers", icon: <HandHelping size={18} /> },
      { label: "Messages", href: "/admin/messages", icon: <MessageSquare size={18} /> },
      { label: "Bhandara", href: "/admin/bhandara", icon: <UtensilsCrossed size={18} /> },
      { label: "Timeslots", href: "/admin/timeslots", icon: <Clock size={18} /> },
    ],
  },
  {
    title: "Library",
    items: [
      { label: "Books", href: "/admin/library", icon: <BookOpen size={18} /> },
      { label: "Borrowings", href: "/admin/library/borrow", icon: <Library size={18} /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: <Shield size={18} /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
      { label: "Data Requests", href: "/admin/data-requests", icon: <Database size={18} /> },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Skip auth check for login page
  const isLoginPage = pathname?.endsWith("/admin/login");

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      // Extract locale from pathname
      const locale = pathname?.split("/")[1] || "sv";
      router.push(`/${locale}/admin/login`);
    }
  }, [user, loading, isLoginPage, router, pathname]);

  // Login page renders without the admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray-50">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !role) {
    return null; // Redirect happening in useEffect
  }

  const handleLogout = async () => {
    await adminLogout();
    const locale = pathname?.split("/")[1] || "sv";
    router.push(`/${locale}/admin/login`);
  };

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}/, "") || "";
    if (href === "/admin") return pathWithoutLocale === "/admin";
    return pathWithoutLocale.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-warm-gray-50 flex">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-warm-gray-200"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 bg-white border-r border-warm-gray-200 flex flex-col
          transition-all duration-200 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-warm-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-sunrise flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">ॐ</span>
          </div>
          {!collapsed && (
            <span className="ml-3 font-display font-semibold text-warm-gray-900 truncate">
              Mandir Admin
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              {!collapsed && (
                <h3 className="px-3 mb-1 text-xs font-semibold text-warm-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => {
                const locale = pathname?.split("/")[1] || "sv";
                const fullHref = `/${locale}${item.href}`;
                const active = isActive(item.href);

                return (
                  <a
                    key={item.href}
                    href={fullHref}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5
                      ${
                        active
                          ? "bg-saffron-50 text-saffron-700 font-medium"
                          : "text-warm-gray-600 hover:bg-warm-gray-100 hover:text-warm-gray-900"
                      }
                      ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={active ? "text-saffron-600" : "text-warm-gray-400"}>
                      {item.icon}
                    </span>
                    {!collapsed && item.label}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-warm-gray-200 p-3">
          {!collapsed && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-warm-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-warm-gray-500 capitalize">{role}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-warm-gray-600 hover:bg-warm-gray-100 hover:text-maroon-600 transition-colors w-full"
              title="Sign out"
            >
              <LogOut size={18} />
              {!collapsed && "Sign out"}
            </button>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full mt-2 py-1.5 rounded-lg text-warm-gray-400 hover:bg-warm-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-200 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
