import React from 'react';
import Cardiologist from '../../images/orthopedic.png';
import Dentist from '../../images/dentist.png';
import Neurology from '../../images/neurology.jpg';

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for a Healthier Lifestyle and Better Health",
    date: "July 12, 2025",
    excerpt: "Discover simple daily habits to improve your overall health, boost energy, and reduce stress.",
    image: Cardiologist,
  },
  {
    id: 2,
    title: "Understanding Your Annual Health Checkup",
    date: "July 10, 2025",
    excerpt: "Regular health checkups are essential. Here's what to expect and why it matters for prevention.",
    image:Dentist,
  },
  {
    id: 3,
    title: "Mental Health Matters: Signs and Support",
    date: "July 5, 2025",
    excerpt: "Learn how to recognize early signs of stress, anxiety, and depression—and how to seek help.",
    image: Neurology,
  },
];

const Blog = () => {
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
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold text-primary mb-2">{post.title}</h3>
                <p className="text-gray-600 text-base mb-4">{post.excerpt}</p>
               <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
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
