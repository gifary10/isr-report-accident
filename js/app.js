document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize libraries check
        initLibraryChecks();
        
        // Initialize form with default values
        initFormDefaults();
        
        // Load master data for dropdowns
        loadMasterData();
        
        // Initialize navigation
        initNavigation();
        
        // Initialize event listeners
        initEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Gagal menginisialisasi aplikasi', 'error');
    }
});

function initLibraryChecks() {
    try {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js library not loaded');
            showToast('Error: Grafik library tidak dimuat', 'error');
        }

        if (typeof jsPDF === 'undefined') {
            console.error('jsPDF library not loaded');
            showToast('Error: PDF library tidak dimuat', 'error');
        }
    } catch (error) {
        console.error('Library check error:', error);
    }
}

function initFormDefaults() {
    try {
        const today = new Date();
        const reportDate = document.getElementById('report-date');
        const reportNumber = document.getElementById('report-number');
        const accidentDate = document.getElementById('accident-date');
        
        if (reportDate) reportDate.valueAsDate = today;
        if (reportNumber) reportNumber.value = generateReportNumber();
        
        // Set accident date to current datetime with timezone offset
        if (accidentDate) {
            const now = new Date();
            const timezoneOffset = now.getTimezoneOffset() * 60000;
            accidentDate.value = new Date(now - timezoneOffset).toISOString().slice(0, 16);
        }
    } catch (error) {
        console.error('Form initialization error:', error);
    }
}

function initEventListeners() {
    try {
        // Form submission with debounce
        const form = document.getElementById('accident-report-form');
        if (form) {
            form.addEventListener('submit', debounce(function(e) {
                e.preventDefault();
                saveReport();
            }, 300));
        }
        
        // Search functionality with debounce
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', debounce(searchReports, 300));
        }
        
        // Reset search
        const resetSearch = document.getElementById('reset-search');
        if (resetSearch) {
            resetSearch.addEventListener('click', resetSearch);
        }
        
        // Reinitialize dropdowns when navigating between pages
        document.addEventListener('pageChanged', function() {
            initCustomDropdowns();
        });
    } catch (error) {
        console.error('Event listener initialization error:', error);
    }
}

function loadMasterData() {
    try {
        if (typeof masterData === 'undefined') {
            console.error('Master data not loaded');
            showToast('Gagal memuat data referensi', 'error');
            return;
        }
        
        populateDropdowns(masterData);
        initCustomDropdowns();
    } catch (error) {
        console.error('Master data loading error:', error);
        showToast('Gagal memuat data referensi', 'error');
    }
}

function populateDropdowns(data) {
    if (!data) return;
    
    try {
        const dropdowns = {
            'accident-type': data.accidentTypes,
            'injury-type': data.injuryTypes,
            'injured-part': data.bodyParts,
            'type-filter': data.accidentTypes
        };

        Object.entries(dropdowns).forEach(([id, options]) => {
            const select = document.getElementById(id);
            if (!select) return;
            
            select.innerHTML = `<option value="">${id === 'type-filter' ? 'Semua Jenis' : 'Pilih'}</option>`;
            if (options) {
                options.forEach(option => {
                    select.appendChild(new Option(option, option));
                });
            }
        });

        // Populate year filter
        const yearFilter = document.getElementById('year-filter');
        if (yearFilter) {
            const currentYear = new Date().getFullYear();
            for (let year = currentYear; year >= currentYear - 5; year--) {
                yearFilter.appendChild(new Option(year, year, year === currentYear, year === currentYear));
            }
        }
    } catch (error) {
        console.error('Dropdown population error:', error);
    }
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}