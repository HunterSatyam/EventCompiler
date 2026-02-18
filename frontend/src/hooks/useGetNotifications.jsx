import { setAllNotifications } from '@/redux/notificationSlice'
import { NOTIFICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetNotifications = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${NOTIFICATION_API_END_POINT}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllNotifications(res.data.notifications));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchNotifications();
    }, [dispatch])
}

export default useGetNotifications
