function initCustomDropdowns() {
    try {
        document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
            if (!wrapper) return;
            
            // Skip if already initialized
            if (wrapper.dataset.initialized === 'true') return;
            
            const select = wrapper.querySelector('select');
            if (!select) return;
            
            // Create dropdown elements
            const selected = createSelectedElement(select);
            const optionsList = createOptionsList(select);
            
            if (selected) wrapper.appendChild(selected);
            if (optionsList) wrapper.appendChild(optionsList);
            wrapper.dataset.initialized = 'true';
            
            // Add event listeners
            setupDropdownEvents(wrapper, select, selected, optionsList);
            
            // Update on initial load
            updateCustomDropdown(select);
        });
    } catch (error) {
        console.error('Custom dropdown initialization error:', error);
    }
}

function createSelectedElement(select) {
    if (!select) return null;
    
    try {
        const selected = document.createElement('div');
        selected.className = 'custom-select-selected';
        selected.textContent = select.options[select.selectedIndex]?.text || '';
        return selected;
    } catch (error) {
        console.error('Error creating selected element:', error);
        return null;
    }
}

function createOptionsList(select) {
    if (!select) return null;
    
    try {
        const optionsList = document.createElement('ul');
        optionsList.className = 'custom-select-options';
        
        Array.from(select.options).forEach(option => {
            if (!option) return;
            
            const li = document.createElement('li');
            li.textContent = option.text;
            li.dataset.value = option.value;
            if (option.selected) li.classList.add('active');
            
            li.addEventListener('click', () => {
                select.value = option.value;
                select.dispatchEvent(new Event('change'));
                updateCustomDropdown(select);
            });
            
            optionsList.appendChild(li);
        });
        
        return optionsList;
    } catch (error) {
        console.error('Error creating options list:', error);
        return null;
    }
}

function setupDropdownEvents(wrapper, select, selected, optionsList) {
    if (!wrapper || !select || !selected || !optionsList) return;
    
    try {
        // Toggle dropdown
        selected.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown(wrapper, optionsList);
        });
        
        // Close when clicking outside
        document.addEventListener('click', () => {
            closeAllDropdowns();
        });
        
        // Prevent dropdown from closing when clicking inside options
        optionsList.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Update custom dropdown when select changes programmatically
        select.addEventListener('change', () => {
            updateCustomDropdown(select);
        });
    } catch (error) {
        console.error('Error setting up dropdown events:', error);
    }
}

function toggleDropdown(wrapper, optionsList) {
    if (!wrapper || !optionsList) return;
    
    try {
        const isOpen = wrapper.classList.contains('open');
        closeAllDropdowns();
        
        if (!isOpen) {
            wrapper.classList.add('open');
            optionsList.style.display = 'block';
        }
    } catch (error) {
        console.error('Error toggling dropdown:', error);
    }
}

function closeAllDropdowns() {
    try {
        document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
            if (!wrapper) return;
            
            wrapper.classList.remove('open');
            const options = wrapper.querySelector('.custom-select-options');
            if (options) options.style.display = 'none';
        });
    } catch (error) {
        console.error('Error closing dropdowns:', error);
    }
}

function updateCustomDropdown(select) {
    if (!select) return;
    
    try {
        const wrapper = select.closest('.custom-select-wrapper');
        if (!wrapper) return;
        
        const selected = wrapper.querySelector('.custom-select-selected');
        const optionsList = wrapper.querySelector('.custom-select-options');
        if (!selected || !optionsList) return;
        
        // Update selected display
        selected.textContent = select.options[select.selectedIndex]?.text || '';
        
        // Update active option
        optionsList.querySelectorAll('li').forEach(li => {
            if (li) {
                li.classList.toggle('active', li.dataset.value === select.value);
            }
        });
    } catch (error) {
        console.error('Error updating custom dropdown:', error);
    }
}

// Initialize dropdowns when the page loads
document.addEventListener('DOMContentLoaded', initCustomDropdowns);