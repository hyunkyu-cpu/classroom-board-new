import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/posts/[id]/comments - 댓글 생성
export async function POST(
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

    const body = await request.json()
    const { authorName, content, commentDate } = body

    if (!authorName || !content || !commentDate) {
      return NextResponse.json(
        { error: 'Author name, content and comment date are required' },
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

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        content,
        commentDate: new Date(commentDate),
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
