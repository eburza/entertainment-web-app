import SwiperComponent from '../shared/Swiper';
import { useAppContext } from '../../context/AppContext';
import { IAppContext } from '../../types/interface';

export default function TrendingSection() {
  const { trending, isLoading, isError, errorMessage } = useAppContext() as IAppContext;

  if (isLoading) {
    return <h1 aria-live="polite">Loading...</h1>;
  }

  if (isError) {
    console.error('Error occurred:', errorMessage);
    return (
      <h1 aria-live="assertive">There was an error: {errorMessage || 'Unknown error occurred'}</h1>
    );
  }

  if (!trending.length) {
    return <p>No trending shows available.</p>;
  }

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-light mb-8">Trending</h2>
      {trending.length > 0 ? (
        <div className="relative overflow-hidden">
          <SwiperComponent items={trending} variant="trending" />
        </div>
      ) : (
        <p>No trending shows available.</p>
      )}
    </section>
  );
}
