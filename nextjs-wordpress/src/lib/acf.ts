/**
 * ACF (Advanced Custom Fields) Integration
 * Fetch and process ACF field data from WordPress
 */

import { fetchGraphQL, fetchRestAPI } from './wordpress';

export interface ACFField {
  fieldGroupName?: string;
  [key: string]: any;
}

/**
 * Fetch ACF fields for a post via GraphQL
 */
export async function getPostACFFields(slug: string, postType: string = 'post'): Promise<ACFField | null> {
  const query = `
    query GetPostACF($slug: ID!) {
      ${postType}(id: $slug, idType: SLUG) {
        id
        acfFields: acf {
          fieldGroupName
        }
      }
    }
  `;
  
  try {
    const data = await fetchGraphQL<any>(query, { slug });
    return data[postType]?.acfFields || null;
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
