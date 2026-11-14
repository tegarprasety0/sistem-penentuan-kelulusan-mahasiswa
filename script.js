const graduationForm = document.getElementById("graduationForm");
const result = document.getElementById("result");
const studentList = document.getElementById("studentList");

// DATA MAHASISWA DARI LOCAL STORAGE
let dataMahasiswa = [];

try {
    const dataTersimpan = localStorage.getItem("dataMahasiswa");
    dataMahasiswa = dataTersimpan ? JSON.parse(dataTersimpan) : [];

    if (!Array.isArray(dataMahasiswa)) {
        dataMahasiswa = [];
    }
} catch (error) {
    dataMahasiswa = [];
}

function simpanData() {
    try {
        localStorage.setItem(
            "dataMahasiswa",
            JSON.stringify(dataMahasiswa)
        );
    } catch (error) {
        alert("Data gagal disimpan di browser.");
        console.error("Gagal menyimpan data:", error);
    }
}

// MENCEGAH TEKS NAMA DIBACA SEBAGAI HTML
function escapeHTML(teks) {
    return String(teks).replace(/[&<>"']/g, function (karakter) {
        const karakterHTML = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return karakterHTML[karakter];
    });
}

// MENAMPILKAN STATISTIK
function tampilkanStatistik() {
    const total = dataMahasiswa.length;

    const jumlahLulus = dataMahasiswa.filter(
        mahasiswa => mahasiswa.lulus
    ).length;

    const jumlahTidakLulus = total - jumlahLulus;

    document.getElementById("totalMahasiswa").textContent = total;
    document.getElementById("jumlahLulus").textContent = jumlahLulus;
    document.getElementById("jumlahTidakLulus").textContent = jumlahTidakLulus;
}

// MENAMPILKAN DATA MAHASISWA
function tampilkanData() {
    if (dataMahasiswa.length === 0) {
        studentList.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">
                    Belum ada data mahasiswa.
                </td>
            </tr>
        `;

        tampilkanStatistik();
        return;
    }

    studentList.innerHTML = dataMahasiswa.map((mahasiswa, index) => {
        const kelasStatus = mahasiswa.lulus
            ? "status-pass"
            : "status-fail";

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(mahasiswa.nama)}</td>
                <td>${mahasiswa.ujian}</td>
                <td>${mahasiswa.tugas}</td>
                <td>${mahasiswa.kehadiran}%</td>
                <td class="${kelasStatus}">
                    ${mahasiswa.status}
                </td>
                <td>
                    <button
                        type="button"
                        class="delete-btn"
                        data-index="${index}"
                        aria-label="Hapus data ${escapeHTML(mahasiswa.nama)}"
                    >
                        HAPUS
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    tampilkanStatistik();
}

// MENAMPILKAN HASIL KELULUSAN
function tampilkanHasil(mahasiswa) {
    const {
        nama,
        ujian,
        tugas,
        kehadiran,
        A,
        B,
        C,
        lulus
    } = mahasiswa;

    const kelasStatus = lulus ? "pass" : "fail";
    const teksStatus = lulus ? "LULUS" : "TIDAK LULUS";

    result.className = "result-card " + kelasStatus;

    result.innerHTML = `
        <p class="result-status">${teksStatus}</p>

        <p class="result-name">
            Nama mahasiswa: ${escapeHTML(nama)}
        </p>

        <p class="evaluation-title">
            HASIL EVALUASI KRITERIA
        </p>

        <ul class="evaluation-list">
            <li>
                <span>Nilai ujian (${ujian} ≥ 60)</span>
                <strong>${A ? "TERPENUHI" : "TIDAK TERPENUHI"}</strong>
            </li>

            <li>
                <span>Nilai tugas (${tugas} ≥ 60)</span>
                <strong>${B ? "TERPENUHI" : "TIDAK TERPENUHI"}</strong>
            </li>

            <li>
                <span>Kehadiran (${kehadiran}% ≥ 75%)</span>
                <strong>${C ? "TERPENUHI" : "TIDAK TERPENUHI"}</strong>
            </li>
        </ul>

        <p class="evaluation-title">
            OPERASI BOOLEAN
        </p>

        <div class="logic-result">
            A = ${A}<br>
            B = ${B}<br>
            C = ${C}<br><br>

            L = A AND B AND C = ${lulus}<br>
            T = NOT A OR NOT B OR NOT C = ${!A || !B || !C}<br>
            NOT L = ${!lulus}
        </div>
    `;
}

// PROSES FORMULIR KELULUSAN
graduationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const ujian = Number(document.getElementById("ujian").value);
    const tugas = Number(document.getElementById("tugas").value);
    const kehadiran = Number(document.getElementById("kehadiran").value);

    const inputKosong = nama === "";

    const nilaiTidakValid =
        !Number.isFinite(ujian) ||
        !Number.isFinite(tugas) ||
        !Number.isFinite(kehadiran) ||
        ujian < 0 || ujian > 100 ||
        tugas < 0 || tugas > 100 ||
        kehadiran < 0 || kehadiran > 100;

    if (inputKosong || nilaiTidakValid) {
        result.className = "result-placeholder";

        result.innerHTML = `
            <p>INPUT TIDAK VALID</p>
            <span>
                Pastikan nama terisi dan semua nilai berada
                pada rentang 0 sampai 100.
            </span>
        `;

        return;
    }

    // VARIABEL BOOLEAN UNTUK SETIAP KRITERIA
    const A = ujian >= 60;
    const B = tugas >= 60;
    const C = kehadiran >= 75;

    // OPERASI AND DAN OR
    const lulus = A && B && C;
    const tidakLulus = !A || !B || !C;

    // OPERASI NOT / NEGASI
    const hasilNegasi = !lulus;

    // MEMBUAT OBJEK MAHASISWA BARU
    const mahasiswaBaru = {
        nama: nama,
        ujian: ujian,
        tugas: tugas,
        kehadiran: kehadiran,

        A: A,
        B: B,
        C: C,

        lulus: lulus,
        tidakLulus: tidakLulus,
        hasilNegasi: hasilNegasi,

        status: lulus ? "LULUS" : "TIDAK LULUS"
    };

    // MENAMPILKAN HASIL
    tampilkanHasil(mahasiswaBaru);

    // MENYIMPAN DATA
    dataMahasiswa.push(mahasiswaBaru);

    simpanData();
    tampilkanData();

    // MENGOSONGKAN FORMULIR
    graduationForm.reset();
});

// MENGHAPUS SATU DATA MAHASISWA
function hapusMahasiswa(index) {
    const mahasiswa = dataMahasiswa[index];

    if (!mahasiswa) return;

    const konfirmasi = confirm(
        `Apakah kamu yakin ingin menghapus data ${mahasiswa.nama}?`
    );

    if (!konfirmasi) return;

    dataMahasiswa.splice(index, 1);

    simpanData();
    tampilkanData();
}

// EVENT DELEGATION UNTUK TOMBOL HAPUS
studentList.addEventListener("click", function (event) {
    const tombolHapus = event.target.closest(".delete-btn");

    if (tombolHapus) {
        const index = Number(tombolHapus.dataset.index);

        hapusMahasiswa(index);
    }
});

// MENGHAPUS SELURUH DATA MAHASISWA
document.getElementById("clearAllBtn").addEventListener("click", function () {
    if (dataMahasiswa.length === 0) {
        alert("Belum ada data mahasiswa untuk dihapus.");
        return;
    }

    const konfirmasi = confirm(
        "Hapus seluruh data mahasiswa yang tersimpan?"
    );

    if (!konfirmasi) return;

    dataMahasiswa = [];

    simpanData();
    tampilkanData();

    result.className = "result-placeholder";

    result.innerHTML = `
        <p>Data berhasil dikosongkan.</p>
        <span>
            Belum ada data mahasiswa yang diperiksa.
        </span>
    `;
});

// MENAMPILKAN DATA TERSIMPAN SAAT HALAMAN DIBUKA
tampilkanData();