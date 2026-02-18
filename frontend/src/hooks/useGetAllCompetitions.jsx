import { setAllCompetitions } from '@/redux/competitionSlice'
import { COMPETITION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompetitions = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllCompetitions = async () => {
            try {
                const res = await axios.get(`${COMPETITION_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllCompetitions(res.data.competitions));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllCompetitions();
    }, [dispatch])
}

export default useGetAllCompetitions
