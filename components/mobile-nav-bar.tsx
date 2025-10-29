"use client";

import { usePathname } from "next/navigation";

import { Home, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

const MobileNavbar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  const links = [
    { href: "/", label: "Home" },
    { href: "/income", label: "Income" },
    { href: "/expenses", label: "Expenses" },
  ];

  const getIcon = (label: string, className = "") => {
    switch (label) {
      case "Home":
        return <Home className={className} />;
      case "Income":
        return <BanknoteArrowDown className={className} />;
      case "Expenses":
        return <BanknoteArrowUp className={className} />;
      default:
        return null;
    }
  };

  return (
    /* Mobile Sidebar */
    <div className="md:hidden w-full bg-surface-light py-4">
      <nav className="flex justify-around items-center ">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`flex flex-col items-center text-sm ${
              isActive(link.href) ? "active-link" : ""
            }`}
          >
            {/* Icons (Lucide) */}
            <div className="mb-1">{getIcon(link.label, "h-7 w-7")}</div>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavbar;
