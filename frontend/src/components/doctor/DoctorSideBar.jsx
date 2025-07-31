import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Clock, FileText, Star, UserCog, LogOut, Menu, X } from 'lucide-react';
import BASE_URL from '../../config';
import Loader from '../common/Loader';
import Avatar from '../../images/avtarimage.webp';
const IMAGE_BASE_URL = 'http://localhost:5000';

const DoctorSidebar = ({
  doctor,
  isSidebarOpen = false,
  setIsSidebarOpen = () => { },
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [loading, setLoading] = useState(true);

  const defaultDoctor = {
    name: 'Dr. Darren Elder',
    specialty: 'BDS, MDS - Oral Surgery',
    avatar: Avatar,
  };

  const [doctorData, setDoctorData] = useState(doctor || defaultDoctor);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${BASE_URL}/user/doctor-profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.error === false) {
          const doc = data.payload.doctor;

          const fullName = doc.full_name || `${doc.prefix} ${doc.f_name} ${doc.l_name}`;
          const avatar = doc.profile_image
            ? `${IMAGE_BASE_URL}${doc.profile_image}`
            : defaultDoctor.avatar;

          const specialty = data.payload.educations?.[0]?.degree
            ? `${data.payload.educations[0].degree} - ${data.payload.experiences?.[0]?.designation || 'Doctor'}`
            : 'Specialist';

          setDoctorData({
            name: fullName,
            avatar: avatar,
            specialty: specialty,
          });
        }
      } catch (error) {
        console.error('Failed to fetch doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleLogout = () => {
    setIsSidebarOpen(false);
    // TODO: Add logout logic here
  };

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: <User className="w-5 h-5 mr-3" /> },
    { label: 'My Patients', path: '/doctor/patients', icon: <Users className="w-5 h-5 mr-3" /> },
    { label: 'Schedule Timings', path: '/doctor/schedule', icon: <Clock className="w-5 h-5 mr-3" /> },
    { label: 'Invoices', path: '/doctor/invoice', icon: <FileText className="w-5 h-5 mr-3" /> },
    { label: 'Reviews', path: '/doctor/reviews', icon: <Star className="w-5 h-5 mr-3" /> },
    { label: 'Profile Settings', path: '/doctor/profile-form', icon: <UserCog className="w-5 h-5 mr-3" /> },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col ${isMobile ? 'p-4' : 'p-6'}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Doctor Profile Section */}
      <div className="text-center mb-8 pb-6 border-b border-gray-100">
        {loading ? (
          <Loader/>
        ) : (
          <>
            <div className="relative inline-block">
              <img
                src={doctorData.avatar}
                alt={doctorData.name}
                loading="lazy"
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-100 shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/96x96?text=Avatar';
                }}
              />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{doctorData.name}</h3>
            <p className="text-sm text-gray-500 px-2">{doctorData.specialty}</p>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-cyan-500 text-white shadow-lg transform scale-105'
                  : ' hover:bg-cyan-500 hover:text-white hover:shadow-md'
                }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {link.icon}
              </div>
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {loading && <Loader />}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-full h-full bg-white">
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
};

export default DoctorSidebar;
