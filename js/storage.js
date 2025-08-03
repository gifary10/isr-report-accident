const STORAGE_KEY = 'accidentReports';

// Initialize localStorage
function initStorage() {
    try {
        if (typeof localStorage === 'undefined') {
            throw new Error('localStorage is not available');
        }
        
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
    } catch (error) {
        console.error('Storage initialization error:', error);
        showToast('Gagal menginisialisasi penyimpanan lokal', 'error');
    }
}

// Get all reports sorted by date (newest first)
function getAllReports() {
    try {
        const reports = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        return reports.sort((a, b) => {
            try {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } catch (e) {
                return 0;
            }
        });
    } catch (error) {
        console.error('Error reading reports:', error);
        showToast('Gagal memuat data laporan', 'error');
        return [];
    }
}

// Save a report to storage
function saveReportToStorage(report) {
    if (!report) {
        throw new Error('Report data is required');
    }

    try {
        const reports = getAllReports();
        reports.unshift(report); // Add to beginning
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        return report;
    } catch (error) {
        console.error('Error saving report:', error);
        showToast('Gagal menyimpan laporan', 'error');
        throw error;
    }
}

// Delete a report from storage
function deleteReportFromStorage(reportNumber) {
    if (!reportNumber) return false;

    try {
        const reports = getAllReports();
        const updatedReports = reports.filter(report => report.reportNumber !== reportNumber);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
        return true;
    } catch (error) {
        console.error('Error deleting report:', error);
        showToast('Gagal menghapus laporan', 'error');
        return false;
    }
}

// Get reports by filter function
function getReportsByFilter(filterFn) {
    if (typeof filterFn !== 'function') {
        console.error('Filter function is required');
        return [];
    }

    try {
        return getAllReports().filter(filterFn);
    } catch (error) {
        console.error('Error filtering reports:', error);
        return [];
    }
}

// Initialize storage on first load
initStorage();