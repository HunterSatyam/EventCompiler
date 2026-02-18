import { setAllWebinars } from '@/redux/webinarSlice'
import { WEBINAR_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllWebinars = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllWebinars = async () => {
            try {
                const res = await axios.get(`${WEBINAR_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllWebinars(res.data.webinars));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllWebinars();
    }, [dispatch])
}

export default useGetAllWebinars
