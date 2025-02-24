import MediaCard from '../shared/MediaCard';
import imageUrl from '../../mockData/assets/thumbnails/dogs/regular/large.jpg';

export default function MediaGrid() {
  return (
    <section>
      <h2 className="text-3xl font-light mb-8">Recommended for you</h2>
      <div className="grid grid-cols-4 gap-8">
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
