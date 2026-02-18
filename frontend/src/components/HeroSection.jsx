import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Briefcase, GraduationCap, Trophy, Code, Video, Award, Sparkles, MoveRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import CategoryCarousel from './CategoryCarousel';
import { motion } from 'framer-motion'

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate(`/browse?query=${query}`);
    }

    const categories = [
        { title: "Internships", icon: <GraduationCap className="w-8 h-8" />, query: "Internship", color: "blue" },
        { title: "Jobs", icon: <Briefcase className="w-8 h-8" />, query: "Job", color: "purple" },
        { title: "Hackathons", icon: <Code className="w-8 h-8" />, query: "Hackathon", color: "emerald" },
        { title: "Competitions", icon: <Trophy className="w-8 h-8" />, query: "Competition", color: "amber" },
        { title: "Webinars", icon: <Video className="w-8 h-8" />, query: "Webinar", color: "rose" },
        { title: "Certifications", icon: <Award className="w-8 h-8" />, query: "Certification", color: "indigo" },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className='relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#F8F9FF] py-20'>
            {/* Background Decorative Elements */}
            <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10'>
                <div className='absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob'></div>
                <div className='absolute top-[10%] -right-[10%] w-[35%] h-[35%] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000'></div>
                <div className='absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-pink-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000'></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='container mx-auto px-4 text-center z-10'
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className='inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white shadow-xl shadow-purple-100/50 border border-purple-50 mb-8 cursor-default group hover:scale-105 transition-transform'>
                    <div className='p-1 bg-purple-600 rounded-full text-white'>
                        <Sparkles size={12} />
                    </div>
                    <span className='text-[10px] uppercase tracking-[0.2em] font-black text-purple-600'>Unlock Your Future Potential</span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1 variants={itemVariants} className='text-6xl md:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight mb-8'>
                    The Global <br />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 underline decoration-purple-200 decoration-8 underline-offset-[12px]'>Career Compass</span>
                </motion.h1>

                <motion.p variants={itemVariants} className='max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12'>
                    Discover high-impact opportunities in tech, engineering, and creative fields. Connect with world-class companies and scale your career.
                </motion.p>

                {/* Search Bar */}
                <motion.div variants={itemVariants} className='relative max-w-3xl mx-auto mb-20'>
                    <div className='absolute inset-0 bg-purple-600 blur-[32px] opacity-10 -z-10'></div>
                    <div className='flex items-center gap-4 bg-white p-2 md:p-3 rounded-[32px] shadow-2xl shadow-purple-100 border border-white'>
                        <div className='flex-1 flex items-center gap-4 px-6'>
                            <Search className='text-gray-300' size={24} />
                            <input
                                type="text"
                                placeholder="Search roles, skills, or companies..."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                                className="w-full h-12 bg-transparent border-none outline-none text-gray-900 font-bold placeholder:text-gray-300 text-lg"
                            />
                        </div>
                        <Button
                            onClick={searchJobHandler}
                            className="bg-black hover:bg-gray-900 text-white rounded-2xl px-10 h-14 font-black transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                        >
                            Explore <MoveRight className='group-hover:translate-x-1 transition-transform' size={18} />
                        </Button>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div variants={itemVariants} className='max-w-6xl mx-auto'>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                        {categories.map((cat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => {
                                    dispatch(setSearchedQuery(cat.query));
                                    navigate(`/browse?query=${cat.query}`);
                                }}
                                className='group relative flex flex-col items-center gap-4 p-6 bg-white rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100 border border-gray-50 transition-all cursor-pointer'
                            >
                                <div className={`p-4 rounded-2xl bg-${cat.color}-50 text-${cat.color}-600 transition-colors group-hover:bg-gray-900 group-hover:text-white`}>
                                    {cat.icon}
                                </div>
                                <span className='font-black text-[11px] uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors'>{cat.title}</span>
                                <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <MoveRight size={14} className='text-purple-600' />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default HeroSection

