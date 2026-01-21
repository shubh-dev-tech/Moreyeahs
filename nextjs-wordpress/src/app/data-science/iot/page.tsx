import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Internet of Things (IoT) | Data Science | MoreYeahs',
  description: 'Connect, monitor, and optimize your physical devices with intelligent IoT solutions that transform real-world data into actionable insights.',
};

async function getIoTPageData() {
  try {
    // Try to fetch the Data Science IoT page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=iot&parent=data-science`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=iot`,
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
    console.error('Error fetching IoT page:', error);
    return null;
  }
}

export default async function IoTPage() {
  const pageData = await getIoTPageData();

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
          <div className="iot-page">
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
      <div className="iot-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Internet of Things (IoT)</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">IoT Solutions</h2>
              <p className="text-lg">
                Connect your physical devices to the digital world with intelligent IoT solutions. 
                We help you collect, analyze, and act on real-time data from sensors, machines, 
                and devices to optimize operations and create new business opportunities.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our IoT Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Device Connectivity</h3>
                <p className="text-gray-600">
                  Connect sensors, devices, and machines using MQTT, HTTP, CoAP, and 
                  other IoT protocols for reliable data transmission.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Edge Computing</h3>
                <p className="text-gray-600">
                  Process data closer to the source with edge computing solutions 
                  for reduced latency and bandwidth optimization.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">IoT Platforms</h3>
                <p className="text-gray-600">
                  Azure IoT Hub, AWS IoT Core, and Google Cloud IoT integration 
                  for scalable device management and data processing.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Predictive Maintenance</h3>
                <p className="text-gray-600">
                  AI-powered predictive analytics to identify equipment failures 
                  before they occur, reducing downtime and costs.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Real-Time Monitoring</h3>
                <p className="text-gray-600">
                  Dashboards and alerts for monitoring device health, performance, 
                  and environmental conditions in real-time.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Security & Compliance</h3>
                <p className="text-gray-600">
                  End-to-end security with device authentication, encryption, 
                  and compliance with industry standards.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">IoT Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Smart Manufacturing</h4>
                <p className="text-gray-600">
                  Monitor production lines, track inventory, and optimize manufacturing 
                  processes with connected sensors and analytics.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Asset Tracking</h4>
                <p className="text-gray-600">
                  Real-time location tracking and condition monitoring for vehicles, 
                  equipment, and valuable assets across the supply chain.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Smart Buildings</h4>
                <p className="text-gray-600">
                  Optimize energy consumption, HVAC systems, and building operations 
                  with intelligent automation and monitoring.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Environmental Monitoring</h4>
                <p className="text-gray-600">
                  Track air quality, temperature, humidity, and other environmental 
                  factors for safety and compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Connect Your Devices?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how IoT can transform your operations and unlock new insights.
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
