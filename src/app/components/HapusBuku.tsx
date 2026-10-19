'use client'

import { useState } from 'react'
import { hapusBuku } from '@/app/actions'

export default function HapusBuku({ buku }: { buku: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Tombol Pemicu (Hapus) */}
      <button onClick={() => setIsOpen(true)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
        Hapus
      </button>
      
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            
            {/* Header Modal */}
            <div className="p-6 pb-4 relative">
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 mb-3">
                🗑️
              </div>
              <h2 className="text-xl font-bold text-gray-800">Hapus Buku?</h2>
              <p className="text-sm text-gray-500 mt-1">Pastikan buku ini tidak lagi dibutuhkan.</p>
            </div>

            {/* Detail Buku (Kotak Abu-abu) */}
            <div className="px-6">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
                <p className="font-bold text-gray-800 text-sm mb-1">{buku.judul}</p>
                <p className="text-xs text-gray-600 mb-2">{buku.penulis} · {buku.tahun_terbit} · {buku.kode_buku}</p>
                <p className="text-xs text-gray-500">{buku.stok_total} eksemplar · Tidak sedang dipinjam</p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Buku akan dihapus dari koleksi. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {/* Footer Modal */}
            <div className="p-6 pt-0 flex justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
              
              {/* Form action untuk Hapus */}
              <form action={async () => {
                await hapusBuku(buku.id)
                setIsOpen(false)
              }}>
                <button type="submit" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Ya, Hapus Buku</button>
              </form>
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}