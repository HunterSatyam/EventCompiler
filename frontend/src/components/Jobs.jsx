import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import InternshipCard from './InternshipCard';
import HackathonCard from './HackathonCard';
import WebinarCard from './WebinarCard';
import CompetitionCard from './CompetitionCard';
import CertificationCard from './CertificationCard';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import useGetAllInternships from '@/hooks/useGetAllInternships';
import useGetAllHackathons from '@/hooks/useGetAllHackathons';
import useGetAllWebinars from '@/hooks/useGetAllWebinars';
import useGetAllCompetitions from '@/hooks/useGetAllCompetitions';
import useGetAllCertifications from '@/hooks/useGetAllCertifications';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    // Fetch all data in case of direct access/refresh
    useGetAllJobs();
    useGetAllInternships();
    useGetAllHackathons();
    useGetAllWebinars();
    useGetAllCompetitions();
    useGetAllCertifications();

    const { allJobs, searchedQuery, filters } = useSelector(store => store.job);
    const { allInternship } = useSelector(store => store.internship);
    const { allHackathons } = useSelector(store => store.hackathon);
    const { allWebinars } = useSelector(store => store.webinar);
    const { allCompetitions } = useSelector(store => store.competition);
    const { allCertifications } = useSelector(store => store.certification);

    const [allEvents, setAllEvents] = useState([]);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
        // Combine all events with explicit jobType
        const jobs = allJobs?.map(item => ({ ...item, jobType: item.jobType || 'Job' })) || [];
        const internships = allInternship?.map(item => ({ ...item, jobType: 'Internship' })) || [];
        const hackathons = allHackathons?.map(item => ({ ...item, jobType: 'Hackathon' })) || [];
        const webinars = allWebinars?.map(item => ({ ...item, jobType: 'Webinar' })) || [];
        const competitions = allCompetitions?.map(item => ({ ...item, jobType: 'Competition' })) || [];
        const certifications = allCertifications?.map(item => ({ ...item, jobType: 'Certification' })) || [];

        const combined = [
            ...jobs,
            ...internships,
            ...hackathons,
            ...webinars,
            ...competitions,
            ...certifications
        ];

        // Sort by createdAt descending
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAllEvents(combined);
    }, [allJobs, allInternship, allHackathons, allWebinars, allCompetitions, allCertifications]);

    useEffect(() => {
        let filteredEvents = allEvents;

        // 1. Global Search from Home/Hero
        if (searchedQuery) {
            filteredEvents = filteredEvents.filter((job) => {
                return job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.jobType?.toLowerCase().includes(searchedQuery.toLowerCase())
            });
        }

        // 2. Sidebar Filters - Title
        if (filters.title) {
            filteredEvents = filteredEvents.filter(job =>
                job.title?.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        // 3. Sidebar Filters - Type
        if (filters.type) {
            filteredEvents = filteredEvents.filter(job => {
                const type = filters.type.toLowerCase();
                const jobType = job.jobType?.toLowerCase() || '';

                if (type === 'jobs') return jobType.includes('job');
                if (type === 'internships') return jobType.includes('internship');
                if (type === 'hackathons') return jobType.includes('hackathon');
                if (type === 'webinars') return jobType.includes('webinar');
                if (type === 'certification' || type === 'certification program') return jobType.includes('certification');
                if (type === 'competition') return jobType.includes('competition');

                return jobType.includes(type);
            });
        }

        // 4. Sidebar Filters - Location
        if (filters.location) {
            filteredEvents = filteredEvents.filter(job =>
                job.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // 5. Sidebar Filters - Industry
        if (filters.industry) {
            filteredEvents = filteredEvents.filter(job => {
                const term = filters.industry.toLowerCase();
                return job.title?.toLowerCase().includes(term) ||
                    job.description?.toLowerCase().includes(term);
            });
        }

        // 6. Date Filter
        if (filters.date) {
            const now = new Date();
            const filterDate = new Date();
            let applyDateFilter = true;

            if (filters.date === "Last 24 Hours") {
                filterDate.setDate(now.getDate() - 1);
            } else if (filters.date === "Last 7 Days") {
                filterDate.setDate(now.getDate() - 7);
            } else if (filters.date === "Last Month") {
                filterDate.setMonth(now.getMonth() - 1);
            } else if (filters.date === "Anytime") {
                applyDateFilter = false;
            }

            if (applyDateFilter) {
                filteredEvents = filteredEvents.filter(job => {
                    const jobDate = new Date(job.createdAt);
                    return jobDate >= filterDate;
                });
            }
        }

        // 7. Income Filter
        if (filters.income) {
            filteredEvents = filteredEvents.filter(job => {
                // Determine salary/stipend/prize/fee
                // Normalize to a single 'incomeValue'
                let incomeValue = 0;

                if (job.salary !== undefined) incomeValue = Number(job.salary);
                else if (job.stipend !== undefined) incomeValue = Number(job.stipend) * 12; // annualized for internships
                else if (job.prize !== undefined && typeof job.prize === 'number') incomeValue = Number(job.prize); // Only if prize is a number
                // For webinars/certifications, 'fee' is a cost, not income. So they won't match income filters unless fee is 0.

                // Normalizing if value is in LPA (e.g., '5' for 5LPA)
                if (incomeValue < 100 && incomeValue > 0) incomeValue = incomeValue * 100000;

                if (filters.income === "0-3LPA") {
                    return incomeValue < 300000;
                } else if (filters.income === "3LPA-6LPA") {
                    return incomeValue >= 300000 && incomeValue < 600000;
                } else if (filters.income === "6LPA-10LPA") {
                    return incomeValue >= 600000 && incomeValue < 1000000;
                } else if (filters.income === "10LPA-25LPA") {
                    return incomeValue >= 1000000 && incomeValue < 2500000;
                } else if (filters.income === "25LPA+") {
                    return incomeValue >= 2500000;
                }
                return true;
            });
        }

        setFilterJobs(filteredEvents);
    }, [allEvents, searchedQuery, filters]);


    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-8'>
                    <div className='w-[20%] min-w-[250px]'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? (
                            <div className='flex-1 h-[88vh] flex items-center justify-center flex-col gap-4 bg-white rounded-xl shadow-lg border border-dashed border-gray-200'>
                                <img src="https://cdni.iconscout.com/illustration/premium/thumb/job-search-3428242-2902696.png" alt="No events" className='w-40 opacity-70 grayscale' />
                                <span className='text-xl font-bold text-gray-500'>No events found matching your criteria</span>
                                <p className='text-gray-400'>Try adjusting your filters or search query</p>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                {(() => {
                                                    const type = job?.jobType?.toLowerCase() || '';
                                                    if (type === 'internship') return <InternshipCard job={job} />;
                                                    if (type === 'hackathon') return <HackathonCard job={job} />;
                                                    if (type === 'webinar') return <WebinarCard job={job} />;
                                                    if (type === 'competition') return <CompetitionCard job={job} />;
                                                    if (type === 'certification') return <CertificationCard job={job} />;
                                                    return <Job job={job} />;
                                                })()}
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs