function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('id-ID');
    } catch (error) {
        console.error('Date formatting error:', error);
        return dateString || '-';
    }
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleString('id-ID');
    } catch (error) {
        console.error('DateTime formatting error:', error);
        return dateString || '-';
    }
}

function showToast(message, type = 'success') {
    if (!message) return;
    
    try {
        // Remove existing toasts
        removeExistingToasts();
        
        // Create and show new toast
        const toast = createToastElement(message, type);
        if (!toast) return;
        
        document.body.appendChild(toast.container);
        
        // Animate in
        toast.element.classList.add('animate__fadeInUp');
        
        // Set up auto-dismiss and click handler
        setupToastDismissal(toast);
    } catch (error) {
        console.error('Toast error:', error);
    }
}

function removeExistingToasts() {
    try {
        document.querySelectorAll('.custom-toast').forEach(toast => {
            if (toast) {
                toast.classList.remove('animate__fadeInUp');
                toast.classList.add('animate__fadeOutDown');
                setTimeout(() => toast.remove(), 300);
            }
        });
    } catch (error) {
        console.error('Error removing toasts:', error);
    }
}

function createToastElement(message, type) {
    if (!message) return null;
    
    try {
        const typeConfig = {
            success: { icon: '✓', bgColor: 'bg-success', textColor: 'text-white' },
            error: { icon: '✗', bgColor: 'bg-danger', textColor: 'text-white' },
            warning: { icon: '⚠', bgColor: 'bg-warning', textColor: 'text-dark' },
            info: { icon: 'ℹ', bgColor: 'bg-info', textColor: 'text-white' }
        };
        
        const config = typeConfig[type] || typeConfig.success;
        
        const container = document.createElement('div');
        container.className = 'position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        
        const toastHTML = `
            <div class="custom-toast ${config.bgColor} ${config.textColor}" role="alert">
                <div class="toast-icon">${config.icon}</div>
                <div class="toast-message">${sanitizeInput(message)}</div>
                <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
        `;
        
        container.innerHTML = toastHTML;
        
        return {
            container,
            element: container.firstElementChild
        };
    } catch (error) {
        console.error('Error creating toast element:', error);
        return null;
    }
}

function setupToastDismissal(toast) {
    if (!toast || !toast.element) return;
    
    try {
        const closeBtn = toast.element.querySelector('.btn-close');
        if (!closeBtn) return;
        
        // Click handler
        closeBtn.addEventListener('click', () => dismissToast(toast.element));
        
        // Auto-dismiss after 5 seconds
        const dismissTimeout = setTimeout(() => dismissToast(toast.element), 5000);
        
        // Cancel timeout on hover
        toast.element.addEventListener('mouseenter', () => clearTimeout(dismissTimeout));
        toast.element.addEventListener('mouseleave', () => 
            setTimeout(() => dismissToast(toast.element), 3000)
        );
    } catch (error) {
        console.error('Error setting up toast dismissal:', error);
    }
}

function dismissToast(toast) {
    if (!toast) return;
    
    try {
        toast.classList.remove('animate__fadeInUp');
        toast.classList.add('animate__fadeOutDown');
        setTimeout(() => toast.remove(), 300);
    } catch (error) {
        console.error('Error dismissing toast:', error);
    }
}

function sanitizeInput(text) {
    if (!text) return '';
    try {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    } catch (error) {
        console.error('Error sanitizing input:', error);
        return '';
    }
}