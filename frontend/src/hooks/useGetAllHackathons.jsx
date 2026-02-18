import { setAllHackathons } from '@/redux/hackathonSlice'
import { HACKATHON_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllHackathons = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllHackathons = async () => {
            try {
                const res = await axios.get(`${HACKATHON_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllHackathons(res.data.hackathons));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllHackathons();
    }, [dispatch])
}

export default useGetAllHackathons
