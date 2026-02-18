import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { MapPin, Share2, Heart, Users, Calendar, Trophy, Zap } from 'lucide-react'
import { useSelector } from 'react-redux'

const CompetitionCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Calculate days left (placeholder logic preserved)
    const postedDate = job?.createdAt ? new Date(job.createdAt) : new Date();
    const daysLeft = 7;

    return (
        <div onClick={() => navigate(`/description/competition/${job._id}`)} className='bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full group relative'>

            {/* Top Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>

            <div className="p-6 flex flex-col h-full gap-4">

                {/* Header: Logo, Title, Company */}
                <div className="flex gap-4 items-start">
                    <Avatar className="h-14 w-14 rounded-xl border border-gray-100 bg-white shadow-sm flex-shrink-0">
                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-lg" />
                        <AvatarFallback className="rounded-lg text-lg bg-gray-50 font-bold text-gray-500">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold text-gray-900 leading-tight truncate pr-2 group-hover:text-purple-700 transition-colors">{job?.title}</h2>
                        </div>
                        <p className="text-sm font-medium text-gray-500 mt-1 truncate">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Prize Section - Highlighted */}
                <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-3 border border-purple-100">
                    <div className="p-2 bg-white rounded-full shadow-sm text-yellow-500">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Prize Pool</p>
                        <p className="text-sm font-bold text-gray-900">{job?.prize || 'No Prize'}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{job?.position ? `1 - ${job.position} Members` : 'Individual'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="font-medium truncate">{job?.location || "Online"}</span>
                    </div>
                    {/* Add more grid items if needed, e.g. Deadline */}
                    <div className="flex items-center gap-2 col-span-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 text-xs">Posted {postedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                    </div>
                </div>

                {/* Tags (limited to 3) */}
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {job?.description?.split(" ").slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                            {tag.replace(/[.,]/g, '')}
                        </span>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>{daysLeft} days left</span>
                    </div>

                    {
                        user?.role === 'recruiter' ? (
                            <></>
                        ) : (
                            <div className='flex gap-2 text-gray-400'>
                                <button className='hover:text-purple-600 p-1.5 hover:bg-purple-50 rounded-full transition-colors'><Share2 className='w-4 h-4' /></button>
                                <button className='hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors'><Heart className='w-4 h-4' /></button>
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default CompetitionCard
