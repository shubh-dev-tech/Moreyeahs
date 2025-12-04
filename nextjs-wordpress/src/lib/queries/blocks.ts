/**
 * GraphQL Queries for Blocks and ACF
 */

export const GET_POST_WITH_BLOCKS = `
  query GetPostWithBlocks($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      blocks {
        name
        attributes
        innerBlocks {
          name
          attributes
        }
      }
      acf {
        fieldGroupName
      }
    }
  }
`;

export const GET_PAGE_WITH_BLOCKS = `
  query GetPageWithBlocks($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content
      blocks {
        name
        attributes
        innerBlocks {
          name
          attributes
        }
      }
      acf {
        fieldGroupName
      }
    }
  }
`;
