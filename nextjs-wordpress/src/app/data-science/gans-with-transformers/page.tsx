import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('gans-with-transformers');
}

async function getGANsPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=gans-with-transformers&parent=data-science`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=gans-with-transformers`,
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
    console.error('Error fetching GANs with Transformers page:', error);
    return null;
  }
}

export default async function GANsWithTransformersPage() {
  const pageData = await getGANsPageData();

  if (pageData) {
    if (pageData.blocks && Array.isArray(pageData.blocks) && pageData.blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={pageData.blocks} />
        </main>
      );
    }

    const blocks = parseBlocks(pageData.content?.rendered || '') || [];

    if (blocks && blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={blocks} />
        </main>
      );
    }

    if (pageData.content?.rendered) {
      return (
        <main className="min-h-screen">
          <WordPressContent content={pageData.content.rendered} />
        </main>
      );
    }

    if (pageData.acf && pageData.acf.blocks) {
      return (
        <main className="min-h-screen">
          <div className="gans-transformers-page">
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

  return (
    <main className="min-h-screen">
      <div className="gans-transformers-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">GANs with Transformers</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Generative Adversarial Networks & Transformers</h2>
              <p className="text-lg">
                Combine the power of GANs and Transformers to create cutting-edge generative models. 
                From image synthesis to text generation, we leverage advanced deep learning architectures 
                to build innovative AI solutions that push the boundaries of what&apos;s possible.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our GAN & Transformer Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Image Generation</h3>
                <p className="text-gray-600">
                  Create photorealistic images, artwork, and designs using StyleGAN, DALL-E, 
                  and other advanced generative models.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Text-to-Image Synthesis</h3>
                <p className="text-gray-600">
                  Build models that generate images from text descriptions using diffusion models 
                  and transformer-based architectures.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Style Transfer</h3>
                <p className="text-gray-600">
                  Apply artistic styles to images and videos with neural style transfer 
                  and GAN-based techniques.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Augmentation</h3>
                <p className="text-gray-600">
                  Generate synthetic training data to improve model performance and handle 
                  data scarcity challenges.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Super Resolution</h3>
                <p className="text-gray-600">
                  Enhance image quality and resolution using GAN-based upscaling techniques 
                  for medical imaging, satellite imagery, and more.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Multimodal Generation</h3>
                <p className="text-gray-600">
                  Build models that work across text, images, and audio using transformer 
                  architectures and cross-modal learning.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Applications & Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Creative Content Generation</h4>
                <p className="text-gray-600">
                  Generate marketing visuals, product mockups, and creative assets for 
                  advertising and design workflows.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Medical Image Enhancement</h4>
                <p className="text-gray-600">
                  Improve diagnostic imaging quality and generate synthetic medical data 
                  for training and research.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Fashion & Design</h4>
                <p className="text-gray-600">
                  Create virtual try-ons, generate fashion designs, and synthesize product 
                  variations for e-commerce.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Video Synthesis</h4>
                <p className="text-gray-600">
                  Generate and manipulate video content with deepfake detection, video 
                  restoration, and animation.
                </p>
              </div>
            </div>
          </div>

          <div className="frameworks-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Technologies & Architectures</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">StyleGAN</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Stable Diffusion</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">DALL-E</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Vision Transformers</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">CLIP</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">PyTorch</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">TensorFlow</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Hugging Face</p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore Advanced Generative AI?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how GANs and Transformers can power your next innovative AI project.
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

export const revalidate = 60;
