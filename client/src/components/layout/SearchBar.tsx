import searchIcon from '../../assets/icons/icon-search.svg';

export default function SearchBar() {
  return (
    <div>
      <img src={`${searchIcon}`} alt="Search" />
      <input type="text" placeholder="Search for a movie or TV series" />
    </div>
  );
}
