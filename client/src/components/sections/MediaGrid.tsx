import MediaCard from '../shared/MediaCard';
import imageUrl from '../../mockData/assets/thumbnails/dogs/regular/large.jpg';

export default function MediaGrid() {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8">Recommended for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
      </div>
    </section>
  );
}
