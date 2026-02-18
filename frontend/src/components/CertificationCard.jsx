import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Award, CheckCircle, BookOpen, Clock, Users, Share2, Heart } from 'lucide-react'
import { useSelector } from 'react-redux'

const CertificationCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Assuming cost is stored in salary, 0 means Free
    const cost = job?.salary === 0 ? "Free" : `₹${job?.salary}`;

    return (
        <div onClick={() => navigate(`/description/certification/${job._id}`)} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full group'>
            {/* Header with Pattern/Color */}
            <div className="h-20 bg-emerald-50 relative p-4 flex justify-between items-start">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <Badge className="bg-white/80 text-emerald-800 backdrop-blur-sm border-none shadow-sm z-10 font-semibold">
                    <Award className="w-3 h-3 mr-1 text-emerald-600" /> Certification
                </Badge>
                <Badge className={`${job?.salary === 0 ? 'bg-emerald-500' : 'bg-blue-600'} text-white border-none shadow-sm z-10`}>
                    {cost}
                </Badge>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-3 -mt-10 z-10">
                {/* Logo & Provider */}
                <div className="flex justify-between items-end">
                    <Avatar className="h-16 w-16 rounded-xl border-4 border-white bg-white shadow-md">
                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-lg" />
                        <AvatarFallback className="rounded-lg text-xl bg-gray-100 font-bold text-gray-500">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex gap-2 text-gray-400 mb-2'>
                        <button className='hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors'><Share2 className='w-4 h-4' /></button>
                        <button className='hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors'><Heart className='w-4 h-4' /></button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">{job?.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-1">
                        Provided by <span className='text-gray-900 font-semibold'>{job?.company?.name}</span>
                        <CheckCircle className="w-3 h-3 text-blue-500 ml-0.5 fill-current bg-white rounded-full" />
                    </p>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-2 gap-2 mt-2'>
                    <div className='bg-gray-50 p-2 rounded-lg flex items-center gap-2 text-xs font-medium text-gray-600'>
                        <Clock className='w-3.5 h-3.5 text-gray-400' />
                        {job?.experience ? `${job.experience} Weeks` : 'Self-Paced'}
                    </div>
                    <div className='bg-gray-50 p-2 rounded-lg flex items-center gap-2 text-xs font-medium text-gray-600'>
                        <BookOpen className='w-3.5 h-3.5 text-gray-400' />
                        {job?.location || 'Online'}
                    </div>
                </div>

                {/* Enroll Button */}
                {
                    user?.role === 'recruiter' ? (
                        <></>
                    ) : (
                        <div className="mt-auto pt-2">
                            <button className="w-full py-2.5 border border-emerald-600 text-emerald-700 bg-white rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white">
                                Access Course
                            </button>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default CertificationCard
