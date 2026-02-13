import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Briefcase, MapPin, Clock, IndianRupee, GraduationCap, Share2, Heart, ArrowRight } from 'lucide-react'

const InternshipCard = ({ job }) => {
    const navigate = useNavigate();

    if (!job) return null;

    // Calculate duration - using experience field as months
    const duration = job?.experience ? `${job.experience} Months` : '3-6 Months';
    const stipend = job?.salary ? `₹${job.salary}k/month` : 'Unpaid';

    return (
        <div onClick={() => navigate(`/description/${job._id}`)} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer flex flex-col h-full group'>
            {/* Header with light gradient */}
            <div className="h-16 bg-gradient-to-r from-purple-50 to-pink-50 relative p-4 flex justify-between items-center border-b border-purple-100">
                <Badge className="bg-white text-purple-600 border border-purple-200 shadow-sm font-semibold text-xs">
                    <Briefcase className="w-3 h-3 mr-1" /> Internship
                </Badge>
                <div className='flex gap-2 text-gray-400'>
                    <button className='hover:text-purple-500 p-1.5 rounded-full hover:bg-purple-50 transition-colors'>
                        <Share2 className='w-3.5 h-3.5' />
                    </button>
                    <button className='hover:text-pink-500 p-1.5 rounded-full hover:bg-pink-50 transition-colors'>
                        <Heart className='w-3.5 h-3.5' />
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-3">
                {/* Logo & Company */}
                <div className="flex items-start gap-3 -mt-10">
                    <Avatar className="h-14 w-14 rounded-lg border-4 border-white bg-white shadow-md">
                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-md p-1" />
                        <AvatarFallback className="rounded-md text-lg bg-gradient-to-br from-purple-50 to-pink-50 font-bold text-purple-600">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 mt-8">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">{job?.title}</h3>
                        <p className="text-sm text-gray-600 font-medium mt-0.5">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Meta Info Grid */}
                <div className='grid grid-cols-2 gap-2 mt-1'>
                    <div className='flex items-center gap-1.5 text-xs text-gray-600'>
                        <MapPin className='w-3.5 h-3.5 text-gray-400' />
                        <span className='font-medium truncate'>{job?.location || "Remote"}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-xs text-gray-600'>
                        <Clock className='w-3.5 h-3.5 text-gray-400' />
                        <span className='font-medium'>{duration}</span>
                    </div>
                </div>

                {/* Stipend Badge */}
                <div className='flex items-center gap-2 mt-1'>
                    <div className='flex items-center gap-1.5 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200 flex-1'>
                        <IndianRupee className='w-4 h-4 text-purple-500' />
                        <span className='text-sm font-bold text-purple-600'>{stipend}</span>
                    </div>
                    {job?.position && (
                        <div className='flex items-center gap-1 bg-gray-50 px-2.5 py-2 rounded-lg border border-gray-200'>
                            <GraduationCap className='w-3.5 h-3.5 text-gray-500' />
                            <span className='text-xs font-semibold text-gray-600'>{job.position} {job.position === 1 ? 'Spot' : 'Spots'}</span>
                        </div>
                    )}
                </div>

                {/* Description Preview */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {job?.description || "Gain hands-on experience and learn from industry experts"}
                </p>

                {/* Apply Button */}
                <div className="mt-auto pt-2">
                    <button className="w-full py-2.5 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 group-hover:shadow-md">
                        Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InternshipCard
