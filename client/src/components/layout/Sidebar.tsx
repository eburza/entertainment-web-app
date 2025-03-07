import logoIcon from '../../assets/icons/logo.svg';
import navHomeIcon from '../../assets/icons/icon-nav-home.svg';
import navMoviesIcon from '../../assets/icons/icon-nav-movies.svg';
import navTvSeriesIcon from '../../assets/icons/icon-nav-tv-series.svg';
import navBookmarkedIcon from '../../assets/icons/icon-nav-bookmark.svg';
// import userAvatar from '../../assets/avatar/image-avatar.png';
import userEmptyAvatar from '../../assets/avatar/user-empty.svg';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <section className="bg-dark-light w-full md:w-24 md:min-h-screen flex flex-row md:flex-col items-center justify-between md:justify-start p-4 md:py-8 md:fixed md:left-0">
      <img src={logoIcon} alt="Logo" className="w-8 h-8" />
      <nav className="flex-1 flex justify-center items-center">
        <ul className="flex md:flex-col gap-6 md:gap-10 list-none">
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
      <Link to="/login">
        <img
          src={userEmptyAvatar}
          alt="User avatar"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-light"
        />
      </Link>
    </section>
  );
}
