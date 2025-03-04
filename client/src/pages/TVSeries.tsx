import MediaSection from '../components/shared/MediaSection';
import { useAppContext } from '../context/AppContext';
import { IAppContext, IShow } from '../types/interface';

export default function TVSeries() {
  const { tvSeries } = useAppContext() as IAppContext;

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">TV Series</h2>
      <MediaSection items={tvSeries as IShow[]} />
    </section>
  );
}
