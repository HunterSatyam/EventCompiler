import React from 'react'
import { Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setSavedEvents } from '@/redux/authSlice'
import { toast } from 'sonner'

const LikeButton = ({ eventId, eventType, className }) => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const isSaved = user?.savedEvents?.some(event => {
        const savedId = typeof event.eventId === 'object' ? event.eventId._id : event.eventId;
        return savedId === eventId;
    });

    const toggleSave = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to save events");
            return;
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/toggle-save`, {
                eventId,
                eventType
            }, { withCredentials: true });

            if (res.data.success) {
                // Update Redux state
                let updatedSavedEvents = [...(user.savedEvents || [])];

                if (res.data.isSaved) {
                    updatedSavedEvents.push({ eventType, eventId });
                    toast.success("Event Saved");
                } else {
                    updatedSavedEvents = updatedSavedEvents.filter(event => {
                        const savedId = typeof event.eventId === 'object' ? event.eventId._id : event.eventId;
                        return savedId !== eventId;
                    });
                    toast.success("Event Removed");
                }

                dispatch(setSavedEvents(updatedSavedEvents));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to toggle save");
        }
    }

    return (
        <Button
            onClick={toggleSave}
            variant="ghost"
            size="icon"
            className={`rounded-full transition-all z-10 ${isSaved ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-white/70 hover:text-white hover:bg-white/10'} ${className}`}
        >
            <Heart className={isSaved ? "fill-current" : ""} size={20} />
        </Button>
    )
}

export default LikeButton
