import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [store, setStore] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:5000/api/view/storeuser')
      .then(res => res.json())
      .then(async data => {
        const currentStore = data.find(s => s.email === currentUser.email);
        if (!currentStore) return;

        const res = await fetch(`http://localhost:5000/api/storeuser/${currentUser.email}/ratings`);
        const ratingData = res.ok ? await res.json() : { rating: [], averageRating: 0 };

        setStore({
          ...currentStore,
          ratings: ratingData.rating,
          averageRating: ratingData.averageRating
        });
      })
      .catch(err => console.error('Error fetching store data:', err));
  }, [currentUser.email]);

  const handleRatingChange = async (newRating) => {
    try {
      const response = await fetch(`http://localhost:5000/api/storeuser/${currentUser.email}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, rating: newRating })
      });
      if (!response.ok) throw new Error('Failed to rate store');

      const res = await fetch(`http://localhost:5000/api/storeuser/${currentUser.email}/ratings`);
      const ratingData = res.ok ? await res.json() : { rating: [], averageRating: 0 };

      setStore(prev => ({
        ...prev,
        ratings: ratingData.rating,
        averageRating: ratingData.averageRating
      }));
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  if (!store) return <div className="p-4">Loading your store data...</div>;

  const userRating = store.ratings.find(r => r.email === currentUser.email)?.rating || '';

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Store</h2>

      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <h3 className="text-xl font-semibold text-gray-800">{store.storeName}</h3>
        <p className="text-gray-600">Address: {store.address}</p>
        <p className="text-gray-600">Owner: {store.fullName} ({store.email})</p>
        <p className="text-gray-700 font-medium">
          Average Rating: {store.averageRating ? Number(store.averageRating).toFixed(1) : 0}
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
          <select
            value={userRating}
            onChange={(e) => handleRatingChange(parseInt(e.target.value))}
            className="border rounded px-3 py-1 w-24"
          >
            <option value="">Rate</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Ratings by Users:</h4>
          {store.ratings.length === 0 ? (
            <p className="text-gray-500">No one has rated your store yet.</p>
          ) : (
            <ul className="list-disc pl-5 text-gray-800">
              {store.ratings.map((rater, idx) => (
                <li key={idx}>
                  <strong>{rater.email}</strong> rated: {rater.rating} ⭐
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
