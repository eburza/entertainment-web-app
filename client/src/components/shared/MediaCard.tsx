import BookmarkButton from './BookmarkButton';
import MediaCardData from './MediaCardData';
import { IMediaCardProps } from '../../types/interface';

const TMDB_IMAGE_BASE_URL =
  process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/original';

export default function MediaCard({
  backdrop_path,
  variant = 'regular',
  title,
  year,
  media_type,
  rating,
  isBookmarked = false,
  isWatched = false,
  isFavorite = false,
}: IMediaCardProps) {
  const cardStyles = {
    regular: 'aspect-[16/10] w-full',
    trending: 'aspect-[16/9] min-w-[460px]',
    //aspect-[16/9] w-full sm:w-[280px] md:w-[320px] lg:w-[400px]'
    // trending: 'aspect-[16/9] min-w-[300px] md:min-w-[400px] lg:min-w-[450px]',
  };
  const fullImageUrl = backdrop_path ? `${TMDB_IMAGE_BASE_URL}${backdrop_path}` : '';

  return (
    <div
      className={`${cardStyles[variant]} relative bg-cover bg-center rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200`}
      style={{ backgroundImage: `url(${fullImageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute top-4 right-4">
        <BookmarkButton isBookmarked={isBookmarked} />
      </div>
      <div className="absolute bottom-4 left-4 drop-shadow-lg">
        <MediaCardData
          title={title}
          year={year}
          media_type={media_type}
          rating={rating}
          isWatched={isWatched}
          isFavorite={isFavorite}
          imageUrl={backdrop_path}
        />
      </div>
    </div>
  );
}
