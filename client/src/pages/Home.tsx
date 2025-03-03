import TrendingSection from '../components/sections/TrendingSection';
import ShowsSection from '../components/sections/ShowsSection';

export default function Home() {
  return (
    <div className="space-y-10 max-w-[1440px] mx-auto">
      <TrendingSection />
      <ShowsSection />
    </div>
  );
}
