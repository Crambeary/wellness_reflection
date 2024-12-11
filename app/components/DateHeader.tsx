'use client'

import { useAppSelector } from '../store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function DateHeader() {

    const formatDateInLocalTimezone = (dateString: string) => {
        if (!dateString) {
            return '';
        }
        const localDate = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'UTC', // forced since the date is created in UTC
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(localDate);
        return formattedDate;
    }
    const formattedDate = formatDateInLocalTimezone(useAppSelector((state) => state.wellness.date));

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
                            {formattedDate}
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