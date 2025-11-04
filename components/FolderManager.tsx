'use client'

import { useState, useEffect } from 'react'

interface Folder {
  id: number
  name: string
  description?: string
  color: string
  _count?: {
    posts: number
  }
}

interface FolderManagerProps {
  onSelectFolder: (folderId: number | null) => void
  selectedFolderId: number | null
}

export default function FolderManager({ onSelectFolder, selectedFolderId }: FolderManagerProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newFolder, setNewFolder] = useState({ name: '', description: '', color: '#3B82F6' })

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders')
      const data = await response.json()
      setFolders(data)
    } catch (error) {
      console.error('Error fetching folders:', error)
    }
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFolder.name.trim()) return

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFolder)
      })

      if (response.ok) {
        setNewFolder({ name: '', description: '', color: '#3B82F6' })
        setIsCreating(false)
        fetchFolders()
      }
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleDeleteFolder = async (folderId: number) => {
    if (!confirm('이 폴더를 삭제하시겠습니까? (폴더 내 게시글은 유지됩니다)')) return

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        if (selectedFolderId === folderId) {
          onSelectFolder(null)
        }
        fetchFolders()
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  const colors = [
    { name: '파랑', value: '#3B82F6' },
    { name: '초록', value: '#10B981' },
    { name: '빨강', value: '#EF4444' },
    { name: '보라', value: '#8B5CF6' },
    { name: '노랑', value: '#F59E0B' },
    { name: '분홍', value: '#EC4899' }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">폴더</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isCreating ? '취소' : '+ 새 폴더'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateFolder} className="mb-4 p-4 bg-gray-50 rounded">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">폴더 이름</label>
            <input
              type="text"
              value={newFolder.name}
              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="예: 수학 과제, 미술 작품"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">설명 (선택)</label>
            <input
              type="text"
              value={newFolder.description}
              onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="폴더 설명"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">색상</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setNewFolder({ ...newFolder, color: color.value })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newFolder.color === color.value ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            폴더 만들기
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectFolder(null)}
          className={`px-4 py-2 rounded font-medium ${
            selectedFolderId === null
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          전체
        </button>

        {folders.map((folder) => (
          <div key={folder.id} className="relative group">
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${
                selectedFolderId === folder.id
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: selectedFolderId === folder.id ? folder.color : `${folder.color}30`,
                color: selectedFolderId === folder.id ? 'white' : folder.color
              }}
            >
              <span>{folder.name}</span>
              {folder._count && folder._count.posts > 0 && (
                <span className="text-xs opacity-75">({folder._count.posts})</span>
              )}
            </button>
            <button
              onClick={() => handleDeleteFolder(folder.id)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="폴더 삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
