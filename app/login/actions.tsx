'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login() {
  const supabase = await createClient()

  const { data, error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
    },
  })


  if (error) {
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function logout() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}