//import MediaCard from '../components/shared/MediaCard';

export default function Bookmarked() {
  return (
    <div className="space-y-10 max-w-[1440px] mx-auto">
      <div>
        <h2 className="text-3xl font-light mb-8">Bookmarked Movies</h2>
        <div className="grid grid-cols-auto-fill gap-4 md:gap-6">
          <p>No bookmarked movies</p>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-light mb-8">Bookmarked TV Series</h2>
        <div className="grid grid-cols-auto-fill gap-4 md:gap-6">
          <p>No bookmarked TV series</p>
        </div>
      </div>
    </div>
  );
}
