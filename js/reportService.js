function generateReportNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `LAP-${year}${month}${day}-${randomNum}`;
}

function saveReport() {
    try {
        const report = collectFormData();
        
        if (!validateReport(report)) {
            showToast('Mohon lengkapi semua field yang wajib diisi!', 'error');
            return;
        }
        
        saveReportToStorage(report);
        showToast('Laporan berhasil disimpan!', 'success');
        resetForm();
        updateUIAfterSave();
    } catch (error) {
        console.error('Error saving report:', error);
        showToast('Gagal menyimpan laporan: ' + error.message, 'error');
    }
}

function collectFormData() {
    const getValue = id => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };
    
    return {
        companyName: getValue('company-name'),
        reportNumber: getValue('report-number'),
        reportDate: getValue('report-date'),
        accidentDate: getValue('accident-date'),
        location: getValue('location'),
        department: getValue('department'),
        accidentType: getValue('accident-type'),
        accidentDesc: getValue('accident-desc'),
        injuredPerson: getValue('injured-person'),
        injuryType: getValue('injury-type'),
        injuredPart: getValue('injured-part'),
        witnesses: getValue('witnesses'),
        immediateAction: getValue('immediate-action'),
        rootCause: getValue('root-cause'),
        correctiveAction: getValue('corrective-action'),
        preventiveAction: getValue('preventive-action'),
        investigator: getValue('investigator'),
        supervisor: getValue('supervisor'),
        createdAt: new Date().toISOString()
    };
}

function validateReport(report) {
    if (!report) return false;
    
    const requiredFields = [
        'companyName', 'accidentType', 'accidentDesc', 'injuredPerson',
        'injuryType', 'injuredPart', 'immediateAction',
        'rootCause', 'correctiveAction', 'preventiveAction'
    ];
    
    return requiredFields.every(field => {
        const value = report[field];
        return value !== undefined && value !== null && value !== '';
    });
}

function resetForm() {
    try {
        const reportNumber = document.getElementById('report-number');
        const reportDate = document.getElementById('report-date');
        
        if (reportNumber) reportNumber.value = generateReportNumber();
        if (reportDate) reportDate.valueAsDate = new Date();
        
        // Set accident date to current datetime with timezone offset
        const accidentDate = document.getElementById('accident-date');
        if (accidentDate) {
            const now = new Date();
            const timezoneOffset = now.getTimezoneOffset() * 60000;
            accidentDate.value = new Date(now - timezoneOffset).toISOString().slice(0, 16);
        }
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

function updateUIAfterSave() {
    try {
        loadDashboard();
        loadCharts();
        
        // If on reports page, refresh the list
        if (document.getElementById('reports')?.classList.contains('active')) {
            loadReports();
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function loadReports() {
    try {
        const reports = getAllReports().sort((a, b) => 
            new Date(b.reportDate) - new Date(a.reportDate)
        );
        
        const tbody = document.querySelector('#reports-table tbody');
        if (!tbody) return;
        
        if (reports.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-3">Tidak ada laporan</td></tr>`;
            return;
        }
        
        tbody.innerHTML = reports.map(report => `
            <tr>
                <td>${report.reportNumber || '-'}</td>
                <td>${formatDate(report.reportDate)}</td>
                <td>${report.accidentType || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view" data-id="${report.reportNumber}">
                        Lihat
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger delete" data-id="${report.reportNumber}">
                        Hapus
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading reports:', error);
        showToast('Gagal memuat daftar laporan', 'error');
    }
}

function loadDashboard() {
    try {
        const reports = getAllReports();
        const now = new Date();
        
        // Update counters
        const totalEl = document.getElementById('total-reports');
        const monthlyEl = document.getElementById('monthly-reports');
        const seriousEl = document.getElementById('serious-accidents');
        
        if (totalEl) totalEl.textContent = reports.length;
        if (monthlyEl) monthlyEl.textContent = getMonthlyReportCount(reports, now);
        if (seriousEl) seriousEl.textContent = getSeriousAccidentCount(reports);
        
        // Update recent reports
        updateRecentReports(reports);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Gagal memuat dashboard', 'error');
    }
}

function getMonthlyReportCount(reports, date) {
    if (!reports || !date) return 0;
    
    return reports.filter(report => {
        try {
            const reportDate = new Date(report.reportDate);
            return reportDate.getMonth() === date.getMonth() && 
                   reportDate.getFullYear() === date.getFullYear();
        } catch (e) {
            return false;
        }
    }).length;
}

function getSeriousAccidentCount(reports) {
    if (!reports) return 0;
    
    const seriousTypes = ['tersengat listrik', 'terbakar', 'tertimpa', 'tersangkut mesin'];
    return reports.filter(report => {
        try {
            return seriousTypes.includes(report.accidentType?.toLowerCase());
        } catch (e) {
            return false;
        }
    }).length;
}

function updateRecentReports(reports) {
    if (!reports) return;
    
    const tbody = document.querySelector('#recent-reports tbody');
    if (!tbody) return;
    
    const recentReports = reports
        .sort((a, b) => {
            try {
                return new Date(b.reportDate) - new Date(a.reportDate);
            } catch (e) {
                return 0;
            }
        })
        .slice(0, 5);
    
    tbody.innerHTML = recentReports.map(report => `
        <tr>
            <td>${report.injuredPerson || '-'}</td>
            <td>${report.department || '-'}</td>
            <td>${formatDateTime(report.accidentDate)}</td>
        </tr>
    `).join('');
}

function searchReports() {
    try {
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput?.value.toLowerCase().trim() || '';
        
        if (!searchTerm) {
            loadReports();
            return;
        }
        
        const reports = getAllReports().filter(report => 
            ['reportNumber', 'location', 'injuredPerson', 'accidentType', 'companyName']
                .some(field => {
                    const value = report[field];
                    return value?.toLowerCase().includes(searchTerm);
                })
        );
        
        const tbody = document.querySelector('#reports-table tbody');
        if (!tbody) return;
        
        if (reports.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-3">Tidak ditemukan laporan</td></tr>`;
            return;
        }
        
        tbody.innerHTML = reports.map(report => `
            <tr>
                <td>${report.reportNumber || '-'}</td>
                <td>${formatDate(report.reportDate)}</td>
                <td>${report.accidentType || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view" data-id="${report.reportNumber}">
                        Lihat
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger delete" data-id="${report.reportNumber}">
                        Hapus
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error searching reports:', error);
        showToast('Gagal melakukan pencarian', 'error');
    }
}

function resetSearch() {
    try {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        loadReports();
    } catch (error) {
        console.error('Error resetting search:', error);
    }
}

function deleteReport(reportNumber) {
    if (!reportNumber || !confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
    
    try {
        if (deleteReportFromStorage(reportNumber)) {
            showToast('Laporan berhasil dihapus', 'success');
            loadReports();
            loadDashboard();
            loadCharts();
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        showToast('Gagal menghapus laporan', 'error');
    }
}

function viewReport(reportNumber) {
    if (!reportNumber) return;
    
    try {
        const report = getAllReports().find(r => r.reportNumber === reportNumber);
        if (!report) {
            showToast('Laporan tidak ditemukan!', 'error');
            return;
        }
        
        showReportModal(report);
    } catch (error) {
        console.error('Error viewing report:', error);
        showToast('Gagal memuat detail laporan', 'error');
    }
}

function showReportModal(report) {
    if (!report) return;
    
    try {
        // Remove existing modal
        const existingModal = document.getElementById('viewReportModal');
        if (existingModal) existingModal.remove();
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="viewReportModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detail Laporan: ${report.reportNumber || 'No Number'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${renderReportDetails(report)}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            <button type="button" class="btn btn-primary" id="generatePdfBtn">Generate PDF</button>
                            <button type="button" class="btn btn-danger" id="deleteReportBtn">Hapus Laporan</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to DOM and show
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('viewReportModal'));
        modal.show();
        
        // Set up event handlers
        const pdfBtn = document.getElementById('generatePdfBtn');
        const deleteBtn = document.getElementById('deleteReportBtn');
        
        if (pdfBtn) {
            pdfBtn.addEventListener('click', () => {
                generatePDF(report, 'download');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                modal.hide();
                deleteReport(report.reportNumber);
            });
        }
        
        // Clean up on modal close
        modal._element.addEventListener('hidden.bs.modal', () => {
            modal.dispose();
        });
    } catch (error) {
        console.error('Error showing report modal:', error);
        showToast('Gagal menampilkan detail laporan', 'error');
    }
}

function renderReportDetails(report) {
    if (!report) return '';
    
    return `
        <div class="row mb-2">
            <div class="col-md-6">
                <p class="mb-1"><strong>Perusahaan:</strong> ${report.companyName || '-'}</p>
                <p class="mb-1"><strong>Tanggal Laporan:</strong> ${formatDate(report.reportDate)}</p>
            </div>
        </div>
        
        <h6 class="mt-3 border-bottom pb-1">Informasi Kejadian</h6>
        <div class="row">
            <div class="col-md-6">
                <p class="mb-1"><strong>Tanggal Kejadian:</strong> ${formatDateTime(report.accidentDate)}</p>
                <p class="mb-1"><strong>Lokasi:</strong> ${report.location || '-'}</p>
                <p class="mb-1"><strong>Departemen:</strong> ${report.department || '-'}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-1"><strong>Jenis Kecelakaan:</strong> ${report.accidentType || '-'}</p>
            </div>
        </div>
        <p class="mt-2 mb-1"><strong>Deskripsi:</strong></p>
        <p class="ps-2">${report.accidentDesc || 'Tidak ada deskripsi'}</p>
        
        <h6 class="mt-3 border-bottom pb-1">Informasi Korban</h6>
        <div class="row">
            <div class="col-md-6">
                <p class="mb-1"><strong>Nama Korban:</strong> ${report.injuredPerson || '-'}</p>
                <p class="mb-1"><strong>Jenis Cedera:</strong> ${report.injuryType || '-'}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-1"><strong>Bagian yang Terluka:</strong> ${report.injuredPart || '-'}</p>
                <p class="mb-1"><strong>Saksi:</strong> ${report.witnesses || 'Tidak ada saksi'}</p>
            </div>
        </div>
        
        <h6 class="mt-3 border-bottom pb-1">Investigasi</h6>
        <p class="mb-1"><strong>Tindakan Segera:</strong></p>
        <p class="ps-2">${report.immediateAction || 'Tidak ada tindakan'}</p>
        
        <p class="mb-1"><strong>Penyebab Utama:</strong></p>
        <p class="ps-2">${report.rootCause || 'Tidak diketahui'}</p>
        
        <p class="mb-1"><strong>Tindakan Korektif:</strong></p>
        <p class="ps-2">${report.correctiveAction || 'Tidak ada tindakan'}</p>
        
        <p class="mb-1"><strong>Tindakan Pencegahan:</strong></p>
        <p class="ps-2">${report.preventiveAction || 'Tidak ada tindakan'}</p>
        
        <h6 class="mt-3 border-bottom pb-1">Penanggung Jawab</h6>
        <div class="row">
            <div class="col-md-6">
                <p class="mb-1"><strong>Investigator:</strong> ${report.investigator || '-'}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-1"><strong>Atasan:</strong> ${report.supervisor || '-'}</p>
            </div>
        </div>
    `;
}

// Initialize event delegation for dynamic elements
document.addEventListener('click', function(e) {
    try {
        if (e.target.classList.contains('view')) {
            viewReport(e.target.dataset.id);
        }
        if (e.target.classList.contains('delete')) {
            deleteReport(e.target.dataset.id);
        }
    } catch (error) {
        console.error('Error handling click event:', error);
    }
});