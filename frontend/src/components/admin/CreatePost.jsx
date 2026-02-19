import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase, Calendar, Trophy, Video, GraduationCap,
    Zap, ArrowRight, ChevronLeft, MapPin, IndianRupee,
    Users, Clock, Link as LinkIcon, FileText, Sparkles,
    CheckCircle2, Loader2, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../shared/Navbar'
import PremiumFileUpload from '../shared/PremiumFileUpload'
import axios from 'axios'
import {
    JOB_API_END_POINT,
    HACKATHON_API_END_POINT,
    WEBINAR_API_END_POINT,
    COMPETITION_API_END_POINT,
    CERTIFICATION_API_END_POINT,
    INTERNSHIP_API_END_POINT
} from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addJob } from '@/redux/jobSlice'

const POST_TYPES = [
    { id: 'job', title: 'Full-time Job', icon: <Briefcase />, color: 'blue', desc: 'Hire top talent for permanent roles' },
    { id: 'internship', title: 'Internship', icon: <Clock />, color: 'emerald', desc: 'Find bright students for your team' },
    { id: 'hackathon', title: 'Hackathon', icon: <Zap />, color: 'amber', desc: 'Organize a coding competition' },
    { id: 'webinar', title: 'Webinar', icon: <Video />, color: 'purple', desc: 'Share knowledge with the community' },
    { id: 'competition', title: 'Competition', icon: <Trophy />, color: 'indigo', desc: 'Generic contests and challenges' },
    { id: 'certification', title: 'Certification', icon: <GraduationCap />, color: 'rose', desc: 'Provide verified learning paths' },
];

const CreatePost = () => {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        stipend: '',
        experience: 0,
        position: '',
        duration: '',
        date: '',
        time: '',
        prize: '',
        teamSize: '',
        speaker: '',
        fee: 0,
        level: 'Beginner',
        meetingLink: '',
        rules: '',

        provider: '',
        category: '',
        registrationDeadline: '',
        skills: '',
        file: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        setFormData(prev => ({ ...prev, file }));
    };

    const getEndpoint = () => {
        switch (selectedType) {
            case 'job': return `${JOB_API_END_POINT}/post`;
            case 'internship': return `${INTERNSHIP_API_END_POINT}/post`;
            case 'hackathon': return `${HACKATHON_API_END_POINT}/post`;
            case 'webinar': return `${WEBINAR_API_END_POINT}/post`;
            case 'competition': return `${COMPETITION_API_END_POINT}/post`;
            case 'certification': return `${CERTIFICATION_API_END_POINT}/post`;
            default: return `${JOB_API_END_POINT}/post`;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    payload.append(key, formData[key]);
                }
            });

            // Add jobType based on selectedType for generic parsing if needed
            let jobTypeLabel = 'Job';
            if (selectedType === 'job') jobTypeLabel = 'Job';
            else if (selectedType === 'internship') jobTypeLabel = 'Internship';
            else if (selectedType === 'hackathon') jobTypeLabel = 'Hackathon';
            else if (selectedType === 'webinar') jobTypeLabel = 'Webinar';
            else if (selectedType === 'competition') jobTypeLabel = 'Competition';
            else if (selectedType === 'certification') jobTypeLabel = 'Certification';

            payload.append('jobType', jobTypeLabel);

            // Handle date mapping for Competition
            if (selectedType === 'competition' && formData.date) {
                payload.append('eventDate', formData.date);
            }

            // Handle specific mappings for Certification
            if (selectedType === 'certification') {
                if (!formData.provider && formData.companyName) {
                    payload.append('provider', formData.companyName);
                }
                if (formData.requirements) {
                    payload.append('skills', formData.requirements);
                }
            }

            const res = await axios.post(getEndpoint(), payload, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(`${jobTypeLabel} Posted Successfully!`);
                if (res.data.job) dispatch(addJob(res.data.job));
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = () => {
        const inputBase = "w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300 shadow-sm hover:border-gray-200";
        const labelBase = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2";

        return (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Common Fields */}
                <div className='md:col-span-2'>
                    <label className={labelBase}>Event/Job Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Frontend Developer" required className={inputBase} />
                </div>

                <div className='md:col-span-1'>
                    <label className={labelBase}>Organization Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company or Community Name" required className={inputBase} />
                </div>

                <div className='md:col-span-1'>
                    <label className={labelBase}>Location</label>
                    <div className='relative'>
                        <MapPin className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Remote or City" required className={`${inputBase} pl-12`} />
                    </div>
                </div>

                <div className='md:col-span-2'>
                    <label className={labelBase}>Full Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Detailed overview of the opportunity..." required className={`${inputBase} resize-none`} />
                </div>

                {/* Conditional Fields based on Type */}
                {selectedType === 'job' && (
                    <>
                        <div>
                            <label className={labelBase}>Salary (LPA)</label>
                            <div className='relative'>
                                <IndianRupee className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. 12" className={`${inputBase} pl-12`} />
                            </div>
                        </div>
                        <div>
                            <label className={labelBase}>Experience Level (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0 for freshers" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>No. of Positions</label>
                            <input type="number" name="position" value={formData.position} onChange={handleInputChange} placeholder="e.g. 5" className={inputBase} />
                        </div>
                    </>
                )}

                {selectedType === 'internship' && (
                    <>
                        <div>
                            <label className={labelBase}>Stipend (Monthly)</label>
                            <input type="number" name="stipend" value={formData.stipend} onChange={handleInputChange} placeholder="₹ 15000" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>Duration (Months)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 6" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>No. of Positions</label>
                            <input type="number" name="position" value={formData.position} onChange={handleInputChange} placeholder="e.g. 5" className={inputBase} />
                        </div>
                    </>
                )}

                {(selectedType === 'hackathon' || selectedType === 'competition') && (
                    <>
                        <div>
                            <label className={labelBase}>Prize Pool</label>
                            <div className='relative'>
                                <Trophy className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                <input type="text" name="prize" value={formData.prize} onChange={handleInputChange} placeholder="e.g. $5000" className={`${inputBase} pl-12`} />
                            </div>
                        </div>
                        <div>
                            <label className={labelBase}>Team Size</label>
                            <input type="text" name="teamSize" value={formData.teamSize} onChange={handleInputChange} placeholder="e.g. 1-4 Members" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Coding, Design" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>Registration Deadline</label>
                            <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} className={inputBase} />
                        </div>
                        <div className='md:col-span-2'>
                            <label className={labelBase}>Rules & Guidelines</label>
                            <textarea name="rules" value={formData.rules} onChange={handleInputChange} rows={3} placeholder="Eligibility, rounds, etc." className={inputBase} />
                        </div>
                    </>
                )}

                {selectedType === 'webinar' && (
                    <>
                        <div>
                            <label className={labelBase}>Speaker/Mentor</label>
                            <input type="text" name="speaker" value={formData.speaker} onChange={handleInputChange} placeholder="Name of the speaker" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>Meeting Link</label>
                            <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleInputChange} placeholder="Zoom/Meet URL" className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>Duration (Hours)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 1.5" className={inputBase} />
                        </div>
                    </>
                )}

                {(selectedType === 'webinar' || selectedType === 'hackathon' || selectedType === 'competition') && (
                    <>
                        <div>
                            <label className={labelBase}>Event Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputBase} />
                        </div>
                        <div>
                            <label className={labelBase}>Start Time</label>
                            <input type="time" name="time" value={formData.time} onChange={handleInputChange} className={inputBase} />
                        </div>
                    </>
                )}

                {selectedType === 'certification' && (
                    <>
                        <div>
                            <label className={labelBase}>Level</label>
                            <select name="level" value={formData.level} onChange={handleInputChange} className={inputBase}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelBase}>Program Duration (Weeks)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 4" required className={inputBase} />
                        </div>
                        <div className="md:col-span-1">
                            <label className={labelBase}>Provider / Organization</label>
                            <input type="text" name="provider" value={formData.provider || formData.companyName} onChange={handleInputChange} placeholder="e.g. Google, Coursera" required className={inputBase} />
                        </div>
                        <div className="md:col-span-1">
                            <label className={labelBase}>Cost (0 for Free)</label>
                            <input type="number" name="fee" value={formData.fee} onChange={handleInputChange} placeholder="0" required className={inputBase} />
                        </div>
                    </>
                )}

                <div className='md:col-span-2'>
                    <label className={labelBase}>Requirements (Comma Separated)</label>
                    <input type="text" name="requirements" value={formData.requirements} onChange={handleInputChange} placeholder="React, Node.js, Problem Solving" className={inputBase} />
                </div>

                <div className='md:col-span-2'>
                    <PremiumFileUpload onFileSelect={handleFileSelect} label="Upload Image or Logo" />
                </div>
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-[#FDFCFE] pb-24'>
            <Navbar />

            <div className='max-w-5xl mx-auto px-4 mt-12'>
                {/* Header */}
                <div className='text-center mb-16'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-purple-600 font-black text-[10px] uppercase tracking-widest mb-6 border border-purple-100 shadow-sm'
                    >
                        <Sparkles size={14} /> Recruiter Studio
                    </motion.div>
                    <h1 className='text-5xl font-black text-gray-900 tracking-tight mb-4'>Publish Excellence</h1>
                    <p className='text-gray-500 font-medium text-lg'>Reach thousands of motivated students and professionals</p>
                </div>

                {/* Progress Bar (Visual) */}
                <div className='mb-12 relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden'>
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: step === 1 ? '33%' : step === 2 ? '100%' : '100%' }}
                        className='absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all'
                    ></motion.div>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        >
                            {POST_TYPES.map((type) => (
                                <motion.div
                                    key={type.id}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => {
                                        setSelectedType(type.id);
                                        setStep(2);
                                    }}
                                    className={`cursor-pointer p-8 rounded-[32px] border-2 transition-all group relative overflow-hidden ${selectedType === type.id
                                        ? 'border-purple-600 bg-white shadow-2xl'
                                        : 'border-gray-50 bg-white hover:border-purple-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl shadow-lg transition-transform group-hover:scale-110 duration-500 ${type.color === 'blue' ? 'bg-blue-600 shadow-blue-200' :
                                        type.color === 'emerald' ? 'bg-emerald-600 shadow-emerald-200' :
                                            type.color === 'amber' ? 'bg-amber-600 shadow-amber-200' :
                                                type.color === 'purple' ? 'bg-purple-600 shadow-purple-200' :
                                                    type.color === 'indigo' ? 'bg-indigo-600 shadow-indigo-200' :
                                                        'bg-rose-600 shadow-rose-200'
                                        }`}>
                                        {type.icon}
                                    </div>
                                    <h3 className='text-2xl font-black text-gray-900 mb-2'>{type.title}</h3>
                                    <p className='text-gray-500 font-medium leading-relaxed'>{type.desc}</p>

                                    <div className='mt-8 flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity'>
                                        Choose <ArrowRight size={14} />
                                    </div>

                                    {/* Abstract Background Decoration */}
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-50/50 transition-colors'></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className='bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-white/50 p-10 md:p-14'
                        >
                            <button
                                onClick={() => setStep(1)}
                                className='flex items-center gap-2 text-gray-400 hover:text-purple-600 font-bold mb-10 transition-colors group'
                            >
                                <div className='p-2 bg-gray-50 rounded-xl group-hover:bg-purple-50 transition-colors'>
                                    <ChevronLeft size={18} />
                                </div>
                                Change Type
                            </button>

                            <div className='flex items-center gap-4 mb-12 pb-12 border-b border-gray-50'>
                                <div className='w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-xl shadow-xl'>
                                    {POST_TYPES.find(t => t.id === selectedType)?.icon}
                                </div>
                                <div>
                                    <h2 className='text-3xl font-black text-gray-900'>Post a New {POST_TYPES.find(t => t.id === selectedType)?.title}</h2>
                                    <p className='text-gray-400 font-bold text-sm tracking-tight'>Fill in the details to go live</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-12'>
                                {renderFormFields()}

                                <div className='pt-10 flex flex-col sm:flex-row gap-4'>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className='flex-1 h-20 text-xl font-black rounded-3xl bg-black text-white hover:bg-gray-900 shadow-2xl transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 group'
                                    >
                                        {loading ? (
                                            <div className='flex items-center gap-3'>
                                                <Loader2 className='animate-spin' size={28} />
                                                Publishing...
                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-3'>
                                                <CheckCircle2 size={24} />
                                                Post Now
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/')}
                                        className='sm:w-[200px] h-20 rounded-3xl border-gray-100 hover:bg-gray-50 font-black text-gray-400 text-lg transition-all'
                                    >
                                        Discard
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default CreatePost
