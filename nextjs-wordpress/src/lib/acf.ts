/**
 * ACF (Advanced Custom Fields) Integration
 * Fetch and process ACF field data from WordPress
 */

import { fetchRestAPI } from './wordpress';

export interface ACFField {
  fieldGroupName?: string;
  [key: string]: any;
}

/**
 * Fetch ACF fields for a post via REST API
 */
export async function getPostACFFields(slug: string, postType: string = 'post'): Promise<ACFField | null> {
  try {
    // First get the post by slug to get its ID
    const posts = await fetchRestAPI(`/wp/v2/${postType}s?slug=${slug}&_fields=id,acf`);
    
    if (!posts || posts.length === 0) {
      return null;
    }
    
    const post = posts[0];
    return post.acf || null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch ACF fields via REST API (alternative method)
 */
export async function getACFFieldsREST(postId: number): Promise<Record<string, any> | null> {
  try {
    const data = await fetchRestAPI(`/wp/v2/posts/${postId}?_fields=acf`);
    return data.acf || null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch ACF options page data
 */
export async function getACFOptions(optionsPageName: string = 'options'): Promise<Record<string, any> | null> {
  try {
    const data = await fetchRestAPI(`/acf/v3/options/${optionsPageName}`);
    return data || null;
  } catch (error) {
    return null;
  }
}
