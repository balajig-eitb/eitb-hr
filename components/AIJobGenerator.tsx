import React, { useState } from 'react';
import { generateJobDescription } from '../services/geminiService';
import { FileText, Wand2, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIJobGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('Mid-Level (3-5 years)');
  const [generatedJD, setGeneratedJD] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Validation State
  const [errors, setErrors] = useState<{ title?: string; skills?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; skills?: boolean }>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'title') {
      if (!value.trim()) error = 'Job title is required';
      else if (value.length < 3) error = 'Title must be at least 3 characters';
    }
    if (name === 'skills') {
      if (!value.trim()) error = 'Please list at least one skill';
      else if (value.length < 5) error = 'Please provide more detail about skills';
    }
    return error;
  };

  const handleBlur = (field: 'title' | 'skills') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = field === 'title' ? title : skills;
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: 'title' | 'skills', value: string) => {
    if (field === 'title') setTitle(value);
    if (field === 'skills') setSkills(value);

    // Real-time validation if already touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const titleError = validateField('title', title);
    const skillsError = validateField('skills', skills);

    setErrors({ title: titleError, skills: skillsError });
    setTouched({ title: true, skills: true });

    if (titleError || skillsError) return;

    setLoading(true);
    setGeneratedJD('');
    setCopied(false);

    const result = await generateJobDescription(title, skills, experience);
    setGeneratedJD(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedJD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInputClass = (error?: string, isTouched?: boolean) => {
    const baseClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition duration-200";
    if (error && isTouched) {
      return `${baseClass} border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30`;
    }
    return `${baseClass} border-slate-200 focus:border-indigo-500 focus:ring-indigo-500`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wand2 className="text-indigo-600" />
            Job Description Wizard
          </h2>
          <p className="text-slate-500 mt-1">
            Fill in the details below and let our AI draft a professional JD for you instantly.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5 flex-1" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className={getInputClass(errors.title, touched.title)}
                placeholder="e.g. Senior Product Designer"
                value={title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                required
              />
              {errors.title && touched.title && (
                <div className="absolute right-3 top-2.5 text-rose-500 animate-fade-in">
                  <AlertCircle size={18} />
                </div>
              )}
            </div>
            {errors.title && touched.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium animate-fade-in">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option>Entry Level (0-2 years)</option>
              <option>Mid-Level (3-5 years)</option>
              <option>Senior Level (5-8 years)</option>
              <option>Lead / Principal (8+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Required Skills (Comma separated) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <textarea
                className={`${getInputClass(errors.skills, touched.skills)} h-32 resize-none`}
                placeholder="e.g. React, TypeScript, Figma, Agile methodologies..."
                value={skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                onBlur={() => handleBlur('skills')}
                required
              />
              {errors.skills && touched.skills && (
                <div className="absolute right-3 top-3 text-rose-500 animate-fade-in">
                  <AlertCircle size={18} />
                </div>
              )}
            </div>
             {errors.skills && touched.skills && (
              <p className="mt-1 text-xs text-rose-500 font-medium animate-fade-in">{errors.skills}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Generating...
              </>
            ) : (
              <>
                <Wand2 size={20} className="group-hover:scale-110 transition-transform" /> Generate JD
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output Display */}
      <div className="bg-slate-50 rounded-xl shadow-inner border border-slate-200 p-6 flex flex-col h-full overflow-hidden relative">
        <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-4">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <FileText size={18} />
            Preview
          </h3>
          {generatedJD && (
            <button
              onClick={handleCopy}
              className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                copied ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {generatedJD ? (
            <article className="prose prose-indigo prose-sm max-w-none text-slate-700">
               <div className="whitespace-pre-line font-sans">
                 {generatedJD}
               </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Wand2 size={48} className="mb-4 opacity-20" />
              <p>Generated content will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIJobGenerator;
