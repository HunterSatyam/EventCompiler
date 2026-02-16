import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { setAllRecruiterApplications } from '@/redux/applicationSlice'

const RecruiterApplicationsTable = () => {
    const { recruiterApplications } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                // Update the local state
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
        <div>
            <Table>
                <TableCaption>A list of all applications received for your posted opportunities</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        recruiterApplications && recruiterApplications.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">No applications received yet</TableCell>
                            </TableRow>
                        ) : (
                            recruiterApplications?.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item?.applicant?.fullname}</TableCell>
                                    <TableCell>{item?.applicant?.email}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                                    <TableCell>{item?.jobTitle}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                            {item?.jobType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            ${item.status === "rejected" ? 'bg-red-100 text-red-700 border-red-200' :
                                                item.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    'bg-gray-100 text-gray-700 border-gray-200'}
                                        `}>
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            {item.status === 'pending' && (
                                                <>
                                                    <Button
                                                        onClick={() => statusHandler('accepted', item._id)}
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => statusHandler('rejected', item._id)}
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {item.status === 'accepted' && (
                                                <Button
                                                    onClick={() => statusHandler('rejected', item._id)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                                >
                                                    Reject
                                                </Button>
                                            )}
                                            {item.status === 'rejected' && (
                                                <Button
                                                    onClick={() => statusHandler('accepted', item._id)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-green-300 text-green-600 hover:bg-green-50"
                                                >
                                                    Accept
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default RecruiterApplicationsTable
