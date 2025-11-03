'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Post = {
  id: number
  title: string | null
  description: string | null
  authorName: string
  uploadDate: string
  imageUrl: string | null
  createdAt: string
  comments: any[]
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    fetchPosts()

    // 로그인한 사용자 정보 가져오기
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserRole(data.user.role)
        }
      })
      .catch((error) => console.error('Error fetching user:', error))
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: number, e: React.MouseEvent) => {
    e.preventDefault() // Link 클릭 방지
    e.stopPropagation()

    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('게시물 삭제에 실패했습니다.')
      }

      alert('게시물이 삭제되었습니다.')
      fetchPosts() // 목록 새로고침
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error instanceof Error ? error.message : '게시물 삭제 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">게시물 목록</h2>
        <Link
          href="/upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          새 게시물 작성
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">아직 게시물이 없습니다.</p>
          <Link
            href="/upload"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            첫 게시물을 작성해보세요!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <Link
                href={`/posts/${post.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden block"
              >
                {post.imageUrl && (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={post.imageUrl}
                      alt={post.title || '게시물 이미지'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {post.title || '제목 없음'}
                  </h3>
                  {post.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.authorName}</span>
                    <span>{formatDate(post.uploadDate)}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    댓글 {post.comments.length}개
                  </div>
                </div>
              </Link>

              {/* 교사만 삭제 버튼 표시 */}
              {userRole === 'teacher' && (
                <button
                  onClick={(e) => handleDeletePost(post.id, e)}
                  className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
