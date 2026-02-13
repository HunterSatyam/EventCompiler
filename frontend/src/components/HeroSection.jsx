
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Briefcase, GraduationCap, Trophy, Code, Video, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import CategoryCarousel from './CategoryCarousel';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate(`/browse?query=${query}`);
    }

    const categories = [
        { title: "Internships", icon: <GraduationCap className="w-8 h-8 text-blue-500" />, query: "Internship" },
        { title: "Jobs", icon: <Briefcase className="w-8 h-8 text-purple-500" />, query: "Job" },
        { title: "Hackathons", icon: <Code className="w-8 h-8 text-green-500" />, query: "Hackathon" },
        { title: "Competitions", icon: <Trophy className="w-8 h-8 text-yellow-500" />, query: "Competition" },
        { title: "Webinars", icon: <Video className="w-8 h-8 text-red-500" />, query: "Webinar" },
        { title: "Certifications", icon: <Award className="w-8 h-8 text-orange-500" />, query: "Certification" },
    ];


    return (
        <div className='text-center py-8 bg-gradient-to-b from-white to-gray-50'>
            <div className='flex flex-col gap-6 my-4 max-w-4xl mx-auto'>
                <span className='mx-auto px-6 py-2 rounded-full bg-[#6A38C2]/10 text-[#6A38C2] font-semibold border border-[#6A38C2]/20 tracking-wide'>
                    All Events at one Place
                </span>
                <h1 className='text-6xl font-extrabold leading-tight text-gray-900'>
                    Search, Apply & <br /> Get Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>Dream Career</span>
                </h1>
                <p className='text-lg text-gray-600 mb-6'>
                    Find the best match according to your skills and aspirations. Explore jobs, internships, hackathons, and more.
                </p>
                <div className='flex w-full max-w-2xl shadow-xl border border-gray-100 pl-4 pr-1 py-1 rounded-full items-center gap-4 mx-auto bg-white transition-all hover:shadow-2xl hover:border-[#6A38C2]/30'>
                    <input
                        type="text"
                        placeholder='Search for jobs, events, or companies...'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full pl-2 text-lg text-gray-700 placeholder-gray-400 bg-transparent py-3'
                    />
                    <Button onClick={searchJobHandler} className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] h-12 w-12 flex items-center justify-center transition-all duration-300">
                        <Search className='h-6 w-6 text-white' />
                    </Button>
                </div>

                {/* Category Carousel */}
                <div className='w-full max-w-4xl mx-auto'>
                    <CategoryCarousel />
                </div>

                {/* Category Buttons */}
                <div className='w-full max-w-5xl mx-auto mt-12'>
                    <div className='flex flex-wrap justify-center gap-6'>
                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    dispatch(setSearchedQuery(cat.query));
                                    navigate(`/browse?query=${cat.query}`);
                                }}
                                className='flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer min-w-[120px] border border-gray-100'
                            >
                                <div className={`p-3 rounded-full bg-gray-50 group-hover:bg-[#6A38C2]/10 transition-colors`}>
                                    {cat.icon}
                                </div>
                                <span className='font-semibold text-gray-700'>{cat.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
