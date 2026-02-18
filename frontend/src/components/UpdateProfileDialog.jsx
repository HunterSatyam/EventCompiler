import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, X, User, Phone, Mail, FileText, Sparkles, CheckCircle2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import PremiumFileUpload from './shared/PremiumFileUpload'
import { motion, AnimatePresence } from 'framer-motion'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: null,
        profilePhoto: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const handleResumeSelect = (file) => {
        setInput({ ...input, file });
    }

    const handlePhotoSelect = (file) => {
        setInput({ ...input, profilePhoto: file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    if (!open) return null;

    const inputClasses = "w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300";
    const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
                {/* Header Decoration */}
                <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 to-indigo-600 -z-10'></div>

                <div className='p-8 md:p-10'>
                    <div className='flex items-start justify-between mb-8'>
                        <div className='text-white'>
                            <div className='inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-md border border-white/10'>
                                <Sparkles size={12} /> Account Identity
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">Update Presence</h2>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Photo Selection */}
                            <div className='md:col-span-2'>
                                <PremiumFileUpload
                                    onFileSelect={handlePhotoSelect}
                                    label="Profile Picture"
                                    existingFile={user?.profile?.profilePhoto}
                                />
                            </div>

                            <div className='space-y-1.5'>
                                <label className={labelClasses}>Full Name</label>
                                <div className='relative'>
                                    <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input name="fullname" value={input.fullname} onChange={changeEventHandler} className={`${inputClasses} pl-12`} />
                                </div>
                            </div>

                            <div className='space-y-1.5'>
                                <label className={labelClasses}>Email Address</label>
                                <div className='relative'>
                                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input name="email" type="email" value={input.email} onChange={changeEventHandler} className={`${inputClasses} pl-12`} />
                                </div>
                            </div>

                            <div className='space-y-1.5'>
                                <label className={labelClasses}>Phone Number</label>
                                <div className='relative'>
                                    <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                    <input name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className={`${inputClasses} pl-12`} />
                                </div>
                            </div>

                            <div className='space-y-1.5'>
                                <label className={labelClasses}>Professional Bio</label>
                                <div className='relative flex items-start'>
                                    <FileText className='absolute left-4 top-4 text-gray-300' size={18} />
                                    <textarea name="bio" value={input.bio} onChange={changeEventHandler} rows={1} className={`${inputClasses} pl-12 resize-none`} />
                                </div>
                            </div>

                            {user?.role !== 'recruiter' && (
                                <>
                                    <div className='md:col-span-2 space-y-1.5'>
                                        <label className={labelClasses}>Skills (Comma Separated)</label>
                                        <div className='relative'>
                                            <Sparkles className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                                            <input name="skills" value={input.skills} onChange={changeEventHandler} className={`${inputClasses} pl-12`} placeholder="TypeScript, Next.js, AI Tools" />
                                        </div>
                                    </div>
                                    <div className='md:col-span-2'>
                                        <PremiumFileUpload
                                            onFileSelect={handleResumeSelect}
                                            label="Resume / Portfolio (PDF)"
                                            accept="application/pdf"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-16 rounded-3xl bg-black text-white hover:bg-gray-900 shadow-xl font-black text-lg transition-all active:scale-95 group"
                            >
                                {loading ? (
                                    <Loader2 className='animate-spin' size={24} />
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <CheckCircle2 size={24} />
                                        Save Changes
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="px-10 h-16 rounded-3xl border-gray-100 hover:bg-gray-50 font-black text-gray-400"
                            >
                                Back
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default UpdateProfileDialog
