import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Lightbulb, Code, Briefcase, ChevronRight } from 'lucide-react';

const Recommendations = () => {
  const { user } = useAuth();
  
  const recs = user?.recommendations || {
    skills_to_learn: [],
    general_advice: "Complete your profile to get personalized recommendations.",
    projects_suggested: false,
    internships_suggested: false
  };

  // Mock radar chart data comparing user to 'ideal' candidate
  const chartData = [
    { subject: 'CGPA', A: (user?.profile?.cgpa || 0) * 10, B: 85, fullMark: 100 },
    { subject: 'Skills', A: Math.min((user?.profile?.skills?.length || 0) * 10, 100), B: 80, fullMark: 100 },
    { subject: 'Projects', A: Math.min((user?.profile?.projects || 0) * 33.3, 100), B: 70, fullMark: 100 },
    { subject: 'Internships', A: Math.min((user?.profile?.internships || 0) * 50, 100), B: 60, fullMark: 100 },
    { subject: 'Aptitude', A: user?.profile?.aptitude_score || 0, B: 75, fullMark: 100 },
    { subject: 'Certs', A: Math.min((user?.profile?.certifications || 0) * 20, 100), B: 40, fullMark: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Personalized Insights</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl flex flex-col h-[400px]"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Strength vs Average Student</h3>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Profile" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Avg. Placed Student" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none' }}
                  itemStyle={{ color: '#1f2937' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div><span className="dark:text-gray-300">You</span></div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div><span className="dark:text-gray-300">Average</span></div>
          </div>
        </motion.div>

        {/* Actionable Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-2">
              <Lightbulb className="mr-2 text-yellow-500" /> AI Feedback
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {recs.general_advice}
            </p>
          </div>

          {(recs.skills_to_learn?.length > 0 || recs.projects_suggested || recs.internships_suggested) && (
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suggested Action Plan</h3>
              <ul className="space-y-4">
                {recs.skills_to_learn?.length > 0 && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1"><Code size={18} className="text-primary-500" /></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Learn New Skills</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Consider adding these to your stack: {recs.skills_to_learn.join(', ')}.</p>
                    </div>
                  </li>
                )}
                {recs.projects_suggested && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1"><ChevronRight size={18} className="text-green-500" /></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Build More Projects</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Having 2 or more strong projects significantly boosts your chances. Build a full-stack clone or a data analysis project.</p>
                    </div>
                  </li>
                )}
                {recs.internships_suggested && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1"><Briefcase size={18} className="text-purple-500" /></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Gain Real Experience</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try to secure at least one internship. Look for early-stage startups or open-source contributions.</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Recommendations;
