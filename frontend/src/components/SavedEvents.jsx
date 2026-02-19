import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import Job from './Job'
import InternshipCard from './InternshipCard'
import HackathonCard from './HackathonCard'
import WebinarCard from './WebinarCard'
import CompetitionCard from './CompetitionCard'
import CertificationCard from './CertificationCard'
import { motion } from 'framer-motion'
import { HeartOff, Loader2 } from 'lucide-react'

const SavedEvents = () => {
    const [savedEvents, setSavedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedEvents = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/saved`, { withCredentials: true });
                if (res.data.success) {
                    setSavedEvents(res.data.savedEvents);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedEvents();
    }, []);

    const renderEventCard = (item) => {
        const { eventType, eventId } = item;
        // eventId is populated with the actual event object
        const event = eventId;

        if (!event) return null; // Handle deleted events

        switch (eventType) {
            case 'Job':
                return <Job job={event} key={event._id} />;
            case 'Internship':
                return <InternshipCard job={event} key={event._id} />;
            case 'Hackathon':
                return <HackathonCard job={event} key={event._id} />;
            case 'Webinar':
                return <WebinarCard job={event} key={event._id} />;
            case 'Competition':
                return <CompetitionCard job={event} key={event._id} />;
            case 'Certification':
                return <CertificationCard job={event} key={event._id} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#F8F9FF] flex items-center justify-center'>
                <Loader2 className='animate-spin text-purple-600' size={40} />
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#F8F9FF]'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='text-3xl font-black text-gray-900 mb-8'>Saved Events</h1>

                {savedEvents.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm'>
                        <div className='bg-gray-50 p-6 rounded-full text-gray-400 mb-6'>
                            <HeartOff size={48} />
                        </div>
                        <h2 className='text-xl font-bold text-gray-900'>No saved events yet</h2>
                        <p className='text-gray-500 mt-2'>Events you like will appear here</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {savedEvents.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={item._id}
                                className="relative"
                            >
                                {renderEventCard(item)}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default SavedEvents
