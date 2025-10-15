// ===========================================
// DATA KAS (DIPERTEMPATKAN DARI KODE SEBELUMNYA)
// ===========================================
let transaksi = [];
let kasChart;
const form = document.getElementById('formTransaksi');
const tabelBody = document.getElementById('tabelKas').getElementsByTagName('tbody')[0];
const saldoAkhirEl = document.getElementById('saldoAkhir');
const grafikKasCtx = document.getElementById('grafikKas').getContext('2d');


// ===========================================
// DATA STATUS (BARU)
// ===========================================
let anggota = [
    { nama: 'Yuliana', status: {} }, // status akan berisi { 'YYYY-MM-DD': true/false }
    { nama: 'Budi', status: {} },
    { nama: 'Citra', status: {} },
];
let tanggalStatus = []; // Berisi array string tanggal dalam format 'YYYY-MM-DD'

const tabelStatusHead = document.getElementById('tabelStatus').getElementsByTagName('thead')[0].rows[0];
const tabelStatusBody = document.getElementById('tabelStatus').getElementsByTagName('tbody')[0];
const namaAnggotaInput = document.getElementById('namaAnggotaInput');
const tanggalStatusInput = document.getElementById('tanggalStatusInput');


// ===========================================
// FUNGSI KAS (DIPERTEMPATKAN)
// ===========================================

function initChart() {
    // ... (Fungsi Chart.js tetap sama) ...
    kasChart = new Chart(grafikKasCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['rgba(76, 175, 80, 0.8)', 'rgba(244, 67, 54, 0.8)'],
                borderColor: ['rgba(76, 175, 80, 1)', 'rgba(244, 67, 54, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Perbandingan Pemasukan vs Pengeluaran' }
            }
        }
    });
}

function hitungTotal() {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    transaksi.forEach(t => {
        const jumlah = parseFloat(t.jumlah);
        if (t.jenis === 'pemasukan') {
            totalPemasukan += jumlah;
        } else {
            totalPengeluaran += jumlah;
        }
    });

    const saldoAkhir = totalPemasukan - totalPengeluaran;
    saldoAkhirEl.textContent = `Rp ${saldoAkhir.toLocaleString('id-ID')}`;
    saldoAkhirEl.style.color = saldoAkhir >= 0 ? '#4CAF50' : '#F44336';
    updateChart(totalPemasukan, totalPengeluaran);
}

function renderTabel() {
    tabelBody.innerHTML = '';
    transaksi.forEach(t => {
        const row = tabelBody.insertRow();
        row.insertCell().textContent = t.tanggal;
        row.insertCell().textContent = t.keterangan;
        
        const jenisCell = row.insertCell();
        jenisCell.textContent = t.jenis.toUpperCase();
        jenisCell.style.color = t.jenis === 'pemasukan' ? '#4CAF50' : '#F44336';
        
        const jumlahCell = row.insertCell();
        jumlahCell.textContent = `Rp ${parseFloat(t.jumlah).toLocaleString('id-ID')}`;
        jumlahCell.style.fontWeight = 'bold';
    });
}

function updateChart(pemasukan, pengeluaran) {
    kasChart.data.datasets[0].data = [pemasukan, pengeluaran];
    kasChart.update();
}

function handleFormSubmit(e) {
    e.preventDefault();
    const newTransaction = {
        tanggal: document.getElementById('tanggal').value,
        keterangan: document.getElementById('keterangan').value,
        jenis: document.getElementById('jenis').value,
        jumlah: document.getElementById('jumlah').value,
    };

    if (newTransaction.jumlah > 0) {
        transaksi.push(newTransaction);
        renderTabel();
        hitungTotal();
        form.reset();
    } else {
        alert('Jumlah harus lebih dari nol.');
    }
}


// ===========================================
// FUNGSI STATUS (BARU)
// ===========================================

// Format tanggal dari 'YYYY-MM-DD' menjadi 'DD/MM YY'
function formatTanggal(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    return `${parts[2]}/${parts[1]} ${parts[0].slice(2)}`;
}

// Menangani klik pada sel status (toggle centang/silang)
function toggleStatus(anggotaIndex, tanggal) {
    const statusSaatIni = anggota[anggotaIndex].status[tanggal];
    anggota[anggotaIndex].status[tanggal] = !statusSaatIni;
    renderTabelStatus(); // Render ulang tabel
}

// Menambahkan nama anggota baru
function tambahAnggota() {
    const nama = namaAnggotaInput.value.trim();
    if (nama && !anggota.some(a => a.nama.toLowerCase() === nama.toLowerCase())) {
        anggota.push({ nama: nama, status: {} });
        renderTabelStatus();
        namaAnggotaInput.value = '';
    } else {
        alert('Nama tidak boleh kosong atau sudah ada!');
    }
}

// Menambahkan kolom tanggal baru
function tambahKolomTanggal() {
    const tanggal = tanggalStatusInput.value;
    if (tanggal && !tanggalStatus.includes(tanggal)) {
        tanggalStatus.push(tanggal);
        tanggalStatus.sort(); // Urutkan tanggal
        renderTabelStatus();
        tanggalStatusInput.value = '';
    } else if (tanggal) {
        alert('Tanggal tersebut sudah ada!');
    } else {
        alert('Pilih tanggal terlebih dahulu!');
    }
}

// Memperbarui tampilan tabel status
function renderTabelStatus() {
    // 1. Perbarui Header (Kolom Tanggal)
    tabelStatusHead.innerHTML = '<th>Nama Anggota</th>'; // Reset header
    tanggalStatus.forEach(tgl => {
        const th = document.createElement('th');
        th.textContent = formatTanggal(tgl);
        tabelStatusHead.appendChild(th);
    });

    // 2. Perbarui Body (Baris Anggota dan Status)
    tabelStatusBody.innerHTML = ''; // Bersihkan body
    
    anggota.forEach((member, index) => {
        const row = tabelStatusBody.insertRow();
        
        // Sel Nama Anggota
        row.insertCell().textContent = member.nama;
        
        // Sel Status untuk setiap Tanggal
        tanggalStatus.forEach(tgl => {
            const statusCell = row.insertCell();
            const isChecked = member.status[tgl] || false; // default false
            
            // Set ikon dan class
            statusCell.textContent = isChecked ? '✅' : '❌'; // Centang atau Silang
            statusCell.className = 'status-cell ' + (isChecked ? 'checked' : 'unchecked');
            
            // Tambahkan event listener untuk toggle
            statusCell.onclick = () => toggleStatus(index, tgl);
        });
    });
}


// ===========================================
// INISIALISASI
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Kas
    initChart();
    form.addEventListener('submit', handleFormSubmit);
    
    // Contoh data awal Status (untuk demo)
    tanggalStatus.push('2025-10-15');
    tanggalStatus.push('2025-10-17');
    anggota[0].status['2025-10-15'] = true; // Yuliana centang 15/10
    anggota[0].status['2025-10-17'] = true; // Yuliana centang 17/10
    anggota[1].status['2025-10-15'] = true; // Budi centang 15/10
    
    // Render awal Status
    renderTabelStatus();
    
    // Render awal Kas
    // (Tambahkan transaksi contoh di sini jika diperlukan, lalu panggil renderTabel() dan hitungTotal())
});
