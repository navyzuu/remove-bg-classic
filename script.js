// Global variables
let originalImage = null;
let processedImage = null;
let originalCanvas, resultCanvas;
let originalCtx, resultCtx;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    originalCanvas = document.getElementById('originalCanvas');
    resultCanvas = document.getElementById('resultCanvas');
    originalCtx = originalCanvas.getContext('2d');
    resultCtx = resultCanvas.getContext('2d');

    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const removeBgBtn = document.getElementById('removeBgBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resizeBtn = document.getElementById('resizeBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Upload area click
    uploadArea.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Buttons
    removeBgBtn.addEventListener('click', removeBackground);
    resetBtn.addEventListener('click', resetImage);
    resizeBtn.addEventListener('click', applyResize);
    downloadBtn.addEventListener('click', downloadImage);
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file!');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            displayOriginalImage(img);
            document.getElementById('controlsSection').style.display = 'block';
            document.getElementById('previewSection').style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Display original image
function displayOriginalImage(img) {
    const maxWidth = 500;
    const maxHeight = 500;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
    }

    originalCanvas.width = width;
    originalCanvas.height = height;
    originalCtx.drawImage(img, 0, 0, width, height);

    // Copy to result canvas initially
    resultCanvas.width = width;
    resultCanvas.height = height;
    resultCtx.drawImage(img, 0, 0, width, height);
    processedImage = img;
}

// Remove background
async function removeBackground() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    loadingOverlay.style.display = 'flex';
    document.getElementById('removeBgBtn').disabled = true;

    try {
        if (apiKey) {
            // Use remove.bg API
            await removeBackgroundWithAPI(apiKey);
        } else {
            // Use basic background removal
            removeBackgroundBasic();
        }
    } catch (error) {
        console.error('Error removing background:', error);
        alert('Error removing background. Please try again or use API key for better results.');
        removeBackgroundBasic(); // Fallback to basic method
    } finally {
        loadingOverlay.style.display = 'none';
        document.getElementById('removeBgBtn').disabled = false;
    }
}

// Remove background using remove.bg API
async function removeBackgroundWithAPI(apiKey) {
    // Convert canvas to blob
    const blob = await new Promise(resolve => {
        originalCanvas.toBlob(resolve, 'image/png');
    });

    // Create form data
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', 'auto');

    // Call API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors ? error.errors[0].title : 'API Error');
    }

    // Get result image
    const blobResult = await response.blob();
    const img = new Image();
    img.onload = () => {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        resultCtx.drawImage(img, 0, 0);
        processedImage = img;
    };
    img.src = URL.createObjectURL(blobResult);
}

// Basic background removal (simple edge detection)
function removeBackgroundBasic() {
    const width = originalCanvas.width;
    const height = originalCanvas.height;
    
    resultCanvas.width = width;
    resultCanvas.height = height;
    
    // Get image data
    const imageData = originalCtx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Simple background removal using edge detection and color similarity
    // This is a basic implementation - API gives much better results
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        
        // Simple threshold - adjust these values for better results
        // This is a very basic approach
        const threshold = 240; // Adjust based on your image
        
        // If pixel is too bright (likely background), make it transparent
        if (brightness > threshold) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
        
        // Also check for white/light colors
        if (r > 250 && g > 250 && b > 250) {
            data[i + 3] = 0;
        }
    }
    
    resultCtx.putImageData(imageData, 0, 0);
    
    // Create new image from result
    const img = new Image();
    img.onload = () => {
        processedImage = img;
    };
    img.src = resultCanvas.toDataURL();
}

// Apply resize
function applyResize() {
    if (!processedImage) {
        alert('Please process an image first!');
        return;
    }

    const widthInput = document.getElementById('widthInput').value;
    const heightInput = document.getElementById('heightInput').value;
    const maintainAspect = document.getElementById('maintainAspect').checked;

    let newWidth = widthInput ? parseInt(widthInput) : processedImage.width;
    let newHeight = heightInput ? parseInt(heightInput) : processedImage.height;

    if (maintainAspect && processedImage.width && processedImage.height) {
        const aspectRatio = processedImage.width / processedImage.height;
        
        if (widthInput && !heightInput) {
            newHeight = newWidth / aspectRatio;
        } else if (heightInput && !widthInput) {
            newWidth = newHeight * aspectRatio;
        } else if (widthInput && heightInput) {
            // Use the dimension that maintains aspect ratio better
            const widthRatio = newWidth / processedImage.width;
            const heightRatio = newHeight / processedImage.height;
            const ratio = Math.min(widthRatio, heightRatio);
            newWidth = processedImage.width * ratio;
            newHeight = processedImage.height * ratio;
        }
    }

    // Resize result canvas
    resultCanvas.width = newWidth;
    resultCanvas.height = newHeight;
    resultCtx.drawImage(processedImage, 0, 0, newWidth, newHeight);

    // Update processed image
    const img = new Image();
    img.onload = () => {
        processedImage = img;
    };
    img.src = resultCanvas.toDataURL();
}

// Reset image
function resetImage() {
    if (originalImage) {
        displayOriginalImage(originalImage);
        document.getElementById('widthInput').value = '';
        document.getElementById('heightInput').value = '';
    }
}

// Download image
function downloadImage() {
    if (!processedImage) {
        alert('No processed image to download!');
        return;
    }

    // Create download link
    const link = document.createElement('a');
    link.download = 'background-removed-image.png';
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
}

