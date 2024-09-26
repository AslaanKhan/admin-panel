import BlurPage from "@/components/global/blur-page";
import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar />
      <div className="md:pl-[300px]">
        <div className="relative">
          <BlurPage> {children} </BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
