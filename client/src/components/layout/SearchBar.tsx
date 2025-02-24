import searchIcon from '../../assets/icons/icon-search.svg';

export default function SearchBar() {
  return (
    <div className="flex items-center gap-6 px-8 py-6">
      <img src={searchIcon} alt="Search" className="w-[2rem] h-[2rem]" />
      <input
        type="text"
        placeholder="Search for movies or TV series"
        className="bg-transparent border-none outline-none w-full text-2xl font-light placeholder:text-light/50 caret-primary focus:border-b focus:border-dark-lighter pb-2"
      />
    </div>
  );
}
