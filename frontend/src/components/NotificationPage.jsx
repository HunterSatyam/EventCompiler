import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, CheckCircle2, Trash2, Calendar, MapPin, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { NOTIFICATION_API_END_POINT } from '@/utils/constant'
import { setAllNotifications, markNotificationAsRead, removeNotification } from '@/redux/notificationSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import useGetNotifications from '@/hooks/useGetNotifications'

const NotificationPage = () => {

    useGetNotifications();
    const { allNotifications } = useSelector(store => store.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const markAsReadHandler = async (id) => {
        try {
            const res = await axios.put(`${NOTIFICATION_API_END_POINT}/${id}/read`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(markNotificationAsRead(id));
                toast.success("Marked as read");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to mark as read");
        }
    }

    const deleteHandler = async (id) => {
        try {
            const res = await axios.delete(`${NOTIFICATION_API_END_POINT}/${id}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(removeNotification(id));
                toast.success("Notification deleted");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete notification");
        }
    }

    return (
        <div className='min-h-screen bg-[#F8F9FF]'>
            <Navbar />
            <div className='max-w-4xl mx-auto my-16 px-4'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h1 className='text-4xl font-black text-gray-900'>Notifications</h1>
                        <p className='text-gray-500 font-medium mt-1'>Stay updated with events matching your profile</p>
                    </div>
                    <div className='bg-white p-3 rounded-2xl shadow-sm border border-gray-100'>
                        <Bell className='text-purple-600' size={24} />
                    </div>
                </div>

                <div className='space-y-4'>
                    <AnimatePresence mode='popLayout'>
                        {allNotifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='bg-white rounded-[32px] p-16 text-center border border-gray-100 shadow-sm'
                            >
                                <div className='inline-flex p-6 rounded-full bg-gray-50 text-gray-400 mb-6'>
                                    <BellOff size={48} />
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 mb-2'>No notifications yet</h3>
                                <p className='text-gray-500 max-w-xs mx-auto font-medium'>
                                    When recruiters post events matching your skills, you'll see them here.
                                </p>
                            </motion.div>
                        ) : (
                            allNotifications.map((notification, index) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative group bg-white rounded-[24px] p-6 border transition-all ${notification.isRead ? 'opacity-70 border-gray-100' : 'border-purple-100 shadow-md shadow-purple-50'
                                        }`}
                                >
                                    {!notification.isRead && (
                                        <div className='absolute top-6 right-6 w-2 h-2 bg-purple-600 rounded-full'></div>
                                    )}

                                    <div className='flex gap-6'>
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notification.type === 'Job' ? 'bg-purple-50 text-purple-600' :
                                            notification.type === 'Internship' ? 'bg-blue-50 text-blue-600' :
                                                'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            <Calendar size={24} />
                                        </div>

                                        <div className='flex-1'>
                                            <div className='flex items-start justify-between mb-1'>
                                                <h3 className='font-black text-lg text-gray-900'>{notification.title}</h3>
                                                <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
                                                    {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                </span>

                                            </div>
                                            <p className='text-gray-600 font-medium mb-4'>{notification.message}</p>

                                            <div className='flex items-center gap-4'>
                                                <button
                                                    onClick={() => navigate(`/description/${notification.type.toLowerCase()}/${notification.eventId}`)}
                                                    className='text-xs font-black uppercase tracking-widest text-purple-600 hover:text-purple-700 flex items-center gap-1'
                                                >

                                                    View Details <ExternalLink size={14} />
                                                </button>

                                                <div className='flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity'>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsReadHandler(notification._id)}
                                                            className='p-2 text-gray-400 hover:text-emerald-600 transition-colors'
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteHandler(notification._id)}
                                                        className='p-2 text-gray-400 hover:text-rose-600 transition-colors'
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default NotificationPage
