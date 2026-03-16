const uploadForm = document.getElementById('uploadForm');
const pdfFileInput = document.getElementById('pdfFile');
const fileNameDisplay = document.getElementById('fileName');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const usageContent = document.getElementById('usageContent');

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

    const file = pdfFileInput.files[0];
    const prompt = document.getElementById('prompt').value;

    if (!file) {
        alert('Please select a PDF file.');
        return;
    }

    // UI Feedback
    submitBtn.disabled = true;
    loader.style.display = 'block';
    resultSection.classList.add('hidden');

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('prompt', prompt);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to process PDF');
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
