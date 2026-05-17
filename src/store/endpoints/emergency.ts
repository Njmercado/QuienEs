import { apiSlice } from "../apiSlice";
import { supabase } from "../../lib/supabase";

export interface EmergencyData {
  latitude: number
  longitude: number
  token: string
  created_at?: string
  name: string
}

export const emergencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendLocationToEmergencyContacts: builder.mutation<void, EmergencyData>({
      queryFn: async ({ latitude, longitude, token, name }) => {
        const { error, status } = await supabase.from('Emergency').insert({
          user_id: token,
          latitude,
          longitude,
          name
        })
        console.log("ERROR: ", error, "STATUS: ", status)
        if (error) return { error: { status: status, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Emergency']
    }),
    getEmergency: builder.query<EmergencyData, string>({
      queryFn: async (id: string) => {
        const { data, error, status } = await supabase
          .from('Emergency')
          .select('*')
          .eq('id', id)
          .single()
        if (error) return { error: { status: status, data: error.message } }
        return { data }
      },
      providesTags: ['Emergency']
    })
  })
})

export const { useSendLocationToEmergencyContactsMutation, useGetEmergencyQuery } = emergencyApi