'use client'

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { setDate } from '@/store/actions'
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { setShowModal, setModalMessage, setIsAuthenticated } from '@/store/wellnessSlice';

export default function DateHeader() {

    const isAuthenticated = useAppSelector((state) => {
        return state.wellness.isAuthenticated;
    });

    const confirmAuth = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error && error.toString() !== 'AuthSessionMissingError: Auth session missing!') {
            console.error(error);
        }
        setIsAuthenticated(data.user !== null);
    }

    const dispatch = useAppDispatch();
    const stateDate = useAppSelector((state) => {
        return state.wellness.date;
    });
    
    useEffect(() => {
        confirmAuth();
    }, [isAuthenticated]);

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

    const showModal = () => {
        dispatch(setShowModal(true));
        dispatch(setModalMessage({
            title: 'See the bigger picture',
            body: 'Want to view your full wellness history? \nLog in to access all your past data and insights.',
            footer: 'unauthenticated'
        }));
    }

    return (
        <nav className="navbar sticky-top bg-primary text-white" data-bs-theme="dark">
            <div className='container-fluid'>
                <div className='d-flex mx-auto'>
                    {isAuthenticated && (
                        <>
                        <button className='btn' onClick={() => {
                            const prev = prevDay();
                            dispatch(setDate(prev));
                        }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button className='btn' onClick={() => dispatch(setDate(new Date().toISOString()))}>
                            <FontAwesomeIcon icon={faCalendar} />
                        </button>
                        <div className='mx-auto my-auto'>
                            {formattedDate}
                        </div>
                        <button className='btn' onClick={() => dispatch(setDate(nextDay()))}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                        </>
                    )} 
                    {!isAuthenticated && (
                        <>
                        <button className='btn' onClick={() => showModal()}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button className='btn' onClick={() => showModal()}>
                            <FontAwesomeIcon icon={faCalendar} />
                        </button>
                        <div className='mx-auto my-auto'>
                            {formattedDate}
                        </div>
                        <button className='btn' onClick={() => showModal()}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}