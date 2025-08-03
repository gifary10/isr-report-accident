function generatePDF(report, action = 'preview') {
    if (!report) {
        showToast('Data laporan tidak valid', 'error');
        return;
    }

    try {
        // Check for jsPDF availability
        if (typeof jsPDF === 'undefined') {
            throw new Error('jsPDF library not loaded');
        }
        
        const doc = createPDFDocument(report);
        setupPDFProperties(doc, report);
        addPDFHeader(doc, report);
        
        // Format dates
        const formatDate = (dateString) => {
            try {
                return dateString ? new Date(dateString).toLocaleDateString('id-ID') : '-';
            } catch (e) {
                return dateString || '-';
            }
        };
        
        const formatDateTime = (dateString) => {
            try {
                return dateString ? new Date(dateString).toLocaleString('id-ID') : '-';
            } catch (e) {
                return dateString || '-';
            }
        };
        
        // Add content sections
        let yPos = 35;
        yPos = addReportInfoSection(doc, report, yPos, formatDate);
        yPos = addAccidentInfoSection(doc, report, yPos, formatDateTime);
        yPos = addVictimInfoSection(doc, report, yPos);
        yPos = addInvestigationSection(doc, report, yPos);
        addResponsibleSection(doc, report, yPos);
        
        // Final touches
        addPDFFooter(doc);
        addPageBorder(doc);
        
        // Handle output
        handlePDFOutput(doc, report, action);
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast(`Gagal menghasilkan PDF: ${error.message}`, 'error');
    }
}

function createPDFDocument() {
    try {
        return new jsPDF('p', 'mm', 'a4');
    } catch (error) {
        console.error('Error creating PDF document:', error);
        throw new Error('Gagal membuat dokumen PDF');
    }
}

function setupPDFProperties(doc, report) {
    if (!doc || !report) return;
    
    try {
        doc.setProperties({
            title: `Laporan Kecelakaan - ${report.reportNumber || 'No Number'}`,
            subject: 'Laporan Investigasi Kecelakaan Kerja',
            author: 'Aplikasi Laporan Kecelakaan'
        });
    } catch (error) {
        console.error('Error setting PDF properties:', error);
    }
}

function addPDFHeader(doc, report) {
    if (!doc) return;
    
    try {
        // Add header background
        doc.setFillColor(33, 37, 41);
        doc.setLineJoin('round');
        doc.roundedRect(9, 8, 192, 18, 8, 8, 'F');
        
        
        // Add title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('LAPORAN INVESTIGASI KECELAKAAN KERJA', 105, 15, { align: 'center' });
        
        // Add company name
        doc.setFontSize(12);
        doc.text(`Perusahaan: ${report.companyName || '[Nama Perusahaan]'}`, 105, 22, { align: 'center' });
    } catch (error) {
        console.error('Error adding PDF header:', error);
    }
}

function addReportInfoSection(doc, report, yPos, formatDate) {
    if (!doc || !report) return yPos;
    
    try {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(33, 37, 41);
        
        // Section box
        doc.roundedRect(10, yPos - 5, 190, 16, 5, 5, 'S');
        doc.text('Informasi Laporan', 15, yPos);
        
        // Underline
        doc.setDrawColor(250, 128, 12);
        doc.setLineWidth(0.5);
        doc.line(15, yPos + 1, 50, yPos + 1);
        
        // Content
        doc.setFont('helvetica', 'normal');
        yPos += 7;
        doc.text(`Nomor Laporan : ${report.reportNumber || '-'}`, 15, yPos);
        doc.text(`Tanggal Laporan : ${formatDate(report.reportDate)}`, 110, yPos);
        
        return yPos + 15;
    } catch (error) {
        console.error('Error adding report info section:', error);
        return yPos + 15;
    }
}

function addAccidentInfoSection(doc, report, yPos, formatDateTime) {
    if (!doc || !report) return yPos;
    
    try {
        const content = [
            `Tanggal Kejadian    : ${formatDateTime(report.accidentDate)}`,
            `Lokasi                      : ${report.location || '-'}`,
            `Departemen            : ${report.department || '-'}`,
            `Jenis Kecelakaan   : ${report.accidentType || '-'}`,
            `Deskripsi Kejadian : ${report.accidentDesc || 'Tidak ada deskripsi'}`
        ].join('\n');
        
        return addSection(doc, 'Informasi Kejadian', content, yPos);
    } catch (error) {
        console.error('Error adding accident info section:', error);
        return yPos;
    }
}

function addVictimInfoSection(doc, report, yPos) {
    if (!doc || !report) return yPos;
    
    try {
        const content = [
            `Nama Korban             : ${report.injuredPerson || '-'}`,
            `Jenis Cedera              : ${report.injuryType || '-'}`,
            `Bagian yang Terluka  : ${report.injuredPart || '-'}`,
            `Saksi                            : ${report.witnesses || 'Tidak ada saksi'}`
        ].join('\n');
        
        return addSection(doc, 'Informasi Korban', content, yPos);
    } catch (error) {
        console.error('Error adding victim info section:', error);
        return yPos;
    }
}

function addInvestigationSection(doc, report, yPos) {
    if (!doc || !report) return yPos;
    
    try {
        const content = [
            `Tindakan Segera           : ${report.immediateAction || 'Tidak ada tindakan'}`,
            `Penyebab Utama          : ${report.rootCause || 'Tidak diketahui'}`,
            `Tindakan Korektif         : ${report.correctiveAction || 'Tidak ada tindakan'}`,
            `Tindakan Pencegahan : ${report.preventiveAction || 'Tidak ada tindakan'}`
        ].join('\n');
        
        return addSection(doc, 'Hasil Investigasi', content, yPos);
    } catch (error) {
        console.error('Error adding investigation section:', error);
        return yPos;
    }
}

function addResponsibleSection(doc, report, yPos) {
    if (!doc || !report) return;
    
    try {
        // Section box
        //doc.roundedRect(10, yPos - 5, 190, 30, 5, 5, 'S');
        
        // Signature lines
        doc.setDrawColor(33, 37, 41);
        doc.setLineWidth(0.5);
        doc.line(30, yPos + 19, 80, yPos + 19);
        doc.line(120, yPos + 19, 170, yPos + 19);
        
        // Labels
        yPos += 5;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Investigator', 55, yPos + 20, { align: 'center' });
        doc.text('Atasan', 145, yPos + 20, { align: 'center' });
        
        // Names
        yPos += 5;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(report.investigator || '-', 55, yPos + 21, { align: 'center' });
        doc.text(report.supervisor || '-', 145, yPos + 21, { align: 'center' });
    } catch (error) {
        console.error('Error adding responsible section:', error);
    }
}

function addSection(doc, title, content, yPos, maxWidth = 170) {
    if (!doc || !title || !content) return yPos;
    
    try {
        const textHeight = doc.getTextDimensions(content, { maxWidth }).h;
        const sectionHeight = Math.max(20, textHeight + 15);
        
        // Section box
        doc.roundedRect(10, yPos - 3, 190, sectionHeight, 5, 5, 'S');
        
        // Title with underline
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(33, 37, 41);
        doc.text(title, 15, yPos + 3);
        doc.setDrawColor(33, 37, 41);
        doc.line(15, yPos + 4, 50, yPos + 4);
        
        // Content
        doc.setFont('helvetica', 'normal');
        doc.text(content, 15, yPos + 10, { maxWidth });
        
        return yPos + sectionHeight + 6;
    } catch (error) {
        console.error('Error adding section:', error);
        return yPos;
    }
}

function addPDFFooter(doc) {
    if (!doc) return;
    
    try {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Dokumen ini di download pada: ${new Date().toLocaleString('id-ID')}`, 105, 285, { align: 'center' });
    } catch (error) {
        console.error('Error adding PDF footer:', error);
    }
}

function addPageBorder(doc) {
    if (!doc) return;
    
    try {
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.roundedRect(5, 5, 200, 287, 10, 10, 'S');
    } catch (error) {
        console.error('Error adding page border:', error);
    }
}

function handlePDFOutput(doc, report, action) {
    if (!doc || !report) return;
    
    try {
        if (action === 'download') {
            doc.save(`Laporan_${report.reportNumber || 'new'}.pdf`);
        } else {
            showPDFPreview(doc.output('datauristring'));
        }
    } catch (error) {
        console.error('Error handling PDF output:', error);
        showToast('Gagal menangani output PDF', 'error');
    }
}

function showPDFPreview(pdfData) {
    if (!pdfData) return;
    
    try {
        // Remove existing modal
        const existingModal = document.getElementById('pdfPreviewModal');
        if (existingModal) existingModal.remove();
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="pdfPreviewModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-fullscreen-md-down">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Pratinjau PDF</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-0">
                            <iframe src="${pdfData}" style="width:100%; height:80vh;"></iframe>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            <button type="button" class="btn btn-primary" id="downloadPdfBtn">Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to DOM and show
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('pdfPreviewModal'));
        modal.show();
        
        // Set up download button
        const downloadBtn = document.getElementById('downloadPdfBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const formData = getFormData();
                generatePDF(formData, 'download');
                modal.hide();
            });
        }
        
        // Clean up on modal close
        modal._element.addEventListener('hidden.bs.modal', () => {
            modal.dispose();
        });
    } catch (error) {
        console.error('PDF preview error:', error);
        showToast('Gagal menampilkan pratinjau PDF', 'error');
    }
}

function getFormData() {
    try {
        return {
            companyName: document.getElementById('company-name')?.value || '',
            reportNumber: document.getElementById('report-number')?.value || '',
            reportDate: document.getElementById('report-date')?.value || '',
            accidentDate: document.getElementById('accident-date')?.value || '',
            location: document.getElementById('location')?.value || '',
            department: document.getElementById('department')?.value || '',
            accidentType: document.getElementById('accident-type')?.value || '',
            accidentDesc: document.getElementById('accident-desc')?.value || '',
            injuredPerson: document.getElementById('injured-person')?.value || '',
            injuryType: document.getElementById('injury-type')?.value || '',
            injuredPart: document.getElementById('injured-part')?.value || '',
            witnesses: document.getElementById('witnesses')?.value || '',
            immediateAction: document.getElementById('immediate-action')?.value || '',
            rootCause: document.getElementById('root-cause')?.value || '',
            correctiveAction: document.getElementById('corrective-action')?.value || '',
            preventiveAction: document.getElementById('preventive-action')?.value || '',
            investigator: document.getElementById('investigator')?.value || '',
            supervisor: document.getElementById('supervisor')?.value || ''
        };
    } catch (error) {
        console.error('Error getting form data:', error);
        return {};
    }
}