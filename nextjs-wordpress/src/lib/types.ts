export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
}

export interface Author {
  node: {
    name: string;
    avatar: {
      url: string;
    };
  };
}

export interface Category {
  name: string;
  slug: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface SEO {
  title: string;
  metaDesc: string;
  canonical: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: {
    sourceUrl: string;
  } | null;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: {
    sourceUrl: string;
  } | null;
  schema: {
    raw: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  modified: string;
  excerpt: string;
  content: string;
  featuredImage: FeaturedImage | null;
  author: Author;
  categories: {
    nodes: Category[];
  };
  tags: {
    nodes: Tag[];
  };
  seo: SEO;
}

export interface PostsResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: Post[];
  };
}

export interface PostResponse {
  post: Post;
}

export interface PostsSlugsResponse {
  posts: {
    nodes: {
      slug: string;
    }[];
  };
}

export interface GeneralSettings {
  title: string;
  description: string;
  url: string;
  language: string;
}

export interface SiteSettingsResponse {
  generalSettings: GeneralSettings;
}
