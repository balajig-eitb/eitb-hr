import React, { useState } from 'react';
import { ViewState, Users } from '../types';
import { 
  User, Mail, Phone, MapPin, Briefcase, Clock, DollarSign, 
  Linkedin, Globe, Award, BookOpen, Save, X, AlertCircle, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { useToast } from './Toast';

interface AddUserFormProps {
  onNavigate: (view: ViewState) => void;
  //onAddRole: (candidate: Candidate) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  
  const initialState = {
    name: '',
    user_name: '',
    password: '',
  }

  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    password: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'This field is required';
        else if (value.length < 5) error = 'Must be at least 2 characters';
        break;
      case 'user_name':
        if (!value.trim()) error = 'This field is required';
        else if (value.length < 2) error = 'Must be at least 8 characters';
        else if (value.length > 8) error = 'Must be at less than 8 characters';

        break;
      case 'password':
        if (!value.trim()) error = 'At least one skill is required';
        else if (value.length < 8) error = 'Must be at least 8 characters';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
        ...prev,
        [name]: name === 'user_name'
          ? value.toLocaleLowerCase()
          : value,
      }));
    
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

    const newUser: Users = {
      name: formData.name,
      user_name: formData.user_name,
      password : formData.password,
      id: Date.now().toString(),
      code: formData.user_name.toUpperCase(),
      description: '',
      role: '',
      create_at: new Date().toISOString(),
      permission: {} as JSON,
      active: true,
    }; 

    //onAddRole(newRole);

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    console.log('baseUrl:', baseUrl);
    console.log('newUser:', newUser);
    try{

      const res = await fetch(`${baseUrl}/api/users/create-user`, {
        method: 'POST',
        headers: 
        {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      console.log(res);
      const json = await res.json()

      if (!res.ok) {
          throw new Error(json.message || "Something went wrong");
      }
      showToast('New User created successfully', 'success');
      setFormData(initialState);

    }catch(err){
     console.log(err);
      showToast("Faild to create new user", 'error');
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
          <h1 className="text-2xl font-bold text-slate-800">Add New User</h1>
          <p className="text-slate-500 text-sm">Enter the user description below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 roleForm">
        
        {/* Main Column - Left (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Personal Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
              <User className="text-indigo-600" size={20} /> User Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('name')}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && touched.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('user_name')}
                    placeholder="admin1 (must be unique)"
                  />
                </div>
                {errors.user_name && touched.user_name && <p className="mt-1 text-xs text-rose-500">{errors.user_name}</p>}
              </div>

              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('password')}
                    placeholder="*********"
                  />
                </div>
                 {errors.password && touched.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
              </div>
            </div>
          </div>
       

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
             <button 
               type="submit"
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
             >
               <Save size={20} /> Save User
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

export default AddUserForm;
