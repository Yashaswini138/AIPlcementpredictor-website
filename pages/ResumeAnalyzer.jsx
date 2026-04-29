import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, CheckCircle, AlertTriangle, Loader2, Sparkles, XCircle } from 'lucide-react';
import api from '../utils/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setError('');
    setResults(null);
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Need to set content type to multipart/form-data for this specific request
      const res = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 text-primary-600 dark:text-primary-400">
          <Sparkles size={28} />
        </div>
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Resume Analyzer</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          Upload your PDF resume to instantly extract skills and discover missing keywords that recruiters are looking for.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-8 sm:p-12 rounded-3xl"
      >
        <div 
          className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]' : 'border-gray-300 dark:border-dark-border hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50/50 dark:hover:bg-dark-bg/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          {isDragging && <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleChange} 
            accept=".pdf" 
            className="hidden" 
          />
          
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 cursor-pointer">
            <motion.div 
              animate={isDragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
              className="w-20 h-20 bg-primary-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center shadow-inner border border-primary-100 dark:border-dark-border"
            >
              {file ? <File className="text-primary-500 w-10 h-10" /> : <UploadCloud className="text-primary-500 w-10 h-10" />}
            </motion.div>
            
            <div>
              <p className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                {file ? file.name : 'Click or drag PDF here to upload'}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Maximum file size 5MB'}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center border border-red-100 dark:border-red-800"
            >
              <XCircle size={18} className="mr-3 flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={!file || isUploading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center shadow-xl hover:shadow-primary-500/30 active:scale-95"
          >
            {isUploading ? (
              <><Loader2 className="animate-spin mr-3" size={20} /> Analyzing Resume...</>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>
      </motion.div>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="glass-panel p-8 rounded-3xl border-t-4 border-green-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={24} /> Skills Detected
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {results.extracted_skills.length > 0 ? (
                results.extracted_skills.map((skill, i) => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="px-4 py-2 bg-green-50/80 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-semibold shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No common skills found. Try a different format.</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-t-4 border-amber-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertTriangle className="text-amber-500 mr-3" size={24} /> Recommended Additions
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
              Consider learning or adding these industry-standard skills to your resume if you know them:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {results.suggested_skills.map((skill, i) => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="px-4 py-2 bg-amber-50/80 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm font-semibold shadow-sm flex items-center"
                >
                  <Plus size={14} className="mr-1" /> {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
