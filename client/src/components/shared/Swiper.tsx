import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';
import MediaCard from './MediaCard';
import imageUrl from '../../mockData/assets/thumbnails/dogs/regular/large.jpg';

export default function SwiperComponent() {
  return (
    <Swiper
      modules={[Navigation]}
      slidesPerView="auto"
      spaceBetween={40}
      navigation={true}
      className="!overflow-visible"
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
  );
}
