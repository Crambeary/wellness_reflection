'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login() {
  const supabase = await createClient()

  const { data, error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
          ? 'https://' + process.env.SITE_URL + '/auth/callback'
          :  process.env.NEXT_PUBLIC_VERCEL_URL
            ? 'https://' + process.env.NEXT_PUBLIC_VERCEL_URL + '/auth/callback'
            : 'http://localhost:3000/auth/callback'
      }`,
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
  redirect('/logout-confirmed')
}