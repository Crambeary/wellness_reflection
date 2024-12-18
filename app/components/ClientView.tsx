import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ClientCard from './ClientCard';
import { Card } from './ui/card';
import { getCoachClients } from '@/utils/supabase/database';
import { doesUserHaveRole } from '@/utils/supabase/database';
import { redirect } from 'next/navigation';

const supabase = createClient();


interface Client {
    name: string;
    user_id: string;
}

const ClientView = () => {
  const [coachClients, setCoachClients] = useState<Client[]>([]);
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  const renderClients = async () => {
    if (!userId) {
      return
    }
    const clients = await getCoachClients(userId);
    setCoachClients(clients);
    console.log(clients);
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


  return (
    <Card>
      {coachClients.map((client) => (
        <ClientCard key={client.user_id} clientName={client.name} />
      ))}
    </Card>
  );
};

export default ClientView;