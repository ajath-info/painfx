import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

const IMAGE_BASE_URL = 'http://localhost:5000';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const postsPerPage = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/blogs/latest`);
        const data = await response.json();
        
        if (data.error === false && data.code === 200) {
          setBlogPosts(data.payload);
        } else {
          setError('Failed to fetch blog posts');
        }
      } catch (err) {
        setError('Error loading blog posts');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMore = (id) => {
    navigate('/blog-detail', { state: { blogId: id } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const stripHtmlTags = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, Math.ceil(blogPosts.length / postsPerPage) - 1) : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === Math.ceil(blogPosts.length / postsPerPage) - 1 ? 0 : prev + 1
    );
  };

  const displayedPosts = blogPosts.slice(
    currentIndex * postsPerPage,
    (currentIndex + 1) * postsPerPage
  );

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-10 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-2">Latest From Our Blog</h2>
            <p className="text-gray-600 text-lg">
              Stay informed with the latest healthcare tips, news, and stories from our experts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 md:px-10 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-2">Latest From Our Blog</h2>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="blog-details"
      className="py-16 px-4 md:px-10 bg-white text-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-2">Latest From Our Blog</h2>
          <p className="text-gray-600 text-lg">
            Stay informed with the latest healthcare tips, news, and stories from our experts.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={`${IMAGE_BASE_URL}${post.image_url}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-blog.jpg'; // fallback image
                  }}
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{formatDate(post.created_at)}</p>
                  <h3 className="text-xl font-semibold text-primary mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-base mb-4 line-clamp-5">
                    {truncateText(stripHtmlTags(post.description))}
                  </p>
                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Read More..
                  </button>
                </div>
              </div>
            ))}
          </div>

          {blogPosts.length > postsPerPage && (
            <>
              <button
                onClick={prevSlide}
                className="cursor-pointer hidden lg:flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white text-gray-500 hover:text-blue-500 transition absolute left-[-50px] top-1/2 transform -translate-y-1/2"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="cursor-pointer hidden lg:flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white text-gray-500 hover:text-blue-500 transition absolute right-[-50px] top-1/2 transform -translate-y-1/2"
              >
                <FaChevronRight />
              </button>
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
            </>
          )}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No blog posts available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;