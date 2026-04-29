import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/user/leaderboard');
        setLeaders(res.data.leaderboard);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="text-yellow-400 w-6 h-6" />;
    if (index === 1) return <Medal className="text-gray-400 w-6 h-6" />;
    if (index === 2) return <Award className="text-orange-500 w-6 h-6" />;
    return <span>{index + 1}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Users className="mr-2" />
        Global Leaderboard
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Category</th>
              <th>Probability</th>
            </tr>
          </thead>

          <tbody>
            {leaders.map((leader, index) => (
              <tr key={leader.id}>
                <td>{getRankIcon(index)}</td>
                <td>{leader.name}</td>
                <td>{leader.prediction?.category || 'Low'}</td>
                <td>{leader.probability}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        <TrendingUp className="inline mr-2" />
        Your Score: {user?.prediction?.probability || 0}%
      </div>
    </div>
  );
};

export default Leaderboard;