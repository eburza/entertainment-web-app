import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import MediaCard from './MediaCard';
import { ISwiperComponentProps } from '../../types/interface';

export default function SwiperComponent({
  items = [],
  variant = 'trending',
}: ISwiperComponentProps) {
  return (
    <div className="relative group px-8">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
        <button className="swiper-custom-prev w-12 h-12 bg-dark-light/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={40}
        mousewheel={true}
        navigation={{
          prevEl: '.swiper-custom-prev',
          nextEl: '.swiper-custom-next',
        }}
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className="!w-auto">
            <MediaCard
              backdrop_path={(item as any).backdrop_path}
              variant={variant}
              title={(item as any).title || (item as any).name}
              year={item.year}
              media_type={item.media_type}
              rating={item.vote_average}
              isBookmarked={item.isBookmarked}
              isWatched={item.isWatched}
              isFavorite={item.isFavorite}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
        <button className="swiper-custom-next w-12 h-12 bg-dark-light/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
