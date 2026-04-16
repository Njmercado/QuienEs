import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../objects/profile'
import type { Condition } from '../../objects/condition'
import type { SOSContact } from '../../objects/sosContact'
import type { PublicProfileType } from '../../objects/publicProfile'

export interface ProfileDetails extends Profile {
  medical_conditions_data: Condition[]
  sos_contacts_data: SOSContact[]
}

export const profilesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query<Profile[], void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: [] }
        const { data, error } = await supabase.from('Profile').select('*').eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: data || [] }
      },
      providesTags: ['Profile']
    }),
    getChosenProfile: builder.query<Profile, string>({
      queryFn: async (token) => {
        const { data, error } = await supabase
          .from('Profile')
          .select('*')
          .eq('user_id', token)
          .eq('chosen', true)
          .single()
        if (error) return { error: { status: 500, data: error.message } }
        return { data }
      },
      providesTags: ['Profile']
    }),
    getPublicProfile: builder.query<PublicProfileType, string>({
      queryFn: async (token) => {
        const { data, error } = await supabase
          .from('PublicProfile')
          .select('*')
          .eq('user_id', token)
          .single()
        if (error) return { error: { status: 500, data: error.message } }
        return { data }
      },
      // Uses Profile tag since public profile is effectively derived from Profile updates
      providesTags: ['Profile']
    }),
    createProfile: builder.mutation<void, Profile>({
      queryFn: async (profile) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('Profile').insert({
          ...profile,
          user_id: user.id
        })
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    updateProfile: builder.mutation<void, Profile>({
      queryFn: async (profile) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase
          .from('Profile')
          .update({
            profile_description: profile.profile_description,
            profile_title: profile.profile_title,
            medical_conditions: profile.medical_conditions,
            sos_contacts: profile.sos_contacts,
            insurance_name: profile.insurance_name,
            insurance_number: profile.insurance_number,
            chosen: profile.chosen,
          })
          .eq('id', profile.id)
          .eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    deleteProfile: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase
          .from('Profile')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    updateChosenStatus: builder.mutation<void, { id: string; currentChosenProfileId?: string }>({
      queryFn: async ({ id, currentChosenProfileId }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }

        if (currentChosenProfileId) {
          const { error: err1 } = await supabase
            .from('Profile')
            .update({ chosen: false })
            .eq('id', currentChosenProfileId)
            .eq('user_id', user.id)
          if (err1) return { error: { status: 500, data: err1.message } }
        }

        const { error: err2 } = await supabase
          .from('Profile')
          .update({ chosen: true })
          .eq('id', id)
          .eq('user_id', user.id)
        if (err2) return { error: { status: 500, data: err2.message } }

        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    updatePublicProfile: builder.mutation<void, void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }

        // 1. Get chosen profile
        const { data: profile, error: profileErr } = await supabase
          .from('Profile')
          .select('*')
          .eq('user_id', user.id)
          .eq('chosen', true)
          .single()

        if (profileErr || !profile) return { error: { status: 500, data: 'Could not fetch chosen profile' } }

        // 2. Get User
        const { data: userInfo, error: userErr } = await supabase
          .from('User')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (userErr || !userInfo) return { error: { status: 500, data: 'Could not fetch user' } }

        // 3. Get conditions
        let conditions: any[] = []
        if (profile.medical_conditions && profile.medical_conditions.length > 0) {
          const { data: cData } = await supabase
            .from('MedicalCondition')
            .select('*')
            .in('id', profile.medical_conditions)
            .eq('user_id', user.id)
          if (cData) conditions = cData
        }

        // 4. Get contacts
        let contacts: any[] = []
        if (profile.sos_contacts && profile.sos_contacts.length > 0) {
          const { data: sData } = await supabase
            .from('SOSContact')
            .select('*')
            .in('id', profile.sos_contacts)
            .eq('user_id', user.id)
          if (sData) contacts = sData
        }

        const medical_conditions = conditions.map((condition) => ({
          title: condition.title,
          medicines: condition.medicines,
          is_allergy: condition.is_allergy,
        }))
        const sos_contacts = contacts.map((contact) => ({
          name: contact.name,
          last_name: contact.last_name,
          phone_number: contact.phone_number,
          phone_indicative: contact.phone_indicative,
          location: contact.location,
          relationship: contact.relationship,
        }))

        // Upsert
        const { error } = await supabase
          .from('PublicProfile')
          .upsert({
            name: userInfo.name,
            last_name: userInfo.last_name,
            id_type: userInfo.id_type,
            id_number: userInfo.id_number,
            from: userInfo.from,
            living_in: userInfo.living_in,
            sex: userInfo.sex,
            rh: userInfo.rh,
            profile_title: profile.profile_title,
            profile_description: profile.profile_description,
            insurance_name: profile.insurance_name,
            insurance_number: profile.insurance_number,
            medical_conditions,
            sos_contacts,
            user_id: user.id,
          })

        if (error) return { error: { status: 500, data: error.message } }

        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    })
  })
})

export const {
  useGetProfilesQuery,
  useGetChosenProfileQuery,
  useGetPublicProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUpdateChosenStatusMutation,
  useUpdatePublicProfileMutation
} = profilesApi
