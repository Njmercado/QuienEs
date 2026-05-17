import { apiSlice } from "../apiSlice";
import { supabase } from "../../lib/supabase";

export interface EmergencyData {
  latitude: number
  longitude: number
  token: string
  created_at?: string
  name: string
}

export const alertLogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendAlerts: builder.mutation<void, { user_id: string, latitude: number, longitude: number }>({
      queryFn: async ({ user_id, latitude, longitude }) => {
        const { data, error } = await supabase.functions.invoke('send_alert_notification', {
          body: {
            user_id,
            lng: longitude,
            lat: latitude
          }
        })
        if (error) return { error: { status: 500, data: error.message } }
        return { data }
      },
      invalidatesTags: ['AlertLog']
    }),
    getAlert: builder.query<EmergencyData, string>({
      queryFn: async (id: string) => {
        const { data, error, status } = await supabase
          .from('AlertLogs')
          .select('*')
          .eq('id', id)
          .single()
        if (error) return { error: { status: status, data: error.message } }
        return { data }
      },
      providesTags: ['AlertLog']
    })
  })
})

export const { useSendAlertsMutation, useGetAlertQuery } = alertLogsApi 
