import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import InternshipCard from './InternshipCard'
import HackathonCard from './HackathonCard'
import WebinarCard from './WebinarCard'
import CompetitionCard from './CompetitionCard'
import CertificationCard from './CertificationCard'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import useGetAllInternships from '@/hooks/useGetAllInternships';
import useGetAllHackathons from '@/hooks/useGetAllHackathons';
import useGetAllWebinars from '@/hooks/useGetAllWebinars';
import useGetAllCompetitions from '@/hooks/useGetAllCompetitions';
import useGetAllCertifications from '@/hooks/useGetAllCertifications';
import { useSearchParams } from 'react-router-dom';

const Browse = () => {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('query');

    useGetAllJobs();
    useGetAllInternships();
    useGetAllHackathons();
    useGetAllWebinars();
    useGetAllCompetitions();
    useGetAllCertifications();

    const { allJobs } = useSelector(store => store.job);
    const { allInternship } = useSelector(store => store.internship);
    const { allHackathons } = useSelector(store => store.hackathon);
    const { allWebinars } = useSelector(store => store.webinar);
    const { allCompetitions } = useSelector(store => store.competition);
    const { allCertifications } = useSelector(store => store.certification);
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        if (queryParam) {
            dispatch(setSearchedQuery(queryParam));
        }
    }, [queryParam, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [])

    useEffect(() => {
        const combined = [
            ...(allJobs?.map(item => ({ ...item, type: 'job' })) || []),
            ...(allInternship?.map(item => ({ ...item, type: 'internship' })) || []),
            ...(allHackathons?.map(item => ({ ...item, type: 'hackathon' })) || []),
            ...(allWebinars?.map(item => ({ ...item, type: 'webinar' })) || []),
            ...(allCompetitions?.map(item => ({ ...item, type: 'competition' })) || []),
            ...(allCertifications?.map(item => ({ ...item, type: 'certification' })) || [])
        ];

        const query = (searchedQuery || queryParam || "").toLowerCase();

        if (query) {
            const temp = combined.filter(item => {
                const title = item.title?.toLowerCase() || "";
                const desc = item.description?.toLowerCase() || "";
                const type = item.type?.toLowerCase() || "";
                const location = item.location?.toLowerCase() || "";

                return title.includes(query) || desc.includes(query) || type.includes(query) || location.includes(query);
            });
            setAllEvents(temp);
        } else {
            setAllEvents(combined);
        }
    }, [allJobs, allInternship, allHackathons, allWebinars, allCompetitions, allCertifications, searchedQuery, queryParam]);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mb-10 mt-20 px-4'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allEvents.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        allEvents.map((item) => {
                            switch (item.type) {
                                case 'job':
                                    return <Job key={item._id} job={item} />;
                                case 'internship':
                                    return <InternshipCard key={item._id} job={item} />;
                                case 'hackathon':
                                    return <HackathonCard key={item._id} job={item} />;
                                case 'webinar':
                                    return <WebinarCard key={item._id} job={item} />;
                                case 'competition':
                                    return <CompetitionCard key={item._id} job={item} />;
                                case 'certification':
                                    return <CertificationCard key={item._id} job={item} />;
                                default:
                                    return <Job key={item._id} job={item} />;
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse
