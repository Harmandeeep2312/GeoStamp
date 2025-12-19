import React from 'react';
import HeroSection from '../Components/HeroSection';
import HowItWorks from '../Components/HowItWorks';
import GetStarted from '../Components/GetStarted';
import AppNavbarr from '../Components/AppNavbarr';

function LandiingPage() {
    return (
        <>
        <AppNavbarr />
        <HeroSection />
        <HowItWorks />
        <GetStarted />
        </>
    );
}

export default LandiingPage;