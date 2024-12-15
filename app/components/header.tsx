'use client'

import { createClient } from "@/utils/supabase/client";
import { login } from "@/login/actions";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setIsAuthenticated, setModalMessage, setShowModal, setEmail } from "@/store/wellnessSlice";
import { useEffect, useState } from "react";

export default function Header() {

    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAppSelector((state) => state.wellness.isAuthenticated);
    const email = useAppSelector((state) => state.wellness.email);
    const dispatch = useAppDispatch();
    const handleAuth = async () => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            dispatch(setEmail(user.email || ''));
            dispatch(setIsAuthenticated(true));
        } else {
            dispatch(setIsAuthenticated(false));
        }
        setIsLoading(false);
    }

    useEffect(() => {
        handleAuth();
    }, []);

    const handleLogout = () => {
        dispatch(setModalMessage({
            title: 'Logout',
            body: 'Are you sure you want to logout?',
            footer: 'logout'
        }));
        dispatch(setShowModal(true));
    }

    return (
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
            <a className="navbar-brand" href="/"style={{ fontFamily: 'Nunito Sans', fontWeight: 'bold'}}>
                <img src="/logo.png" alt="Logo" width="48" height="48" />
                Wellness Dashboard
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto my-auto">
                <li className="nav-item ms-auto">
                    {!isLoading && (email || 'Login for an upgraded experience')}
                </li>
            </ul>
            {!isLoading && isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
            ): 
                <button onClick={login} className="btn btn-outline-success">Log in</button>
                }
            </div>
        </div>
        </nav>
        </>
    )
}