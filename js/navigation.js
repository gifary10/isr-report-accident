function initNavigation() {
    try {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        if (!navLinks.length) {
            console.warn('No navigation links found');
            return;
        }
        
        // Set up click handlers
        navLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', handleNavClick);
            }
        });
        
        // Load initial page
        loadInitialPage();
    } catch (error) {
        console.error('Navigation initialization error:', error);
    }
}

function handleNavClick(e) {
    try {
        e.preventDefault();
        const link = e.currentTarget;
        if (!link) return;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(el => {
            if (el) {
                el.classList.toggle('active', el === link);
            }
        });
        
        // Show selected page
        const pageId = link.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
            
            // Update URL hash
            window.location.hash = pageId;
        }
    } catch (error) {
        console.error('Navigation click handler error:', error);
    }
}

function showPage(pageId) {
    if (!pageId) return;
    
    try {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            if (page) {
                page.classList.remove('active');
            }
        });
        
        // Show selected page
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
            loadPageData(pageId);
            
            // Dispatch event for dropdown initialization
            document.dispatchEvent(new CustomEvent('pageChanged'));
        }
    } catch (error) {
        console.error('Error showing page:', error);
    }
}

function loadPageData(pageId) {
    if (!pageId) return;
    
    try {
        switch (pageId) {
            case 'reports':
                loadReports();
                break;
            case 'statistics':
                setupChartFilters();
                loadCharts();
                break;
            case 'dashboard':
                loadDashboard();
                break;
        }
    } catch (error) {
        console.error('Error loading page data:', error);
    }
}

function loadInitialPage() {
    try {
        const pageFromHash = window.location.hash.substring(1);
        const validPages = ['dashboard', 'new-report', 'reports', 'statistics'];
        const defaultPage = 'dashboard';
        
        const initialPage = validPages.includes(pageFromHash) ? pageFromHash : defaultPage;
        const initialLink = document.querySelector(`.nav-link[data-page="${initialPage}"]`);
        
        if (initialLink) {
            initialLink.click();
        } else {
            const defaultLink = document.querySelector('.nav-link[data-page="dashboard"]');
            if (defaultLink) defaultLink.click();
        }
    } catch (error) {
        console.error('Error loading initial page:', error);
    }
}