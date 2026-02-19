import React from 'react';
import { Mail, Phone, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data, template = 'modern' }) => {
    const { personalInfo, education, experience, projects, skills } = data;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Modern Template
    if (template === 'modern') {
        return (
            <div className="w-full h-full bg-white shadow-2xl p-8 md:p-12 min-h-[1123px] text-[#1f2937] font-sans" id="resume-preview">
                {/* Header */}
                <header className="border-b-2 border-[#111827] pb-6 mb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] uppercase tracking-tight mb-2">
                        {personalInfo.firstName} <span className="text-[#2563eb]">{personalInfo.lastName}</span>
                    </h1>
                    <p className="text-xl text-[#4b5563] font-medium mb-4">{data.title}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-[#4b5563]">
                        {personalInfo.email && (
                            <div className="flex items-center gap-1">
                                <Mail size={14} className="text-[#2563eb]" />
                                <span>{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-1">
                                <Phone size={14} className="text-[#2563eb]" />
                                <span>{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-1">
                                <Linkedin size={14} className="text-[#2563eb]" />
                                <span>{personalInfo.linkedin}</span>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-1">
                                <Github size={14} className="text-[#2563eb]" />
                                <span>{personalInfo.github}</span>
                            </div>
                        )}
                        {personalInfo.portfolio && (
                            <div className="flex items-center gap-1">
                                <Globe size={14} className="text-[#2563eb]" />
                                <span>{personalInfo.portfolio}</span>
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Summary */}
                        {personalInfo.summary && (
                            <section>
                                <h2 className="text-lg font-bold text-[#111827] uppercase border-b border-[#e5e7eb] pb-1 mb-3">Professional Summary</h2>
                                <p className="text-sm leading-relaxed text-[#374151] whitespace-pre-line">
                                    {personalInfo.summary}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {experience?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-[#111827] uppercase border-b border-[#e5e7eb] pb-1 mb-4">Experience</h2>
                                <div className="space-y-6">
                                    {experience.map((exp, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-[#1f2937]">{exp.role}</h3>
                                                <span className="text-xs font-semibold text-[#6b7280] bg-[#f3f4f6] px-2 py-1 rounded">
                                                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#2563eb] font-medium mb-2">
                                                <BriefcaseIcon size={14} />
                                                {exp.company}
                                                {exp.location && <span className="text-[#9ca3af]">• {exp.location}</span>}
                                            </div>
                                            <p className="text-sm text-[#4b5563] leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {projects?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-[#111827] uppercase border-b border-[#e5e7eb] pb-1 mb-4">Projects</h2>
                                <div className="space-y-5">
                                    {projects.map((proj, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-[#1f2937]">{proj.title}</h3>
                                                {proj.link && (
                                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#3b82f6] flex items-center gap-1 hover:underline">
                                                        View Project <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-xs text-[#2563eb] font-mono mb-2">{proj.technologies}</p>
                                            <p className="text-sm text-[#4b5563] leading-relaxed">
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8">
                        {/* Education */}
                        {education?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-[#111827] uppercase border-b border-[#e5e7eb] pb-1 mb-4">Education</h2>
                                <div className="space-y-4">
                                    {education.map((edu, index) => (
                                        <div key={index}>
                                            <h3 className="font-bold text-[#1f2937] text-sm">{edu.institution}</h3>
                                            <p className="text-sm text-[#2563eb]">{edu.degree}</p>
                                            <p className="text-xs text-[#6b7280] mt-1">
                                                {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {skills && (
                            <section>
                                <h2 className="text-lg font-bold text-[#111827] uppercase border-b border-[#e5e7eb] pb-1 mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.split(',').map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-[#f3f4f6] text-[#374151] text-xs font-semibold rounded-full border border-[#e5e7eb]">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Simple Icon component to avoid import errors if lucide-react changes
const BriefcaseIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default ResumePreview;
