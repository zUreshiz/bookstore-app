import React from "react";
import { Link } from "react-router";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards, Autoplay } from "swiper/modules";

const BannerSale = () => {
  const images = [
    "banner_sale_1.jpg",
    "banner_sale_2.jpg",
    "banner_sale_3.jpg",
    "banner_sale_4.jpg",
    "banner_sale_5.jpg",
    "banner_sale_6.jpg",
    "banner_sale_7.jpg",
    "banner_sale_8.jpg",
    "banner_sale_9.jpg",
  ];
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute transform -rotate-45 w-96 h-96 bg-white rounded-full -top-48 -left-48"></div>
        <div className="absolute transform -rotate-45 w-96 h-96 bg-white rounded-full -bottom-48 -right-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="text-center md:text-left mb-8 md:mb-0 md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Winter Book Sale
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Up to <span className="font-bold text-yellow-400">50% OFF</span> on selected
              books
            </p>
            <div className="space-x-4">
              <Link
                to="/sale"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-white transition-colors duration-300">
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Book Display */}
          <div className="md:w-1/2 relative">
            <div className="relative">
              {/* Sale Badge */}
              <div className="absolute -top-8 -right-10 bg-red-500 text-white text-2xl font-bold rounded-full w-30 h-30 flex items-center justify-center transform rotate-12 animate-pulse z-20">
                50% OFF
              </div>

              {/* Books Stack Effect */}
              <div className="w-52 h-80 mx-auto md:w-72 md:h-[448px] lg:w-[500px] lg:h-[480px] sm:mt-5">
                <Swiper
                  effect={"cards"}
                  grabCursor={true}
                  modules={[EffectCards, Autoplay]}
                  initialSlide={4}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  className="mySwiper w-full h-full">
                  {images.map((src, index) => (
                    <SwiperSlide
                      key={index}
                      className="rounded-lg shadow-xl overflow-hidden">
                      <img
                        src={src}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover scale-110"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {/* <div className="relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg transform rotate-9"></div>
                <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg transform rotate-6"></div>
                <div className="absolute top-1 left-1 w-full h-full bg-gray-300 rounded-lg transform rotate-3"></div>
                <img
                  src="winter_book_sale.png"
                  alt="Featured Books"
                  className="relative z-10 rounded-lg shadow-xl"
                />
              </div> */}

              {/* Floating Elements */}
              <div className="absolute -top-2 -left-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce z-20"></div>
              <div className="absolute -bottom-4 right-8 w-12 h-12 bg-pink-500 rounded-full animate-bounce delay-100 z-20"></div>
              <div className="absolute top-1/2 -right-4 w-6 h-6 bg-green-400 rounded-full animate-bounce delay-200 z-20"></div>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 text-lg mb-4">Limited Time Offer</p>
          <div className="flex justify-center space-x-4">
            {["02", "23", "59", "59"].map((num, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4 w-24">
                <div className="text-2xl font-bold text-white">{num}</div>
                <div className="text-sm text-blue-100">
                  {["Days", "Hours", "Minutes", "Seconds"][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSale;
