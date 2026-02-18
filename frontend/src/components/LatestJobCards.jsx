import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Briefcase, MapPin, Clock, Share2, Heart, Banknote } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    if (!job) return null;

    return (
        <div onClick={() => navigate(`/description/job/${job._id}`)} className='p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 cursor-pointer relative group flex flex-col gap-4'>
            {/* Top Section: Title, Company, Logo */}
            <div className='flex justify-between items-start'>
                <div className='flex-1 pr-4'>
                    <h1 className='text-xl font-bold text-gray-900 leading-tight'>{job?.title}</h1>
                    <p className='text-base font-medium text-red-600 mt-1'>{job?.company?.name}</p>
                </div>
                <Avatar className="h-14 w-14 rounded-xl border border-gray-100 bg-white shadow-sm p-1">
                    <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-lg" />
                    <AvatarFallback className="rounded-lg text-lg bg-gray-50 font-bold text-gray-500">{job?.company?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>

            {/* Meta Info: Experience, Type, Location */}
            <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium'>
                <div className='flex items-center gap-1.5'>
                    <Briefcase className='w-4 h-4 text-gray-400' />
                    <span>{job?.experienceLevel === 0 ? "Fresher" : `${job?.experienceLevel} Years`}</span>
                </div>
                <span className='text-gray-300'>|</span>
                <div className='flex items-center gap-1.5'>
                    <Clock className='w-4 h-4 text-gray-400' />
                    <span>{job?.jobType}</span>
                </div>
                <span className='text-gray-300'>|</span>
                <div className='flex items-center gap-1.5'>
                    <MapPin className='w-4 h-4 text-gray-400' />
                    <span>{job?.location || "India"}</span>
                </div>
            </div>

            {/* Description/Skills Line */}
            <p className='text-sm text-gray-600 line-clamp-1'>
                {job?.description}
            </p>

            {/* Action Row: Tags & Salary */}
            <div className='flex items-center justify-between mt-2'>
                <div className='flex flex-wrap gap-2'>
                    <Badge className={'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm'} variant="secondary">
                        {job?.position} Positions
                    </Badge>
                </div>

                <Badge className={'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm'} variant="secondary">
                    <Banknote className="w-3.5 h-3.5" />
                    {job?.salary} LPA
                </Badge>
            </div>

            {/* Footer: Date & Social Actions */}
            <div className='flex items-center justify-between pt-4 mt-auto border-t border-gray-50'>
                <span className='text-xs font-medium text-gray-400'>
                    Posted {job?.createdAt ? new Date(job.createdAt).toDateString() : 'Recently'}
                </span>
                <div className='flex gap-3 text-gray-400'>
                    <button className='hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50'><Share2 className='w-5 h-5' /></button>
                    <button className='hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50'><Heart className='w-5 h-5' /></button>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards