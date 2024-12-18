'use client'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { doesUserHaveRole } from '@/utils/supabase/database'
import ClientCard from '@/app/components/ClientCard'
import { Suspense, useEffect, useState } from 'react'
import { getCoachClients } from '@/utils/supabase/database'
import ClientView from '@/app/components/ClientView'

export default function CoachPage() {
  const [coachClients, setCoachClients] = useState([])
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  const renderClients = async () => {
    if (!userId) {
      return
    }
    // const clients = await getCoachClients(userId);
    //   setCoachClients(clients);
    //   console.log(clients);
  }

  const confirmAuth = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error && error.toString() !== 'AuthSessionMissingError: Auth session missing!') {
      console.error(error);
    }
    if (error || !data.user) {
      redirect('/')
    }
    const isCoach = await doesUserHaveRole(data.user.id, 'coach')
    if (!isCoach) {
      redirect('/')
    }
    setIsAuthenticated(data.user !== null);
    setUserId(data.user.id);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      confirmAuth();
    }
  }, []);

  useEffect(() => {
    renderClients()
  }, [userId]);


  // TODO: Attempt using a server component to fetch the clients and display them as cards. Return promise at first to wrap here in Suspense. ClientCard is within the server component

  return (
    <main>
      <h1 className="text-xl font-bold top-0 p-2 sm:text-3xl max-w-screen-xl mx-auto">Your Clients</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:pt-32">
        {/* {coachClients.map((client: { user_id: string, name: string }) => (
          <ClientCard key={client.user_id} clientName={`${client.name}`} />
        ))} */}
        <Suspense fallback={<div>Loading...</div>}>
          <ClientView />
        </Suspense>
      </div>
    </main>
  )
}
