import { Button } from './ui/button'
import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import LikeButton from './shared/LikeButton'

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
        <div onClick={() => navigate(`/description/job/${job?._id}`)} className='group bg-white rounded-[24px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-violet-200/50 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className="absolute top-4 right-4 z-20">
                <LikeButton eventId={job?._id} eventType="Job" />
            </div>
            <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative p-6 flex justify-between items-start overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-black/20 text-white backdrop-blur-md border-none px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10">
                    <div className='flex items-center gap-1.5'>
                        <Clock size={12} />
                        {timeAgo === 0 ? "Today" : `${timeAgo} days ago`}
                    </div>
                </Badge>
                <Badge className='bg-white text-violet-700 border-none px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm z-10'>
                    {job?.jobType}
                </Badge>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white shadow-lg border border-gray-100 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-violet-50 text-violet-600 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 leading-tight group-hover:text-violet-600 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-1">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className='flex flex-wrap items-center gap-2 mt-2'>
                    <Badge className='bg-blue-50/50 text-blue-600 border-blue-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex-1 justify-center h-9' variant="outline">
                        <div className='flex items-center gap-1.5'>
                            <Briefcase size={12} />
                            {job?.position} Positions
                        </div>
                    </Badge>
                    <Badge className='bg-emerald-50/50 text-emerald-600 border-emerald-100 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex-1 justify-center h-9' variant="outline">
                        <div className='flex items-center gap-1'>
                            <IndianRupee size={12} />
                            {job?.salary} LPA
                        </div>
                    </Badge>
                </div>

                <div className='flex items-center gap-1.5 text-xs font-bold text-gray-500 mt-1 pl-1'>
                    <MapPin size={14} className="text-gray-400" /> {job?.location || "India"}
                </div>

                {/* Footer Button */}
                <div className="mt-auto pt-2 flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-2xl border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Details
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all group/btn"
                    >
                        <span className='flex items-center gap-2'>
                            Quick Apply
                            <ArrowRight size={16} className='group-hover/btn:translate-x-1 transition-transform' />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Job