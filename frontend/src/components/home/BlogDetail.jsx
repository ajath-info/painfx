import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Scrolltop from '../common/Scrolltop';
import BASE_URL from '../../config';

const IMAGE_BASE_URL = 'http://localhost:5000';

const BlogDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the blog ID from navigation state
  const blogId = location.state?.blogId;

  useEffect(() => {
    // If no blog ID is provided in state, redirect to blogs or show error
    if (!blogId) {
      setError('Blog ID not provided');
      setLoading(false);
      return;
    }

    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/blogs/${blogId}`);
        const data = await response.json();
        
        if (data.error === false && data.code === 200) {
          const foundBlog = data.payload
          if (foundBlog) {
            setBlog(foundBlog);
          } else {
            setError('Blog not found');
          }
        } else {
          setError('Failed to fetch blog details');
        }
      } catch (err) {
        setError('Error loading blog details');
        console.error('Error fetching blog detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  useEffect(() => {
    const section = document.getElementById("blog-details");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleGoBack = () => {
    // Navigate back to the blogs page or previous page
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Scrolltop />
        <Header />
        <div className="bg-cyan-500 text-white w-full py-6 px-4">
          <div className="max-w-9xl mx-auto text-lg">
            <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> 
            <span className="font-semibold">Blogs</span>
          </div>
        </div>
        <section className="py-16 px-4 md:px-10 max-w-4xl mx-auto bg-white text-gray-800">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="w-full h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Scrolltop />
        <Header />
        <div className="bg-cyan-500 text-white w-full py-6 px-4">
          <div className="max-w-9xl mx-auto text-lg">
            <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> 
            <span className="font-semibold">Blogs</span>
          </div>
        </div>
        <section className="py-16 px-4 md:px-10 max-w-4xl mx-auto bg-white text-gray-800">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500">{error || 'Blog not found'}</h2>
            <button
              className="cursor-pointer mt-4 bg-cyan-500 text-white px-4 py-2 rounded"
              onClick={handleGoBack}
            >
              Go Back
            </button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Scrolltop />
      <Header />

      <div className="bg-cyan-500 text-white w-full py-6 px-4">
        <div className="max-w-9xl mx-auto text-lg">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> 
          <span className="font-semibold">Blogs</span>
        </div>
      </div>

      <section
        id="blog-details"
        className="py-16 px-4 md:px-10 max-w-4xl mx-auto bg-white text-gray-800"
      >
        <button
          className="cursor-pointer mb-6 text-cyan-600 hover:underline"
          onClick={handleGoBack}
        >
          ← Back to Blogs
        </button>

        <img
          src={`${IMAGE_BASE_URL}${blog.image_url}`}
          alt={blog.title}
          className="w-full h-64 object-fill rounded-lg mb-6"
          onError={(e) => {
            e.target.src = '/images/default-blog.jpg'; // fallback image
          }}
        />

        <h1 className="text-3xl font-bold text-primary mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{formatDate(blog.created_at)}</p>

        <div 
          className="text-gray-700 text-lg leading-relaxed prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
      </section>
      <Footer />
    </>
  );
};

export default BlogDetail;