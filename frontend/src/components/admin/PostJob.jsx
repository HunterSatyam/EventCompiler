import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Briefcase, MapPin, IndianRupee,
    FileText, Sparkles, CheckCircle2,
    Loader2, ArrowRight, Building2,
    Users, Clock, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../shared/Navbar'
import PremiumFileUpload from '../shared/PremiumFileUpload'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addJob } from '@/redux/jobSlice'

const PostJob = () => {
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
        experience: 0,
        position: 1,
        jobType: 'Job',
        file: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        setFormData(prev => ({ ...prev, file }));
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

            // Explicitly set date for jobs
            payload.append("date", new Date().toISOString().split('T')[0]);

            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Job Posted Successfully!");
                if (res.data.job) dispatch(addJob(res.data.job));
                navigate('/admin/posts');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300 shadow-sm hover:border-gray-200";
    const labelBase = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2";

    return (
        <div className='min-h-screen bg-[#FDFCFE] pb-24'>
            <Navbar />

            <div className='max-w-5xl mx-auto px-4 mt-12'>
                {/* Header Section */}
                <div className='bg-black rounded-[40px] p-10 md:p-14 mb-12 text-white relative overflow-hidden shadow-2xl'>
                    <div className='absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]'></div>
                    <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]'></div>

                    <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-10'>
                        <div className='text-center md:text-left'>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-blue-300 font-bold text-xs uppercase tracking-widest mb-6'
                            >
                                <Sparkles size={14} className='fill-current' /> Talent Acquisition
                            </motion.div>
                            <h1 className='text-4xl md:text-6xl font-black mb-4 tracking-tighter'>Post a New Career Opportunity</h1>
                            <p className='text-gray-400 font-medium text-lg max-w-xl'>Draft a compelling job description and find the perfect match for your organization.</p>
                        </div>
                        <div className='shrink-0 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px]'>
                            <Briefcase size={80} className='text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]' />
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-white/50 p-8 md:p-14'
                >
                    <form onSubmit={handleSubmit} className='space-y-12'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Row 1 */}
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Job Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Lead Software Engineer (React)" required className={inputBase} />
                            </div>

                            {/* Row 2 */}
                            <div>
                                <label className={labelBase}>Company Name</label>
                                <div className='relative'>
                                    <Building2 className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Your Organization" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Work Location</label>
                                <div className='relative'>
                                    <MapPin className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Remote, Mumbai, etc." required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Job Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} placeholder="Describe the role, responsibilities, and team culture..." required className={`${inputBase} resize-none`} />
                            </div>

                            {/* Row 4 */}
                            <div>
                                <label className={labelBase}>Salary Package (LPA)</label>
                                <div className='relative'>
                                    <IndianRupee className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="Example: 12" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Experience Required (Years)</label>
                                <div className='relative'>
                                    <Clock className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0 for Freshers" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div>
                                <label className={labelBase}>Number of Positions</label>
                                <div className='relative'>
                                    <Users className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input type="number" name="position" value={formData.position} onChange={handleInputChange} placeholder="Total openings" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Employment Type</label>
                                <div className='relative'>
                                    <Briefcase className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <select name="jobType" value={formData.jobType} onChange={handleInputChange} className={`${inputBase} pl-12 appearance-none cursor-pointer`}>
                                        <option value="Job">Full-time Job</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 6 */}
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Technical Requirements & Skills</label>
                                <div className='relative'>
                                    <Sparkles className='absolute left-5 top-5 text-gray-300' size={18} />
                                    <input type="text" name="requirements" value={formData.requirements} onChange={handleInputChange} placeholder="React, Tailwind, Node.js (Comma separated)" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            {/* Row 7 */}
                            <div className='md:col-span-2'>
                                <PremiumFileUpload onFileSelect={handleFileSelect} label="Company Logo or Banner" />
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className='pt-12 flex flex-col sm:flex-row items-center gap-6 border-t border-gray-50'>
                            <Button
                                type="submit"
                                disabled={loading}
                                className='w-full sm:flex-1 h-20 text-xl font-black rounded-3xl bg-blue-600 text-white hover:bg-blue-700 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none'
                            >
                                {loading ? (
                                    <div className='flex items-center gap-3'>
                                        <Loader2 className='animate-spin' size={28} />
                                        Publishing...
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-3'>
                                        <CheckCircle2 size={24} />
                                        Publish Opening
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/posts')}
                                className='w-full sm:w-[200px] h-20 rounded-3xl border-gray-100 hover:bg-gray-50 font-black text-gray-400 text-lg'
                            >
                                Exit Editor
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Footer Tips */}
                <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {[
                        { icon: <FileText className='text-blue-500' />, title: 'Clarity Wins', desc: 'Be specific about deliverables to attract quality candidates.' },
                        { icon: <Trophy className='text-amber-500' />, title: 'Fair Pay', desc: 'Competitive salary listings get 3x more applications.' },
                        { icon: <Sparkles className='text-purple-500' />, title: 'Culture Matters', desc: 'Mention perks and your company mission to stand out.' }
                    ].map((tip, i) => (
                        <div key={i} className='bg-white p-6 rounded-[24px] border border-gray-50 shadow-sm flex items-start gap-4'>
                            <div className='p-3 bg-gray-50 rounded-xl'>{tip.icon}</div>
                            <div>
                                <h4 className='font-black text-gray-900 mb-1 text-sm'>{tip.title}</h4>
                                <p className='text-xs text-gray-500 font-medium leading-relaxed'>{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PostJob
