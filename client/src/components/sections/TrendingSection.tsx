// import MediaCard from '../shared/MediaCard';
import SwiperComponent from '../shared/Swiper';

export default function TrendingSection() {
  return (
    <section className="mb-10">
      <h2 className="text-3xl font-light mb-8">Trending</h2>
      <div className="relative overflow-hidden">
        <SwiperComponent />
      </div>
    </section>
  );
}
