import logoIcon from '../../assets/icons/logo.svg';
import navHomeIcon from '../../assets/icons/icon-nav-home.svg';
import navMoviesIcon from '../../assets/icons/icon-nav-movies.svg';
import navTvSeriesIcon from '../../assets/icons/icon-nav-tv-series.svg';
import navBookmarkedIcon from '../../assets/icons/icon-nav-bookmark.svg';
import userAvatar from '../../assets/avatar/image-avatar.png';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <section>
      <img src={`${logoIcon}`} alt="Logo" />
      <ul>
        <li>
          <Link to="/">
            <img src={`${navHomeIcon}`} alt="Home" />
          </Link>
        </li>
        <li>
          <Link to="/movies">
            <img src={`${navMoviesIcon}`} alt="Movies" />
          </Link>
        </li>
        <li>
          <Link to="/tv-series">
            <img src={`${navTvSeriesIcon}`} alt="TV Series" />
          </Link>
        </li>
        <li>
          <Link to="/bookmarked">
            <img src={`${navBookmarkedIcon}`} alt="Bookmarked" />
          </Link>
        </li>
        <img src={`${userAvatar}`} alt="User avatar" />
      </ul>
    </section>
  );
}
