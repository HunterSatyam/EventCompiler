import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Building2, MapPin, Briefcase, IndianRupee, Clock, Heart, Share2, Users } from 'lucide-react'
import { useSelector } from 'react-redux'

const JobCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    const salary = job?.salary ? `₹${job.salary} LPA` : 'Not Disclosed';
    const experience = job?.experience ? `${job.experience}+ Years` : 'Fresher';

    // Calculate time ago
    const getTimeAgo = (date) => {
        if (!date) return 'Recently';
        const now = new Date();
        const posted = new Date(date);
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    // Extract skills from description (simple keyword extraction)
    const extractSkills = (description) => {
        if (!description) return [];
        const commonSkills = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'MongoDB', 'SQL', 'Angular', 'Vue', 'Express', 'Django', 'Flask'];
        const found = commonSkills.filter(skill =>
            description.toLowerCase().includes(skill.toLowerCase())
        );
        return found.slice(0, 3);
    };

    const skills = extractSkills(job?.description);
    const timeAgo = getTimeAgo(job?.createdAt);

    return (
        <div onClick={() => navigate(`/description/job/${job._id}`)} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer flex flex-col h-full group'>
            {/* Header */}
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-12 w-12 rounded-lg border border-gray-200 bg-white shadow-sm">
                            <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-md p-1.5" />
                            <AvatarFallback className="rounded-md text-base bg-blue-50 font-bold text-blue-600">{job?.company?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">{job?.title}</h3>
                            <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {job?.company?.name}
                            </p>
                        </div>
                    </div>
                    <button className='text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors'>
                        <Heart className='w-4 h-4' />
                    </button>
                </div>

                {/* Job Type & Posted Time */}
                <div className='flex items-center gap-2 mb-3'>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
                        Full-time
                    </Badge>
                    <span className='text-xs text-gray-500 flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {timeAgo}
                    </span>
                </div>

                {/* Meta Info */}
                <div className='flex flex-wrap gap-2'>
                    <div className='flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-200'>
                        <Briefcase className='w-3.5 h-3.5 text-gray-500' />
                        {experience}
                    </div>
                    <div className='flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-200'>
                        <MapPin className='w-3.5 h-3.5 text-gray-500' />
                        {job?.location || "Remote"}
                    </div>
                    {job?.position && (
                        <div className='flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 border border-gray-200'>
                            <Users className='w-3.5 h-3.5 text-gray-500' />
                            {job.position} {job.position === 1 ? 'Opening' : 'Openings'}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 pb-4 flex flex-col flex-1 gap-3">
                {/* Skills */}
                {skills.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                        {skills.map((skill, index) => (
                            <span key={index} className='bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium border border-blue-100'>
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {job?.description || "Join our team and work on exciting projects"}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className='flex items-center gap-1.5'>
                        <div className='flex items-center gap-1 bg-green-50 px-2.5 py-1.5 rounded-md border border-green-200'>
                            <IndianRupee className='w-4 h-4 text-green-600' />
                            <span className='text-sm font-bold text-green-700'>{salary}</span>
                        </div>
                    </div>
                    {
                        user?.role === 'recruiter' ? (
                            <></>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <button className='text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors'>
                                    <Share2 className='w-4 h-4' />
                                </button>
                                <button className='bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors'>
                                    Apply Now
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default JobCard
