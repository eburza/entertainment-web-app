import searchIcon from '../../assets/icons/icon-search.svg';

export default function SearchBar() {
  return (
    <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-6">
      <img src={searchIcon} alt="Search" className="w-6 md:w-8 h-6 md:h-8" />
      <input
        type="text"
        placeholder="Search for movies or TV series"
        className="bg-transparent border-none outline-none w-full text-lg md:text-2xl font-light placeholder:text-light/50 caret-primary focus:border-b focus:border-dark-lighter pb-2"
      />
    </div>
  );
}
