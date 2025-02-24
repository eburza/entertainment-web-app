import logoIcon from '../../assets/icons/logo.svg';
import navHomeIcon from '../../assets/icons/icon-nav-home.svg';
import navMoviesIcon from '../../assets/icons/icon-nav-movies.svg';
import navTvSeriesIcon from '../../assets/icons/icon-nav-tv-series.svg';
import navBookmarkedIcon from '../../assets/icons/icon-nav-bookmark.svg';
import userAvatar from '../../assets/avatar/image-avatar.png';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <section className="bg-dark-light min-h-screen w-24 flex flex-col items-center py-8 fixed left-0">
      <img src={logoIcon} alt="Logo" className="w-8 h-8" />
      <nav className="flex-1 flex items-center">
        <ul className="flex flex-col gap-10 list-none">
          <li>
            <Link to="/" className="nav-link">
              <img src={navHomeIcon} alt="Home" className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <Link to="/movies" className="nav-link">
              <img src={navMoviesIcon} alt="Movies" className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <Link to="/tv-series" className="nav-link">
              <img src={navTvSeriesIcon} alt="TV Series" className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <Link to="/bookmarked" className="nav-link">
              <img src={navBookmarkedIcon} alt="Bookmarked" className="w-5 h-5" />
            </Link>
          </li>
        </ul>
      </nav>
      <img
        src={userAvatar}
        alt="User avatar"
        className="w-10 h-10 rounded-full border border-light"
      />
    </section>
  );
}
