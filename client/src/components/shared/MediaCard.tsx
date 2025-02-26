import BookmarkButton from './BookmarkButton';
import MediaCardData from './MediaCardData';

interface MediaCardProps {
  imageUrl?: string;
  variant?: 'regular' | 'trending';
}

export default function MediaCard({ imageUrl = '', variant = 'regular' }: MediaCardProps) {
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
        <BookmarkButton />
      </div>
      <div className="absolute bottom-4 left-4">
        <MediaCardData />
      </div>
    </div>
  );
}
