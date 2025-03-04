import MediaSection from '../components/shared/MediaSection';
import { useAppContext } from '../context/AppContext';
import { IAppContext, IShow } from '../types/interface';

export default function Movies() {
  const { movies } = useAppContext() as IAppContext;
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Movies</h2>
      <MediaSection items={movies as IShow[]} />
    </div>
  );
}
