const uploadForm = document.getElementById('uploadForm');
const pdfFileInput = document.getElementById('pdfFile');
const fileNameDisplay = document.getElementById('fileName');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const usageContent = document.getElementById('usageContent');

const fileGroup = document.getElementById('fileGroup');
const promptGroup = document.getElementById('promptGroup');
const modeRadios = document.getElementsByName('mode');

// Function to update UI visibility based on mode
function updateUIForMode() {
    const selectedMode = Array.from(modeRadios).find(r => r.checked).value;
    
    if (selectedMode === 'prompt_only') {
        fileGroup.classList.add('hidden');
        promptGroup.classList.remove('hidden');
        pdfFileInput.required = false;
        document.getElementById('prompt').required = true;
    } else if (selectedMode === 'pdf_prompt') {
        fileGroup.classList.remove('hidden');
        promptGroup.classList.remove('hidden');
        pdfFileInput.required = true;
        document.getElementById('prompt').required = false;
    } else if (selectedMode === 'pdf_only') {
        fileGroup.classList.remove('hidden');
        promptGroup.classList.add('hidden');
        pdfFileInput.required = true;
        document.getElementById('prompt').required = false;
    }
}

// Attach event listeners to radios
modeRadios.forEach(radio => {
    radio.addEventListener('change', updateUIForMode);
});

// Initial UI setup
updateUIForMode();

// Update file name when selected
pdfFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;
    } else {
        fileNameDisplay.textContent = 'No file chosen';
    }
});

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedMode = Array.from(modeRadios).find(r => r.checked).value;
    const file = pdfFileInput.files[0];
    const promptValue = document.getElementById('prompt').value;

    // Validation
    if ((selectedMode === 'pdf_prompt' || selectedMode === 'pdf_only') && !file) {
        alert('Please select a PDF file.');
        return;
    }
    if (selectedMode === 'prompt_only' && !promptValue.trim()) {
        alert('Please enter a prompt.');
        return;
    }

    // UI Feedback
    submitBtn.disabled = true;
    loader.style.display = 'block';
    resultSection.classList.add('hidden');

    const formData = new FormData();
    formData.append('mode', selectedMode);
    
    if (file) {
        formData.append('pdf', file);
    }
    
    if (selectedMode !== 'pdf_only') {
        formData.append('prompt', promptValue);
    }

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        // Get the response text first
        const responseText = await response.text();
        
        // Try to parse it as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            // If it's not JSON, it might be an HTML error from the server
            console.error('Server returned non-JSON response:', responseText);
            throw new Error(`Server Error: Received invalid response format. Status: ${response.status}`);
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to process request');
        }

        // Display results
        resultContent.textContent = data.text;
        
        // Display usage metrics
        usageContent.innerHTML = '';
        const usage = data.usage;
        
        const metrics = [
            { key: 'promptTokenCount', label: 'Input Tokens' },
            { key: 'candidatesTokenCount', label: 'Output Tokens' },
            { key: 'totalTokenCount', label: 'Total Tokens' }
        ];

        metrics.forEach(metric => {
            const item = document.createElement('div');
            item.className = 'usage-item';
            
            item.innerHTML = `
                <div class="usage-header">
                    <span class="usage-title">${metric.label}</span>
                    <span class="usage-value">${usage[metric.key]}</span>
                </div>
                <p class="usage-explanation">${usage.explanation[metric.key]}</p>
            `;
            usageContent.appendChild(item);
        });

        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        loader.style.display = 'none';
    }
});
