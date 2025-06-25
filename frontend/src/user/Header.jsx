import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', address: '' });
  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setEditData({ fullName: storedUser.fullName, address: storedUser.address });
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/update/${user.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedUser = { ...user, ...editData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      alert('Server error');
    }
  };

  return (
    <header>
      <nav className="bg-white border-b shadow-sm px-4 py-3 dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Left - Navigation */}
          <div className="flex-1">
            <ul className="flex space-x-6">
              <li>
                <button onClick={() => navigate('/user/home')} className="text-gray-700 hover:text-primary-700 dark:text-white dark:hover:text-primary-400">
                  Home
                </button>
              </li>
            </ul>
          </div>

          {/* Center - App Name */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">My App</h1>
          </div>

          {/* Right - Profile Icon & Dropdown */}
          <div className="flex-1 flex justify-end relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-700 dark:text-white text-3xl focus:outline-none"
            >
              <FaUserCircle />
            </button>

            {showDropdown && user && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-5 z-20 space-y-4">
                {/* Profile Header Card */}
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-sm">
                  <div className="mr-4">
                    <FaUserCircle className="text-4xl text-blue-500 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{user.fullName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.role}</p>
                  </div>
                </div>

                {!isEditing ? (
                  <>
                    {/* User Info Card */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-sm space-y-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">EMAIL</p>
                        <p className="text-sm text-gray-800 dark:text-gray-100">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">ADDRESS</p>
                        <p className="text-sm text-gray-800 dark:text-gray-100">{user.address}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    {/* Edit Form Card */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-sm space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">FULL NAME</label>
                        <input
                          type="text"
                          name="fullName"
                          value={editData.fullName}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">ADDRESS</label>
                        <textarea
                          name="address"
                          value={editData.address}
                          onChange={handleEditChange}
                          rows="3"
                          className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;