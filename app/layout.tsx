import type { Metadata } from 'next'
import './globals.css'
import { getUser } from '@/lib/getUser'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: '학급 게시판',
  description: '학생들의 과제와 활동을 공유하는 게시판',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        {user && <Header user={user} />}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
