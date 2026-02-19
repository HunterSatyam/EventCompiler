import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Briefcase, MapPin, Clock, IndianRupee, GraduationCap, Share2, Heart, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import LikeButton from './shared/LikeButton'

const InternshipCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Calculate duration - using experience field as months
    const duration = job?.experience ? `${job.experience} Months` : '3-6 Months';
    const stipend = job?.salary ? `₹${job.salary}k/month` : 'Unpaid';

    return (
        <div onClick={() => navigate(`/description/internship/${job._id}`)} className='group bg-white rounded-[24px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-cyan-200/50 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className="absolute top-4 right-4 z-20">
                <LikeButton eventId={job._id} eventType="Internship" />
            </div>
            <div className="h-28 bg-gradient-to-r from-cyan-500 to-blue-600 relative p-6 flex justify-between items-start overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-white/20 text-white backdrop-blur-md border-none px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10">
                    <div className='flex items-center gap-1.5'>
                        <Briefcase size={12} />
                        Internship
                    </div>
                </Badge>

            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white shadow-lg border border-gray-100 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-cyan-50 text-cyan-600 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 leading-tight group-hover:text-cyan-600 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-1">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className='p-2 bg-blue-50 rounded-xl text-blue-600'>
                            <MapPin size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Location</p>
                            <p className='text-xs font-bold text-gray-900 truncate max-w-[80px]'>{job?.location || "Remote"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className='p-2 bg-cyan-50 rounded-xl text-cyan-600'>
                            <IndianRupee size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Stipend</p>
                            <p className='text-xs font-bold text-gray-900'>{stipend}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                {
                    user?.role === 'recruiter' ? (
                        <></>
                    ) : (
                        <div className="mt-auto pt-2">
                            <button className="w-full h-12 bg-cyan-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg hover:shadow-cyan-200 flex items-center justify-center gap-2 group/btn">
                                Apply Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default InternshipCard
