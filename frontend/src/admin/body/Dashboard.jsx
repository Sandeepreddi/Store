import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

function Dashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    admins: 0,
    storeUsers: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, adminRes, storeRes] = await Promise.all([
          fetch('http://localhost:5000/api/view/user'),
          fetch('http://localhost:5000/api/view/admin'),
          fetch('http://localhost:5000/api/view/storeuser'),
        ]);

        const users = await userRes.json();
        const admins = await adminRes.json();
        const storeUsers = await storeRes.json();

        setCounts({
          users: users.length,
          admins: admins.length,
          storeUsers: storeUsers.length,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchCounts();
  }, []);

  const pieData = [
    { name: 'Users', value: counts.users },
    { name: 'Admins', value: counts.admins },
    { name: 'Store Users', value: counts.storeUsers },
  ];

  return (
    <div className="">

      {/* Summary Cards */}
<div className="px-4 sm:px-8">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full">
    <div className="bg-indigo-100 p-6 rounded-xl shadow text-center">
      <h3 className="text-indigo-700 text-xl font-semibold">Users</h3>
      <p className="text-3xl font-bold">{counts.users}</p>
    </div>
    <div className="bg-green-100 p-6 rounded-xl shadow text-center">
      <h3 className="text-green-700 text-xl font-semibold">Admins</h3>
      <p className="text-3xl font-bold">{counts.admins}</p>
    </div>
    <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
      <h3 className="text-yellow-700 text-xl font-semibold">Store Users</h3>
      <p className="text-3xl font-bold">{counts.storeUsers}</p>
    </div>
  </div>
</div>


      {/* Pie Chart */}
      <div className="w-full h-[300px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
