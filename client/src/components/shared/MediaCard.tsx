import BookmarkButton from './BookmarkButton';
import MediaCardData from './MediaCardData';
import { IMediaCardProps } from '../../types/interface';

export default function MediaCard({
  imageUrl = '',
  variant = 'regular',
  title,
  year,
  category,
  rating,
  isBookmarked = false,
  isWatched = false,
  isFavorite = false,
}: IMediaCardProps) {
  const cardStyles = {
    regular: 'aspect-[16/10] min-w-[200px]',
    trending: 'aspect-[16/9] min-w-[300px] md:min-w-[400px] lg:min-w-[450px]',
  };

  return (
    <div
      className={`${cardStyles[variant]} relative bg-cover bg-center rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute top-4 right-4">
        <BookmarkButton isBookmarked={isBookmarked} />
      </div>
      <div className="absolute bottom-4 left-4">
        <MediaCardData
          title={title}
          year={year}
          category={category}
          rating={rating}
          isWatched={isWatched}
          isFavorite={isFavorite}
        />
      </div>
    </div>
  );
}
