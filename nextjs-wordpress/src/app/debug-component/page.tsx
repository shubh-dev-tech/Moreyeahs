/**
 * Debug page to test FullWidthLeftTextSection component directly
 */

import { FullWidthLeftTextSection } from '@/components/blocks/FullWidthLeftTextSection';

export default function DebugComponent() {
  // Test data that matches what we found in the API
  const testData = {
    heading: "Digital Core Capabilities",
    sub_heading: "Build vital capabilities to deliver digital outcomes.",
    button_text: "Explore",
    button_url: "#",
    heading_bottom_1st: "Pfizer's journey towards increased productivity, powered by AI",
    url_text: "View",
    url_link: "#",
    heading_bottom_2nd: "A government that contributes to the joy of parenting",
    url_title_2nd: "View",
    url_link_2nd: "#",
    right_image: {
      url: "http://localhost/moreyeahs-new/wp-content/uploads/2025/12/digital-capabilities-lead.png",
      alt: "Digital capabilities lead image",
      width: 600,
      height: 600
    },
    reverse_layout: false,
    background_color: "#b8860b"
  };

  return (
    <div>
      <h1 className="text-2xl font-bold p-4">Debug: FullWidthLeftTextSection Component</h1>
      
      <div className="p-4 bg-gray-100 mb-4">
        <h2 className="text-lg font-semibold mb-2">Test Data:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>
      
      <div className="border-2 border-red-500 mb-4">
        <p className="p-2 bg-red-100 text-red-800">Component should render below this line:</p>
      </div>
      
      <FullWidthLeftTextSection data={testData} />
      
      <div className="border-2 border-red-500 mt-4">
        <p className="p-2 bg-red-100 text-red-800">Component should render above this line</p>
      </div>
    </div>
  );
}