import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { doesUserHaveRole } from '@/utils/supabase/database'

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/')
  }

  const isCoach = await doesUserHaveRole(user.id, 'coach')
  
  if (!isCoach) {
    redirect('/')
  }

  return (
    <div>
      <h1>View Clients</h1>
    </div>
  )
}
