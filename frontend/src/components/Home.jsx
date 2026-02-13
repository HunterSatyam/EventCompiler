
import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import LatestInternship from './LatestInternship'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import useGetAllInternships from '@/hooks/useGetAllInternships'
import useGetAllHackathons from '@/hooks/useGetAllHackathons'
import LatestHackathon from './LatestHackathon'

import LatestCompetition from './LatestCompetition'
import LatestWebinar from './LatestWebinar'
import LatestCertification from './LatestCertification'


const Home = () => {
    useGetAllJobs();
    useGetAllInternships();
    useGetAllHackathons();
    // useEffect(() => {
    //     if (user?.role === 'recruiter') {
    //         navigate("/admin/companies");
    //     }
    // }, [user, navigate]);
    return (
        <div>
            <Navbar />
            <HeroSection />
            <LatestJobs />
            <LatestInternship />
            <LatestHackathon />
            <LatestCompetition />
            <LatestWebinar />
            <LatestCertification />
            <Footer />
        </div>
    )
}

export default Home