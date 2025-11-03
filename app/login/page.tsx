'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다.')
        setLoading(false)
        return
      }

      // 로그인 성공 시 홈으로 이동
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">학급 게시판</h1>
            <p className="text-gray-600">로그인하여 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이름을 입력하세요"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                로그인 코드
              </label>
              <input
                type="password"
                id="code"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="4자리 코드를 입력하세요"
                maxLength={4}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              학생 계정 또는 교사 계정으로 로그인하세요.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <details className="cursor-pointer">
            <summary className="hover:text-gray-900">계정 정보 보기</summary>
            <div className="mt-4 bg-white rounded-lg shadow p-4 text-left">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">학생 계정</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>김대수 / 1024</li>
                  <li>김주한 / 0623</li>
                  <li>김차영 / 0630</li>
                  <li>김태린 / 0609</li>
                  <li>김혜지 / 1029</li>
                  <li>안준희 / 1207</li>
                  <li>인선우 / 1010</li>
                  <li>정군 / 0420</li>
                  <li>정유이 / 0609</li>
                  <li>최지음 / 0820</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">교사 계정</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>교사 / 5555</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
