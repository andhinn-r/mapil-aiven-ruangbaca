"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ================= BUKU =================
export async function tambahBuku(formData: FormData) {
  const judul = formData.get("judul") as string;
  const penulis = formData.get("penulis") as string;
  const tahunTerbit = parseInt(formData.get("tahunTerbit") as string);
  const kategori = formData.get("kategori") as string;
  const stokTotal = parseInt(formData.get("jumlahEksemplar") as string);

  // Ambil kode buku terakhir untuk generate kode baru
  const [rows]: any = await db.query(
    "SELECT kode_buku FROM buku ORDER BY id DESC LIMIT 1",
  );
  let nextNumber = 1;
  if (rows.length > 0) {
    const lastKode = rows[0].kode_buku;
    nextNumber = parseInt(lastKode.split("-")[1]) + 1;
  }
  const kodeBuku = `BK-${String(nextNumber).padStart(3, "0")}`;

  await db.execute(
    "INSERT INTO buku (kode_buku, judul, penulis, tahun_terbit, kategori, stok_total, stok_tersedia) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [kodeBuku, judul, penulis, tahunTerbit, kategori, stokTotal, stokTotal],
  );
  revalidatePath("/");
}

export async function editBuku(id: number, formData: FormData) {
  const judul = formData.get("judul") as string;
  const penulis = formData.get("penulis") as string;
  const tahunTerbit = parseInt(formData.get("tahunTerbit") as string);
  const kategori = formData.get("kategori") as string;
  const stokTotalBaru = parseInt(formData.get("jumlahEksemplar") as string);

  // Ambil stok lama untuk hitung selisih
  const [rows]: any = await db.query(
    "SELECT stok_total, stok_tersedia FROM buku WHERE id = ?",
    [id],
  );
  const bukuLama = rows[0];
  const selisih = stokTotalBaru - bukuLama.stok_total;
  const stokTersediaBaru = bukuLama.stok_tersedia + selisih;

  await db.execute(
    "UPDATE buku SET judul=?, penulis=?, tahun_terbit=?, kategori=?, stok_total=?, stok_tersedia=? WHERE id=?",
    [
      judul,
      penulis,
      tahunTerbit,
      kategori,
      stokTotalBaru,
      stokTersediaBaru,
      id,
    ],
  );
  revalidatePath("/");
}

export async function hapusBuku(id: number) {
  await db.execute("DELETE FROM buku WHERE id = ?", [id]);
  revalidatePath("/");
}

// ================= PEMINJAMAN =================
export async function tambahPeminjaman(formData: FormData) {
  const namaPeminjam = formData.get("namaPeminjam") as string;
  const bukuId = parseInt(formData.get("bukuId") as string);
  const tanggalPinjam = formData.get("tanggalPinjam") as string;
  const batasKembali = formData.get("batasKembali") as string;

  // Generate Kode Peminjaman
  const [rows]: any = await db.query(
    "SELECT kode_peminjaman FROM peminjaman ORDER BY id DESC LIMIT 1",
  );
  let nextNumber = 1;
  if (rows.length > 0) {
    nextNumber = parseInt(rows[0].kode_peminjaman.split("-")[1]) + 1;
  }
  const kodePeminjaman = `PJ-${String(nextNumber).padStart(3, "0")}`;

  // Gunakan Transaction karena melibatkan 2 query (Update stok & Insert peminjaman)
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Kurangi stok buku
    await connection.execute(
      "UPDATE buku SET stok_tersedia = stok_tersedia - 1 WHERE id = ?",
      [bukuId],
    );

    // 2. Insert ke tabel peminjaman
    await connection.execute(
      "INSERT INTO peminjaman (kode_peminjaman, nama_peminjam, buku_id, tanggal_pinjam, batas_kembali, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        kodePeminjaman,
        namaPeminjam,
        bukuId,
        tanggalPinjam,
        batasKembali,
        "Dipinjam",
      ],
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/peminjaman");
}

export async function kembalikanBuku(peminjamanId: number, bukuId: number) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update status peminjaman
   await connection.execute(
  `UPDATE peminjaman SET status = 'Dikembalikan' WHERE id = ?`,
  [peminjamanId],
);

    // 2. Kembalikan stok buku
    await connection.execute(
      "UPDATE buku SET stok_tersedia = stok_tersedia + 1 WHERE id = ?",
      [bukuId],
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/peminjaman");
}
