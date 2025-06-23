import React, { useState } from 'react';
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    role:'user',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const nameLength = formData.fullName.trim().length;
    const addressLength = formData.address.trim().length;

    if (nameLength < 20 || nameLength > 60) {
      newErrors.fullName = "Name must be between 20 and 60 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (addressLength > 400) {
      newErrors.address = "Address can't exceed 400 characters.";
    }

    const password = formData.password;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8–16 characters, include an uppercase letter and a special character.";
    }

    if (password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            address:formData.address,
            role:formData.role,
            password: formData.password
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Signup successful!');
          navigate('/login');
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch {
        alert('Network error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" >

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Signup Page</h1>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create an account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 pr-10 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer"
                  >
                    {showPassword ? <FaRegEye />:<FaRegEyeSlash />}
                  </span>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 pr-10 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer"
                  >
                    {showConfirmPassword ? <FaRegEye />:<FaRegEyeSlash />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-blue-700"
              >
                Create an account
              </button>

              {/* Login link */}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <span onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:underline cursor-pointer">
                  Login here
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
