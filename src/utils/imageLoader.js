// Utility to automatically discover and sort numbered photos (01, 02, 03...) for each folder
// Uses Vite's import.meta.glob so any new image added as 03.jpg / 04.png will be automatically included!

// Glob all images inside ../../Img/
const rawImages = import.meta.glob('../../Img/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Map of folderName -> array of sorted photo URLs
const folderPhotosMap = {};

for (const path in rawImages) {
  // Normalize path and extract folder & filename
  const cleanPath = path.replace(/\\/g, '/');
  const parts = cleanPath.split('/');
  
  if (parts.length >= 2) {
    const filename = decodeURIComponent(parts[parts.length - 1]);
    const folder = decodeURIComponent(parts[parts.length - 2]);

    // Only include numbered photos like 01.jpg, 02.png, 03.webp, etc.
    const isNumbered = /^\d{1,3}\.(jpg|jpeg|png|webp)$/i.test(filename);
    if (isNumbered) {
      if (!folderPhotosMap[folder]) {
        folderPhotosMap[folder] = [];
      }
      folderPhotosMap[folder].push({
        num: parseInt(filename, 10),
        url: rawImages[path],
        filename: filename,
      });
    }
  }
}

// Sort each folder's photos by number (01, 02, 03...)
for (const folder in folderPhotosMap) {
  folderPhotosMap[folder].sort((a, b) => a.num - b.num);
  folderPhotosMap[folder] = folderPhotosMap[folder].map(item => item.url);
}

export function getPhotosForFolder(folderName) {
  return folderPhotosMap[folderName] || [];
}

export { folderPhotosMap };
