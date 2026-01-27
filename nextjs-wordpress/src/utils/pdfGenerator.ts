'use client';

interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

// Lazy load function for html2canvas
const loadHtml2Canvas = async () => {
  try {
    const html2canvasModule = await import('html2canvas');
    return html2canvasModule.default;
  } catch (error) {
    console.error('Failed to load html2canvas:', error);
    throw new Error('PDF generation library not available. Please try refreshing the page.');
  }
};

// Lazy load function for jsPDF
const loadJsPDF = async () => {
  try {
    const jsPDFModule = await import('jspdf');
    return jsPDFModule.default;
  } catch (error) {
    console.error('Failed to load jsPDF:', error);
    throw new Error('PDF generation library not available. Please try refreshing the page.');
  }
};

export const generatePDF = async (
  elementId: string, 
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'case-study.pdf',
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    // Load libraries dynamically
    const [html2canvas, jsPDF] = await Promise.all([
      loadHtml2Canvas(),
      loadJsPDF()
    ]);
    // Get the element to convert
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Show loading state
    const loadingElement = document.createElement('div');
    loadingElement.id = 'pdf-loading-overlay';
    loadingElement.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-family: Arial, sans-serif;
      ">
        <div style="text-align: center;">
          <div style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <div>Generating PDF...</div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingElement);

    // Wait for any images to load
    const images = element.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 1000); // Timeout after 1 second
        });
      })
    );

    // Wait a bit for layout to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate canvas from HTML with better options
    console.log('Generating canvas for element:', element);
    console.log('Element dimensions:', {
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight
    });
    
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      logging: true, // Enable logging for debugging
      width: element.scrollWidth,
      height: element.scrollHeight
    });
    
    console.log('Canvas generated successfully:', {
      width: canvas.width,
      height: canvas.height
    });

    // Calculate PDF dimensions
    const imgWidth = format === 'a4' ? 210 : 216; // A4: 210mm, Letter: 216mm
    const imgHeight = format === 'a4' ? 297 : 279; // A4: 297mm, Letter: 279mm
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scaling to fit content on page
    const widthRatio = imgWidth / (canvasWidth * 0.264583);
    const heightRatio = imgHeight / (canvasHeight * 0.264583);
    const ratio = Math.min(widthRatio, heightRatio) * 0.9; // 90% to add some margin
    
    const scaledWidth = canvasWidth * 0.264583 * ratio;
    const scaledHeight = canvasHeight * 0.264583 * ratio;

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });

    // Add the image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Center the content on the page
    const xOffset = (imgWidth - scaledWidth) / 2;
    const yOffset = (imgHeight - scaledHeight) / 2;
    
    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);

    // Handle multi-page content if needed
    if (scaledHeight > imgHeight) {
      let currentPage = 0;
      const pageHeight = imgHeight;
      let remainingHeight = scaledHeight;
      
      while (remainingHeight > pageHeight) {
        pdf.addPage();
        currentPage++;
        
        const sourceY = currentPage * (pageHeight / ratio / 0.264583);
        const sourceHeight = Math.min(pageHeight / ratio / 0.264583, canvasHeight - sourceY);
        
        // Create canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = sourceHeight;
        
        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          pageCtx.drawImage(canvas, 0, sourceY, canvasWidth, sourceHeight, 0, 0, canvasWidth, sourceHeight);
          
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.8);
          const pageScaledHeight = sourceHeight * 0.264583 * ratio;
          
          pdf.addImage(pageImgData, 'JPEG', xOffset, yOffset, scaledWidth, pageScaledHeight);
        }
        
        remainingHeight -= pageHeight;
      }
    }

    // Save the PDF
    pdf.save(filename);

    // Remove loading element
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Remove loading element if it exists
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
    
    // Show error message with more details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Error generating PDF: ${errorMessage}. Please try again.`);
  }
};

export const testPDFGeneration = async (): Promise<void> => {
  try {
    console.log('Testing PDF generation...');
    
    // Load libraries dynamically
    const [html2canvas, jsPDF] = await Promise.all([
      loadHtml2Canvas(),
      loadJsPDF()
    ]);
    
    // Create a simple test element
    const testElement = document.createElement('div');
    testElement.id = 'pdf-test-element';
    testElement.style.cssText = `
      width: 800px;
      height: 600px;
      background: white;
      padding: 20px;
      font-family: Arial, sans-serif;
      position: absolute;
      top: -9999px;
      left: -9999px;
    `;
    testElement.innerHTML = `
      <h1 style="color: #333;">PDF Test</h1>
      <p>This is a test to verify PDF generation is working.</p>
      <div style="background: linear-gradient(135deg, #00bcd4, #9c27b0); color: white; padding: 20px; border-radius: 10px;">
        <h2>Gradient Test</h2>
        <p>This should appear with a gradient background.</p>
      </div>
    `;
    
    document.body.appendChild(testElement);
    
    // Generate canvas
    const canvas = await html2canvas(testElement, {
      useCORS: true,
      allowTaint: true,
      logging: false
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save('test-pdf.pdf');
    
    // Clean up
    document.body.removeChild(testElement);
    
    console.log('PDF test completed successfully');
  } catch (error) {
    console.error('PDF test failed:', error);
    throw error;
  }
};

export const downloadCaseStudyPDF = async (caseStudyTitle: string = 'Case Study'): Promise<void> => {
  const sanitizedTitle = caseStudyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${sanitizedTitle}_case_study.pdf`;
  
  // Try different element IDs in order of preference
  const possibleIds = [
    'case-study-pdf-content',
    'case-study-template',
    'case-study-main'
  ];
  
  let elementFound = false;
  
  for (const elementId of possibleIds) {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Found element with ID: ${elementId}`);
      elementFound = true;
      try {
        await generatePDF(elementId, {
          filename,
          format: 'a4',
          orientation: 'portrait'
        });
        return; // Success, exit function
      } catch (error) {
        console.error(`Failed to generate PDF with element ID ${elementId}:`, error);
        continue; // Try next element ID
      }
    }
  }
  
  if (!elementFound) {
    // Fallback: try to find any case study related element
    const fallbackSelectors = [
      '.case-study-main',
      '.case-study-template',
      '[class*="case-study"]',
      'main',
      'body'
    ];
    
    for (const selector of fallbackSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        // Create a temporary ID for this element
        const tempId = 'temp-pdf-content-' + Date.now();
        element.id = tempId;
        
        try {
          await generatePDF(tempId, {
            filename,
            format: 'a4',
            orientation: 'portrait'
          });
          return; // Success
        } catch (error) {
          console.error(`Failed to generate PDF with selector ${selector}:`, error);
        } finally {
          // Remove temporary ID
          element.removeAttribute('id');
        }
      }
    }
    
    throw new Error('Could not find any suitable element for PDF generation');
  }
};