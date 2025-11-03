import { writeFile } from 'fs/promises'
import path from 'path'

/**
 * 파일을 로컬 public/uploads 폴더에 저장합니다.
 * 실제 배포 시에는 이 함수를 S3나 Supabase Storage를 사용하도록 교체할 수 있습니다.
 *
 * @param file - 업로드할 파일
 * @returns 파일에 접근할 수 있는 URL
 */
export async function saveFileLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // 파일명 중복 방지를 위해 타임스탬프 추가
  const timestamp = Date.now()
  const originalName = file.name.replace(/\s/g, '_')
  const filename = `${timestamp}_${originalName}`

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const filepath = path.join(uploadDir, filename)

  await writeFile(filepath, buffer)

  // 클라이언트에서 접근 가능한 URL 반환
  return `/uploads/${filename}`
}

/**
 * 향후 Supabase Storage로 교체하려면:
 *
 * import { createClient } from '@supabase/supabase-js'
 *
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY!
 * )
 *
 * export async function saveFileToSupabase(file: File): Promise<string> {
 *   const timestamp = Date.now()
 *   const filename = `${timestamp}_${file.name}`
 *
 *   const { data, error } = await supabase.storage
 *     .from('uploads')
 *     .upload(filename, file)
 *
 *   if (error) throw error
 *
 *   const { data: { publicUrl } } = supabase.storage
 *     .from('uploads')
 *     .getPublicUrl(filename)
 *
 *   return publicUrl
 * }
 */
