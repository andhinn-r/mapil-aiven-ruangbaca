import { db } from '@/lib/db';
import TambahPeminjaman from '@/app/components/TambahPeminjaman';
import TombolKembalikan from '@/app/components/TombolKembalikan';

export default async function PeminjamanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const like = `%${q}%`;

  // 1. Ambil data peminjaman (JOIN dengan buku) + pencarian
  const [peminjamanList]: any = await db.query(
    `
    SELECT p.*, b.judul, b.kode_buku
    FROM peminjaman p
    JOIN buku b ON p.buku_id = b.id
    WHERE p.nama_peminjam LIKE ? OR b.judul LIKE ? OR b.kode_buku LIKE ?
    ORDER BY p.id DESC
  `,
    [like, like, like],
  );

  // 2. Ambil SEMUA data buku untuk dimasukkan ke dropdown form
  const [bukuList]: any = await db.query('SELECT * FROM buku ORDER BY judul ASC');

  const totalDipinjam = peminjamanList.filter(
    (p: any) => p.status === 'Dipinjam' || p.status === 'Terlambat',
  ).length;

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Peminjaman</h1>
          <p className="text-gray-500">Catat buku yang dipinjam dan kelola pengembaliannya di sini.</p>
        </div>
        {/* Kirim data bukuList sebagai props */}
        <TambahPeminjaman bukuList={bukuList} />
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Pencarian (tekan Enter) */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200">
          <form className="w-full max-w-sm">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari peminjam atau judul buku..."
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </form>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {peminjamanList.length} peminjaman · {totalDipinjam} aktif
          </p>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Peminjam</th>
              <th className="p-4 font-semibold text-gray-600">Buku</th>
              <th className="p-4 font-semibold text-gray-600">Tanggal pinjam</th>
              <th className="p-4 font-semibold text-gray-600">Batas kembali</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {peminjamanList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Tidak ada peminjaman yang cocok dengan pencarian.
                </td>
              </tr>
            )}
            {peminjamanList.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-medium text-gray-800">{p.nama_peminjam}</p>
                  <p className="text-sm text-gray-500">{p.kode_peminjaman}</p>
                </td>
                <td className="p-4">
                  <p className="font-medium text-gray-800">{p.judul}</p>
                  <p className="text-sm text-gray-500">{p.kode_buku} · 1 eksemplar</p>
                </td>
                <td className="p-4 text-gray-700">{new Date(p.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                <td className="p-4 text-gray-700">{new Date(p.batas_kembali).toLocaleDateString('id-ID')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.status === 'Dipinjam' ? 'bg-blue-100 text-blue-700' :
                    p.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4">
                  {p.status === 'Dipinjam' || p.status === 'Terlambat' ? (
                    <TombolKembalikan peminjamanId={p.id} bukuId={p.buku_id} />
                  ) : (
                    <span className="text-sm text-green-600">✓ Selesai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}