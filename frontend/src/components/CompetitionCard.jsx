import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { MapPin, Share2, Heart, Users, Calendar, Trophy, Zap, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import LikeButton from './shared/LikeButton'

const CompetitionCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Calculate days left (placeholder logic preserved)
    const postedDate = job?.createdAt ? new Date(job.createdAt) : new Date();
    const daysLeft = 7;

    return (
        <div onClick={() => navigate(`/description/competition/${job._id}`)} className='group bg-white rounded-[24px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-900/20 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className="absolute top-4 right-4 z-20">
                <LikeButton eventId={job._id} eventType="Competition" />
            </div>
            <div className="h-28 bg-gradient-to-r from-orange-800 to-red-900 relative p-6 flex justify-between items-start overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-white/20 text-white backdrop-blur-md border-none px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10">
                    <div className='flex items-center gap-1.5'>
                        <Trophy size={12} />
                        Competition
                    </div>
                </Badge>


            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white shadow-lg border border-gray-100 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-red-50 text-red-900 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 leading-tight group-hover:text-red-900 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-1">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Prize Info */}
                <div className="bg-red-50 rounded-2xl p-3 flex items-center gap-3 border border-red-100/50">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-red-800">
                        <Trophy size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-red-800 font-black uppercase tracking-widest">Prize Pool</p>
                        <p className="text-sm font-black text-gray-900">{job?.prize || 'No Prize'}</p>
                    </div>
                </div>

                {/* Footer Button */}
                {
                    user?.role === 'recruiter' ? (
                        <></>
                    ) : (
                        <div className="mt-auto pt-2 grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-800 rounded-xl border border-orange-100">
                                <Zap size={14} className="fill-current" />
                                <span className="text-xs font-bold">{daysLeft} days left</span>
                            </div>
                            <button className="h-10 bg-gradient-to-r from-orange-800 to-red-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg hover:shadow-red-900/20 flex items-center justify-center gap-2 group/btn">
                                Join <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )
                }
            </div>
        </div >
    )
}

export default CompetitionCard
