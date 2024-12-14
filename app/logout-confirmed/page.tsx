'use client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'


export default function LogoutConfirmed() {
    useEffect(() => {
        setTimeout(() => {
            redirect('/')
        }, 2000)
    }, [])
    return <div>Bye! Logged out</div>
}