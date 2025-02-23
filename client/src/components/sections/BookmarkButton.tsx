import BookmarkIconOn from '../../assets/icons/bookmark/icon-bookmark-full.svg';
import BookmarkIconOff from '../../assets/icons/bookmark/icon-bookmark-empty.svg';

import { useState } from 'react';

export default function BookmarkButton() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button onClick={handleClick}>{isBookmarked ? <BookmarkIconOn /> : <BookmarkIconOff />}</button>
  );
}
