'use client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setIsAuthenticated, setEmail, clearForm, clearName } from '@/store/wellnessSlice'

export default function LogoutConfirmed() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setIsAuthenticated(false));
        dispatch(setEmail(''));
        dispatch(clearForm());
        dispatch(clearName());
        setTimeout(() => {
            redirect('/')
        }, 2000)
    }, [])
    return <div>Bye! Logged out</div>
}