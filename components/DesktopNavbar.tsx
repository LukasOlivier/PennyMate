"use client";

import { usePathname } from "next/navigation";

const DesktopNavbar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  const links = [
    { href: "/", label: "Home" },
    { href: "/income", label: "Income" },
    { href: "/expenses", label: "Expenses" },
  ];

  return (
    <div className="hidden md:block py-4 nav-container">
      <nav className="w-full md:w-8/12 mx-auto flex justify-between items-center">
        <a className="flex gap-2 items-center hover:cursor-pointer" href="/">
          <img
            src="/logo.png"
            alt="PennyMate Logo"
            className="h-10 w-10 inline-block border-none"
          />
          <h1 className="text-3xl font-bold">PennyMate</h1>
        </a>
        <div className="flex gap-5 links text-lg">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={isActive(link.href) ? "active-link" : ""}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavbar;
