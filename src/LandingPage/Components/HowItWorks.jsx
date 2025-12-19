import React from 'react';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import '../styles/HowItWorks.css'

function HowItWorks() {
    return (
        <>
            <div className='Container'>
                <div className='Work-text'>
                    <h2>How It Works</h2>
                    <p>Designed to verify presence with precision and reliability.</p>
                </div>
                <div className='Box'>
                    <div>
                        <h3><LocationOnRoundedIcon /> Define Location</h3>
                        <p>Define a geofence by specifying the venue’s center point and radius.</p>
                    </div>
                    <div>
                        <h3><VerifiedUserRoundedIcon /> Verify Presence</h3>
                        <p>Attendance is enabled only when the device is inside the event boundary, and 
                        Users can mark attendance only while inside the designated area.</p>
                    </div>
                    <div>
                        <h3><MoreHorizRoundedIcon /> Prevent Duplicates</h3>
                        <p>Each device can record attendance only once per event.Attendance is limited to one entry per device per event.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HowItWorks;