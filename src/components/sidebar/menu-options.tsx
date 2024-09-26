"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { FiMenu } from "react-icons/fi";
import clsx from "clsx";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import Link from "next/link";
import { Separator } from "../ui/separator";

type Props = {
  defaultOpen?: boolean;
  sidebarLogo?: string;
  details?: any;
  user?: any;
};

const Sidebar = ({ details, sidebarLogo, user, defaultOpen }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const sidebarOpt = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/dashboard/users", icon: <FaUsers /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
    {
      name: "Logout",
      path: "/login",
      action: "logout",
      icon: <FaSignOutAlt />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token or session
    router.push("/login"); // Redirect to login
  };

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <FiMenu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={clsx(
          "bg-blue-500/20 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
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
        <Command className="rounded-lg overflow-visible bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList className="py-4 overflow-visible">
                <CommandEmpty>No Results Found</CommandEmpty>
                <CommandGroup className="overflow-visible">
                  {sidebarOpt.map((sidebarOptions) => {                   
                    return (
                      <CommandItem
                        key={sidebarOptions.name}
                        className="md:w-[320px] w-full"
                      >
                        <Link
                          href={sidebarOptions.path}
                          className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
                        >
                          {sidebarOptions.icon}
                          <span>{sidebarOptions.name}</span>
                        </Link>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
