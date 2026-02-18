import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Briefcase, GraduationCap, MapPin, Globe, FileText, Sparkles, LogOut } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import RecruiterApplicationsTable from './RecruiterApplicationsTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import useGetRecruiterApplications from '@/hooks/useGetRecruiterApplications'
import { motion } from 'framer-motion'

const Profile = () => {
    useGetAppliedJobs();
    useGetRecruiterApplications();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const isResume = user?.profile?.resume;

    return (
        <div className="min-h-screen bg-[#F8F9FF]">
            <Navbar />

            {/* Header / Cover Section */}
            <div className='relative h-64 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 overflow-hidden'>
                <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2'></div>
                    <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2'></div>
                </div>
                <div className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8F9FF] to-transparent'></div>
            </div>

            <div className='max-w-6xl mx-auto px-4 -mt-32 relative z-10 pb-20'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='lg:col-span-1'
                    >
                        <div className='bg-white rounded-[32px] p-8 shadow-xl shadow-purple-100/50 border border-white sticky top-24'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='relative group'>
                                    <div className='absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-[32px] blur-lg opacity-20 group-hover:opacity-40 transition-opacity'></div>
                                    <Avatar className="h-32 w-32 rounded-[28px] border-4 border-white shadow-xl relative">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        <AvatarFallback className="bg-purple-50 text-purple-600 text-3xl font-black">{user?.fullname?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        size="icon"
                                        className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl shadow-lg border border-gray-100 transition-transform hover:scale-110"
                                    >
                                        <Pen size={16} />
                                    </Button>
                                </div>

                                <div className='mt-6'>
                                    <h1 className='text-3xl font-black text-gray-900 tracking-tight'>{user?.fullname}</h1>
                                    <div className='flex items-center justify-center gap-1.5 mt-2 text-purple-600 font-bold uppercase tracking-widest text-[10px] bg-purple-50 px-3 py-1 rounded-full'>
                                        <Sparkles size={12} />
                                        {user?.role === 'recruiter' ? 'Recruiter' : 'Student Professional'}
                                    </div>
                                    <p className='mt-4 text-gray-500 font-medium leading-relaxed'>{user?.profile?.bio || "No bio added yet."}</p>
                                </div>
                            </div>

                            <div className='mt-10 space-y-4 pt-8 border-t border-gray-50'>
                                <div className='flex items-center gap-4 group cursor-pointer'>
                                    <div className='p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors'>
                                        <Mail size={20} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Email Address</span>
                                        <span className='text-gray-900 font-bold truncate max-w-[200px]'>{user?.email}</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 group cursor-pointer'>
                                    <div className='p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors'>
                                        <Contact size={20} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Phone Number</span>
                                        <span className='text-gray-900 font-bold'>{user?.phoneNumber || 'Not provided'}</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 group cursor-pointer'>
                                    <div className='p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors'>
                                        <MapPin size={20} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Location</span>
                                        <span className='text-gray-900 font-bold'>India, Remote</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Details & Activity */}
                    <div className='lg:col-span-2 space-y-8'>

                        {/* Summary / About Info (Student Only) */}
                        {user?.role !== 'recruiter' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className='bg-white rounded-[32px] p-8 shadow-xl shadow-purple-100/50 border border-white'
                            >
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='p-2 bg-indigo-50 rounded-xl text-indigo-600 font-black'>
                                        <FileText size={20} />
                                    </div>
                                    <h2 className='text-xl font-black text-gray-900'>Professional Summary</h2>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                    <div className='space-y-6'>
                                        <div>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block'>Technical Skills</label>
                                            <div className='flex flex-wrap gap-2'>
                                                {
                                                    user?.profile?.skills?.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                                        <Badge key={index} className="bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600 border-gray-100 px-4 py-2 rounded-xl transition-all shadow-none font-bold">
                                                            {item}
                                                        </Badge>
                                                    )) : <span className="text-gray-400 font-medium italic">No skills listed</span>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block'>Resume Attachment</label>
                                        <div className='mt-2'>
                                            {
                                                isResume ? (
                                                    <a target='blank' href={user?.profile?.resume} className='flex items-center gap-4 bg-gray-50 p-4 rounded-[20px] group hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100'>
                                                        <div className='h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform'>
                                                            <FileText size={24} />
                                                        </div>
                                                        <div className='flex flex-col min-w-0'>
                                                            <span className='text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors'>{user?.profile?.resumeOriginalName}</span>
                                                            <span className='text-xs text-gray-400 font-black uppercase tracking-widest mt-0.5'>PDF Document • Digital Signature</span>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className='p-6 border-2 border-dashed border-gray-100 rounded-[28px] text-center'>
                                                        <p className='text-gray-400 font-medium'>No resume uploaded yet</p>
                                                        <Button variant="link" onClick={() => setOpen(true)} className="text-purple-600 font-black text-xs uppercase tracking-widest mt-2 p-0 h-auto">Upload Now</Button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Tables Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className='bg-white rounded-[32px] p-2 shadow-xl shadow-purple-100/50 border border-white overflow-hidden'
                        >
                            <div className='p-8 pb-4 flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-2 bg-emerald-50 rounded-xl text-emerald-600'>
                                        <Briefcase size={20} />
                                    </div>
                                    <h2 className='text-xl font-black text-gray-900'>
                                        {user?.role === 'recruiter' ? 'Applications Received' : 'Applications Sent'}
                                    </h2>
                                </div>
                                <Badge className="bg-gray-900 text-white border-0 font-black px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">
                                    Recent Activity
                                </Badge>
                            </div>

                            <div className='px-4 pb-4'>
                                {user?.role === 'recruiter' ? <RecruiterApplicationsTable /> : <AppliedJobTable />}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile