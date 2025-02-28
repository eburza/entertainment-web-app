import bookmarkIconOn from '../../assets/icons/icon-bookmark-full.svg';
import bookmarkIconOff from '../../assets/icons/icon-bookmark-empty.svg';
import { useState } from 'react';
import { IBookmarkButtonProps } from '../../types/interface';

export default function BookmarkButton({
  isBookmarked: initialIsBookmarked = false,
}: IBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
    >
      <img src={isBookmarked ? bookmarkIconOn : bookmarkIconOff} alt="Bookmark icon" />
    </button>
  );
}
