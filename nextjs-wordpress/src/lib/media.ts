/**
 * Media utilities for handling WordPress attachments
 */

import { fetchWordPressAPI } from './wordpress';

export interface MediaItem {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  mime_type: string;
  title: string;
  caption: string;
  description: string;
  sizes?: {
    thumbnail?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    full?: { url: string; width: number; height: number };
  };
}

/**
 * Fetch media item data from WordPress by attachment ID
 */
export async function getMediaById(id: number): Promise<MediaItem | null> {
  try {
    const media = await fetchWordPressAPI<any>(`/wp/v2/media/${id}`);
    
    if (!media) {
      return null;
    }
    
    return {
      id: media.id,
      url: media.source_url || media.url,
      alt: media.alt_text || '',
      width: media.media_details?.width || 600,
      height: media.media_details?.height || 600,
      mime_type: media.mime_type || '',
      title: media.title?.rendered || '',
      caption: media.caption?.rendered || '',
      description: media.description?.rendered || '',
      sizes: media.media_details?.sizes ? {
        thumbnail: media.media_details.sizes.thumbnail ? {
          url: media.media_details.sizes.thumbnail.source_url,
          width: media.media_details.sizes.thumbnail.width,
          height: media.media_details.sizes.thumbnail.height,
        } : undefined,
        medium: media.media_details.sizes.medium ? {
          url: media.media_details.sizes.medium.source_url,
          width: media.media_details.sizes.medium.width,
          height: media.media_details.sizes.medium.height,
        } : undefined,
        large: media.media_details.sizes.large ? {
          url: media.media_details.sizes.large.source_url,
          width: media.media_details.sizes.large.width,
          height: media.media_details.sizes.large.height,
        } : undefined,
        full: {
          url: media.source_url || media.url,
          width: media.media_details?.width || 600,
          height: media.media_details?.height || 600,
        }
      } : undefined
    };
  } catch (error) {
    console.error('Error fetching media by ID:', id, error);
    return null;
  }
}

/**
 * Convert various image data formats to a consistent format
 */
export function normalizeImageData(imageData: any): { url: string; alt: string; width: number; height: number } | null {
  if (!imageData) {
    return null;
  }
  
  // Case 1: Already normalized object with url
  if (typeof imageData === 'object' && imageData.url) {
    return {
      url: imageData.url,
      alt: imageData.alt || '',
      width: imageData.width || 600,
      height: imageData.height || 600,
    };
  }
  
  // Case 2: String URL
  if (typeof imageData === 'string') {
    return {
      url: imageData,
      alt: '',
      width: 600,
      height: 600,
    };
  }
  
  // Case 3: Number (attachment ID) - this requires async fetching
  if (typeof imageData === 'number') {
    // This case needs to be handled separately with async/await
    return null;
  }
  
  return null;
}