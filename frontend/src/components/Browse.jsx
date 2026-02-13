import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import useGetAllInternships from '@/hooks/useGetAllInternships';
import useGetAllHackathons from '@/hooks/useGetAllHackathons';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

const Browse = () => {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('query');

    useGetAllJobs();
    useGetAllInternships();
    useGetAllHackathons();

    const { allJobs } = useSelector(store => store.job);
    const { allInternship } = useSelector(store => store.internship);
    const { allHackathons } = useSelector(store => store.hackathon);
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
        const combined = [...allJobs, ...(allInternship || []), ...(allHackathons || [])];
        const query = (searchedQuery || queryParam || "").toLowerCase();

        if (query) {
            const temp = combined.filter(item => {
                const title = item.title?.toLowerCase() || "";
                const desc = item.description?.toLowerCase() || "";
                const type = item.jobType?.toLowerCase() || "";
                const location = item.location?.toLowerCase() || "";

                // Special handling for "Job" query to match generic jobs (non-internship/non-hackathon)
                if (query === 'job' || query === 'jobs') {
                    if (type === 'job' || (type !== 'internship' && type !== 'hackathon')) {
                        return true;
                    }
                }

                return title.includes(query) || desc.includes(query) || type.includes(query) || location.includes(query);
            });
            setAllEvents(temp);
        } else {
            setAllEvents(combined);
        }
    }, [allJobs, allInternship, allHackathons, searchedQuery, queryParam]);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mb-10 mt-20 px-4'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allEvents.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        allEvents.map((job) => {
                            return (
                                <Job key={job._id} job={job} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse
