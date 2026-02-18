import { setAllAdminJobs } from '@/redux/jobSlice'
import {
    JOB_API_END_POINT,
    INTERNSHIP_API_END_POINT,
    HACKATHON_API_END_POINT,
    WEBINAR_API_END_POINT,
    COMPETITION_API_END_POINT,
    CERTIFICATION_API_END_POINT
} from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllAdminPosts = async () => {
            try {
                const fetchSafely = async (url, key) => {
                    try {
                        const res = await axios.get(url, { withCredentials: true });
                        if (res.data.success) {
                            return res.data[key] || [];
                        }
                    } catch (error) {
                        // If 404 or other error, return empty array
                        return [];
                    }
                    return [];
                };

                const [jobs, internships, hackathons, webinars, competitions, certifications] = await Promise.all([
                    fetchSafely(`${JOB_API_END_POINT}/getadminjobs`, 'jobs'),
                    fetchSafely(`${INTERNSHIP_API_END_POINT}/getadmininternships`, 'internships'),
                    fetchSafely(`${HACKATHON_API_END_POINT}/getadminhackathons`, 'hackathons'),
                    fetchSafely(`${WEBINAR_API_END_POINT}/getadminwebinars`, 'webinars'),
                    fetchSafely(`${COMPETITION_API_END_POINT}/getadmincompetitions`, 'competitions'),
                    fetchSafely(`${CERTIFICATION_API_END_POINT}/getadmincertifications`, 'certifications')
                ]);

                // Add jobType manually if missing and merge
                const allPosts = [
                    ...jobs.map(item => ({ ...item, jobType: item.jobType || 'Job' })), // Jobs usually have jobType
                    ...internships.map(item => ({ ...item, jobType: 'Internship' })),
                    ...hackathons.map(item => ({ ...item, jobType: 'Hackathon' })),
                    ...webinars.map(item => ({ ...item, jobType: 'Webinar' })),
                    ...competitions.map(item => ({ ...item, jobType: 'Competition' })),
                    ...certifications.map(item => ({ ...item, jobType: 'Certification' }))
                ];

                // Sort by createdAt descending
                allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                dispatch(setAllAdminJobs(allPosts));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminPosts();
    }, [dispatch])
}

export default useGetAllAdminJobs
