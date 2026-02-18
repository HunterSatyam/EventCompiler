import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCompetition } from '@/redux/competitionSlice'
import { setFilters } from '@/redux/jobSlice'
import { COMPETITION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { Loader2, Sparkles, ArrowRight, Trophy } from 'lucide-react'
import CompetitionCard from './CompetitionCard';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const LatestCompetition = () => {
    const { allCompetitions } = useSelector(store => store.competition);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        location: '',
        prize: '',
        teamSize: 1, // Changed from experience
        // position: 1,
        type: 'Competition',
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
            // payload.append("salary", 0);
            payload.append("prize", formData.prize);
            payload.append("location", formData.location);
            // payload.append("jobType", 'Competition');
            // payload.append("experience", Number(formData.experience));
            payload.append("teamSize", Number(formData.teamSize));
            payload.append("companyName", formData.companyName);
            // payload.append("date", new Date().toISOString().split('T')[0]);
            if (formData.file) {
                payload.append("file", formData.file);
            }

            const res = await axios.post(`${COMPETITION_API_END_POINT}/post`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedJob = res.data.competition;
                dispatch(addCompetition(updatedJob));
                setIsModalOpen(false);
                setFormData({ title: '', companyName: '', description: '', location: '', prize: '', teamSize: 1, type: 'Competition', file: null });
                alert("Competition Posted Successfully!");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message + ": " + (error.response?.data?.error || ""));
        } finally {
            setLoading(false);
        }
    }

    const competitions = allCompetitions || [];

    return (
        <div className='max-w-7xl mx-auto my-32 px-4'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-12'>
                <div className='space-y-4'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-[0.2em] text-[10px] font-black'>
                        <Trophy size={12} />
                        Global Events
                    </div>
                    <h1 className='text-5xl font-black text-gray-900 leading-tight'>
                        Open <span className='text-amber-600'>Competitions</span>
                    </h1>
                    <p className='text-gray-500 font-medium max-w-lg'>
                        Showcase your talent, compete with the best, and earn recognition on a global stage.
                    </p>
                </div>

                <button
                    onClick={() => {
                        dispatch(setFilters({ type: 'Competition' }));
                        navigate("/events");
                    }}
                    className='bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 shadow-xl transition-all active:scale-95 flex items-center gap-2'
                >
                    View All Competitions <ArrowRight size={16} />
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-5'>
                {
                    competitions.length <= 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                            <span className="text-gray-400 text-lg font-bold uppercase tracking-widest">No Competitions Available Currently</span>
                        </div>
                    ) : (
                        competitions.slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CompetitionCard job={job} />
                            </motion.div>
                        ))
                    )
                }
            </div>


            {/* Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-8 rounded-lg w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]'>
                        <h2 className='text-2xl font-bold mb-4'>Post New Competition</h2>
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
                                <label className='block text-sm font-medium text-gray-700'>Title</label>
                                <input
                                    type="text" name="title" placeholder="Competition Title"
                                    value={formData.title} onChange={handleInputChange} required
                                    className="border p-2 rounded w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Company/Organizer Name</label>
                                <input
                                    type="text" name="companyName" placeholder="Company Name"
                                    value={formData.companyName} onChange={handleInputChange} required
                                    className="border p-2 rounded w-full mt-1"
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Description</label>
                                <textarea
                                    name="description" placeholder="Describe the competition. The first few words will be used as tags."
                                    value={formData.description} onChange={handleInputChange} required
                                    className="border p-2 rounded w-full mt-1"
                                ></textarea>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Location</label>
                                    <input
                                        type="text" name="location" placeholder="Location"
                                        value={formData.location} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Prize</label>
                                    <input
                                        type="text" name="prize" placeholder="Example: 1st - 10k, 2nd - 5k"
                                        value={formData.prize} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                {/* <div>
                                    <label className='block text-sm font-medium text-gray-700'>Competition Duration (Days)</label>
                                    <input
                                        type="number" name="experience" placeholder="e.g. 7"
                                        value={formData.experience} onChange={handleInputChange} 
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div> */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Team Size (Max Members)</label>
                                    <input
                                        type="number" name="teamSize" placeholder="e.g. 4"
                                        value={formData.teamSize} onChange={handleInputChange} required
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                            </div>

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

export default LatestCompetition
