import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import LatestInternship from './LatestInternship'
import LatestHackathon from './LatestHackathon'
import LatestCompetition from './LatestCompetition'
import LatestWebinar from './LatestWebinar'
import LatestCertification from './LatestCertification'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import useGetAllInternships from '@/hooks/useGetAllInternships'
import useGetAllHackathons from '@/hooks/useGetAllHackathons'
import useGetAllWebinars from '@/hooks/useGetAllWebinars'
import useGetAllCompetitions from '@/hooks/useGetAllCompetitions'
import useGetAllCertifications from '@/hooks/useGetAllCertifications'

const Home = () => {
    useGetAllJobs();
    useGetAllInternships();
    useGetAllHackathons();
    useGetAllWebinars();
    useGetAllCompetitions();
    useGetAllCertifications();

    return (
        <div className='min-h-screen bg-[#F8F9FF]'>
            <Navbar />

            <main className='relative'>
                <HeroSection />

                <div className='relative z-10 space-y-20 pb-20'>
                    <section id="jobs" className='scroll-mt-20'>
                        <LatestJobs />
                    </section>

                    <div className='max-w-7xl mx-auto px-4'>
                        <div className='h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent'></div>
                    </div>

                    <section id="internships" className='scroll-mt-20'>
                        <LatestInternship />
                    </section>

                    <div className='max-w-7xl mx-auto px-4'>
                        <div className='h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent'></div>
                    </div>

                    <section id="hackathons" className='scroll-mt-20'>
                        <LatestHackathon />
                    </section>

                    <div className='max-w-7xl mx-auto px-4'>
                        <div className='h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent'></div>
                    </div>

                    <section id="competitions" className='scroll-mt-20'>
                        <LatestCompetition />
                    </section>

                    <div className='max-w-7xl mx-auto px-4'>
                        <div className='h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent'></div>
                    </div>

                    <section id="webinars" className='scroll-mt-20'>
                        <LatestWebinar />
                    </section>

                    <section id="certifications" className='scroll-mt-20'>
                        <LatestCertification />
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Home