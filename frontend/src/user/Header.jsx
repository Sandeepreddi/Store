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
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">My App</h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-700 dark:text-white text-3xl focus:outline-none"
            >
              <FaUserCircle />
            </button>

            {showDropdown && user && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-5 z-20">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Profile</h3>

                {!isEditing ? (
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white w-full py-1 rounded"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 dark:bg-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Address</label>
                      <textarea
                        name="address"
                        value={editData.address}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 dark:bg-gray-600"
                      />
                    </div>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 hover:bg-green-600 text-white w-full py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md"
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
