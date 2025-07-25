import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cardiologist from '../../images/orthopedic.png';
import Dentist from '../../images/dentist.png';
import Neurology from '../../images/neurology.jpg';
import Header from '../common/Header';
import Footer from '../common/Footer';

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for a Healthier Lifestyle and Better Health",
    date: "July 12, 2025",
    content: `
      Adopting a healthier lifestyle doesn’t have to be hard. Start by drinking enough water, eating a balanced diet rich in fruits and vegetables, and exercising at least 30 minutes a day.
      Avoid processed food, get 7–8 hours of sleep each night, and reduce screen time. These small changes add up to big benefits for your long-term well-being.
    `,
    image: Cardiologist,
  },
  {
    id: 2,
    title: "Understanding Your Annual Health Checkup",
    date: "July 10, 2025",
    content: `
      Annual health checkups are vital for early detection of diseases and overall health monitoring. Your visit might include blood tests, blood pressure check, BMI, and screenings for diabetes or cholesterol.
      Discuss any symptoms or lifestyle changes with your doctor to get personalized advice and preventive care recommendations.
    `,
    image: Dentist,
  },
  {
    id: 3,
    title: "Mental Health Matters: Signs and Support",
    date: "July 5, 2025",
    content: `
      Mental health is just as crucial as physical health. If you experience prolonged sadness, anxiety, loss of interest, or trouble sleeping, it could be time to seek help.
      Support systems include talking to a friend, seeing a therapist, or engaging in stress-reducing activities like mindfulness and journaling. Remember—it's okay to ask for help.
    `,
    image: Neurology,
  },
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogPosts.find((post) => post.id === parseInt(id));

  useEffect(() => {
    const section = document.getElementById("blog-details");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Blog not found.</h2>
        <button
          className="cursor-pointer mt-4 bg-cyan-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section
        id="blog-details"
        className="py-16 px-4 md:px-10 max-w-4xl mx-auto bg-white text-gray-800"
      >
        <button
          className="cursor-pointer mb-6 text-cyan-600 hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Back to Blogs
        </button>

        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <h1 className="text-3xl font-bold text-primary mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{blog.date}</p>

        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {blog.content}
        </p>
      </section>
      <Footer />
    </>
  );
};

export default BlogDetail;
