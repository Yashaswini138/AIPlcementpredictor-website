import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, Award, BookOpen, Briefcase, Plus, X, Save, Lightbulb, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(user?.profile || {
    cgpa: 0,
    skills: [],
    projects: 0,
    internships: 0,
    certifications: 0,
    aptitude_score: 0
  });
  
  const [prediction, setPrediction] = useState(user?.prediction || { probability: 0, category: 'Low', confidence: 0 });
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Debounce simulation logic
  useEffect(() => {
    const simulatePrediction = async () => {
      setIsSimulating(true);
      try {
        const res = await api.post('/predict/simulate', profile);
        setPrediction(res.data.prediction);
      } catch (error) {
        console.error("Simulation error", error);
      } finally {
        setIsSimulating(false);
      }
    };

    const timer = setTimeout(() => {
      simulatePrediction();
    }, 500);

    return () => clearTimeout(timer);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.post('/predict/', profile);
      updateProfile({ profile: res.data.profile, prediction: res.data.prediction, recommendations: res.data.recommendations });
    } catch (error) {
      console.error("Save error", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Circular Progress Logic
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (prediction.probability / 100) * circumference;

  const getColor = (prob) => {
    if (prob >= 75) return 'text-green-500';
    if (prob >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = (prob) => {
    if (prob >= 75) return 'stroke-green-500';
    if (prob >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const radarData = [
    { subject: 'Academics', A: Math.min((profile.cgpa / 10) * 100, 100) || 10, fullMark: 100 },
    { subject: 'Skills', A: Math.min(profile.skills.length * 10, 100) || 10, fullMark: 100 },
    { subject: 'Projects', A: Math.min(profile.projects * 20, 100) || 10, fullMark: 100 },
    { subject: 'Internships', A: Math.min(profile.internships * 30, 100) || 10, fullMark: 100 },
    { subject: 'Aptitude', A: profile.aptitude_score || 10, fullMark: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">Your Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your profile and simulate outcomes.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-primary-500/30 disabled:opacity-50 active:scale-95 font-medium"
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving Profile...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Activity className="mr-2 text-primary-500" size={20} /> Academic & Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BookOpen size={16} className="inline mr-2 text-gray-400" />
                  CGPA (out of 10)
                </label>
                <input
                  type="number"
                  name="cgpa"
                  step="0.1"
                  max="10"
                  min="0"
                  value={profile.cgpa || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:bg-white dark:focus:bg-dark-card"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Target size={16} className="inline mr-2 text-gray-400" />
                  Aptitude Score (out of 100)
                </label>
                <input
                  type="number"
                  name="aptitude_score"
                  max="100"
                  min="0"
                  value={profile.aptitude_score || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:bg-white dark:focus:bg-dark-card"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Briefcase size={16} className="inline mr-2 text-gray-400" />
                  Number of Projects
                </label>
                <input
                  type="number"
                  name="projects"
                  min="0"
                  value={profile.projects || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:bg-white dark:focus:bg-dark-card"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Award size={16} className="inline mr-2 text-gray-400" />
                  Internships
                </label>
                <input
                  type="number"
                  name="internships"
                  min="0"
                  value={profile.internships || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:bg-white dark:focus:bg-dark-card"
                />
              </div>

            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-6">Technical Skills</h3>
            <form onSubmit={handleAddSkill} className="flex space-x-3 mb-6">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. React, Python, Machine Learning"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all focus:bg-white dark:focus:bg-dark-card"
              />
              <button type="submit" className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 px-4 rounded-xl hover:bg-primary-200 transition-colors flex items-center justify-center">
                <Plus size={24} />
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`${skill}-${idx}`} 
                  className="px-4 py-1.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center shadow-sm"
                >
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none transition-colors">
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
              {profile.skills.length === 0 && <span className="text-sm text-gray-400 italic">No skills added yet.</span>}
            </div>
          </div>

        </motion.div>

        {/* Prediction Results Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-8 w-full text-left">Live Prediction</h3>
            
            <div className="relative w-56 h-56 mb-8">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="transparent"
                  className="stroke-gray-100 dark:stroke-gray-800"
                  strokeWidth="12"
                />
                {/* Progress Circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="transparent"
                  className={`${getStrokeColor(prediction.probability)} transition-all duration-1000 ease-out`}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-display font-bold ${getColor(prediction.probability)} drop-shadow-sm`}>
                  {prediction.probability}%
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wide">Probability</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-gray-50/80 dark:bg-dark-bg/80 p-4 rounded-2xl text-center border border-gray-100 dark:border-dark-border">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-semibold">Category</p>
                <p className={`font-bold text-lg ${getColor(prediction.probability)}`}>{prediction.category}</p>
              </div>
              <div className="bg-gray-50/80 dark:bg-dark-bg/80 p-4 rounded-2xl text-center border border-gray-100 dark:border-dark-border">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-semibold">Confidence</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{prediction.confidence}%</p>
              </div>
            </div>
            {isSimulating && (
              <div className="absolute bottom-4 left-0 w-full text-center">
                <p className="text-xs text-primary-500 font-medium animate-pulse">Simulating impact...</p>
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl h-64 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 w-full text-left pl-4">Profile Strengths</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Profile" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-xl shadow-primary-500/20">
            <h3 className="font-display font-semibold mb-3 flex items-center text-lg"><Lightbulb className="mr-2 text-yellow-300" size={20}/> Pro Tip</h3>
            <p className="text-sm text-primary-50 leading-relaxed font-medium">
              Play around with the input fields to simulate how adding a project or learning a new skill impacts your placement probability in real-time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
