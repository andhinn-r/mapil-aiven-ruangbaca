'use client'

import { useTransition } from 'react'
import { kembalikanBuku, perpanjangPeminjaman } from '@/app/actions'

export default function TombolKembalikan({ peminjamanId, bukuId }: { peminjamanId: number, bukuId: number }) {
  const [isPending, startTransition] = useTransition()

  const handleKembalikan = () => {
    if (confirm('Apakah Anda yakin buku ini sudah dikembalikan?')) {
      startTransition(async () => {
        await kembalikanBuku(peminjamanId, bukuId)
      })
    }
  }

  const handlePerpanjang = () => {
    if (confirm('Perpanjang peminjaman selama 7 hari?')) {
      startTransition(async () => {
        await perpanjangPeminjaman(peminjamanId)
      })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePerpanjang}
        disabled={isPending}
        className={`text-sm flex items-center gap-1 ${
          isPending ? 'text-gray-400 cursor-not-allowed' : 'text-[#2D6A4F] hover:underline'
        }`}
      >
        {isPending ? '⏳ Memproses...' : '🔄 Perpanjang'}
      </button>
      <button
        onClick={handleKembalikan}
        disabled={isPending}
        className={`text-sm flex items-center gap-1 ${
          isPending ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
        }`}
      >
        {isPending ? '⏳ Memproses...' : '↩️ Kembalikan'}
      </button>
    </div>
  )
}