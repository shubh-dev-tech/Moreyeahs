import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('generative-ai');
}

async function getGenerativeAIPageData() {
  try {
    // Try to fetch the Generative AI page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=generative-ai&parent=data-science`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // Fallback: try without parent filter
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=generative-ai`,
      { next: { revalidate: 60 } }
    );
    
    if (fallbackResponse.ok) {
      const pages = await fallbackResponse.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Generative AI page:', error);
    return null;
  }
}

export default async function GenerativeAIPage() {
  const pageData = await getGenerativeAIPageData();

  if (pageData) {
    // First check if we have blocks from the custom endpoint
    if (pageData.blocks && Array.isArray(pageData.blocks) && pageData.blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={pageData.blocks} />
        </main>
      );
    }

    // Parse blocks from content if available
    const blocks = parseBlocks(pageData.content?.rendered || '') || [];

    // If we have parsed blocks, render them with BlockRenderer
    if (blocks && blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={blocks} />
        </main>
      );
    }

    // If no blocks but we have content, render with WordPressContent
    if (pageData.content?.rendered) {
      return (
        <main className="min-h-screen">
          <WordPressContent content={pageData.content.rendered} />
        </main>
      );
    }

    // If WordPress page exists but has no content, render with ACF blocks if available
    if (pageData.acf && pageData.acf.blocks) {
      return (
        <main className="min-h-screen">
          <div className="generative-ai-page">
            <div className="mx-auto px-4 py-8">
              <div className="blocks">
                <BlockRenderer blocks={pageData.acf.blocks} />
              </div>
            </div>
          </div>
        </main>
      );
    }
  }

  // Default content if no WordPress page exists
  return (
    <main className="min-h-screen">
      <div className="generative-ai-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Generative AI</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Generative AI Solutions</h2>
              <p className="text-lg">
                Harness the power of generative AI to create content, automate workflows, 
                and build intelligent applications. From large language models to image generation, 
                we help you leverage cutting-edge AI technology to transform your business.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Generative AI Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Large Language Models (LLMs)</h3>
                <p className="text-gray-600">
                  Build custom chatbots, virtual assistants, and content generation systems 
                  using GPT, Claude, and other advanced language models.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">RAG Systems</h3>
                <p className="text-gray-600">
                  Implement Retrieval-Augmented Generation to create AI systems that 
                  answer questions based on your proprietary data and documents.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">AI Agents & Automation</h3>
                <p className="text-gray-600">
                  Develop autonomous AI agents that can perform complex tasks, make decisions, 
                  and interact with multiple systems.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Image & Video Generation</h3>
                <p className="text-gray-600">
                  Create visual content with AI models like DALL-E, Midjourney, and Stable Diffusion 
                  for marketing, design, and creative applications.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Code Generation</h3>
                <p className="text-gray-600">
                  Accelerate development with AI-powered code generation, documentation, 
                  and automated testing solutions.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Fine-tuning & Custom Models</h3>
                <p className="text-gray-600">
                  Customize pre-trained models with your data to create specialized AI 
                  solutions tailored to your industry and use case.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Generative AI Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Intelligent Customer Support</h4>
                <p className="text-gray-600">
                  Deploy AI chatbots that understand context, provide accurate answers, 
                  and escalate complex issues to human agents.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Content Creation & Marketing</h4>
                <p className="text-gray-600">
                  Generate blog posts, social media content, product descriptions, 
                  and marketing copy at scale.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Document Analysis & Summarization</h4>
                <p className="text-gray-600">
                  Extract insights from contracts, reports, and documents with AI-powered 
                  analysis and summarization.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Personalized Recommendations</h4>
                <p className="text-gray-600">
                  Create hyper-personalized product recommendations and content suggestions 
                  using generative AI.
                </p>
              </div>
            </div>
          </div>

          <div className="frameworks-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Technologies & Platforms</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">OpenAI GPT</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Anthropic Claude</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Azure OpenAI</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">LangChain</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">LlamaIndex</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Hugging Face</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Stable Diffusion</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Vector Databases</p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore Generative AI?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how generative AI can revolutionize your business processes and create new opportunities.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-cyan-400 text-white px-8 py-4 rounded-lg hover:bg-cyan-500 transition-colors font-semibold text-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
