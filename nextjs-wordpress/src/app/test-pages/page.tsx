import { fetchGraphQL } from '@/lib/wordpress';

async function getAllPages() {
  const query = `
    query GetAllPages {
      pages(first: 20) {
        nodes {
          id
          title
          slug
          uri
          isFrontPage
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<any>(query);
    return data.pages?.nodes || [];
  } catch (error) {
    return [];
  }
}

export default async function TestPages() {
  const pages = await getAllPages();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">All WordPress Pages</h1>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(pages, null, 2)}
        </pre>
      </div>
    </main>
  );
}
