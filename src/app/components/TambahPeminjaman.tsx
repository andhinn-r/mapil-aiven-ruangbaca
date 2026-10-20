'use client'

import { useState } from 'react'
import { tambahPeminjaman } from '@/app/actions'

// Format YYYY-MM-DD memakai waktu lokal (bukan UTC)
const formatTanggal = (d: Date) => d.toLocaleDateString('en-CA')

export default function ModalTambahPeminjaman({ bukuList }: { bukuList: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBuku, setSelectedBuku] = useState<any>(null)

  // Tanggal otomatis: hari ini dan tepat 7 hari ke depan
  const hariIni = new Date()
  const today = formatTanggal(hariIni)
  const nextWeek = formatTanggal(new Date(hariIni.getTime() + 7 * 24 * 60 * 60 * 1000))

  const handleClose = () => {
    setIsOpen(false)
    setSelectedBuku(null)
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
  const readOnlyClass =
    "w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-600 bg-gray-100 cursor-not-allowed focus:outline-none"

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <span>+</span> Tambah Peminjaman
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-900 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 pb-4 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#2D6A4F] mb-3 text-lg">
                ⇄
              </div>
              <h2 className="text-xl font-bold text-gray-800">Tambah Peminjaman</h2>
              <p className="text-sm text-gray-500 mt-1">Catat peminjaman baru dengan mudah.</p>
            </div>

            <form
              action={async (formData) => {
                await tambahPeminjaman(formData)
                handleClose()
              }}
              className="p-6 pt-2"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama peminjam</label>
                <input name="namaPeminjam" placeholder="Nadia Putri" className={inputClass} required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Buku</label>
                <select
                  name="bukuId"
                  defaultValue=""
                  onChange={(e) => {
                    const buku = bukuList.find((b) => b.id.toString() === e.target.value)
                    setSelectedBuku(buku || null)
                  }}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Pilih buku...</option>
                  {bukuList.map((buku) => (
                    <option key={buku.id} value={buku.id} disabled={buku.stok_tersedia === 0}>
                      {buku.judul} — {buku.penulis} {buku.stok_tersedia === 0 ? '(Habis)' : ''}
                    </option>
                  ))}
                </select>

                {selectedBuku && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span>ⓘ</span> {selectedBuku.stok_tersedia} eksemplar tersedia · Meminjam 1 eksemplar
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal pinjam</label>
                  <input
                    type="date"
                    name="tanggalPinjam"
                    value={today}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Batas kembali</label>
                  <input
                    type="date"
                    name="batasKembali"
                    value={nextWeek}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>
              </div>

              <div className="bg-[#E8F5E9] text-[#2D6A4F] text-xs p-3 rounded-lg flex items-start gap-2 mb-2">
                <span className="mt-0.5">ⓘ</span>
                <p>Lama peminjaman otomatis 7 hari. Ketersediaan buku berkurang setelah disimpan.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedBuku}
                  className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}