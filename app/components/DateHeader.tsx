'use client'

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { setDate as setDateAction } from '@/store/wellnessSlice';
import { setDate } from '@/store/actions'

export default function DateHeader() {

    const dispatch = useAppDispatch();
    const stateDate = useAppSelector((state) => {
        console.log("DateHeader state:", state.wellness);
        return state.wellness.date;
    });

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
    const formattedDate = formatDateInLocalTimezone(stateDate);

    const prevDay = () => {
        const date = new Date(stateDate);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    }

    const nextDay = () => {
        const date = new Date(stateDate);
        date.setDate(date.getDate() + 1);
        if (date > new Date()) {
            date.setDate(date.getDate() - 1);
        }
        return date.toISOString().split('T')[0];
    }

    return (
        <nav className="navbar sticky-top bg-primary text-white" data-bs-theme="dark">
            <div className='container-fluid'>
                <div className='d-flex mx-auto'>
                    <button className='mx-1 btn' onClick={() => {
                        const prev = prevDay();
                        console.log("Navigating to previous day:", prev);
                        dispatch(setDate(prev));
                    }}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button className='mx-1 btn' onClick={() => dispatch(setDate(new Date().toISOString()))}>
                        <FontAwesomeIcon icon={faCalendar} />
                    </button>
                    <div className='mx-1 my-auto'>
                        <h5>
                            {formattedDate}
                        </h5>
                    </div>
                    <button className='mx-1 btn' onClick={() => dispatch(setDate(nextDay()))}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
        </nav>
    )
}