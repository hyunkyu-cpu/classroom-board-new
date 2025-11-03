import { cookies } from 'next/headers'
import { User } from './auth'

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('user')

    if (!userCookie?.value) {
      return null
    }

    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}
