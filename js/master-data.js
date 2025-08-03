// master-data.js
const masterData = {
  accidentTypes: [
    "Terjatuh",
    "Tertiban",
    "Terpotong",
    "Tersayat",
    "Tersengat listrik",
    "Terbakar",
    "Terpapar kimia",
    "Tertusuk",
    "Tergores",
    "Tersangkut mesin",
    "Tertimpa",
    "Kontak dengan benda panas",
    "Kontak dengan benda dingin",
    "Gerakan berulang",
    "Lainnya"
  ],

  injuryTypes: [
    "Luka lecet",
    "Luka sayat",
    "Luka tusuk",
    "Luka bakar",
    "Patah tulang",
    "Dislokasi",
    "Amputasi",
    "Gegar otak",
    "Keracunan",
    "Trauma mata",
    "Trauma telinga",
    "Keseleo",
    "Kram otot",
    "Luka tembus",
    "Lainnya"
  ],

  bodyParts: [
    "Kepala",
    "Wajah",
    "Mata",
    "Telinga",
    "Hidung",
    "Mulut",
    "Leher",
    "Bahu",
    "Lengan",
    "Tangan",
    "Jari",
    "Dada",
    "Perut",
    "Punggung",
    "Pinggang",
    "Panggul",
    "Alat kelamin",
    "Paha",
    "Lutut",
    "Betis",
    "Kaki",
    "Seluruh tubuh"
  ],

  immediateActions: [
    "Evakuasi korban",
    "Pemberian P3K",
    "Pengendalian perdarahan",
    "Imobilisasi",
    "Pemadaman api",
    "Pencucian kimia",
    "Pelepasan listrik",
    "Pemanggilan medis",
    "Pengamanan area",
    "Penghentian mesin",
    "Pencatatan bukti",
    "Pelaporan"
  ],

  severityLevels: [
    "P3K",
    "Perawatan medis",
    "Hilang waktu kerja",
    "Rawat inap",
    "Cacat permanen",
    "Kematian"
  ]
};

// Export for modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = masterData;
}