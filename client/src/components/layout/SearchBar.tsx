import searchIcon from '../../assets/icons/icon-search.svg';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  function hendleSerach(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const query = e.target.value;
    navigate(`/search?query=${query}`);
  }

  return (
    <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-6">
      <img src={searchIcon} alt="Search" className="w-6 md:w-8 h-6 md:h-8" />
      <input
        type="text"
        placeholder="Search for movies or TV series"
        className="bg-transparent border-none outline-none w-full text-lg md:text-2xl font-light placeholder:text-light/50 caret-primary focus:border-b focus:border-dark-lighter pb-2"
        onChange={hendleSerach}
        value={query || ''}
      />
    </div>
  );
}
