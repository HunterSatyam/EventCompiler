import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { setAllRecruiterApplications } from '@/redux/applicationSlice'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Check, X, Clock, FileText, Download } from 'lucide-react'

const RecruiterApplicationsTable = () => {
    const { recruiterApplications } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                const updatedApplications = recruiterApplications.map(app =>
                    app._id === id ? { ...app, status: status.toLowerCase() } : app
                );
                dispatch(setAllRecruiterApplications(updatedApplications));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    }

    return (
        <div className='overflow-x-auto overflow-y-visible'>
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-0">
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6 pl-8">Applicant</TableHead>
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Title</TableHead>
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Resume</TableHead>
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Date</TableHead>
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                        <TableHead className="text-right font-black text-gray-400 uppercase tracking-widest text-[10px] pr-8">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        recruiterApplications && recruiterApplications.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-medium">
                                    No applications received yet for your opportunities.
                                </TableCell>
                            </TableRow>
                        ) : (
                            recruiterApplications?.map((item, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={item._id}
                                    className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold group-hover:scale-110 transition-transform">
                                                {item?.applicant?.fullname?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 leading-tight">{item?.applicant?.fullname}</span>
                                                <span className="text-[10px] text-gray-400 font-bold lowercase">{item?.applicant?.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 leading-tight">{item?.jobTitle}</span>
                                            <span className="text-[10px] text-purple-600 font-black uppercase tracking-widest mt-0.5">{item?.jobType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item?.applicant?.profile?.resume ? (
                                            <a
                                                href={item?.applicant?.profile?.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group/resume"
                                            >
                                                <div className="p-2 bg-blue-50 rounded-lg group-hover/resume:scale-110 transition-transform">
                                                    <Download size={14} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Resume</span>
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Resume</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2 text-gray-400 font-bold text-xs'>
                                            {item?.createdAt?.split("T")[0]}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            ${item.status === "rejected" ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                item.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'}
                                            px-3 py-1.5 rounded-full border shadow-none font-black text-[10px] uppercase tracking-widest
                                        `}>
                                            <div className="flex items-center gap-1.5">
                                                {item.status === 'accepted' ? <Check size={12} /> : item.status === 'rejected' ? <X size={12} /> : <Clock size={12} />}
                                                {item.status.toUpperCase()}
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.status === 'pending' ? (
                                                <>
                                                    <Button
                                                        onClick={() => statusHandler('accepted', item._id)}
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest h-9 px-4 shadow-lg shadow-emerald-200"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => statusHandler('rejected', item._id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-black text-[10px] uppercase tracking-widest h-9 px-4"
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 cursor-default h-9"
                                                >
                                                    {item.status === 'accepted' ? 'Hired' : 'Closed'}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default RecruiterApplicationsTable


