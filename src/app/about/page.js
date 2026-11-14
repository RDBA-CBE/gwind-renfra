import StatsSection from "@/components/About- Main";
import AboutContentSection from "@/components/About- Main";
import InnerBanner from "@/components/Inner-Banner";
import MainCareerSection from "@/components/Main-Career";
import ExecutiveMessageTabs from "@/components/Team-Message";
import TechnicalSection from "@/components/Technical-Edge";
import { TestimonialsSection } from "@/components/Testimonials";
import TimelineSection from "@/components/Timeline";
import ValueVisionMission from "@/components/Vision";


export default function About() {
  return (
<>

<InnerBanner title="About" bgImage="/images/about-bg.svg" />
<StatsSection />
<ValueVisionMission />
<TimelineSection />
<ExecutiveMessageTabs />
<TechnicalSection />
<TestimonialsSection />
</>
  );
}
