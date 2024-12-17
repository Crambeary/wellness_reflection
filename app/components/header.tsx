'use client'

import { createClient } from "@/utils/supabase/client";
import { login } from "@/login/actions";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setIsAuthenticated, setModalMessage, setShowModal, setEmail, setIsCoach } from "@/store/wellnessSlice";
import { useEffect, useState } from "react";
import { doesUserHaveRole } from "@/utils/supabase/database";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAppSelector((state) => state.wellness.isAuthenticated);
    const email = useAppSelector((state) => state.wellness.email);
    const dispatch = useAppDispatch();
    const [userId, setUserId] = useState('');
    const userIsCoach = useAppSelector((state) => state.wellness.isCoach);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const handleAuth = async () => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            dispatch(setEmail(user.email || ''));
            dispatch(setIsAuthenticated(true));
            setUserId(user.id);
            const isCoach = await doesUserHaveRole(user.id, 'coach');
            dispatch(setIsCoach(isCoach));
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
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <a href="/" className="flex items-center no-underline text-black hover:text-gray-500">
                    <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-8 w-8 mr-3"
                    />
                    <span className="font-['Nunito_Sans'] font-bold text-xl">
                        Elevate Wellness 
                    </span>
                </a>
            {isDesktop ? (
                <>
                
                <div className="flex items-center lg:order-2">
                    {!isLoading && (
                        userIsCoach ? (
                            <button 
                                onClick={() => router.push('/coach/view-clients')}
                                className="text-gray-500 hover:text-white border border-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 mr-4 text-center"
                            >
                                View Clients
                            </button>
                        ) : (
                            <span className="mr-4 text-gray-500">
                            </span>
                        )
                    )}
                    {!isLoading && (
                        <span className="mr-4 text-gray-500">
                            {isAuthenticated 
                                ? `Signed in as: ${email}` 
                                : 'Login for an upgraded experience'
                            }
                        </span>
                    )}
                    {!isLoading && (
                        isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={login}
                                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                            >
                                Log in
                            </button>
                        )
                    )}
                    </div>
            </>
        ) : (
            <Drawer>
                <DrawerTrigger className="border border-gray-500 rounded-md p-1">
                    <MenuIcon className="w-6 h-6" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Menu</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button onClick={() => router.push('/')}>
                                Home
                            </Button>
                        </DrawerClose>
                        {userIsCoach && (
                            <DrawerClose asChild>
                                <Button onClick={() => router.push('/coach/view-clients')}>
                                    View Clients
                                </Button>
                            </DrawerClose>
                        )}
                        {isAuthenticated ? (
                            <DrawerClose asChild>
                                <Button variant="destructive" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </DrawerClose>
                        ) : (
                            <DrawerClose asChild>
                                <Button onClick={login}>
                                    Log in
                                </Button>
                            </DrawerClose>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
        }
                </div>
        </nav>
    );
}