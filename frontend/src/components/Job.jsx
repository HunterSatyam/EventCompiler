import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const timeAgo = daysAgoFunction(job?.createdAt);

    return (
        <div className='group bg-white rounded-[24px] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200/50 flex flex-col h-full relative overflow-hidden'>
            {/* Top Shine Effect */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

            <div className='flex items-center justify-between mb-6'>
                <div className='px-3 py-1 bg-gray-50 rounded-full border border-gray-100 flex items-center gap-1.5'>
                    <Clock size={12} className='text-gray-400' />
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                        {timeAgo === 0 ? "Today" : `${timeAgo} days ago`}
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    <Bookmark size={20} />
                </Button>
            </div>

            <div className='flex items-center gap-4 mb-6'>
                <div className="p-1 rounded-[16px] bg-white shadow-sm border border-gray-100 transition-transform group-hover:scale-105 duration-300">
                    <Avatar className="h-14 w-14 rounded-[12px]">
                        <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                        <AvatarFallback className="rounded-[12px] bg-purple-50 text-purple-600 font-black text-xl">
                            {job?.company?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className='min-w-0'>
                    <h2 className='font-black text-lg text-gray-900 leading-tight truncate'>{job?.company?.name}</h2>
                    <div className='flex items-center gap-1 text-gray-400'>
                        <MapPin size={12} />
                        <p className='text-xs font-bold uppercase tracking-wider'>{job?.location || "India"}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex-1">
                <h1 className='font-black text-xl mb-3 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight'>
                    {job?.title}
                </h1>
                <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium'>
                    {job?.description}
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mb-8'>
                <Badge className='bg-blue-50/50 text-blue-600 border-blue-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider' variant="outline">
                    <div className='flex items-center gap-1.5'>
                        <Briefcase size={12} />
                        {job?.position} Positions
                    </div>
                </Badge>
                <Badge className='bg-red-50/50 text-red-600 border-red-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider' variant="outline">
                    {job?.jobType}
                </Badge>
                <Badge className='bg-emerald-50/50 text-emerald-600 border-emerald-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider' variant="outline">
                    <div className='flex items-center gap-1'>
                        <IndianRupee size={12} />
                        {job?.salary} LPA
                    </div>
                </Badge>
            </div>

            <div className='flex items-center gap-3 mt-auto'>
                <Button
                    onClick={() => navigate(`/description/job/${job?._id}`)}
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest transition-all"
                >
                    Details
                </Button>
                <Button
                    variant="default"
                    className="flex-1 h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all group/btn"
                >
                    <span className='flex items-center gap-2'>
                        Quick Apply
                        <ArrowRight size={16} className='group-hover/btn:translate-x-1 transition-transform' />
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default Job