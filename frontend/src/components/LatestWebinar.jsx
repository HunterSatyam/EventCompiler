import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addWebinar } from '@/redux/webinarSlice'
import { setFilters } from '@/redux/jobSlice'
import { WEBINAR_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { Loader2, Sparkles, ArrowRight, Video } from 'lucide-react'
import WebinarCard from './WebinarCard';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const LatestWebinar = () => {
    const { allWebinars } = useSelector(store => store.webinar);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        location: 'Online',
        fee: '',
        speaker: '',
        date: '',
        time: '',
        file: null
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files?.[0] });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("description", formData.description);
            // payload.append("requirements", formData.description);
            payload.append("fee", Number(formData.fee));
            // payload.append("location", formData.location);
            // payload.append("jobType", 'Webinar');
            payload.append("speaker", formData.speaker);
            // payload.append("experience", Number(formData.experience));
            // payload.append("position", Number(formData.position));
            payload.append("companyName", formData.companyName);

            const dateTime = formData.date && formData.time ? `${formData.date}T${formData.time}` : new Date().toISOString();
            payload.append("date", dateTime);

            if (formData.file) {
                payload.append("file", formData.file);
            }

            const res = await axios.post(`${WEBINAR_API_END_POINT}/post`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedJob = res.data.webinar;
                dispatch(addWebinar(updatedJob));
                setIsModalOpen(false);
                setFormData({
                    title: '', companyName: '', description: '', location: 'Online',
                    fee: '', speaker: '',
                    date: '', time: '', file: null
                });
                alert("Webinar Posted Successfully!");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message + ": " + (error.response?.data?.error || ""));
        } finally {
            setLoading(false);
        }
    }

    const webinars = allWebinars || [];

    return (
        <div className='max-w-7xl mx-auto my-32 px-4'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-12'>
                <div className='space-y-4'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-[0.2em] text-[10px] font-black'>
                        <Video size={12} />
                        Live Sessions
                    </div>
                    <h1 className='text-5xl font-black text-gray-900 leading-tight'>
                        Upcoming <span className='text-rose-600'>Webinars</span>
                    </h1>
                    <p className='text-gray-500 font-medium max-w-lg'>
                        Learn from the best in the industry with our curated live interactive sessions.
                    </p>
                </div>

                <button
                    onClick={() => {
                        dispatch(setFilters({ type: 'Webinars' }));
                        navigate("/events");
                    }}
                    className='bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 shadow-xl transition-all active:scale-95 flex items-center gap-2'
                >
                    View All Webinars <ArrowRight size={16} />
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-5'>
                {
                    webinars.length <= 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                            <span className="text-gray-400 text-lg font-bold uppercase tracking-widest">No Webinars Available Currently</span>
                        </div>
                    ) : (
                        webinars.slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <WebinarCard job={job} />
                            </motion.div>
                        ))
                    )
                }
            </div>


            {/* Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-8 rounded-lg w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]'>
                        <h2 className='text-2xl font-bold mb-4'>Post New Webinar</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Logo/Image</label>
                                <input
                                    type="file" name="file"
                                    onChange={handleFileChange}
                                    className="border p-2 rounded w-full mt-1"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Webinar Title</label>
                                <input
                                    type="text" name="title" placeholder="e.g. Intro to React"
                                    value={formData.title} onChange={handleInputChange} required
                                    className="border p-2 rounded w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Organizer Name</label>
                                <input
                                    type="text" name="companyName" placeholder="Company/Organizer"
                                    value={formData.companyName} onChange={handleInputChange} required
                                    className="border p-2 rounded w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Description</label>
                                <textarea
                                    name="description" placeholder="Description"
                                    value={formData.description} onChange={handleInputChange} required
                                    className="border p-2 rounded w-full mt-1"
                                ></textarea>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Date</label>
                                    <input
                                        type="date" name="date"
                                        value={formData.date} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Time</label>
                                    <input
                                        type="time" name="time"
                                        value={formData.time} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Speaker Name</label>
                                    <input
                                        type="text" name="speaker" placeholder="Speaker"
                                        value={formData.speaker} onChange={handleInputChange}
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Cost (0 for Free)</label>
                                    <input
                                        type="number" name="fee" placeholder="0"
                                        value={formData.fee} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                            </div>

                            {/* <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Duration (Hours)</label>
                                    <input
                                        type="number" name="experience" placeholder="e.g. 1"
                                        value={formData.experience} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Total Slots</label>
                                    <input
                                        type="number" name="position" placeholder="e.g. 100"
                                        value={formData.position} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                            </div> */ }


                            <div className='flex justify-end gap-2 mt-4'>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className='px-4 py-2 bg-[#6A38C2] text-white rounded hover:bg-[#5b30a6]'
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className='animate-spin' /> : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LatestWebinar
