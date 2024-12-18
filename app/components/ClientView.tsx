import React, { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ClientCard from './ClientCard';
import { Card } from './ui/card';
import { getCoachClients } from '@/utils/supabase/database';
import { doesUserHaveRole } from '@/utils/supabase/database';
import { redirect } from 'next/navigation';
import { Spinner } from './ui/spinner';

interface Client {
    name: string;
    user_id: string;
}

const ClientView = () => {
  const [coachClients, setCoachClients] = useState<Client[]>([]);
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');


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
    const loadClients = async () => {
        if (!userId) {
            return
        }
        const clients = await getCoachClients(userId);
        setCoachClients(clients);
    }

    loadClients();
  }, [userId]);



  return (
    <>
        {Object.keys(coachClients).length > 0 ? (
            <Card>
                {coachClients.map((client) => (
                    <ClientCard key={client.user_id} clientName={client.name} />
                ))}
            </Card>
        ) : (
            <Card className='w-48 max-w-md h-32 text-center flex items-center justify-center'>
                <div className='inline-block'>
                    Client Loading
                    <Spinner size='md' className='bg-black dark:bg-white'/>
                </div>
            </Card>
        )
    }
    </>
  );
};

export default ClientView;