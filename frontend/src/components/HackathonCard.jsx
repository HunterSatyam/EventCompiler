import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Code2, Calendar, MapPin, Trophy, Users, Zap, Share2, Heart } from 'lucide-react'

const HackathonCard = ({ job }) => {
    const navigate = useNavigate();

    if (!job) return null;

    // Format date
    const hackathonDate = job?.date ? new Date(job.date) : null;
    const dateString = hackathonDate ? hackathonDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA';

    const prize = job?.prize || 'To be announced';

    return (
        <div onClick={() => navigate(`/description/${job._id}`)} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer flex flex-col h-full group'>
            {/* Header with accent - dark gradient */}
            <div className="h-2 bg-gradient-to-r from-slate-700 via-blue-600 to-slate-700"></div>

            <div className="p-5 flex flex-col flex-1 gap-3">
                {/* Logo & Title */}
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 rounded-lg border-2 border-slate-300 bg-white">
                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-md p-1.5" />
                        <AvatarFallback className="rounded-md text-base bg-gradient-to-br from-slate-100 to-blue-50 font-bold text-slate-700">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <Badge className="bg-slate-100 text-slate-700 border-slate-300 mb-1.5 text-xs font-semibold">
                            <Code2 className="w-3 h-3 mr-1" /> Hackathon
                        </Badge>
                        <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{job?.title}</h3>
                        <p className="text-sm text-gray-600 font-medium mt-0.5">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Date & Location */}
                <div className='flex flex-wrap gap-2'>
                    <div className='flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-md text-xs font-medium text-blue-700 border border-blue-200'>
                        <Calendar className='w-3.5 h-3.5' />
                        {dateString}
                    </div>
                    <div className='flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 border border-slate-300'>
                        <MapPin className='w-3.5 h-3.5 text-slate-500' />
                        {job?.location || "Online"}
                    </div>
                </div>

                {/* Prize Section */}
                <div className='bg-gradient-to-r from-slate-50 to-blue-50 p-3 rounded-lg border border-slate-300'>
                    <div className='flex items-center gap-2'>
                        <Trophy className='w-5 h-5 text-blue-600' />
                        <div className='flex-1'>
                            <p className='text-xs text-slate-600 font-medium'>Prize Pool</p>
                            <p className='text-sm font-bold text-gray-900'>{prize}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {job?.description || "Join this exciting hackathon and showcase your skills"}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className='flex gap-2 text-gray-400'>
                        <button className='hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors'>
                            <Share2 className='w-4 h-4' />
                        </button>
                        <button className='hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors'>
                            <Heart className='w-4 h-4' />
                        </button>
                    </div>
                    <button className='bg-gradient-to-r from-slate-700 to-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:from-slate-800 hover:to-blue-700 transition-all flex items-center gap-1.5'>
                        <Zap className='w-3.5 h-3.5' />
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HackathonCard
