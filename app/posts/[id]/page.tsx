'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Comment = {
  id: number
  authorName: string
  content: string
  commentDate: string
  createdAt: string
}

type Post = {
  id: number
  title: string | null
  description: string | null
  authorName: string
  uploadDate: string
  imageUrl: string | null
  createdAt: string
  comments: Comment[]
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [commentForm, setCommentForm] = useState({
    content: '',
    commentDate: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPost()
    }

    // 로그인한 사용자 정보 가져오기
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.name)
          setUserRole(data.user.role)
        }
      })
      .catch((error) => console.error('Error fetching user:', error))
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        alert('게시물을 찾을 수 없습니다.')
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      alert('게시물을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!commentForm.content.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorName: userName,
          content: commentForm.content,
          commentDate: commentForm.commentDate,
        }),
      })

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.')
      }

      // 댓글 작성 후 폼 초기화 및 게시물 다시 불러오기
      setCommentForm({
        content: '',
        commentDate: new Date().toISOString().split('T')[0]
      })
      await fetchPost()
    } catch (error) {
      console.error('Error creating comment:', error)
      alert(error instanceof Error ? error.message : '댓글 작성 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('게시물 삭제에 실패했습니다.')
      }

      alert('게시물이 삭제되었습니다.')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error instanceof Error ? error.message : '게시물 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  if (!post) {
    return <div className="text-center py-12">게시물을 찾을 수 없습니다.</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 목록으로 돌아가기
        </Link>
      </div>

      {/* 게시물 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">
            {post.title || '제목 없음'}
          </h1>

          {/* 교사만 삭제 버튼 표시 */}
          {userRole === 'teacher' && (
            <button
              onClick={handleDeletePost}
              disabled={deleting}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
          <span className="font-medium">{post.authorName}</span>
          <span>•</span>
          <span>{formatDate(post.uploadDate)}</span>
        </div>

        {post.imageUrl && (
          <div className="mb-6">
            <div className="relative w-full h-96">
              <Image
                src={post.imageUrl}
                alt={post.title || '게시물 이미지'}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {post.description && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
          </div>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          댓글 {post.comments.length}개
        </h2>

        {/* 댓글 목록 */}
        <div className="space-y-4 mb-6">
          {post.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              첫 댓글을 작성해보세요!
            </p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-900">{comment.authorName}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(comment.commentDate)}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">댓글 작성</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                작성자
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {userName || '로딩 중...'}
              </div>
            </div>

            <div>
              <label htmlFor="commentDate" className="block text-sm font-medium text-gray-700 mb-1">
                댓글 날짜 (선택) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="commentDate"
                required
                value={commentForm.commentDate}
                onChange={(e) => setCommentForm({ ...commentForm, commentDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                실제로 댓글을 작성한 날짜를 선택하세요. (오늘이 아니어도 됩니다)
              </p>
            </div>

            <div>
              <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 mb-1">
                댓글 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="commentContent"
                required
                rows={3}
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="댓글을 입력하세요"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {submitting ? '댓글 작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
