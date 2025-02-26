import MediaCard from '../components/shared/MediaCard';
import imageUrl from '../mockData/assets/thumbnails/dogs/regular/large.jpg';

export default function Movies() {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-8">Movies</h2>
      <div className="grid grid-cols-auto-fill gap-4 md:gap-6">
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
        <MediaCard imageUrl={imageUrl} variant="regular" />
      </div>
    </div>
  );
}
