import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSelectedReflection } from '@/utils/supabase/database';
import { loadSavedForm, setLoading, clearForm } from './wellnessSlice';
import { createClient } from '@/utils/supabase/client';
import { setDate as setDateAction, setShowModal, setModalMessage, setIsDiverged, setTargetDate } from './wellnessSlice';
import { mapReflectionToState } from '@/utils/mappers';
import { RootState, AppDispatch } from './store';

export const setDate = createAsyncThunk(
    'wellness/setDate',
    async (date: string, { dispatch, getState }) => { 
        const state = getState() as RootState;
        const isDiverged = state.wellness.isDiverged;

        if (isDiverged) {
            // Show confirmation modal
            dispatch(setModalMessage({ 
                title: 'Unsaved Changes', 
                body: 'You have unsaved changes. Are you sure you want to switch dates?' 
            }));
            dispatch(setShowModal(true));
            
            // Store the target date to switch to after confirmation
            dispatch(setTargetDate(date));
            return;
        }

        await switchToDate(date, dispatch as AppDispatch);
    }
);

// Separate action to handle the actual date switch
export const confirmDateSwitch = createAsyncThunk(
    'wellness/confirmDateSwitch',
    async (_, { dispatch, getState }) => {
        const state = getState() as RootState;
        const targetDate = state.wellness.targetDate;
        
        dispatch(setShowModal(false));
        dispatch(setIsDiverged(false));
        
        if (targetDate) {
            await switchToDate(targetDate, dispatch as AppDispatch);
        }
    }
);

// Helper function to handle the date switching logic
async function switchToDate(date: string, dispatch: AppDispatch) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        console.error('User not authenticated');
        return;
    }

    dispatch(setLoading(true));
    const response = await getSelectedReflection(user.id, date);
    
    if (response.reflection) {
        dispatch(setDateAction(response.reflection.date));
        dispatch(loadSavedForm(mapReflectionToState(response.reflection)));
    } else {
        dispatch(setDateAction(date));
        dispatch(clearForm());
    }
    
    dispatch(setLoading(false));
}