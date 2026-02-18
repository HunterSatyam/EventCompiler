import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { PlusCircle, Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const AdminJobs = () => {
    useGetAllAdminJobs();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchedQuery(input));
    }, [input]);

    return (
        <div className="min-h-screen bg-[#F8F9FF]">
            <Navbar />
            <div className='max-w-6xl mx-auto my-12 px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12'
                >
                    <div>
                        <div className='inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4'>
                            <Sparkles size={12} /> Management Portal
                        </div>
                        <h1 className='text-4xl font-black text-gray-900 tracking-tight'>Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600'>Opportunities</span></h1>
                        <p className='text-gray-500 mt-2 font-medium'>Manage and track all your posted jobs, internships, and events.</p>
                    </div>

                    <div className='flex items-center gap-4 w-full md:w-auto'>
                        <div className='relative flex-1 md:w-80'>
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                            <Input
                                className="w-full h-14 bg-white border-none rounded-2xl pl-12 shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500/20"
                                placeholder="Filter by title or company..."
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => navigate("/admin/create")}
                            className="h-14 px-8 rounded-2xl bg-black text-white hover:bg-gray-900 shadow-xl font-bold flex items-center gap-2 transition-all active:scale-95"
                        >
                            <PlusCircle size={20} />
                            <span>New Post</span>
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <AdminJobsTable />
                </motion.div>
            </div>
        </div>
    )
}

export default AdminJobs
