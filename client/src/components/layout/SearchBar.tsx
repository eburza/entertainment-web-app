import searchIcon from '../../assets/icons/icon-search.svg';

export default function SearchBar() {
  return (
    <div className="flex items-center gap-4">
      <img src={`${searchIcon}`} alt="Search" />
      <input
        type="text"
        placeholder="Search for movies or TV series"
        className="bg-transparent border-none outline-none w-full"
      />
    </div>
  );
}
