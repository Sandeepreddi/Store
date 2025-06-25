import React, { useEffect, useState } from 'react';

function Stores() {
  const [stores, setStores] = useState([]);
  const [expanded, setExpanded] = useState(null); // To manage dropdown toggle

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

  const toggleDropdown = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store, index) => {
          let ratings = [];
          try {
            ratings = store.rating ? JSON.parse(store.rating) : [];
            if (!Array.isArray(ratings)) ratings = [];
          } catch {
            ratings = [];
          }
          return (
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
                ⭐ Average Rating: {store.averageRating?.toFixed(1) ?? 'No ratings yet'} / 5
              </p>
              <p className="text-sm text-gray-500 mb-2">
                🧑‍🤝‍🧑 Total Ratings: {ratings.length}
              </p>

              {ratings.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {expanded === index ? 'Hide Ratings ▲' : 'Show Ratings ▼'}
                  </button>
                  {expanded === index && (
                    <ul className="mt-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm">
                      {ratings.map((r, i) => (
                        <li key={i} className="mb-1">
                          <span className="font-medium">{r.email}:</span> {r.rating}⭐
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stores;
