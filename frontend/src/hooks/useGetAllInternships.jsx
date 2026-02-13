import { setAllInternship } from '@/redux/internshipSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllInternships = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllInternships = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    const internships = res.data.jobs.filter(job => job.jobType === 'Internship');
                    dispatch(setAllInternship(internships));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllInternships();
    }, [dispatch])
}

export default useGetAllInternships
