"use client";
import { useAuth } from "@/hooks/authContext";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiSolidOffer } from "react-icons/bi";
import { FaList, FaSignOutAlt, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

type Props = {
  defaultOpen?: boolean;
  sidebarLogo?: string;
  details?: any;
  user?: any;
};

const MenuOptions = ({ defaultOpen = false }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const {logout} = useAuth()
  const pathname = usePathname(); // Call usePathname here

  const sidebarOpt = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/dashboard/users", icon: <FaUsers /> },
    { name: "Products", path: "/dashboard/products", icon: <MdOutlineProductionQuantityLimits /> },
    { name: "Offers", path: "/dashboard/offers", icon: <BiSolidOffer />},
    { name: "Categories", path: "/dashboard/categories", icon: <FaList />},
    { name: "Orders", path: "/dashboard/orders", icon: <FaUsers /> },
    {
      name: "Logout",
      path: "/",
      action: "logout",
      icon: <FaSignOutAlt />,
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  )

  if (!isMounted) return null; // Ensure hooks are called before this return

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger asChild
        className="absolute left-4 top-4 z-[100] md:!hidden felx">
        <Button variant="outline" size="icon">
          <FiMenu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          "bg-blue-500/20 backdrop-blur-xl fixed h-full top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700 mb-4">
          <AspectRatio ratio={16 / 5}>
            <Image
              src="/assets/preview.png"
              alt="Sidebar Logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>
        </div>
        <Separator className="mb-4" />
        <nav className="relative">
          <Command className="rounded-lg bg-transparent">
            <CommandInput
              placeholder="Search..."
              aria-label="Search Menu"
              className="mb-2"
            />
            <CommandList className="py-4 !min-h-[70vh]">
              <CommandEmpty>No Results Found</CommandEmpty>
              <CommandGroup>
                {sidebarOpt.map(({ name, path, icon }) => {
                  const isActive = pathname === path; // Check if the link is active
                  return (
                    <CommandItem key={name} className="md:w-[320px] w-full">
                      <Link
                        href={path}
                        className={clsx(
                          "flex items-center gap-3 p-2 rounded-md transition-all md:w-full w-full",
                          {
                            "bg-blue-300": isActive, // Highlight active link
                            "hover:bg-blue-200": !isActive, // Hover effect
                          }
                        )}
                        onClick={
                          name === "Logout"
                            ? (e) => {
                                e.preventDefault(); // Prevent default link behavior
                                if (confirm("Are you sure you want to logout?")) {
                                  logout();
                                }
                              }
                            : undefined
                        }
                        aria-label={`Navigate to ${name}`} // Accessibility
                      >
                        {icon}
                        <span>{name}</span>
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
