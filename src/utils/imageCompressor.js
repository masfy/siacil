/**
 * Compress and resize image to fit in Google Sheets cell
 * Google Sheets has ~50,000 character limit per cell
 * We target ~30KB base64 which is ~40,000 characters
 */
export function compressImage(file, maxWidth = 150, maxHeight = 150, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                const base64 = canvas.toDataURL('image/jpeg', quality);

                // Check size - if still too big, reduce quality
                if (base64.length > 40000) {
                    const reducedBase64 = canvas.toDataURL('image/jpeg', 0.5);
                    resolve(reducedBase64);
                } else {
                    resolve(base64);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Check if base64 string is within acceptable size for Google Sheets
 */
export function isImageSizeValid(base64String) {
    return base64String && base64String.length < 45000;
}
