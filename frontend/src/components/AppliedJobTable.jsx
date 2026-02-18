import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Calendar, Building2, Briefcase, CheckCircle2, Clock, XCircle } from 'lucide-react'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    }

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted': return <CheckCircle2 size={12} />;
            case 'rejected': return <XCircle size={12} />;
            default: return <Clock size={12} />;
        }
    }

    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-0">
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6 pl-8">Applied Date</TableHead>
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Position / Role</TableHead>
                        <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Company</TableHead>
                        <TableHead className="text-right font-black text-gray-400 uppercase tracking-widest text-[10px] pr-8">Current Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-gray-400 font-medium">
                                    You haven't applied to any opportunities yet.
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob, index) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={appliedJob._id}
                                className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                            >
                                <TableCell className="py-5 pl-8">
                                    <div className='flex items-center gap-2 text-gray-500 font-bold text-xs'>
                                        <Calendar size={14} className="text-gray-300" />
                                        {appliedJob?.createdAt?.split("T")[0]}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <div className='p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:scale-110 transition-transform'>
                                            <Briefcase size={16} />
                                        </div>
                                        <span className="font-bold text-gray-900">{appliedJob.job?.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2 text-gray-600 font-medium'>
                                        <Building2 size={14} className="text-gray-300" />
                                        {appliedJob.job?.company?.name}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Badge className={`${getStatusStyle(appliedJob.status)} px-3 py-1.5 rounded-full border shadow-none font-black text-[10px] uppercase tracking-widest`}>
                                        <div className='flex items-center gap-1.5'>
                                            {getStatusIcon(appliedJob.status)}
                                            {appliedJob.status.toUpperCase()}
                                        </div>
                                    </Badge>
                                </TableCell>
                            </motion.tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable