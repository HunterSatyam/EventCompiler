import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Calendar, Clock, Video, Users, Share2, Heart, ExternalLink } from 'lucide-react'
import { useSelector } from 'react-redux'

const WebinarCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Use job.date for webinar date, defaulting to creation date if not set
    const webinarDate = job?.date ? new Date(job.date) : new Date(job?.createdAt);
    const dateString = webinarDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeString = webinarDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Assuming cost is stored in salary, 0 means Free
    const cost = job?.salary === 0 ? "Free" : `₹${job?.salary}`;

    return (
        <div onClick={() => navigate(`/description/webinar/${job._id}`)} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer flex flex-col h-full group'>
            {/* Banner Idea: If we had a banner image, it would go here. For now, using a gradient header */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative p-4 flex justify-between items-start">
                <Badge className="bg-white/20 text-white backdrop-blur-sm border-none hover:bg-white/30">
                    {job?.location === 'Online' ? <Video className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                    {job?.location || 'Webinar'}
                </Badge>
                <Badge className={`${job?.salary === 0 ? 'bg-green-500' : 'bg-yellow-500'} text-white border-none shadow-sm`}>
                    {cost}
                </Badge>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-4 -mt-8">
                {/* Logo & Organizer */}
                <div className="flex justify-between items-end">
                    <Avatar className="h-16 w-16 rounded-xl border-4 border-white bg-white shadow-md">
                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-lg" />
                        <AvatarFallback className="rounded-lg text-xl bg-gray-100 font-bold text-gray-500">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className='flex gap-2 text-gray-400 mb-1'>
                        <button className='hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors'><Share2 className='w-4 h-4' /></button>
                        <button className='hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors'><Heart className='w-4 h-4' /></button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">{job?.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{job?.company?.name} • {job?.position ? `${job.position} Seats` : 'Open'}</p>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{dateString}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{timeString}</span>
                    </div>
                </div>

                {/* Register Button */}
                {
                    user?.role === 'recruiter' ? (
                        <></>
                    ) : (
                        <div className="mt-auto pt-2">
                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600">
                                Register Now <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default WebinarCard
