import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import MediaCard from './MediaCard';
import imageUrl from '../../mockData/assets/thumbnails/dogs/regular/large.jpg';

export default function SwiperComponent() {
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
        <SwiperSlide className="!w-auto">
          <MediaCard imageUrl={imageUrl} variant="trending" />
        </SwiperSlide>
        <SwiperSlide className="!w-auto">
          <MediaCard imageUrl={imageUrl} variant="trending" />
        </SwiperSlide>
        <SwiperSlide className="!w-auto">
          <MediaCard imageUrl={imageUrl} variant="trending" />
        </SwiperSlide>
        <SwiperSlide className="!w-auto">
          <MediaCard imageUrl={imageUrl} variant="trending" />
        </SwiperSlide>
        <SwiperSlide className="!w-auto">
          <MediaCard imageUrl={imageUrl} variant="trending" />
        </SwiperSlide>
        <SwiperSlide className="!w-auto">
          <MediaCard imageUrl={imageUrl} variant="trending" />
        </SwiperSlide>
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
