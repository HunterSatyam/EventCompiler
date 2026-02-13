import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }


    return (
        <div className='p-6 rounded-xl shadow-lg bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-[#6A38C2]/30 flex flex-col justify-between h-full bg-gradient-to-br from-white to-gray-50/50'>
            <div className='flex items-center justify-between mb-4'>
                <p className='text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>{daysAgoFunction(job?.createdAt) === 0 ? "New Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="ghost" className="rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#6A38C2] transition-colors" size="icon"><Bookmark className="w-5 h-5" /></Button>
            </div>

            <div className='flex items-center gap-4 mb-4'>
                <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} />
                    </Avatar>
                </div>
                <div>
                    <h1 className='font-bold text-lg text-gray-900 leading-tight'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500 font-medium'>India</p>
                </div>
            </div>

            <div className="mb-4">
                <h1 className='font-bold text-xl my-2 text-gray-800 line-clamp-1 group-hover:text-[#6A38C2] transition-colors'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed h-[42px]'>{job?.description}</p>
            </div>

            <div className='flex items-center gap-2 mt-auto mb-6 flex-wrap'>
                <Badge className={'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200 font-bold px-3 py-1'} variant="outline">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] bg-red-50 hover:bg-red-100 border-red-200 font-bold px-3 py-1'} variant="outline">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] bg-purple-50 hover:bg-purple-100 border-purple-200 font-bold px-3 py-1'} variant="outline">{job?.salary} LPA</Badge>
            </div>

            <div className='flex items-center gap-3 mt-auto'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-medium transition-all">Details</Button>
                <Button className="flex-1 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-medium shadow-md hover:shadow-lg transition-all">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job