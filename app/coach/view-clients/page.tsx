'use client'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { doesUserHaveRole } from '@/utils/supabase/database'
import ClientCard from '@/app/components/ClientCard'
import { use, useEffect, useState } from 'react'

export default function CoachPage() {
  const [coachClients, setCoachClients] = useState([])
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  const getCoachClients = async () => {
    if (!userId) {
      return
    }
    const { data, error } = await supabase
      .rpc('get_coach_clients', { 
        coach_user_id: userId 
      });
    if (error) {
      console.error(error)
    } else {
      setCoachClients(data)
      console.log(data);
    }
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
    getCoachClients()
  }, [userId]);



  return (
    <main>
      <h1 className="text-xl font-bold top-0 p-2 sm:text-3xl max-w-screen-xl mx-auto">Your Clients</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:pt-32">
        {coachClients.map((client: { user_id: string, name: string }) => (
          <ClientCard key={client.user_id} clientName={`${client.name}`} />
        ))}
      </div>
    </main>
  )
}
