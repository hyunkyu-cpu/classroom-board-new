'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    uploadDate: new Date().toISOString().split('T')[0], // 오늘 날짜를 기본값으로
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // 로그인한 사용자 정보 가져오기
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.name)
        }
      })
      .catch((error) => console.error('Error fetching user:', error))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // 미리보기 생성
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = null

      // 1. 파일이 있으면 먼저 업로드
      if (selectedFile) {
        const fileFormData = new FormData()
        fileFormData.append('file', selectedFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('파일 업로드에 실패했습니다.')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
      }

      // 2. 게시물 생성
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorName: userName,
          imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('게시물 작성에 실패했습니다.')
      }

      // 성공 시 홈으로 이동
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      alert(error instanceof Error ? error.message : '게시물 작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">새 게시물 작성</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 작성자 이름 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              작성자
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {userName || '로딩 중...'}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
            />
          </div>

          {/* 내용/설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              내용/설명
            </label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="내용을 입력하세요"
            />
          </div>

          {/* 올린 날짜 (선택) */}
          <div>
            <label htmlFor="uploadDate" className="block text-sm font-medium text-gray-700 mb-1">
              올린 날짜 (선택) <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="uploadDate"
              required
              value={formData.uploadDate}
              onChange={(e) => setFormData({ ...formData, uploadDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              실제로 활동한 날짜를 선택하세요. (오늘이 아니어도 됩니다)
            </p>
          </div>

          {/* 사진 업로드 */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              사진 업로드
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="max-w-full h-auto max-h-64 rounded-md"
                />
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? '저장 중...' : '게시물 저장'}
            </button>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-center"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
