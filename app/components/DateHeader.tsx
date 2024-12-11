'use client'

import { useAppSelector } from '../store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function DateHeader() {
    const date = new Date(useAppSelector((state) => state.wellness.date)).toLocaleDateString('en-US', { timeZone: 'America/Chicago' });
    return (
        <nav className="navbar sticky-top bg-primary text-white" data-bs-theme="dark">
            <div className='container-fluid'>
                <div className='d-flex mx-auto'>
                    <div className='mx-1'>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className='mx-1'>
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className='mx-1'>
                        <h5>
                            {date}
                        </h5>
                    </div>
                    <div className='mx-1'>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                </div>
            </div>
        </nav>
    )
}