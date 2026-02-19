import React, { useState } from 'react';
import axios from 'axios';
import { RESUME_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, Layout, User, Briefcase, GraduationCap, Code, Rocket, Download, Eye } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import ResumePreview from './ResumePreview';

const ResumeBuilder = () => {
    // Style Constants
    const labelClass = "block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 ml-1";
    const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all hover:border-blue-400 hover:shadow-md";

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview' for mobile
    const [resumeData, setResumeData] = useState({
        title: "Full Stack Developer",
        personalInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            linkedin: "linkedin.com/in/johndoe",
            github: "github.com/johndoe",
            portfolio: "johndoe.dev",
            summary: "Passionate Full Stack Developer with 3+ years of experience building scalable web applications using MERN stack. Proven ability to lead teams and deliver high-quality code on time."
        },
        education: [{
            institution: "University of Technology",
            degree: "B.Sc. Computer Science",
            startDate: "2018-09-01",
            endDate: "2022-05-01",
            current: false
        }],
        experience: [{
            company: "Tech Solutions Inc.",
            role: "Software Engineer",
            startDate: "2022-06-01",
            endDate: "",
            current: true,
            location: "San Francisco, CA",
            description: "• Developed and maintained key features for the main product dashboard using React and Node.js.\n• Optimized database queries, reducing load times by 30%.\n• Collaborated with cross-functional teams to define requirements and deliver solutions."
        }],
        projects: [{
            title: "E-commerce Platform",
            description: "A full-featured e-commerce application with user authentication, product management, and payment integration.",
            technologies: "React, Redux, Node.js, MongoDB, Stripe",
            link: "https://shop-demo.com"
        }],
        skills: "JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS, Git, CI/CD"
    });

    const steps = [
        { id: 1, title: "Personal Details", icon: <User size={18} /> },
        { id: 2, title: "Experience", icon: <Briefcase size={18} /> },
        { id: 3, title: "Projects", icon: <Rocket size={18} /> },
        { id: 4, title: "Education", icon: <GraduationCap size={18} /> },
        { id: 5, title: "Skills", icon: <Code size={18} /> },
    ];

    const handleInputChange = (e, section, index = null, field = null) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (section === "personalInfo" || section === "skills" || section === "title") {
            if (section === "title") {
                setResumeData({ ...resumeData, title: value });
            } else if (section === "skills") {
                setResumeData({ ...resumeData, skills: value });
            } else {
                setResumeData({ ...resumeData, [section]: { ...resumeData[section], [e.target.name]: value } });
            }
        } else {
            const updatedSection = [...resumeData[section]];
            updatedSection[index][field] = value;
            setResumeData({ ...resumeData, [section]: updatedSection });
        }
    };

    const addField = (section, template) => {
        setResumeData({ ...resumeData, [section]: [...resumeData[section], template] });
    };

    const removeField = (section, index) => {
        const updatedSection = [...resumeData[section]];
        updatedSection.splice(index, 1);
        setResumeData({ ...resumeData, [section]: updatedSection });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formattedData = {
                ...resumeData,
                skills: resumeData.skills.split(',').map(s => s.trim())
            };
            const res = await axios.post(`${RESUME_API_END_POINT}/create`, formattedData, { withCredentials: true });
            if (res.data.success) {
                toast.success("Resume saved successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save resume.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleDownloadPDF = () => {
        const element = document.getElementById('resume-preview');
        if (!element) {
            toast.error("Resume preview not found.");
            return;
        }

        // Clone the element to ensure a clean capture without UI scaling interference
        const clone = element.cloneNode(true);

        // Sanitize clone to avoid oklch errors (from Tailwind v4 shadows/colors)
        clone.style.boxShadow = 'none';
        clone.classList.remove('shadow-2xl');
        clone.style.backgroundColor = '#ffffff';
        if (clone.classList.contains('bg-white')) clone.classList.remove('bg-white');

        // Create a temporary container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.left = '0';
        container.style.width = '210mm'; // Force A4 width
        container.style.zIndex = '-1';
        container.appendChild(clone);
        document.body.appendChild(container);

        const opt = {
            margin: 0,
            filename: `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || ''}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        toast.info("Generating PDF...");

        html2pdf().from(clone).set(opt).save().then(() => {
            document.body.removeChild(container);
            toast.success("Resume downloaded successfully!");
        }).catch(error => {
            console.error("PDF Export failed:", error);
            toast.error("Failed to export PDF.");
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Layout size={20} />
                    </div>
                    <h1 className="font-bold text-gray-800 text-lg">Resume<span className="text-blue-600">Builder</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-gray-600" onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}>
                        {activeTab === 'edit' ? <Eye /> : <Layout />}
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
                        {loading ? "Saving..." : "Save Resume"} <Save size={16} />
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg">
                        Export PDF <Download size={16} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Steps */}
                <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex shrink-0">
                    <div className="p-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sections</p>
                        <nav className="space-y-1">
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentStep === step.id
                                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {step.icon}
                                    {step.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex overflow-hidden relative">
                    {/* Form Panel */}
                    <div className={`flex-1 overflow-y-auto p-6 md:p-10 transition-transform duration-300 ${activeTab === 'preview' ? '-translate-x-full absolute w-full' : 'translate-x-0'} md:translate-x-0 md:static md:w-1/2 bg-gray-50/50`}>
                        <div className="max-w-2xl mx-auto pb-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
                                <p className="text-gray-500 text-sm mt-1">Fill in the details below to complete your resume.</p>
                            </div>

                            {/* Dynamic Form Content */}
                            <div className="space-y-6">
                                {currentStep === 1 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="col-span-2">
                                                    <label className={labelClass}>Resume Title</label>
                                                    <input type="text" value={resumeData.title} onChange={(e) => handleInputChange(e, 'title')} className={inputClass} placeholder="e.g. Full Stack Developer" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className={labelClass}>Portfolio / Website</label>
                                                    <input type="text" name="portfolio" value={resumeData.personalInfo.portfolio} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} placeholder="https://johndoe.dev" />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>First Name</label>
                                                    <input type="text" name="firstName" value={resumeData.personalInfo.firstName} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Last Name</label>
                                                    <input type="text" name="lastName" value={resumeData.personalInfo.lastName} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClass}>Email Address</label>
                                                    <input type="email" name="email" value={resumeData.personalInfo.email} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClass}>Phone Number</label>
                                                    <input type="tel" name="phone" value={resumeData.personalInfo.phone} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClass}>LinkedIn Profile</label>
                                                    <input type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} placeholder="linkedin.com/in/..." />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClass}>GitHub Profile</label>
                                                    <input type="text" name="github" value={resumeData.personalInfo.github} onChange={(e) => handleInputChange(e, 'personalInfo')} className={inputClass} placeholder="github.com/..." />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className={labelClass}>Professional Summary</label>
                                                    <textarea name="summary" value={resumeData.personalInfo.summary} onChange={(e) => handleInputChange(e, 'personalInfo')} className="input-field h-32 resize-none leading-relaxed" placeholder="Write a brief summary of your career, key skills, and what you bring to the table..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        {resumeData.experience.map((exp, index) => (
                                            <div key={index} className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 relative group transition-all hover:shadow-md">
                                                <button onClick={() => removeField('experience', index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowLeft size={16} className="rotate-45" /></button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2 md:col-span-1">
                                                        <label className={labelClass}>Job Title</label>
                                                        <input type="text" value={exp.role} onChange={(e) => handleInputChange(e, 'experience', index, 'role')} className={inputClass} placeholder="e.g. Software Engineer" />
                                                    </div>
                                                    <div className="col-span-2 md:col-span-1">
                                                        <label className={labelClass}>Company</label>
                                                        <input type="text" value={exp.company} onChange={(e) => handleInputChange(e, 'experience', index, 'company')} className={inputClass} placeholder="e.g. Google" />
                                                    </div>
                                                    <div className="col-span-2 md:col-span-1">
                                                        <label className={labelClass}>Location</label>
                                                        <input type="text" value={exp.location} onChange={(e) => handleInputChange(e, 'experience', index, 'location')} className={inputClass} placeholder="e.g. New York, NY" />
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-2 mb-2">
                                                        <input type="checkbox" id={`current-work-${index}`} checked={exp.current} onChange={(e) => handleInputChange(e, 'experience', index, 'current')} className="rounded text-blue-600 focus:ring-blue-500" />
                                                        <label htmlFor={`current-work-${index}`} className="text-sm text-gray-600">I currently work here</label>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Start Date</label>
                                                        <input type="date" value={exp.startDate} onChange={(e) => handleInputChange(e, 'experience', index, 'startDate')} className={inputClass} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>End Date</label>
                                                        <input type="date" value={exp.endDate} onChange={(e) => handleInputChange(e, 'experience', index, 'endDate')} disabled={exp.current} className="input-field disabled:bg-gray-100 disabled:text-gray-400" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className={labelClass}>Description</label>
                                                        <textarea value={exp.description} onChange={(e) => handleInputChange(e, 'experience', index, 'description')} className="input-field h-32 resize-none" placeholder="Describe your responsibilities and achievements..." />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addField('experience', { company: "", role: "", startDate: "", endDate: "", current: false, description: "", location: "" })} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                            <Briefcase size={18} /> Add Position
                                        </button>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        {resumeData.projects.map((proj, index) => (
                                            <div key={index} className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 relative group transition-all hover:shadow-md">
                                                <button onClick={() => removeField('projects', index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowLeft size={16} className="rotate-45" /></button>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <label className={labelClass}>Project Title</label>
                                                        <input type="text" value={proj.title} onChange={(e) => handleInputChange(e, 'projects', index, 'title')} className={inputClass} placeholder="e.g. E-commerce Platform" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Link (Optional)</label>
                                                        <input type="text" value={proj.link} onChange={(e) => handleInputChange(e, 'projects', index, 'link')} className={inputClass} placeholder="https://..." />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Technologies Used</label>
                                                        <input type="text" value={proj.technologies} onChange={(e) => handleInputChange(e, 'projects', index, 'technologies')} className={inputClass} placeholder="e.g. React, Node.js, MongoDB" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Description</label>
                                                        <textarea value={proj.description} onChange={(e) => handleInputChange(e, 'projects', index, 'description')} className="input-field h-24 resize-none" placeholder="What did you build and what impact did it have?" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addField('projects', { title: "", description: "", technologies: "", link: "" })} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                            <Rocket size={18} /> Add Project
                                        </button>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        {resumeData.education.map((edu, index) => (
                                            <div key={index} className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 relative group transition-all hover:shadow-md">
                                                <button onClick={() => removeField('education', index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowLeft size={16} className="rotate-45" /></button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <label className={labelClass}>School / University</label>
                                                        <input type="text" value={edu.institution} onChange={(e) => handleInputChange(e, 'education', index, 'institution')} className={inputClass} />
                                                    </div>
                                                    <div className="col-span-2 md:col-span-1">
                                                        <label className={labelClass}>Degree</label>
                                                        <input type="text" value={edu.degree} onChange={(e) => handleInputChange(e, 'education', index, 'degree')} className={inputClass} placeholder="e.g. B.Sc. Computer Science" />
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-2 mb-2">
                                                        <input type="checkbox" id={`current-edu-${index}`} checked={edu.current} onChange={(e) => handleInputChange(e, 'education', index, 'current')} className="rounded text-blue-600 focus:ring-blue-500" />
                                                        <label htmlFor={`current-edu-${index}`} className="text-sm text-gray-600">I am currently studying here</label>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Start Date</label>
                                                        <input type="date" value={edu.startDate} onChange={(e) => handleInputChange(e, 'education', index, 'startDate')} className={inputClass} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>End Date</label>
                                                        <input type="date" value={edu.endDate} onChange={(e) => handleInputChange(e, 'education', index, 'endDate')} disabled={edu.current} className="input-field disabled:bg-gray-100 disabled:text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addField('education', { institution: "", degree: "", startDate: "", endDate: "", current: false })} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                            <GraduationCap size={18} /> Add Education
                                        </button>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="space-y-4">
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <label className="label mb-2 block text-lg">Skills</label>
                                            <p className="text-sm text-gray-500 mb-4">Add your technical skills separated by commas.</p>
                                            <textarea value={resumeData.skills} onChange={(e) => handleInputChange(e, 'skills')} className="input-field h-40 text-base leading-relaxed" placeholder="e.g. React, Node.js, Python, Project Management, SEO..." />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Navigation Buttons - Static at bottom of content */}
                            <div className="mt-8 flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors">
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <div className="flex gap-2">
                                    {currentStep < steps.length && (
                                        <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-colors shadow-lg shadow-gray-200">
                                            Next Step <ArrowRight size={18} />
                                        </button>
                                    )}
                                    {currentStep === steps.length && (
                                        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                            {loading ? "Saving..." : "Finish Resume"} <Save size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel (Hidden on mobile by default) */}
                    <div className={`flex-1 bg-gray-200 overflow-y-auto p-4 md:p-8 transition-transform duration-300 ${activeTab === 'edit' ? 'translate-x-full absolute w-full' : 'translate-x-0'} md:translate-x-0 md:static md:block hidden-scrollbar`}>
                        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] sticky top-8 scale-90 md:scale-100 origin-top transition-transform">
                            <ResumePreview data={resumeData} />
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                .hidden-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
            `}</style>
        </div>
    );
};

export default ResumeBuilder;
