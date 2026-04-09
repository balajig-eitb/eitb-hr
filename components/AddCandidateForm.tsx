import React, { useState } from 'react';
import { ViewState, Candidate } from '../types';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, DollarSign, 
  Linkedin, Globe, Award, BookOpen, Save, X, AlertCircle, ArrowLeft, CheckCircle, 
  Upload
} from 'lucide-react';
import { useToast } from './Toast';

interface AddCandidateFormProps {
  onNavigate: (view: ViewState) => void;
  //onAddCandidate: (candidate: Candidate) => void;
}

const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    experience: '',
    currentCompany: '',
    education: '',
    skills: '',
    linkedin: '',
    portfolio: '',
    noticePeriod: 'Immediate',
    expectedSalary: '',
    resume: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'This field is required';
        else if (value.length < 2) error = 'Must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value)) error = 'Invalid phone number';
        break;
      case 'role':
        if (!value.trim()) error = 'Role is required';
        break;
      case 'experience':
        if (!value) error = 'Experience is required';
        else if (parseInt(value) < 0) error = 'Cannot be negative';
        break;
      case 'skills':
        if (!value.trim()) error = 'At least one skill is required';
        break;
      case 'linkedin':
        if (value && !value.includes('linkedin.com')) error = 'Must be a valid LinkedIn URL';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: {[key: string]: string} = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length > 0) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    const data = new FormData();


    const newCandidate: Candidate = {
      id: Date.now().toString(),
      firstname: formData.firstName,
      lastname: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      job_role: formData.role,
      role: formData.role,
      experience: parseInt(formData.experience) || 0,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      currentCompany: formData.currentCompany,
      education: formData.education,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      noticePeriod: formData.noticePeriod,
      expectedSalary: formData.expectedSalary,
      status: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: 0, // Initial score
      avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
    };
    // onAddCandidate(newCandidate);

    Object.keys(newCandidate).forEach((key) => {
      data.append(key, newCandidate[key]);
    });


     if (formData.resume) {
        data.append("resume", formData.resume);
      }

    //onAddCandidate(newCandidate);
    try{

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-candidate`, {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (!res.ok) {
          throw new Error(json.message || "Something went wrong");
      }
      showToast('Candidate added successfully', 'success');

    }catch(err){
      console.log(err);
      showToast("Faild to create candidate", 'error');
    }
   
    //onNavigate(ViewState.RECRUITMENT);
  };

  const getInputClass = (name: string) => {
    const hasError = errors[name] && touched[name];
    return `w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
      hasError 
        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/50' 
        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
    }`;
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => onNavigate(ViewState.RECRUITMENT)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Candidate</h1>
          <p className="text-slate-500 text-sm">Enter the candidate's comprehensive details below.</p>
        </div>
      </div>

       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - Left (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Personal Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
              <User className="text-indigo-600" size={20} /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('firstName')}
                    placeholder="Jane"
                  />
                </div>
                {errors.firstName && touched.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('lastName')}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && touched.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('email')}
                    placeholder="jane.doe@example.com"
                  />
                </div>
                {errors.email && touched.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('phone')}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && touched.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={getInputClass('location')}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
              <Briefcase className="text-indigo-600" size={20} /> Professional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Role <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('role')}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                {errors.role && touched.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    step="0.5"
                    className={getInputClass('experience')}
                    placeholder="e.g. 5"
                  />
                </div>
                {errors.experience && touched.experience && <p className="mt-1 text-xs text-rose-500">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    className={getInputClass('currentCompany')}
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Highest Education</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 text-slate-400" size={18} />
                  <select 
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={getInputClass('education')}
                  >
                    <option value="">Select Education</option>
                    <option value="Bachelors">Bachelor's Degree</option>
                    <option value="Masters">Master's Degree</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Self Taught">Self Taught</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills (Comma Separated) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 text-slate-400" size={18} />
                  <textarea 
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${getInputClass('skills')} h-24 pt-3 resize-none`}
                    placeholder="React, TypeScript, Node.js, AWS..."
                  />
                </div>
                 {errors.skills && touched.skills && <p className="mt-1 text-xs text-rose-500">{errors.skills}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column - Right (1/3) */}
        <div className="space-y-6">
          
          {/* Section 3: Links & Socials */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
              <Globe className="text-indigo-600" size={20} /> Online Presence
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('linkedin')}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                {errors.linkedin && touched.linkedin && <p className="mt-1 text-xs text-rose-500">{errors.linkedin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className={getInputClass('portfolio')}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: HR Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
              <Clock className="text-indigo-600" size={20} /> Availability & Pay
            </h3>
            
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notice Period</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <select 
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className={getInputClass('noticePeriod')}
                  >
                    <option>Immediate</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                    <option>60 Days</option>
                    <option>90 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Salary</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className={getInputClass('expectedSalary')}
                    placeholder="e.g. 120k"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
              <Upload className="text-indigo-600" size={20} /> Upload Resume
            </h3>
            
            <div className="space-y-4">
               <div>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    className={getInputClass('resume')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
             <button 
               type="submit"
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
             >
               <Save size={20} /> Save Candidate
             </button>
             <button 
               type="button"
               onClick={() => onNavigate(ViewState.RECRUITMENT)}
               className="w-full py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
             >
               <X size={20} /> Cancel
             </button>
          </div>

        </div>
       </form>

    </div>
  );
};

export default AddCandidateForm;
