import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaStoreAlt, FaUserShield, FaEye } from 'react-icons/fa';

function Users() {
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [viewRole, setViewRole] = useState('user');
  const [userList, setUserList] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {};

    if (formType === 'user' || formType === 'admin') {
      payload = {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        role: formType,
        password: formData.password,
      };
    } else if (formType === 'store') {
      payload = {
        fullName: formData.fullName,
        storeName: formData.storeName,
        email: formData.email,
        address: formData.address,
        role: 'store',
        password: formData.password,
        rating: null,
      };
    }

    const endpoint =
      formType === 'store'
        ? 'http://localhost:5000/api/store/create'
        : 'http://localhost:5000/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`${formType} added successfully!`);
        setFormData({});
        setFormType(null);
      } else {
        alert(`Failed to add ${formType}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const fetchUsers = async () => {
    const endpoint = `http://localhost:5000/api/view/${viewRole}`;
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setUserList(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    if (formType === 'view') {
      fetchUsers();
    }
  }, [viewRole, formType]);

  const renderForm = () => {
    if (!formType || formType === 'view') return null;

    return (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="w-full border-b p-2 bg-transparent"
            required
          />
        </div>

        {formType === 'store' && (
          <div>
            <label className="block mb-1">Store Name</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName || ''}
              onChange={handleChange}
              className="w-full border-b p-2 bg-transparent"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full border-b p-2 bg-transparent"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full border-b p-2 bg-transparent"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            className="w-full border-b p-2 bg-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    );
  };

  const renderTable = () => {
    if (formType !== 'view') return null;

    return (
      <div className="mt-6">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Role:</label>
          <select
            value={viewRole}
            onChange={(e) => setViewRole(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="storeuser">Store User</option>
          </select>
        </div>

        <table className="w-full border-collapse border border-gray-400 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              {viewRole === 'storeuser' && <th className="border p-2">Store Name</th>}
              <th className="border p-2">Address</th>
              {viewRole === 'storeuser' && <th className="border p-2">Average Rating</th>}
            </tr>
          </thead>
          <tbody>
            {userList.length === 0 ? (
              <tr>
                <td className="border p-4 text-center text-gray-500" colSpan={viewRole === 'storeuser' ? 5 : 4}>
                  No {viewRole} records found.
                </td>
              </tr>
            ) : (
              userList.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="border p-2">{user.fullName}</td>
                  <td className="border p-2">{user.email}</td>
                  {viewRole === 'storeuser' && (
                    <td className="border p-2">{user.storeName}</td>
                  )}
                  <td className="border p-2">{user.address}</td>
                  {viewRole === 'storeuser' && (
                    <td className="border p-2">{user.averageRating ?? 'N/A'}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setFormType('user')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            formType === 'user' ? 'bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <FaUserPlus /> Add User
        </button>
        <button
          onClick={() => setFormType('store')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            formType === 'store' ? 'bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <FaStoreAlt /> Add Store
        </button>
        <button
          onClick={() => setFormType('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            formType === 'admin' ? 'bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <FaUserShield /> Add Admin
        </button>
        <button
          onClick={() => setFormType('view')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            formType === 'view' ? 'bg-gray-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          <FaEye /> View
        </button>
      </div>

      {renderForm()}
      {renderTable()}
    </div>
  );
}

export default Users;
