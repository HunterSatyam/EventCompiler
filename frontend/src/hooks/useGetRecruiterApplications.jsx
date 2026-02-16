import { setAllRecruiterApplications } from '@/redux/applicationSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetRecruiterApplications = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRecruiterApplications = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/recruiter/applications`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllRecruiterApplications(res.data.applications));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchRecruiterApplications();
    }, [dispatch])
}

export default useGetRecruiterApplications
