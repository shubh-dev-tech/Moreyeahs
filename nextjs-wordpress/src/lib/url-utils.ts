/**
 * Convert WordPress URL to Next.js path
 * Handles both full URLs and relative paths
 * Removes basePath if present to avoid duplication
 */
export function wpUrlToPath(url: string): string {
  if (!url) return '/';
  
  // If it's already a relative path, return as is
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }
  
  try {
    // Parse the URL
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    
    // Remove basePath if it exists (e.g., /moreyeahs-new)
    const basePath = '/moreyeahs-new';
    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length) || '/';
    }
    
    // Remove trailing slash unless it's the root
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    // If path is /home, convert to root /
    if (path === '/home') {
      return '/';
    }
    
    return path;
  } catch (error) {
    // If URL parsing fails, try to extract path manually
    const match = url.match(/^https?:\/\/[^\/]+(\/.*?)$/);
    if (match) {
      let path = match[1];
      
      // Remove basePath if it exists
      const basePath = '/moreyeahs-new';
      if (path.startsWith(basePath)) {
        path = path.substring(basePath.length) || '/';
      }
      
      if (path !== '/' && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      if (path === '/home') {
        return '/';
      }
      return path;
    }
    
    return '/';
  }
}
