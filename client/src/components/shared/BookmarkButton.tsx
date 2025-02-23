import bookmarkIconOn from '../../assets/icons/icon-bookmark-full.svg';
import bookmarkIconOff from '../../assets/icons/icon-bookmark-empty.svg';

import { useState } from 'react';

export default function BookmarkButton() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button onClick={handleClick}>
      <img src={`${isBookmarked ? bookmarkIconOn : bookmarkIconOff}`} alt="Bookmark icon" />
    </button>
  );
}
