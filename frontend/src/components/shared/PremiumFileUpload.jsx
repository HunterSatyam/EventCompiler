import React, { useState, useRef } from 'react'
import { Upload, X, File, CheckCircle2, CloudUpload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PremiumFileUpload = ({ onFileSelect, existingFile, label = "Upload Image/Logo", accept = "image/*" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(existingFile || null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const processFile = (file) => {
        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className='w-full'>
            <label className='block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2'>{label}</label>

            <div
                className={`relative group cursor-pointer transition-all duration-300 ${dragActive
                        ? 'border-purple-500 bg-purple-50/50'
                        : 'border-gray-200 bg-gray-50/30 hover:bg-white hover:border-purple-200'
                    } border-2 border-dashed rounded-[24px] overflow-hidden`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                />

                <AnimatePresence mode='wait'>
                    {selectedFile || previewUrl ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className='p-6 flex items-center justify-between gap-4'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden shrink-0'>
                                    {previewUrl && accept.includes('image') ? (
                                        <img src={previewUrl} alt="Preview" className='w-full h-full object-contain' />
                                    ) : (
                                        <File size={28} className='text-purple-500' />
                                    )}
                                </div>
                                <div>
                                    <p className='font-bold text-gray-900 truncate max-w-[200px]'>
                                        {selectedFile ? selectedFile.name : "Existing Image"}
                                    </p>
                                    <p className='text-xs text-emerald-600 font-bold flex items-center gap-1'>
                                        <CheckCircle2 size={12} /> Ready to upload
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className='p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors'
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='py-12 px-6 flex flex-col items-center justify-center text-center'
                        >
                            <div className='w-16 h-16 bg-white rounded-[20px] shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500'>
                                <CloudUpload size={32} className='text-purple-500' />
                            </div>
                            <p className='font-black text-gray-900 text-lg mb-1'>Drop your file here</p>
                            <p className='text-sm text-gray-500 font-medium'>or click to browse your computer</p>
                            <div className='mt-6 px-4 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                                PNG, JPG or SVG Max 5MB
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dragging Overlay */}
                {dragActive && (
                    <div className='absolute inset-0 bg-purple-600/10 backdrop-blur-[2px] pointer-events-none flex items-center justify-center'>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className='bg-white p-4 rounded-3xl shadow-xl border border-purple-200'
                        >
                            <Upload size={40} className='text-purple-600 animate-bounce' />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PremiumFileUpload
