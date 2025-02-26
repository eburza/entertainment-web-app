import BookmarkButton from './BookmarkButton';
import MediaCardData from './MediaCardData';

interface MediaCardProps {
  imageUrl?: string;
  variant?: 'regular' | 'trending';
}

export default function MediaCard({ imageUrl = '', variant = 'regular' }: MediaCardProps) {
  const cardStyles = {
    regular: 'w-full h-[10.875rem]',
    trending: 'w-[15rem] sm:w-[20rem] md:w-[25rem] lg:w-[29.375rem] h-[12rem] md:h-[14.375rem]',
  };

  return (
    <div
      className={`${cardStyles[variant]} relative bg-cover bg-center rounded-lg`}
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
