import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "./BookCarousels.css";

const BookCarousels = () => {
  const images = [
    "book_carousels_1.jpg",
    "book_carousels_2.jpg",
    "book_carousels_3.jpg",
    "book_carousels_4.jpg",
    "book_carousels_5.jpg",
    "book_carousels_6.jpg",
    "book_carousels_7.jpg",
    "book_carousels_8.jpg",
  ];
  return (
    <div className="mb-10">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        spaceBetween={15}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        // pagination={true}
        initialSlide={4}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        breakpoints={{
          320: {
            slidesPerView: 1.3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1.3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
        }}
        className="mySwiper mb-6">
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookCarousels;
