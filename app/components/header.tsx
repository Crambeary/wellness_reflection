'use client'

import { createClient } from "@/utils/supabase/client";
import { login } from "@/login/actions";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setIsAuthenticated, setModalMessage, setShowModal, setEmail, setIsCoach } from "@/store/wellnessSlice";
import { useEffect, useState } from "react";
import { doesUserHaveRole } from "@/utils/supabase/database";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import ThemeSwitch from "@/components/ThemeSwitch";

export default function Header() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAppSelector((state) => state.wellness.isAuthenticated);
    const email = useAppSelector((state) => state.wellness.email);
    const isDiverged = useAppSelector((state) => state.wellness.isDiverged);
    const dispatch = useAppDispatch();
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

    const viewClients = () => {
        if (isDiverged) {
            dispatch(setShowModal(true));
            dispatch(setModalMessage({
                title: 'You have unsaved changes',
                body: 'Discard changes and view clients?',
                footer: 'unsaved-view-clients'
            }));
            return;
        } else {
            router.push('/coach/view-clients');
        }
    }

    return (
        <nav className="bg-white dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600 px-4 py-2.5">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <a href="/" className="flex items-center no-underline text-black hover:text-gray-500">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-8 w-8 mr-3"
                    />
                    <span className="font-['Nunito_Sans', 'sans-serif'] font-bold text-xl dark:text-white">
                        Elevate Wellness 
                    </span>
                </a>
            {isDesktop ? (
                <>
                
                <div className="flex items-center lg:order-2 gap-4">
                    <ThemeSwitch />
                    {!isLoading && (
                        userIsCoach ? (
                            <button 
                                onClick={() => viewClients()}
                                className="text-gray-500 hover:text-white border border-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 mr-4 text-center dark:border-gray-600 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
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
                                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-900 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={login}
                                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-green-600 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-900"
                            >
                                Log in
                            </button>
                        )
                    )}
                    </div>
            </>
        ) : (
            <Drawer>
                <DrawerTrigger title="Menu" className="border border-gray-500 rounded-md p-1 dark:border-gray-600 dark:text-white dark:bg-gray-800">
                    <MenuIcon className="w-6 h-6 text-black dark:text-white"  />
                </DrawerTrigger>
                <DrawerContent className="dark:bg-gray-800 dark:text-white dark:border-gray-600">
                    <DrawerDescription className="hidden">
                        This menu contains navigation links to the different sections of the website.
                    </DrawerDescription>
                    <DrawerHeader>
                        <DrawerTitle>Menu</DrawerTitle>
                    </DrawerHeader>
                        {isAuthenticated ? (
                            <div className="p-4 text-center">
                                Logged in as: {email}
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                Login for an upgraded experience
                            </div>
                        )}
                    <DrawerFooter>
                        <DrawerClose asChild className="border-none">
                            <Button onClick={() => router.push('/')}>
                                Home
                            </Button>
                        </DrawerClose>
                        {userIsCoach && (
                            <DrawerClose asChild className="border-none">
                                <Button onClick={() => viewClients()}>
                                    View Clients
                                </Button>
                            </DrawerClose>
                        )}
                        {isAuthenticated ? (
                            <DrawerClose asChild className="border-none">
                                <Button variant="destructive" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </DrawerClose>
                        ) : (
                            <DrawerClose asChild className="border-none">
                                <Button onClick={login}>
                                    Log in
                                </Button>
                            </DrawerClose>
                        )}
                        <ThemeSwitch />
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
        }
                </div>
        </nav>
    );
}