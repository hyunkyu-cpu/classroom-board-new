import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// GET /api/posts/[id] - 게시물 상세 + 댓글 포함
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - 게시물 삭제 (교사만 가능)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 로그인한 사용자 확인
    const cookieStore = cookies()
    const userCookie = cookieStore.get('user')

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userCookie.value)

    // 교사 권한 확인
    if (user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can delete posts' },
        { status: 403 }
      )
    }

    const postId = parseInt(params.id)

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    // 게시물 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 게시물 삭제 (onDelete: Cascade로 댓글도 자동 삭제됨)
    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
