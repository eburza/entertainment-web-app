import MediaCard from '../components/shared/MediaCard';
import imageUrl from '../mockData/assets/thumbnails/dogs/regular/large.jpg';

export default function Bookmarked() {
  return (
    <div className="space-y-10 max-w-[1440px] mx-auto">
      <div>
        <h2 className="text-3xl font-light mb-8">Bookmarked Movies</h2>
        <div className="grid grid-cols-4 gap-8">
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-light mb-8">Bookmarked TV Series</h2>
        <div className="grid grid-cols-4 gap-8">
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
          <MediaCard imageUrl={imageUrl} variant="regular" />
        </div>
      </div>
    </div>
  );
}
