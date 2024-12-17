import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { doesUserHaveRole } from '@/utils/supabase/database'

export async function coachMiddleware(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const isCoach = await doesUserHaveRole(user.id, 'coach')
  
  if (!isCoach) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
} 