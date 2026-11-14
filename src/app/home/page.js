import { CallButton } from "@/components/Call-Action";
import AboutUsSection from "@/components/Home-About";
import CareerSection from "@/components/Home-Career";
import ProjectsHome from "@/components/Home-Projects";
import SolutionsGwind from "@/components/Home-Solutions";
import TabsComponent from "@/components/Home-Spare";
import NewsHomeSection from "@/components/News-Media";
import VideoBannerSection from "@/components/Video-Banner";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <VideoBannerSection />
   <AboutUsSection />
   <SolutionsGwind />
   <TabsComponent />
   <ProjectsHome />
  <CareerSection />
  <NewsHomeSection />
  <CallButton />
   
   </>
  );
}
