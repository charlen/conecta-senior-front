export type Profile = {
  user_id?: string
  email?: string
  name?: string
  phone?: string
  bio?: string
  /** Short-lived presigned URL of the profile photo (empty when there is none) */
  photo_url?: string
}
