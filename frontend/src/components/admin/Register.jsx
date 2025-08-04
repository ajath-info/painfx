import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../images/logo-white.webp";
import BASE_URL from "../../config";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
    phone: "",
    phone_code: "+61",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/register-admin`, formData);

      if (res.data && res.data.status === 1) {
        const { token, user } = res.data.payload;

        // Store token and user in localStorage
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));

        alert("Admin registered successfully!");
        navigate("/admin/dashboard"); // redirect to dashboard
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Logo */}
        <div className="md:w-1/2 flex mb-20 items-center justify-center p-10">
          <img src={Logo} alt="Logo" className="max-w-full h-auto" />
        </div>

        {/* Right side - Register Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-gray-800">Register</h2>
          <p className="text-gray-500 mb-6">Create a new account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={formData.f_name}
                onChange={(e) =>
                  setFormData({ ...formData, f_name: e.target.value })
                }
                required
                className="w-1/2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.l_name}
                onChange={(e) =>
                  setFormData({ ...formData, l_name: e.target.value })
                }
                required
                className="w-1/2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
           <div>
  <input
    type="text"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only digits and limit to 10 characters
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, phone: value });
      }
    }}
    required
    className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
  />
</div>


            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-cyan-400 hover:bg-cyan-600 text-white py-3 rounded-md text-lg font-medium transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div> */}

          {/* <div className="flex items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 text-lg font-bold flex justify-center items-center">F</button>
            <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full w-10 h-10 text-lg font-bold flex justify-center items-center">G</button>
          </div> */}

          {/* <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/admin/auth/login" className="text-cyan-500 font-semibold hover:underline">
              Login
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
