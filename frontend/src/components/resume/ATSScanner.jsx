import React, { useState } from 'react';
import axios from 'axios';
import { ATS_API_END_POINT } from '@/utils/constant';
import { Loader2, Upload, FileText, CheckCircle, XCircle, AlertCircle, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ATSScanner = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(selectedFile);
        } else {
            toast.error("Please upload a PDF or DOCX file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobDescription) {
            toast.error("Please provide both a resume and a job description.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription);

        try {
            const res = await axios.post(`${ATS_API_END_POINT}/check`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                setResult(res.data.data);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Helper for categorized suggestions
    const criticalSuggestions = result?.detailedAnalysis?.suggestions?.filter(s => s.type === "Critical") || [];
    const recommendedSuggestions = result?.detailedAnalysis?.suggestions?.filter(s => s.type !== "Critical") || [];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                        Smart <span className="text-blue-600">ATS Scanner</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Optimize your resume for Applicant Tracking Systems. Get instant feedback and actionable suggestions to land your dream job.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Input Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl h-fit">
                        <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Upload className="text-blue-600" /> Upload Your Details
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* File Upload */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload Resume (PDF/DOCX)
                                    </label>
                                    <div className="relative w-full">
                                        <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400'}`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {file ? (
                                                    <>
                                                        <FileText className="w-10 h-10 text-green-500 mb-3" />
                                                        <p className="text-sm text-green-700 font-medium">{file.name}</p>
                                                        <p className="text-xs text-green-500 mt-1">Ready to scan</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                                                        <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                                                        <p className="text-xs text-gray-400 mt-1">PDF or DOCX (MAX. 5MB)</p>
                                                    </>
                                                )}
                                            </div>
                                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                                        </label>
                                        {file && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                                className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Description
                                    </label>
                                    <textarea
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] text-sm leading-relaxed transition-shadow shadow-sm focus:shadow-md resize-none"
                                        placeholder="Paste the full job description here for the most accurate match analysis..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !file || !jobDescription}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/30 font-bold text-lg flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" /> Analyzing Resume...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" /> Scan My Resume
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Results Dashboard */}
                    <div className="space-y-6">
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <TrendingUp className="w-10 h-10 text-blue-400 opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Scan Results Yet</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Upload your resume and the job description to get a detailed ATS compatibility report.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">

                                {/* Score Card */}
                                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-full h-1 ${result.score >= 70 ? 'bg-green-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="text-center md:text-left">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">ATS Compatibility Score</h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-6xl font-black ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {result.score}
                                                </span>
                                                <span className="text-2xl text-gray-400 font-bold">/100</span>
                                            </div>
                                            <p className={`mt-2 text-sm font-medium ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                {result.score >= 80 ? 'Excellent Match! 🚀' :
                                                    result.score >= 60 ? 'Good Match, but needs polish 👍' :
                                                        'Needs Improvement ⚠️'}
                                            </p>
                                        </div>

                                        {/* Radial Progress Gauge (Simplified CSS) */}
                                        <div className="relative w-32 h-32">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path
                                                    className="text-gray-100"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3.8"
                                                />
                                                <path
                                                    className={`${result.score >= 70 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                                    strokeDasharray={`${result.score}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3.8"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-xs">
                                                SCORE
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Keyword Analysis Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                        <CheckCircle className="w-5 h-5 text-blue-500" /> Keyword Analysis
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">✅ Matched Keywords</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.matchedKeywords?.length > 0 ? (
                                                    result.matchedKeywords.map((k, i) => (
                                                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold lowercase">
                                                            {k}
                                                        </span>
                                                    ))
                                                ) : <span className="text-gray-400 italic text-sm">No exact matches found.</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">❌ Missing Keywords (Add these!)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.missingKeywords?.length > 0 ? (
                                                    result.missingKeywords.slice(0, 15).map((k, i) => (
                                                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100 lowercase">
                                                            {k}
                                                        </span>
                                                    ))
                                                ) : <span className="text-green-500 italic text-sm">Great job! No major keywords missing.</span>}
                                                {result.missingKeywords?.length > 15 && (
                                                    <span className="text-xs text-gray-400 mt-1 block">...and {result.missingKeywords.length - 15} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Suggestions */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" /> Improvement Suggestions
                                    </h3>

                                    {/* Critical Issues */}
                                    {criticalSuggestions.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1 uppercase tracking-wide text-xs">
                                                <XCircle size={14} /> Critical Fixes
                                            </h4>
                                            <ul className="space-y-2">
                                                {criticalSuggestions.map((s, i) => (
                                                    <li key={i} className="p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        {s.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Recommended Improvements */}
                                    {recommendedSuggestions.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide text-xs">
                                                Recommended Tweaks
                                            </h4>
                                            <ul className="space-y-2">
                                                {recommendedSuggestions.map((s, i) => (
                                                    <li key={i} className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 flex items-start gap-2">
                                                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                                                        {s.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {criticalSuggestions.length === 0 && recommendedSuggestions.length === 0 && (
                                        <div className="text-center py-6 text-green-600 font-medium">
                                            Everything looks great! You are ready to apply. 🌟
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSScanner;
