import { put } from '@vercel/blob'

/**
 * 파일을 Vercel Blob Storage에 저장합니다.
 *
 * @param file - 업로드할 파일
 * @returns 파일에 접근할 수 있는 URL
 */
export async function saveFileLocally(file: File): Promise<string> {
  // 파일명 중복 방지를 위해 타임스탬프 추가
  const timestamp = Date.now()
  const originalName = file.name.replace(/\s/g, '_')
  const filename = `${timestamp}_${originalName}`

  // Vercel Blob Storage에 업로드
  const blob = await put(filename, file, {
    access: 'public',
  })

  return blob.url
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
