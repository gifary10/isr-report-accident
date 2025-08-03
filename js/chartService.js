const chartInstances = {};
const chartConfigs = {
    monthly: {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    },
    types: {
        type: 'doughnut',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: { position: 'right' }
            }
        }
    },
    department: {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: { beginAtZero: true, ticks: { precision: 0 } },
                y: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    }
};

function loadCharts() {
    try {
        if (typeof Chart === 'undefined') {
            showToast('Grafik tidak dapat dimuat: Library Chart.js tidak tersedia', 'error');
            return;
        }

        const reports = getAllReports();
        const filters = getChartFilters();
        const filteredReports = filterReports(reports, filters);
        
        updateDepartmentFilter(filteredReports);
        renderCharts(filteredReports);
    } catch (error) {
        console.error('Error loading charts:', error);
        showToast('Gagal memuat grafik', 'error');
    }
}

function getChartFilters() {
    try {
        return {
            year: document.getElementById('year-filter')?.value || '',
            department: document.getElementById('department-filter')?.value || '',
            type: document.getElementById('type-filter')?.value || ''
        };
    } catch (error) {
        console.error('Error getting chart filters:', error);
        return {};
    }
}

function filterReports(reports, { year, department, type } = {}) {
    if (!reports) return [];
    
    try {
        return reports.filter(report => {
            try {
                const reportYear = new Date(report.reportDate).getFullYear();
                return (!year || reportYear === parseInt(year)) &&
                       (!department || report.department?.toLowerCase() === department.toLowerCase()) &&
                       (!type || report.accidentType?.toLowerCase() === type.toLowerCase());
            } catch (e) {
                return false;
            }
        });
    } catch (error) {
        console.error('Error filtering reports:', error);
        return [];
    }
}

function updateDepartmentFilter(reports) {
    try {
        const departmentFilter = document.getElementById('department-filter');
        if (!departmentFilter) return;
        
        const currentValue = departmentFilter.value;
        
        // Get unique departments from reports
        const departments = [...new Set(
            reports.map(r => r.department)
                   .filter(Boolean)
                   .sort((a, b) => a?.localeCompare(b))
        )];
        
        // Update dropdown options
        departmentFilter.innerHTML = '<option value="">Semua Departemen</option>';
        departments.forEach(dept => {
            if (dept) {
                departmentFilter.appendChild(new Option(dept, dept));
            }
        });
        
        // Restore previous selection if still valid
        if (currentValue && departments.includes(currentValue)) {
            departmentFilter.value = currentValue;
        }
    } catch (error) {
        console.error('Error updating department filter:', error);
    }
}

function renderCharts(reports) {
    if (!reports) return;
    
    try {
        renderMonthlyChart(reports);
        renderAccidentTypesChart(reports);
        renderDepartmentChart(reports);
    } catch (error) {
        console.error('Error rendering charts:', error);
    }
}

function renderMonthlyChart(reports) {
    try {
        const monthlyData = Array(12).fill(0);
        reports.forEach(report => {
            try {
                const month = new Date(report.reportDate).getMonth();
                monthlyData[month]++;
            } catch (e) {
                // Skip invalid dates
            }
        });
        
        const ctx = document.getElementById('monthly-accidents-chart');
        if (!ctx) return;
        
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(250, 128, 12, 0.8)');
        gradient.addColorStop(1, 'rgba(250, 128, 12, 0.2)');
        
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [{
                label: 'Jumlah Kecelakaan',
                data: monthlyData,
                backgroundColor: gradient,
                borderColor: 'rgba(250, 128, 12, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        };
        
        updateOrCreateChart('monthly', ctx, data);
    } catch (error) {
        console.error('Error rendering monthly chart:', error);
    }
}

function renderAccidentTypesChart(reports) {
    try {
        const typeCounts = reports.reduce((acc, report) => {
            try {
                const type = report.accidentType || 'Lainnya';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            } catch (e) {
                return acc;
            }
        }, {});
        
        // Sort by count descending
        const sortedTypes = Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        
        const ctx = document.getElementById('accident-types-chart');
        if (!ctx) return;
        
        const backgroundColors = [
            'rgba(250, 128, 12, 0.7)',
            'rgba(44, 62, 80, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(231, 76, 60, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(241, 196, 15, 0.7)',
            'rgba(26, 188, 156, 0.7)',
            'rgba(149, 165, 166, 0.7)',
            'rgba(22, 160, 133, 0.7)'
        ];
        
        const data = {
            labels: Object.keys(sortedTypes),
            datasets: [{
                data: Object.values(sortedTypes),
                backgroundColor: backgroundColors.slice(0, Object.keys(sortedTypes).length),
                borderWidth: 1
            }]
        };
        
        updateOrCreateChart('types', ctx, data);
    } catch (error) {
        console.error('Error rendering accident types chart:', error);
    }
}

function renderDepartmentChart(reports) {
    try {
        const deptCounts = reports.reduce((acc, report) => {
            try {
                const dept = report.department || 'Unknown';
                acc[dept] = (acc[dept] || 0) + 1;
                return acc;
            } catch (e) {
                return acc;
            }
        }, {});
        
        // Sort by count descending
        const sortedDepts = Object.entries(deptCounts)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        
        const ctx = document.getElementById('department-accidents-chart');
        if (!ctx) return;
        
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, 'rgba(44, 62, 80, 0.8)');
        gradient.addColorStop(1, 'rgba(44, 62, 80, 0.2)');
        
        const data = {
            labels: Object.keys(sortedDepts),
            datasets: [{
                label: 'Jumlah Kecelakaan',
                data: Object.values(sortedDepts),
                backgroundColor: gradient,
                borderColor: 'rgba(44, 62, 80, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        };
        
        updateOrCreateChart('department', ctx, data);
    } catch (error) {
        console.error('Error rendering department chart:', error);
    }
}

function updateOrCreateChart(chartName, ctx, data) {
    if (!chartName || !ctx || !data) return;
    
    try {
        if (chartInstances[chartName]) {
            chartInstances[chartName].data = data;
            chartInstances[chartName].update();
        } else {
            chartInstances[chartName] = new Chart(ctx, {
                type: chartConfigs[chartName].type,
                data: data,
                options: chartConfigs[chartName].options
            });
        }
    } catch (error) {
        console.error('Error updating or creating chart:', error);
    }
}

function setupChartFilters() {
    try {
        const filters = ['year-filter', 'department-filter', 'type-filter'];
        filters.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', debounce(loadCharts, 300));
            }
        });
    } catch (error) {
        console.error('Error setting up chart filters:', error);
    }
}