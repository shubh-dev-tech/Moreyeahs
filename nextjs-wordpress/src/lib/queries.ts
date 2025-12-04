export const POST_FIELDS = `
  id
  title
  slug
  date
  modified
  excerpt
  content
  featuredImage {
    node {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
  author {
    node {
      name
      avatar {
        url
      }
    }
  }
  categories {
    nodes {
      name
      slug
    }
  }
  tags {
    nodes {
      name
      slug
    }
  }
  seo {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
    }
    schema {
      raw
    }
  }
`;

export const GET_ALL_POSTS_SLUGS = `
  query GetAllPostsSlugs {
    posts(first: 10000, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ${POST_FIELDS}
    }
  }
`;

export const GET_RECENT_POSTS = `
  query GetRecentPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($slug: String!, $first: Int = 10) {
    category(id: $slug, idType: SLUG) {
      name
      description
      posts(first: $first, where: { status: PUBLISH }) {
        nodes {
          ${POST_FIELDS}
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const GET_SITE_SETTINGS = `
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
      language
    }
  }
`;
