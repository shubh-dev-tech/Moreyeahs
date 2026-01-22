import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('computer-vision');
}

async function getComputerVisionPageData() {
  try {
    // Try to fetch the Data Science Computer Vision page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=computer-vision&parent=data-science`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=computer-vision`,
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
    console.error('Error fetching Computer Vision page:', error);
    return null;
  }
}

export default async function ComputerVisionPage() {
  const pageData = await getComputerVisionPageData();

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
          <div className="computer-vision-page">
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
      <div className="computer-vision-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Computer Vision</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Computer Vision Solutions</h2>
              <p className="text-lg">
                Enable machines to see, interpret, and understand the visual world with cutting-edge 
                computer vision technologies. We build solutions that extract insights from images and 
                videos to automate processes, enhance quality control, and unlock new capabilities.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Computer Vision Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Object Detection</h3>
                <p className="text-gray-600">
                  Identify and locate multiple objects within images and videos using 
                  state-of-the-art models like YOLO and R-CNN.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Image Classification</h3>
                <p className="text-gray-600">
                  Categorize images into predefined classes with deep learning models 
                  trained on your specific domain.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Facial Recognition</h3>
                <p className="text-gray-600">
                  Detect, analyze, and verify faces for security, attendance tracking, 
                  and personalized experiences.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Image Segmentation</h3>
                <p className="text-gray-600">
                  Partition images into meaningful regions for medical imaging, 
                  autonomous vehicles, and precision analysis.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">OCR & Document Analysis</h3>
                <p className="text-gray-600">
                  Extract text from images and documents with optical character 
                  recognition and intelligent document processing.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Quality Inspection</h3>
                <p className="text-gray-600">
                  Automate visual quality control in manufacturing with defect 
                  detection and anomaly identification.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Computer Vision Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Manufacturing Quality Control</h4>
                <p className="text-gray-600">
                  Automated inspection of products on assembly lines to detect defects, 
                  ensuring consistent quality at scale.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Retail Analytics</h4>
                <p className="text-gray-600">
                  Track customer behavior, analyze shelf compliance, and optimize store 
                  layouts with in-store camera analytics.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Medical Imaging</h4>
                <p className="text-gray-600">
                  Assist healthcare professionals with disease detection and diagnosis 
                  from X-rays, MRIs, and CT scans.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Security & Surveillance</h4>
                <p className="text-gray-600">
                  Real-time monitoring with facial recognition, person tracking, and 
                  suspicious activity detection.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Autonomous Vehicles</h4>
                <p className="text-gray-600">
                  Enable self-driving capabilities with lane detection, pedestrian 
                  recognition, and obstacle avoidance.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Agricultural Monitoring</h4>
                <p className="text-gray-600">
                  Analyze crop health, detect pests and diseases, and optimize yield 
                  through aerial imagery and drones.
                </p>
              </div>
            </div>
          </div>

          <div className="technologies-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Technologies & Frameworks</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">OpenCV</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">TensorFlow</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">PyTorch</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">YOLO</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Azure Computer Vision</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">AWS Rekognition</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Google Vision AI</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Detectron2</p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to See What&apos;s Possible?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how computer vision can transform your visual data into actionable insights.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-cyan-400 text-white px-8 py-4 rounded-lg hover:bg-cyan-500 transition-colors font-semibold text-lg"
            >
              Schedule a Consultation
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
