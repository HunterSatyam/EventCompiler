import { setAllCertifications } from '@/redux/certificationSlice'
import { CERTIFICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCertifications = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllCertifications = async () => {
            try {
                const res = await axios.get(`${CERTIFICATION_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllCertifications(res.data.certifications));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllCertifications();
    }, [dispatch])
}

export default useGetAllCertifications
