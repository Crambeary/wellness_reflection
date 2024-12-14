'use client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setIsAuthenticated } from '@/store/wellnessSlice'

export default function LogoutConfirmed() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setIsAuthenticated(false));
        setTimeout(() => {
            redirect('/')
        }, 2000)
    }, [])
    return <div>Bye! Logged out</div>
}