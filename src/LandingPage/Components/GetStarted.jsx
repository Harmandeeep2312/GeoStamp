import React from 'react';
import '../styles/GetStarted.css'
import { useNavigate } from 'react-router-dom';

function GetStarted() {
    return (
        <>
            <div className='container'>
                <div className='Content'>
                    <h2>Start Verifying Attendance Today</h2>
                    <p>Create your first event and track on-site attendance with precision.</p>
                    <br></br>
                    <button onClick={useNavigate('/admin')}>Launch Admin Pannel</button>
                </div>
            </div>
        </>
    );
}

export default GetStarted;