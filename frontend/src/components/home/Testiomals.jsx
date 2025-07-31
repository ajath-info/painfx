import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BASE_URL from "../../config";
import Avtarimage from "../../images/avtarimage.webp";
import Loader from "../common/Loader";

const IMAGE_BASE_URL = "http://localhost:5000";
const fallbackImages = [Avtarimage];
const getRandomFallbackImage = () => {
  const index = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[index];
};

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${BASE_URL}/rating/testimonials`);
        const data = await res.json();
        if (data.status === 1 && data.payload) {
          setTestimonials(data.payload);
        } else {
          console.error("Error fetching testimonials");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (testimonials.length === 0) {
    return <div className="text-center py-12">No testimonials available.</div>;
  }

  const current = testimonials[currentIndex];

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-20 relative transition-all duration-500 ease-in-out">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        <button
          onClick={prevSlide}
          className="cursor-pointer hidden lg:flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white text-gray-500 hover:text-blue-500 transition"
        >
          <FaChevronLeft />
        </button>

        <div className="flex-shrink-0">
          <img
            src={
              current.user_image
                ? `${IMAGE_BASE_URL}${current.user_image}`
                : getRandomFallbackImage()
            }
            alt={current.user_name || "Anonymous"}
            className="w-50 h-50 rounded-full object-cover transition-all duration-500"
          />
        </div>

        <div className="text-left lg:text-left max-w-2xl transition-all duration-500 ease-in-out mx-auto my-auto">
          <h1 className="text-xl text-cyan-500 font-semibold mb-2">
            Testimonials
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Client Says
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{current.review}</p>
          <p className="text-gray-800 font-semibold">
            {current.user_name || "Anonymous"}
          </p>
          <p className="text-sm text-gray-500">
            {current.user_state && current.user_country
              ? `${current.user_state}, ${current.user_country}`
              : current.user_state || current.user_country || ""}
          </p>
        </div>

        <button
          onClick={nextSlide}
          className="cursor-pointer hidden lg:flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white text-gray-500 hover:text-blue-500 transition"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="flex justify-center items-center gap-6 mt-8 lg:hidden">
        <button
          onClick={prevSlide}
          className="w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white text-gray-500 hover:text-blue-500 transition"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white text-gray-500 hover:text-blue-500 transition"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
