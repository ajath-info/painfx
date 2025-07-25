import React from 'react';
import Cardiologist from '../../images/orthopedic.png';
import Dentist from '../../images/dentist.png';
import Neurology from '../../images/neurology.jpg';
import { useNavigate } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for a Healthier Lifestyle and Better Health",
    date: "July 12, 2025",
    excerpt:
      "Discover simple daily habits like staying hydrated, eating whole foods, exercising regularly, managing stress, and sleeping well. These can dramatically improve your overall wellness, energy levels, and reduce the risk of chronic diseases over time.",
    image: Cardiologist,
  },
  {
    id: 2,
    title: "Understanding Your Annual Health Checkup",
    date: "July 10, 2025",
    excerpt:
      "Annual health exams help detect early signs of health issues like high blood pressure, diabetes, or heart conditions. Learn what tests to expect and how to prepare to get the most out of your doctor visit.",
    image: Dentist,
  },
  {
    id: 3,
    title: "Mental Health Matters: Signs and Support",
    date: "July 5, 2025",
    excerpt:
      "Mental health is just as important as physical health. Recognize symptoms of stress, anxiety, and depression early, and explore support systems, therapy options, and healthy coping strategies that can bring long-term relief and healing.",
    image: Neurology,
  },
];

const Blog = () => {
  const navigate = useNavigate();

  const handleReadMore = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <section
    id="blog-details"
    className="py-16 px-4 md:px-10 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-2">Latest From Our Blog</h2>
          <p className="text-gray-600 text-lg">
            Stay informed with the latest healthcare tips, news, and stories from our experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold text-primary mb-2">{post.title}</h3>
                <p className="text-gray-600 text-base mb-4 line-clamp-5">
                  {post.excerpt}
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
      </div>
    </section>
  );
};

export default Blog;
