import { useAppContext } from '../../context/AppContext';
import { IAppContext, IShow } from '../../types/interface';
import MediaCard from '../shared/MediaCard';

export default function ShowsSection() {
  const { shows, isLoading, isError, errorMessage } = useAppContext() as IAppContext;

  if (isLoading) {
    return <h1 aria-live="polite">Loading...</h1>;
  }

  if (isError) {
    console.error('Error occurred:', errorMessage);
    return (
      <h1 aria-live="assertive">There was an error: {errorMessage || 'Unknown error occurred'}</h1>
    );
  }

  if (!shows) {
    return <p>No shows available.</p>;
  }

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bold mb-8">Recommended for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {shows.map(show => (
          <MediaCard
            key={show.id}
            backdrop_path={(show as unknown as IShow).backdrop_path}
            variant="regular"
            title={(show as unknown as IShow).title || (show as unknown as IShow).name}
            year={show.year}
            media_type={show.media_type}
            rating={show.vote_average}
            isBookmarked={show.isBookmarked}
            isWatched={show.isWatched}
            isFavorite={show.isFavorite}
          />
        ))}
      </div>
    </section>
  );
}
