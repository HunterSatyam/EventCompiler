import { setAllHackathons } from '@/redux/hackathonSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllHackathons = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllHackathons = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    const hackathons = res.data.jobs.filter(job => job.jobType === 'Hackathon');
                    dispatch(setAllHackathons(hackathons));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllHackathons();
    }, [dispatch])
}

export default useGetAllHackathons
