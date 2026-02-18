import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    JOB_API_END_POINT,
    INTERNSHIP_API_END_POINT,
    HACKATHON_API_END_POINT,
    WEBINAR_API_END_POINT,
    COMPETITION_API_END_POINT,
    CERTIFICATION_API_END_POINT,
    APPLICATION_API_END_POINT
} from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import Navbar from './shared/Navbar'
import {
    Calendar, MapPin, Briefcase, IndianRupee, Users, ArrowLeft,
    Building2, CheckCircle2, Clock, Trophy, Video, GraduationCap,
    Award, Link as LinkIcon, FileText, Info, Share2, Bookmark,
    Sparkles, Zap, ShieldCheck, ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DescriptionPage = () => {
    const { type, id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const getApiEndpoint = () => {
        switch (type) {
            case 'job': return JOB_API_END_POINT;
            case 'internship': return INTERNSHIP_API_END_POINT;
            case 'hackathon': return HACKATHON_API_END_POINT;
            case 'webinar': return WEBINAR_API_END_POINT;
            case 'competition': return COMPETITION_API_END_POINT;
            case 'certification': return CERTIFICATION_API_END_POINT;
            default: return JOB_API_END_POINT;
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${getApiEndpoint()}/get/${id}`, { withCredentials: true });
                if (res.data.success) {
                    const key = type === 'webinar' ? 'webinar' : type;
                    setData(res.data[key] || res.data.job || res.data.internship || res.data.hackathon || res.data.webinar || res.data.competition || res.data.certification);
                }
            } catch (error) {
                console.error(error);
                toast.error(`Failed to fetch ${type} details`);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id, type]);

    const isApplied = data?.applications?.some(app => app.applicant === user?._id || app === user?._id) || false;

    const applyHandler = async () => {
        if (!user) {
            toast.error("Please login to apply");
            navigate('/login');
            return;
        }
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${id}?type=${type}`, { withCredentials: true });
            if (res.data.success) {
                setData({ ...data, applications: [...(data.applications || []), user._id] });
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-[#F8F9FF]'>
                <div className='relative'>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className='w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full'
                    />
                    <div className='mt-4 text-purple-600 font-bold animate-pulse'>Loading Excellence...</div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='flex flex-col items-center justify-center h-screen bg-[#F8F9FF]'>
                <Info size={80} className='text-purple-200 mb-6' />
                <h2 className='text-3xl font-black text-gray-800'>Opportunity not found</h2>
                <p className='text-gray-500 mt-2 mb-8'>It might have been removed or the link is broken.</p>
                <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full px-8 py-6 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all font-bold">
                    Go Back Home
                </Button>
            </div>
        );
    }

    const renderBadges = () => {
        const badgeStyle = "px-4 py-2 text-sm font-bold rounded-xl border-none shadow-sm transition-transform hover:scale-105";
        switch (type) {
            case 'job':
                return (
                    <>
                        <Badge className={`${badgeStyle} bg-blue-100 text-blue-700`}>
                            {data?.position} Openings
                        </Badge>
                        <Badge className={`${badgeStyle} bg-red-100 text-[#F83002]`}>
                            {data?.jobType || 'Full Time'}
                        </Badge>
                        <Badge className={`${badgeStyle} bg-purple-100 text-purple-700`}>
                            {data?.salary} LPA
                        </Badge>
                    </>
                );
            case 'internship':
                return (
                    <>
                        <Badge className={`${badgeStyle} bg-emerald-100 text-emerald-700`}>
                            {data?.duration} Months
                        </Badge>
                        <Badge className={`${badgeStyle} bg-blue-100 text-blue-700`}>
                            {data?.position} Spots
                        </Badge>
                        <Badge className={`${badgeStyle} bg-purple-100 text-purple-700`}>
                            ₹{data?.stipend}k/mo
                        </Badge>
                    </>
                );
            case 'hackathon':
            case 'competition':
                return (
                    <>
                        <Badge className={`${badgeStyle} bg-amber-100 text-amber-700`}>
                            <Trophy size={14} className="mr-1 inline" /> {data?.prize} Prize
                        </Badge>
                        <Badge className={`${badgeStyle} bg-indigo-100 text-indigo-700`}>
                            {data?.teamSize || 'Solo/Team'}
                        </Badge>
                    </>
                );
            case 'webinar':
                return (
                    <>
                        <Badge className={`${badgeStyle} bg-orange-100 text-orange-700`}>
                            {data?.fee === 0 ? 'FREE' : `₹${data?.fee}`}
                        </Badge>
                        <Badge className={`${badgeStyle} bg-blue-100 text-blue-700`}>
                            {data?.duration} Hours
                        </Badge>
                    </>
                );
            case 'certification':
                return (
                    <>
                        <Badge className={`${badgeStyle} bg-blue-100 text-blue-700`}>
                            {data?.level} Level
                        </Badge>
                        <Badge className={`${badgeStyle} bg-purple-100 text-purple-700`}>
                            {data?.fee === 0 ? 'FREE' : `₹${data?.fee}`}
                        </Badge>
                    </>
                );
            default: return null;
        }
    }

    const renderSidebarDetails = () => {
        const items = [];
        items.push({ icon: <MapPin size={22} />, label: 'Location', value: data?.location || 'Remote', color: 'purple' });

        if (type === 'job') {
            const exp = data?.experienceLevel === 0 ? 'Fresher' : `${data?.experienceLevel} Years`;
            items.push({ icon: <Clock size={22} />, label: 'Experience', value: exp, color: 'blue' });
            items.push({ icon: <Briefcase size={22} />, label: 'Job Category', value: data?.jobType || 'Full-time', color: 'indigo' });
        } else if (type === 'internship') {
            items.push({ icon: <Calendar size={22} />, label: 'Duration', value: `${data?.duration} Months`, color: 'blue' });
            items.push({ icon: <IndianRupee size={22} />, label: 'Stipend', value: `₹${data?.stipend}k/mo`, color: 'emerald' });
        } else if (type === 'hackathon') {
            items.push({ icon: <Trophy size={22} />, label: 'Prize Pool', value: data?.prize, color: 'amber' });
            items.push({ icon: <Calendar size={22} />, label: 'Event Date', value: data?.date, color: 'indigo' });
        } else if (type === 'webinar') {
            items.push({ icon: <Calendar size={22} />, label: 'Session Date', value: data?.date, color: 'indigo' });
            items.push({ icon: <Clock size={22} />, label: 'Time', value: data?.time, color: 'blue' });
            items.push({ icon: <Users size={22} />, label: 'Speaker', value: data?.speaker, color: 'orange' });
        } else if (type === 'competition') {
            items.push({ icon: <Calendar size={22} />, label: 'Event Date', value: data?.eventDate, color: 'indigo' });
            items.push({ icon: <Trophy size={22} />, label: 'Top Prize', value: data?.prize, color: 'amber' });
        } else if (type === 'certification') {
            items.push({ icon: <Award size={22} />, label: 'Accreditation', value: data?.level, color: 'purple' });
            items.push({ icon: <Clock size={22} />, label: 'Access', value: data?.duration, color: 'blue' });
        }

        items.push({ icon: <ShieldCheck size={22} />, label: 'Verified Post', value: data?.createdAt?.split("T")[0], color: 'emerald' });

        return items.map((item, idx) => (
            <div key={idx} className='flex items-center gap-4 group'>
                <div className={`p-3 bg-${item.color}-50 rounded-2xl text-${item.color === 'purple' ? 'purple-600' : item.color === 'emerald' ? 'emerald-600' : item.color === 'amber' ? 'amber-600' : item.color === 'blue' ? 'blue-600' : item.color === 'indigo' ? 'indigo-600' : 'gray-600'} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                </div>
                <div>
                    <p className='text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]'>{item.label}</p>
                    <p className='text-base font-bold text-gray-800'>{item.value}</p>
                </div>
            </div>
        ));
    }

    return (
        <div className='min-h-screen bg-[#F8F9FF] pb-24 selection:bg-purple-100 selection:text-purple-900'>
            <Navbar />

            {/* Elegant Header Background */}
            <div className='absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-50/50 to-transparent -z-10'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12'>
                {/* Navigation & Actions */}
                <div className='flex items-center justify-between mb-10'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-3 text-gray-500 hover:text-purple-600 transition-all font-bold group'
                    >
                        <div className='p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-purple-200 group-hover:shadow-md transition-all'>
                            <ArrowLeft size={20} className='group-hover:-translate-x-1 transition-transform' />
                        </div>
                        <span className='text-sm'>Back to Explore</span>
                    </button>
                    <div className='flex items-center gap-3'>
                        <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-white hover:shadow-md p-3">
                            <Share2 size={20} className='text-gray-500' />
                        </Button>
                        <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-white hover:shadow-md p-3">
                            <Bookmark size={20} className='text-gray-500' />
                        </Button>
                    </div>
                </div>

                {/* Hero Section - Premium Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/50 p-8 md:p-12 mb-12 relative overflow-hidden backdrop-blur-sm'
                >
                    {/* Abstract Shapes for Modern Look */}
                    <div className='absolute -top-24 -right-24 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl opacity-60'></div>
                    <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-60'></div>

                    <div className='relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10'>
                        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left'>
                            <div className='w-32 h-32 bg-white rounded-3xl flex items-center justify-center p-6 shadow-[0_12px_24px_rgba(0,0,0,0.06)] border border-gray-50 shrink-0 relative'>
                                {data?.logo || data?.company?.logo ? (
                                    <img src={data?.logo || data?.company?.logo} alt="Logo" className='w-full h-full object-contain' />
                                ) : (
                                    <div className='text-purple-500'>
                                        {type === 'webinar' ? <Video size={60} /> :
                                            type === 'certification' ? <GraduationCap size={60} /> :
                                                <Building2 size={60} />}
                                    </div>
                                )}
                                <div className='absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg border-2 border-white shadow-sm'>
                                    <ShieldCheck size={14} />
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div className='flex flex-wrap justify-center md:justify-start gap-3 items-center'>
                                    <span className='px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100'>
                                        {type === 'webinar' ? 'Live Session' : type === 'certification' ? 'Program' : 'Opportunity'}
                                    </span>
                                    {data?.isNew && <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none text-[10px]">NEW</Badge>}
                                </div>
                                <h1 className='text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight'>
                                    {data?.title}
                                </h1>
                                <p className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center md:justify-start gap-2'>
                                    {data?.company?.name || data?.provider || data?.companyName || "Organization"}
                                    <ExternalLink size={18} className='text-gray-300' />
                                </p>
                                <div className='flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4'>
                                    {renderBadges()}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col items-center gap-5 min-w-[280px] w-full lg:w-auto'>
                            {user?.role !== 'recruiter' && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='w-full'>
                                    <Button
                                        onClick={isApplied ? null : applyHandler}
                                        disabled={isApplied}
                                        className={`w-full py-10 text-xl font-black rounded-3xl transition-all shadow-xl hover:shadow-2xl overflow-hidden relative group ${isApplied
                                            ? 'bg-emerald-500 text-white cursor-not-allowed border-none'
                                            : 'bg-black text-white hover:bg-gray-900 border-none'
                                            }`}
                                    >
                                        {!isApplied && (
                                            <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                                        )}
                                        <div className='relative z-10 flex items-center justify-center gap-3'>
                                            {isApplied ? (
                                                <>
                                                    <CheckCircle2 size={32} />
                                                    <span>{type === 'job' || type === 'internship' ? 'Already Applied' : 'Already Registered'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap size={24} className='fill-current' />
                                                    <span>{type === 'job' || type === 'internship' ? 'Apply Now' : 'Secure Spot'}</span>
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                </motion.div>
                            )}
                            <div className='flex items-center gap-2 bg-gray-50 px-6 py-2.5 rounded-full border border-gray-100'>
                                <Users size={16} className='text-purple-600' />
                                <span className='text-sm text-gray-500 font-bold'>
                                    <span className='text-gray-900'>{data?.applications?.length || 0}</span> people have already applied
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                    {/* Left Side - Detailed Info */}
                    <div className='lg:col-span-2 space-y-12'>
                        {/* Description Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className='bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100/50 p-10 md:p-14 relative'
                        >
                            <div className='flex items-center gap-4 mb-10'>
                                <div className='p-3 bg-purple-50 rounded-2xl text-purple-600'>
                                    <FileText size={28} />
                                </div>
                                <h2 className='text-3xl font-black text-gray-900'>
                                    {type === 'webinar' ? 'Session Overview' : type === 'certification' ? 'Program Details' : 'Description'}
                                </h2>
                            </div>
                            <div className='text-gray-600 leading-[1.8] text-lg lg:text-xl whitespace-pre-wrap font-medium'>
                                {data?.description || "No detailed description provided."}
                            </div>

                            {/* Rules for Specific Event Types */}
                            {type === 'competition' && data?.rules && (
                                <div className='mt-12 pt-10 border-t border-gray-50'>
                                    <h3 className='text-2xl font-black text-gray-900 mb-6 flex items-center gap-3'>
                                        <Sparkles size={24} className='text-amber-500' /> Guidelines
                                    </h3>
                                    <div className='bg-amber-50/50 p-8 rounded-3xl border border-amber-100/50 text-gray-700 leading-relaxed font-medium'>
                                        {data.rules}
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Skills/Requirements - Modern Grid */}
                        {((data?.requirements && data.requirements.length > 0) || (data?.skills && data.skills.length > 0)) && (
                            <motion.section
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className='bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100/50 p-10 md:p-14'
                            >
                                <div className='flex items-center gap-4 mb-10'>
                                    <div className='p-3 bg-blue-50 rounded-2xl text-blue-600'>
                                        <Award size={28} />
                                    </div>
                                    <h2 className='text-3xl font-black text-gray-900'>
                                        {type === 'certification' ? 'Skills You Master' : 'Requirements'}
                                    </h2>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {(data?.skills ? (Array.isArray(data.skills) ? data.skills : data.skills.split(',')) : (Array.isArray(data.requirements) ? data.requirements : data.requirements.split(','))).map((item, idx) => (
                                        <div key={idx} className='flex items-center gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-purple-100 group'>
                                            <div className='w-2 h-2 rounded-full bg-purple-400 group-hover:scale-150 transition-transform'></div>
                                            <span className='font-bold text-gray-700'>{item.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Webinar Join UI */}
                        {type === 'webinar' && data?.meetingLink && isApplied && (
                            <motion.section
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className='bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] p-10 md:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative'
                            >
                                <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32'></div>
                                <div className='relative z-10 space-y-4'>
                                    <h2 className='text-4xl font-black flex items-center gap-4'>
                                        <Video size={40} />
                                        You're Ready!
                                    </h2>
                                    <p className='text-emerald-50 font-bold text-lg max-w-md'>
                                        The webinar link is now accessible. Make sure to join 5 minutes before the session starts.
                                    </p>
                                </div>
                                <a
                                    href={data.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='relative z-10 inline-flex items-center gap-3 bg-white text-emerald-600 px-10 py-5 rounded-[24px] font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xl'
                                >
                                    Join Now <ExternalLink size={24} />
                                </a>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Side - Sidebar */}
                    <div className='space-y-10'>
                        {/* Quick Specs */}
                        <section className='bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100/50 p-10'>
                            <h2 className='text-xl font-black text-gray-900 mb-10 tracking-tight'>Quick Overview</h2>
                            <div className='space-y-8'>
                                {renderSidebarDetails()}
                            </div>
                        </section>

                        {/* Agency/Provider Section */}
                        {(data?.company || data?.provider || data?.companyName) && (
                            <section className='bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100/50 p-8'>
                                <h2 className='text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8'>Organized By</h2>
                                <div className='flex items-center gap-5 mb-8'>
                                    <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden'>
                                        {data?.company?.logo || data?.logo ? (
                                            <img src={data?.company?.logo || data?.logo} alt="Logo" className='w-full h-full object-contain p-3' />
                                        ) : (
                                            <Building2 className='text-gray-300' size={32} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className='font-black text-gray-900 text-lg'>{data?.company?.name || data?.provider || data?.companyName || "Organization"}</h3>
                                        <p className='text-sm text-gray-500 font-bold flex items-center gap-1'>
                                            <MapPin size={12} /> {data?.company?.location || data?.location || "Global Headquarters"}
                                        </p>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-500 font-medium leading-relaxed mb-8'>
                                    {data?.company?.description || "A premier organization dedicated to fostering talent and providing world-class opportunities for students and professionals globally."}
                                </p>
                                <Button variant="outline" className="w-full rounded-2xl py-6 border-gray-100 hover:bg-gray-50 font-black text-gray-700 transition-all">
                                    Full Profile
                                </Button>
                            </section>
                        )}

                        {/* Tips & Growth */}
                        <div className='bg-black rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden group'>
                            <div className='absolute -bottom-10 -right-10 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl group-hover:bg-purple-600/50 transition-all'></div>
                            <div className='relative z-10'>
                                <div className='w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6'>
                                    <Sparkles className='text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400' />
                                </div>
                                <h2 className='text-3xl font-black mb-6 italic tracking-tighter'>Expert Insight</h2>
                                <p className='text-gray-400 leading-relaxed text-lg font-bold'>
                                    {type === 'job' || type === 'internship'
                                        ? "Candidates who tailor their resumes to match these specific requirements have a 65% higher response rate."
                                        : type === 'hackathon' || type === 'competition'
                                            ? "The most successful teams often combine strong technical skills with creative storytelling in their final submission."
                                            : "Taking notes during this session and implementing one key takeaway immediately will solidify your learning by 90%."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DescriptionPage
