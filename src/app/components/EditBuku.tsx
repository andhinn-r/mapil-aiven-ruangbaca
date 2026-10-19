"use client";

import { useState } from "react";
import { editBuku } from "@/app/actions";

export default function EditBuku({ buku }: { buku: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        {" "}
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Buku</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black-400 hover:text-black-600"
              >
                ✕
              </button>
            </div>
            <form
              action={async (formData) => {
                await editBuku(buku.id, formData);
                setIsOpen(false);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Judul buku
                </label>
                <input
                  name="judul"
                  defaultValue={buku.judul}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Penulis
                </label>
                <input
                  name="penulis"
                  defaultValue={buku.penulis}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tahun terbit
                  </label>
                  <input
                    type="number"
                    name="tahunTerbit"
                    defaultValue={buku.tahun_terbit}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    defaultValue={buku.kategori}
                    className="w-full border rounded p-2 bg-white"
                  >
                    <option value="Novel">Novel</option>
                    <option value="Komik">Komik</option>
                    <option value="Pelajaran">Pelajaran</option>
                    <option value="Sains">Sains</option>
                    <option value="Sejarah">Sejarah</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Jumlah eksemplar
                </label>
                <input
                  type="number"
                  name="jumlahEksemplar"
                  defaultValue={buku.stok_total}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D6A4F] text-white rounded hover:bg-[#1B4332]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
