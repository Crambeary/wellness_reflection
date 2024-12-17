import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { doesUserHaveRole } from '@/utils/supabase/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">View Clients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Client Name</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Client Email</p>
        </CardContent>
      </Card>
    </div>
  )
}
