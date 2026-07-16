import type { JSX } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { ChannelsSection } from '../components/landing/ChannelsSection';
import { StepsSection } from '../components/landing/StepsSection';
import { CtaSection } from '../components/landing/CtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage(): JSX.Element {
  return (
    <div className="bg-white dark:bg-zinc-950">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <ChannelsSection />
      <StepsSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
