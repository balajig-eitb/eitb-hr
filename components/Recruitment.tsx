import React, { useState } from 'react';
import { Candidate, ViewState } from '../types';
import { analyzeCandidate } from '../services/geminiService';
import { Sparkles, CheckCircle, Clock, BrainCircuit, Loader2, Plus } from 'lucide-react';

interface RecruitmentProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  onNavigate: (view: ViewState) => void;
}

const Recruitment: React.FC<RecruitmentProps> = ({ candidates, setCandidates, onNavigate }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleAnalyze = async (candidate: Candidate) => {
    setAnalyzingId(candidate.id);
    const summary = await analyzeCandidate(candidate);
    
    setCandidates(prev => prev.map(c => 
      c.id === candidate.id ? { ...c, summary } : c
    ));
    setAnalyzingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'New': return <Clock size={16} className="text-blue-500" />;
      case 'Screening': return <BrainCircuit size={16} className="text-purple-500" />;
      case 'Interview': return <CheckCircle size={16} className="text-amber-500" />;
      default: return <CheckCircle size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Recruitment Pipeline</h2>
          <p className="text-slate-500">Manage candidates and use AI for screening.</p>
        </div>
        <button 
          onClick={() => onNavigate(ViewState.ADD_CANDIDATE)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center shadow-sm"
        >
            <Plus size={20} className="mr-2" /> Add Candidate
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 border border-slate-200 overflow-hidden">
                  {candidate.avatar ? (
                    <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    candidate.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{candidate.name}</h3>
                  <p className="text-sm text-slate-500">
                    {candidate.role} • {candidate.experience} Years Exp
                    {candidate.currentCompany ? ` • ${candidate.currentCompany}` : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200 flex items-center gap-2 text-sm font-medium text-slate-700">
                    {getStatusIcon(candidate.status)}
                    {candidate.status}
                 </div>
                 <button 
                    onClick={() => handleAnalyze(candidate)}
                    disabled={analyzingId === candidate.id}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-70 transition-all shadow-sm"
                 >
                    {analyzingId === candidate.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> AI Screen
                      </>
                    )}
                 </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidate.summary && (
              <div className="mt-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 animate-fade-in">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
                  <Sparkles size={16} />
                  <h3>Gemini Insight</h3>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {candidate.summary}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {candidates.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p>No candidates in the pipeline. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruitment;
