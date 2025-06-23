import React, { useEffect, useState } from 'react';

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/view/storeuser');
        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-1">{store.storeName}</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Owner:</span> {store.fullName}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Email:</span> {store.email}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Address:</span> {store.address}
            </p>
            <p className="text-yellow-500 font-semibold mt-2">
              ⭐ Average Rating: {store.averageRating ?? 'No ratings yet'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stores;
