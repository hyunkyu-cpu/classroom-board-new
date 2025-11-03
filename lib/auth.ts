// 학생 및 교사 계정 정보
export const ACCOUNTS = {
  students: [
    { name: '김대수', code: '1024' },
    { name: '김주한', code: '0623' },
    { name: '김차영', code: '0630' },
    { name: '김태린', code: '0609' },
    { name: '김혜지', code: '1029' },
    { name: '안준희', code: '1207' },
    { name: '인선우', code: '1010' },
    { name: '정군', code: '0420' },
    { name: '정유이', code: '0609' },
    { name: '최지음', code: '0820' },
  ],
  teacher: { name: '교사', code: '5555' },
}

export type UserRole = 'student' | 'teacher'

export interface User {
  name: string
  role: UserRole
}

// 로그인 검증
export function verifyLogin(name: string, code: string): User | null {
  // 교사 계정 확인
  if (name === ACCOUNTS.teacher.name && code === ACCOUNTS.teacher.code) {
    return { name: ACCOUNTS.teacher.name, role: 'teacher' }
  }

  // 학생 계정 확인
  const student = ACCOUNTS.students.find(
    (s) => s.name === name && s.code === code
  )

  if (student) {
    return { name: student.name, role: 'student' }
  }

  return null
}
