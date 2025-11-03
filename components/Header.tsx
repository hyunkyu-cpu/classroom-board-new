'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/lib/auth'

interface HeaderProps {
  user: User
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })

      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
            학급 게시판
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-600">환영합니다, </span>
              <span className="font-semibold text-gray-900">{user.name}</span>
              {user.role === 'teacher' && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  교사
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
