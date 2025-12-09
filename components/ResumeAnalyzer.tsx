import React, { useState } from 'react';
import { parseResume } from '../services/geminiService';
import { ResumeAnalysisResult } from '../types';
import { FileSearch, UploadCloud, CheckCircle, AlertCircle, Award, Brain, Mail, GraduationCap, Briefcase, Loader2 } from 'lucide-react';

const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
        setError('Please paste the candidate\'s resume content first.');
        return;
    }
    if (resumeText.length < 50) {
        setError('The resume content appears to be too short for meaningful analysis.');
        return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    const data = await parseResume(resumeText);
    setResult(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setResumeText(e.target.value);
      if (error && e.target.value.length > 50) {
          setError('');
      }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500';
    if (score >= 60) return 'text-amber-500 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Input Section */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UploadCloud className="text-indigo-600" />
            Resume Input
          </h2>
          <p className="text-slate-500 text-sm mt-1">Paste the candidate's resume text below for instant AI analysis.</p>
        </div>
        
        <div className="flex-1 relative mb-4">
            <textarea 
              className={`w-full h-full p-4 bg-slate-50 border rounded-lg focus:ring-2 focus:outline-none resize-none font-mono text-sm transition-colors ${
                  error 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                  : 'border-slate-200 focus:ring-indigo-500'
              }`}
              placeholder="Paste resume content here..."
              value={resumeText}
              onChange={handleChange}
            />
            {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-rose-50 text-rose-600 px-3 py-2 rounded-lg text-sm flex items-center gap-2 border border-rose-100 animate-fade-in">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Analyzing Skills...
            </>
          ) : (
            <>
              <FileSearch size={20} /> Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      <div className="flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
        {result ? (
          <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Header Profile */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{result.name || "Candidate"}</h3>
                <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
                  <span className="flex items-center gap-1"><Mail size={14} /> {result.email || "N/A"}</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {result.experienceYears}+ Years Exp</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
                   <GraduationCap size={14} /> {result.education}
                </div>
              </div>
              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold bg-white ${getScoreColor(result.matchScore)}`}>
                {result.matchScore}
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Brain size={18} className="text-violet-500" />
                AI Executive Summary
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Skills Analysis */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Award size={18} className="text-blue-500" />
                Identified Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 flex items-center gap-2 mb-3">
                  <CheckCircle size={18} /> Strengths
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <h4 className="font-semibold text-rose-800 flex items-center gap-2 mb-3">
                  <AlertCircle size={18} /> Areas for Review
                </h4>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               {loading ? <Loader2 className="animate-spin text-indigo-500" size={32} /> : <FileSearch size={32} />}
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              {loading ? "Analyzing Candidate Profile..." : "Ready to Analyze"}
            </h3>
            <p className="text-sm max-w-xs">
              {loading 
                ? "Our AI is extracting skills, calculating experience, and generating a summary." 
                : "Paste a resume on the left to extract skills, summary, and get an AI rating."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
