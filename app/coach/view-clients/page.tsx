import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { doesUserHaveRole } from '@/utils/supabase/database'
import ClientCard from '@/app/components/ClientCard'

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
    <main>
      <h1 className="text-xl font-bold top-0 p-2 sm:text-3xl max-w-screen-xl mx-auto">Your Clients</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:pt-32">
        {"abcdefgh".split("").map((client) => (
          <ClientCard clientName={`${client} Doe`} />
        ))}
      </div>
    </main>
  )
}
