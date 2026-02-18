import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from '../ui/avatar'

const AdminJobsTable = () => {
    const { allAdminJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchedQuery) {
                return true;
            };
            return job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.jobType?.toLowerCase().includes(searchedQuery.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchedQuery]);


    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <Table>
                <TableCaption className="pb-6">A list of your recently posted opportunities</TableCaption>
                <TableHeader className="bg-gray-50/50">
                    <TableRow>
                        <TableHead className="font-bold text-gray-700 py-6 pl-8">Logo</TableHead>
                        <TableHead className="font-bold text-gray-700 py-6 pl-8">Company Name</TableHead>
                        <TableHead className="font-bold text-gray-700">Title</TableHead>
                        <TableHead className="font-bold text-gray-700">Type</TableHead>
                        <TableHead className="font-bold text-gray-700">Date</TableHead>
                        <TableHead className="text-right font-bold text-gray-700 pr-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <TableRow key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={job?.logo || job?.company?.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-5 pl-8 font-medium text-gray-900">{job?.company?.name}</TableCell>
                                <TableCell className="text-gray-600">{job?.title}</TableCell>
                                <TableCell>
                                    <Badge className={`
                                        ${job?.jobType?.toLowerCase() === 'job' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            job?.jobType?.toLowerCase() === 'internship' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                job?.jobType?.toLowerCase() === 'hackathon' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    job?.jobType?.toLowerCase() === 'webinar' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                        job?.jobType?.toLowerCase() === 'competition' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                            job?.jobType?.toLowerCase() === 'certification' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                'bg-gray-50 text-gray-600 border-gray-100'}
                                        px-3 py-1 rounded-full border shadow-none font-semibold capitalize
                                    `}>
                                        {job.jobType}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500">{job?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-right pr-8">
                                    <Popover>
                                        <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                            <MoreHorizontal className="text-gray-400" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2 rounded-2xl shadow-xl border-gray-100">
                                            <button
                                                onClick={() => navigate(`/admin/posts/${job._id}/edit`)}
                                                className='flex items-center gap-3 w-full p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/posts/${job._id}/applicants`)}
                                                className='flex items-center gap-3 w-full p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl mt-1 transition-all'
                                            >
                                                <Eye className='w-4 h-4' />
                                                <span>Applicants</span>
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            {filterJobs.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-medium">No opportunities found matching your criteria</p>
                </div>
            )}
        </div>
    )
}

export default AdminJobsTable
