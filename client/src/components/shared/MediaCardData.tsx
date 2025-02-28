import movieIcon from '../../assets/icons/icon-category-movie.svg';
import tvSeriesIcon from '../../assets/icons/icon-category-tv.svg';
import { IMediaCardDataProps } from '@/types/interface';
import iconWatchedEmpty from '../../assets/icons/icon-watched-empty.svg';
import iconWatchedFull from '../../assets/icons/icon-watched-full.svg';
import iconFavoriteEmpty from '../../assets/icons/icon-favorite-empty.svg';
import iconFavoriteFull from '../../assets/icons/icon-favorite-full.svg';

type IconProps = {
  icon: string;
  alt: string;
};

const Icon = ({ icon, alt }: IconProps) => {
  return <img src={icon} alt={alt} className="w-4 h-4" />;
};

export default function MediaCardData({
  title = 'Untitled',
  year = new Date().getFullYear(),
  category = 'Movie',
  rating = 'PG',
  isWatched = false,
  isFavorite = false,
}: IMediaCardDataProps) {
  const categoryIcon = category === 'TV Series' ? tvSeriesIcon : movieIcon;

  return (
    <div>
      <div className="flex gap-2 opacity-65 text-sm">
        <p>{year}</p>
        <div className="flex gap-2">
          <img src={categoryIcon} alt={category} className="w-4 h-4" />
          <p>{category}</p>
        </div>
        <p>{rating}</p>
      </div>
      <p className="text-lg font-bold">{title}</p>
      <div className="flex gap-2">
        <Icon icon={isWatched ? iconWatchedFull : iconWatchedEmpty} alt="Watched" />
        <Icon icon={isFavorite ? iconFavoriteFull : iconFavoriteEmpty} alt="Favorite" />
      </div>
    </div>
  );
}
