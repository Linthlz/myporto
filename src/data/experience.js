/**
 * ─────────────────────────────────────────────────────────────────────────────
 * JOURNEY
 *
 * Taken from the education and research sections of your CV.
 * Text that changes with the language is written as { en: '…', id: '…' }.
 *
 *   status: 'current' renders a live amber marker; everything else is neutral.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const experience = [
  {
    id: 'brin',
    period: 'Jan 2026',
    role: { en: 'Research Member', id: 'Anggota Riset' },
    org: { en: 'BRIN — National Research and Innovation Agency', id: 'BRIN — Badan Riset dan Inovasi Nasional' },
    status: 'past',
    summary: {
      en: 'Research on a domain adaptation model for 3D pose estimation in sport: fine-tuning SportsPose and validating it across datasets on AthletePose3D.',
      id: 'Riset model adaptasi domain untuk estimasi pose 3D dalam olahraga: fine-tuning SportsPose dan validasi lintas dataset pada AthletePose3D.',
    },
  },
  {
    id: 'pancasari',
    period: 'Nov 2025',
    role: { en: 'Research Member', id: 'Anggota Riset' },
    org: { en: 'PKM — Pancasari Village Community Economy Programme', id: 'PKM — Program Ekonomi Masyarakat Desa Pancasari' },
    status: 'past',
    summary: {
      en: 'Part of a community service research programme supporting the local economy of Pancasari village.',
      id: 'Bagian dari program riset pengabdian masyarakat yang mendukung ekonomi lokal Desa Pancasari.',
    },
  },
  {
    id: 'pejarakan',
    period: 'Jul 2025',
    role: { en: 'Research Member', id: 'Anggota Riset' },
    org: { en: 'PKM — Pejarakan Assisted Village Programme', id: 'PKM — Program Desa Binaan Pejarakan' },
    status: 'past',
    summary: {
      en: 'Part of a community service research programme in the assisted village of Pejarakan.',
      id: 'Bagian dari program riset pengabdian masyarakat di desa binaan Pejarakan.',
    },
  },
  {
    id: 'degree',
    period: { en: '2023 – Now', id: '2023 – Sekarang' },
    role: { en: 'B.Sc. Information Systems', id: 'S1 Sistem Informasi' },
    org: 'Universitas Pendidikan Ganesha, Bali',
    status: 'current',
    summary: {
      en: 'Undergraduate study in Information Systems, alongside frontend projects for organisations and community programmes.',
      id: 'Kuliah S1 Sistem Informasi, sambil mengerjakan proyek frontend untuk organisasi dan program pengabdian masyarakat.',
    },
  },
]
