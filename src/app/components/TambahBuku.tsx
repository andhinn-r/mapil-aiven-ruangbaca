"use client";

import { useState } from "react";
import { tambahBuku } from "@/app/actions";

export default function TambahBuku() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Pemicu */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <span>+</span> Tambah Buku
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
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#2D6A4F] mb-3">
                📖
              </div>
              <h2 className="text-xl font-bold text-gray-800">Tambah Buku</h2>
              <p className="text-sm text-gray-500 mt-1">
                Lengkapi informasi buku untuk koleksi Anda.
              </p>
            </div>

            {/* Form */}
            <form
              action={async (formData) => {
                await tambahBuku(formData);
                setIsOpen(false);
              }}
              className="p-6 pt-2"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Judul buku
                </label>
                <input
                  name="judul"
                  placeholder=" "
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Penulis
                </label>
                <input
                  name="penulis"
                  placeholder=" "
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tahun terbit
                  </label>
                  <input
                    type="number"
                    name="tahunTerbit"
                    placeholder=" "
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] bg-white"
                  >
                    <option value="Novel">Novel</option>
                    <option value="Komik">Komik</option>
                    <option value="Pelajaran">Pelajaran</option>
                    <option value="Sains">Sains</option>
                    <option value="Sejarah">Sejarah</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jumlah eksemplar
                </label>
                <input
                  type="number"
                  name="jumlahEksemplar"
                  placeholder=" "
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Semua kolom wajib diisi.
                </p>
              </div>

              {/* Footer Modal */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Simpan Buku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
