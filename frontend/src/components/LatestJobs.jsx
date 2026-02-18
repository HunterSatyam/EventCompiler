import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import JobCard from './JobCard';
import { useNavigate } from 'react-router-dom';
import { setFilters } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className='max-w-7xl mx-auto my-32 px-4'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-12'>
                <div className='space-y-4'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-[0.2em] text-[10px] font-black'>
                        <Sparkles size={12} />
                        New Opportunities
                    </div>
                    <h1 className='text-5xl font-black text-gray-900 leading-tight'>
                        Featured <span className='text-purple-600'>Job Openings</span>
                    </h1>
                    <p className='text-gray-500 font-medium max-w-lg'>
                        Handpicked career opportunities from industry leaders and innovative startups.
                    </p>
                </div>

                <button
                    onClick={() => {
                        dispatch(setFilters({ type: 'Jobs' }));
                        navigate("/events");
                    }}
                    className='bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 shadow-xl transition-all active:scale-95 flex items-center gap-2'
                >
                    View All Jobs <ArrowRight size={16} />
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-5'>
                {
                    allJobs.length <= 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                            <span className="text-gray-400 text-lg font-bold uppercase tracking-widest">No Jobs Available Currently</span>
                        </div>
                    ) : (
                        allJobs?.filter(job => job.jobType === 'Job').slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <JobCard job={job} />
                            </motion.div>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs