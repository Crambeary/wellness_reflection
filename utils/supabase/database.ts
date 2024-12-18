'use server'

import { createClient } from './server'
import { getLocalISOString } from '@/utils/helpers'

export async function upsertWellnessReflection(data: any, userId: string) {
  const supabase = await createClient()
  
  try {
    // Check if a reflection exists for this date and user
    const { data: existingReflection } = await supabase
      .from('wellness_reflections')
      .select()
      .eq('user_id', userId)
      .eq('date', data.date)
      .single()

    // Prepare the reflection data
    const reflectionData = {
      user_id: userId,
      date: data.date,
      wake_time: data['wake-time'] === '' ? null : data['wake-time'],
      bedtime: data.bedtime === '' ? null : data.bedtime,
      quote_of_day: data.qotd,
      hydration: data.hydration,
      morning_vitality: data['morning-vitality'],
      afternoon_vitality: data['afternoon-vitality'],
      evening_vitality: data['evening-vitality'],
      morning_meals: data['morning-meals'],
      morning_meals_notes: data['morning-meals-notes'],
      morning_meals_cravings: data['morning-meals-cravings'],
      afternoon_meals: data['afternoon-meals'],
      afternoon_meals_notes: data['afternoon-meals-notes'],
      afternoon_meals_cravings: data['afternoon-meals-cravings'],
      evening_meals: data['evening-meals'],
      evening_meals_notes: data['evening-meals-notes'],
      evening_meals_cravings: data['evening-meals-cravings'],
      morning_activity: data['morning-activity'],
      afternoon_activity: data['afternoon-activity'],
      evening_activity: data['evening-activity'],
      last_updated: new Date().toISOString()
    }

    let result;
    if (existingReflection) {
      // Update existing reflection
      result = await supabase
        .from('wellness_reflections')
        .update(reflectionData)
        .eq('user_id', userId)
        .eq('date', data.date)
        .select()
    } else {
      // Insert new reflection
      result = await supabase
        .from('wellness_reflections')
        .insert([reflectionData])
        .select()
    }

    const { data: reflection, error } = result
    if (error) throw error
    return { reflection, error: null }
  } catch (error) {
    console.error('Error saving wellness reflection:', error)
    return { reflection: null, error }
  }
}

export async function getWellnessReflections(userId: string) {
  const supabase = await createClient()
  
  try {
    const { data: reflections, error } = await supabase
      .from('wellness_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return { reflections, error: null }
  } catch (error) {
    console.error('Error fetching wellness reflections:', error)
    return { reflections: null, error }
  }
}

export async function getTodaysReflection(userId: string) {


  const supabase = await createClient()
  const today = getLocalISOString() // Format: YYYY-MM-DD

  
  try {
    const { data: reflection, error } = await supabase
      .from('wellness_reflections')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      throw error
    }

    return { reflection, error: null }
  } catch (error) {
    console.error('Error fetching today\'s reflection:', error)
    return { reflection: null, error }
  }
}

export async function getSelectedReflection(userId: string, date: string) {
  const supabase = await createClient()
  
  try {
    const { data: reflection, error } = await supabase
      .from('wellness_reflections')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      throw error
    }

    return { reflection, error: null }
  } catch (error) {
    console.error('Error fetching selected reflection:', error)
    return { reflection: null, error }
  }
}


export async function doesUserHaveRole(userId: string, role: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select( `
      *,
      ...roles!inner(*)
      `,)
    .eq('roles.name', role)
    .eq('user_id', userId)

  if (error) throw error
  return data && Object.keys(data).length > 0
}

export async function getCoachClients(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc('get_coach_clients', { 
      coach_user_id: userId 
    });
  }