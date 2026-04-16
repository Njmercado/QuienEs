import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { SOSContact, SOSContactData } from '../../objects/sosContact'

export interface SOSContactFilters {
  search?: string
  relationship?: string
}

export const sosContactsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSOSContacts: builder.query<SOSContact[], SOSContactFilters | void>({
      queryFn: async (filters) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: [] }

        let query = supabase.from('SOSContact').select('*').eq('user_id', user.id)

        if (filters?.search) {
          const term = `%${filters.search}%`
          query = query.or(`name.ilike.${term},last_name.ilike.${term},phone_number.ilike.${term}`)
        }
        if (filters?.relationship) {
          query = query.eq('relationship', filters.relationship)
        }

        const { data, error } = await query
        if (error) return { error: { status: 500, data: error.message } }
        return { data: (data || []) as SOSContact[] }
      },
      providesTags: ['SOSContact']
    }),
    createSOSContact: builder.mutation<void, SOSContactData>({
      queryFn: async (contact) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('SOSContact').insert({
          ...contact,
          user_id: user.id,
        })
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['SOSContact', 'Profile']
    }),
    updateSOSContact: builder.mutation<void, SOSContact>({
      queryFn: async (contact) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('SOSContact').update({
          ...contact,
        }).eq('id', contact.id).eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['SOSContact', 'Profile']
    }),
    deleteSOSContact: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('SOSContact').delete().eq('id', id).eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['SOSContact', 'Profile']
    }),
  })
})

export const {
  useGetSOSContactsQuery,
  useCreateSOSContactMutation,
  useUpdateSOSContactMutation,
  useDeleteSOSContactMutation,
} = sosContactsApi
