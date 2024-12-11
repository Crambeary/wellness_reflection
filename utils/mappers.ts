
export const mapReflectionToState = (reflection: any) => {
    const stateData = {
        date: reflection.date,
        'wake-time': reflection.wake_time,
        bedtime: reflection.bedtime,
        qotd: reflection.quote_of_day,
        hydration: reflection.hydration,
        'morning-vitality': reflection.morning_vitality,
        'afternoon-vitality': reflection.afternoon_vitality,
        'evening-vitality': reflection.evening_vitality,
        'morning-meals': reflection.morning_meals,
        'morning-meals-notes': reflection.morning_meals_notes,
        'morning-meals-cravings': reflection.morning_meals_cravings,
        'afternoon-meals': reflection.afternoon_meals,
        'afternoon-meals-notes': reflection.afternoon_meals_notes,
        'afternoon-meals-cravings': reflection.afternoon_meals_cravings,
        'evening-meals': reflection.evening_meals,
        'evening-meals-notes': reflection.evening_meals_notes,
        'evening-meals-cravings': reflection.evening_meals_cravings,
        'morning-activity': reflection.morning_activity,
        'afternoon-activity': reflection.afternoon_activity,
        'evening-activity': reflection.evening_activity,
        }
        return stateData;
    }