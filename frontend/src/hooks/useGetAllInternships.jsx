import { setAllInternship } from '@/redux/internshipSlice'
import { INTERNSHIP_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllInternships = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllInternships = async () => {
            try {
                const res = await axios.get(`${INTERNSHIP_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllInternship(res.data.internships));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllInternships();
    }, [dispatch])
}

export default useGetAllInternships
