import React from 'react';

interface DebugTextImageAlternatingBlockProps {
  data?: any;
  [key: string]: any;
}

const DebugTextImageAlternatingBlock: React.FC<DebugTextImageAlternatingBlockProps> = (props) => {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px 0', 
      backgroundColor: '#f0f0f0', 
      border: '2px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>
        🐛 Debug: Text Image Alternating Block
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>All Props:</strong>
        <pre style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Data Prop:</strong>
        <pre style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {JSON.stringify(props.data, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Data Analysis:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Has data prop: {props.data ? '✅ Yes' : '❌ No'}</li>
          <li>Data type: {typeof props.data}</li>
          <li>Main heading: {props.data?.main_heading ? '✅ ' + props.data.main_heading : '❌ Missing'}</li>
          <li>Main subheading: {props.data?.main_subheading ? '✅ ' + props.data.main_subheading : '❌ Missing'}</li>
          <li>Content sections: {props.data?.content_sections ? `✅ ${props.data.content_sections.length} sections` : '❌ Missing'}</li>
          <li>Background image: {props.data?.background_image?.url ? '✅ ' + props.data.background_image.url : '❌ Missing'}</li>
        </ul>
      </div>
      
      {props.data?.content_sections && (
        <div>
          <strong>Content Sections Detail:</strong>
          {props.data.content_sections.map((section: any, index: number) => (
            <div key={index} style={{ 
              backgroundColor: '#fff', 
              padding: '10px', 
              margin: '5px 0',
              borderRadius: '4px'
            }}>
              <strong>Section {index + 1}:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Layout: {section.layout_type || 'Not set'}</li>
                <li>Text: {section.text_content || 'Not set'}</li>
                <li>Image URL: {section.section_image?.url || 'Not set'}</li>
                <li>Image Alt: {section.section_image?.alt || 'Not set'}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugTextImageAlternatingBlock;