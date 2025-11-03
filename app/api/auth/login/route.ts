import { NextRequest, NextResponse } from 'next/server'
import { verifyLogin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: '이름과 로그인 코드를 입력해주세요.' },
        { status: 400 }
      )
    }

    const user = verifyLogin(name, code)

    if (!user) {
      return NextResponse.json(
        { error: '이름 또는 로그인 코드가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 세션 생성 (쿠키 사용)
    const response = NextResponse.json({ user }, { status: 200 })

    // 쿠키에 사용자 정보 저장 (7일간 유효)
    response.cookies.set('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
