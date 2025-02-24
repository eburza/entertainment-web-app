import movieIcon from '../../assets/icons/icon-category-movie.svg';
// import tvSeriesIcon from '../../assets/icons/icon-category-tv.svg';

export default function MediaCardData() {
  return (
    <div>
      <div className="flex gap-2 opacity-65 text-sm">
        <p>Year</p>
        <div className="flex gap-2">
          <img src={`${movieIcon}`} alt="Movie" className="w-4 h-4" />
          <p>Movie</p>
        </div>
        <p>Rating</p>
      </div>
      <p className="text-lg font-bold">Movie Title</p>
    </div>
  );
}
