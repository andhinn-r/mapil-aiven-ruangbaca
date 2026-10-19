'use client'

import { useTransition } from 'react'
import { kembalikanBuku } from '@/app/actions'

export default function TombolKembalikan({ peminjamanId, bukuId }: { peminjamanId: number, bukuId: number }) {
  const [isPending, startTransition] = useTransition()

  const handleKembalikan = () => {
    // Konfirmasi sederhana sebelum memproses
    if (confirm('Apakah Anda yakin buku ini sudah dikembalikan?')) {
      startTransition(async () => {
        await kembalikanBuku(peminjamanId, bukuId)
      })
    }
  }

  return (
    <button 
      onClick={handleKembalikan}
      disabled={isPending}
      className={`text-sm flex items-center gap-1 ${
        isPending ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
      }`}
    >
      {isPending ? '⏳ Memproses...' : '↩️ Kembalikan'}
    </button>
  )
}