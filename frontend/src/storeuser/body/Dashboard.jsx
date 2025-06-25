import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:5000/api/view/storeuser')
      .then(res => res.json())
      .then(async data => {
        // Fetch ratings for each store
        const storesWithRatings = await Promise.all(data.map(async (store) => {
          const res = await fetch(`http://localhost:5000/api/storeuser/${store.email}/ratings`);
          if (!res.ok) return { ...store, ratings: [], averageRating: 0 };
          const ratingData = await res.json();
          return { ...store, ratings: ratingData.rating, averageRating: ratingData.averageRating };
        }));
        setStores(storesWithRatings);
      })
      .catch(err => console.error('Error fetching store users:', err));
  }, []);

  const handleRatingChange = async (storeEmail, newRating) => {
    const email = currentUser.email;
    try {
      const response = await fetch(`http://localhost:5000/api/storeuser/${storeEmail}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, rating: newRating })
      });
      if (!response.ok) throw new Error('Failed to rate store');
      // Refetch ratings for this store
      const res = await fetch(`http://localhost:5000/api/storeuser/${storeEmail}/ratings`);
      const ratingData = await res.json();
      setStores(prev => prev.map(store =>
        store.email === storeEmail
          ? { ...store, ratings: ratingData.rating, averageRating: ratingData.averageRating }
          : store
      ));
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  const filteredStores = stores.filter(store =>
    store.storeName?.toLowerCase().includes(search.toLowerCase()) ||
    store.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registered Stores</h2>

      <input
        type="text"
        placeholder="Search by store name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-400 p-2 rounded mb-6 w-full"
      />

      {filteredStores.map((store, index) => {
        let userRating = '';
        if (Array.isArray(store.ratings)) {
          const found = store.ratings.find(r => r.email === currentUser.email);
          userRating = found ? found.rating : '';
        }
        return (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
            <h3 className="text-xl font-semibold text-gray-800">{store.storeName}</h3>
            <p className="text-gray-600">Address: {store.address}</p>
            <p className="text-gray-600">Owner: {store.fullName} ({store.email})</p>
            <p className="text-gray-700 font-medium">Average Rating: {store.averageRating ? Number(store.averageRating).toFixed(1) : 0}</p>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Your Rating:</label>
              <select
                value={userRating}
                onChange={(e) => handleRatingChange(store.email, parseInt(e.target.value))}
                className="mt-1 border rounded px-3 py-1 w-24"
              >
                <option value="">Rate</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
