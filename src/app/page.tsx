import { db } from "@/lib/db";
import TambahBuku from "@/app/components/TambahBuku";
import EditBuku from "@/app/components/EditBuku";
import HapusBuku from "@/app/components/HapusBuku";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const like = `%${q}%`;

  // Fetch data pakai raw SQL (dengan pencarian judul / penulis)
  const [bukuList]: any = await db.query(
    "SELECT * FROM buku WHERE judul LIKE ? OR penulis LIKE ? ORDER BY id ASC",
    [like, like],
  );

  const totalEksemplar = bukuList.reduce(
    (total: number, b: any) => total + Number(b.stok_total),
    0,
  );

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Koleksi Buku</h1>
          <p className="text-gray-500">
            Semua buku di satu tempat. Tambah dan kelola koleksi dengan mudah.
          </p>
        </div>
        <TambahBuku />
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Pencarian (tekan Enter) */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
          <form className="w-full max-w-sm">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari judul atau penulis buku..."
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </form>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {bukuList.length} judul buku · {totalEksemplar} eksemplar
          </p>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Buku</th>
              <th className="p-4 font-semibold text-gray-600">Penulis</th>
              <th className="p-4 font-semibold text-gray-600">Tahun</th>
              <th className="p-4 font-semibold text-gray-600">Kategori</th>
              <th className="p-4 font-semibold text-gray-600">Ketersediaan</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bukuList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Tidak ada buku yang cocok dengan pencarian.
                </td>
              </tr>
            )}
            {bukuList.map((buku: any) => (
              <tr
                key={buku.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    📖
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{buku.judul}</p>
                    <p className="text-sm text-gray-500">{buku.kode_buku}</p>
                  </div>
                </td>
                <td className="p-4 text-gray-700">{buku.penulis}</td>
                <td className="p-4 text-gray-700">{buku.tahun_terbit}</td>
                <td className="p-4 text-gray-700">{buku.kategori}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      buku.stok_tersedia > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {buku.stok_tersedia > 0 ? "Tersedia" : "Dipinjam semua"}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {buku.stok_tersedia} dari {buku.stok_total} tersedia
                  </p>
                </td>
                <td className="p-4 flex gap-2">
                  <EditBuku buku={buku} />
                  <HapusBuku buku={buku} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}