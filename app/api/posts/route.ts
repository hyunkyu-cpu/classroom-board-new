import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/posts - 게시물 목록 가져오기 (uploadDate DESC 정렬)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        uploadDate: 'desc', // 학생이 선택한 날짜로 정렬
      },
      include: {
        comments: true,
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - 게시물 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, authorName, uploadDate, imageUrl } = body

    if (!authorName || !uploadDate) {
      return NextResponse.json(
        { error: 'Author name and upload date are required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        authorName,
        uploadDate: new Date(uploadDate),
        imageUrl,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
