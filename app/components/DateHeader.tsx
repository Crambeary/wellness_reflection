'use client'

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { setDate, setDateClientView } from '@/store/actions'
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { setShowModal, setModalMessage, setIsAuthenticated } from '@/store/wellnessSlice';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function DateHeader({ isCoach=false }: { isCoach?: boolean }) {
    const dispatch = useAppDispatch();
    const stateDate = useAppSelector((state) => state.wellness.date);
    const isAuthenticated = useAppSelector((state) => state.wellness.isAuthenticated);
    const [isLoading, setIsLoading] = useState(true);

    const confirmAuth = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error && error.toString() !== 'AuthSessionMissingError: Auth session missing!') {
            console.error(error);
        }
        setIsAuthenticated(data.user !== null);
    }

    useEffect(() => {
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        confirmAuth();
    }, [isAuthenticated]);

    const formatDateInLocalTimezone = (dateString: string) => {
        if (!dateString) {
            return new Intl.DateTimeFormat('en-US', {
                timeZone: 'UTC',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date());
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
        <div>

        <nav className="sticky top-0 z-50 bg-primary text-white dark:bg-gray-800 dark:text-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center">
                    {isLoading && (
                        <div className="py-2 inline-flex items-center gap-2">
                            Loading Date Info... <Spinner size="sm" className='bg-black dark:bg-white'/>
                        </div>
                    )}
                    {!isLoading && isAuthenticated && !isCoach && (
                        <>
                        <Button
                            variant="default" 
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => dispatch(setDate(prevDay()))}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => dispatch(setDate(new Date().toISOString()))}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                        </Button>
                        <div className="px-4 py-2">
                            {formattedDate}
                        </div>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => dispatch(setDate(nextDay()))}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                        </>
                    )} 
                    {!isLoading && isAuthenticated && isCoach && (
                        <>
                        <Button
                            variant="default" 
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => {
                                const prev = prevDay();
                                dispatch(setDateClientView(prev));
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => dispatch(setDateClientView(new Date().toISOString()))}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                        </Button>
                        <div className="px-4 py-2">
                            {formattedDate}
                        </div>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => dispatch(setDateClientView(nextDay()))}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                        </>
                    )}
                    {!isLoading && !isAuthenticated && (
                        <>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => showModal()}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => showModal()}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                        </Button>
                        <div className="px-4 py-2">
                            {formattedDate}
                        </div>
                        <Button
                            variant="default"
                            className='border-0 active:ring-1 active:ring-black dark:active:ring-white mx-1 dark:text-white dark:bg-gray-800'
                            size="icon"
                            onClick={() => showModal()}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
        </div>
    )
}