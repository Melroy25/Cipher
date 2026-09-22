import React from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../components/Hero.tsx";
import { About } from "../components/About.tsx";
import { Domains } from "../components/Domains.tsx";
import { HomeEvents } from "../components/HomeEvents.tsx";
import { Activities } from "../components/Activities.tsx";
import { Leadership } from "../components/Leadership.tsx";
import { JoinSection } from "../components/JoinSection.tsx";

interface OutletContextType {
  onOpenJoinModal: () => void;
  onOpenRootAccess: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenJoinModal, onOpenRootAccess } = useOutletContext<OutletContextType>();

  return (
    <div>
      <Hero onOpenJoinModal={onOpenJoinModal} onOpenRootAccess={onOpenRootAccess} />
      <About />
      <Domains />
      <HomeEvents />
      <Activities />
      <Leadership />
      <JoinSection onOpenJoinModal={onOpenJoinModal} />
    </div>
  );
};
