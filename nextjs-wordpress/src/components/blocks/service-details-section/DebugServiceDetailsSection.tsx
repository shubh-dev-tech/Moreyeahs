import React from 'react';
import ServiceDetailsSection from './ServiceDetailsSection';

interface DebugServiceDetailsSectionProps {
  data?: any;
  [key: string]: any;
}

const DebugServiceDetailsSection: React.FC<DebugServiceDetailsSectionProps> = (props) => {
  console.log('=== Service Details Section Debug ===');
  console.log('All props:', props);
  console.log('Data prop:', props.data);
  console.log('Props keys:', Object.keys(props));
  
  // Check if data exists and has the expected structure
  if (!props.data) {
    console.warn('No data prop found!');
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#ffebee', 
        border: '2px solid #f44336',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#d32f2f' }}>Service Details Section - No Data</h3>
        <p>The component received no data prop. Check the WordPress block configuration.</p>
        <details>
          <summary>Debug Info</summary>
          <pre>{JSON.stringify(props, null, 2)}</pre>
        </details>
      </div>
    );
  }

  const { data } = props;
  
  // Show all data keys
  console.log('Data keys:', Object.keys(data));
  console.log('Services field:', data.services);
  console.log('Services type:', typeof data.services);
  console.log('Services is array:', Array.isArray(data.services));
  
  // Look for individual service fields
  const serviceFields = Object.keys(data).filter(key => key.startsWith('services_'));
  console.log('Individual service fields found:', serviceFields);
  
  // Check required fields
  const requiredFields = ['heading'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    console.warn('Missing required fields:', missingFields);
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff3e0', 
        border: '2px solid #ff9800',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#f57c00' }}>Service Details Section - Missing Data</h3>
        <p>Missing required fields: {missingFields.join(', ')}</p>
        <details>
          <summary>Available Data</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    );
  }

  // Check services array
  if (!Array.isArray(data.services) || data.services.length === 0) {
    console.warn('Services is not an array or is empty:', data.services);
    
    // Try to reconstruct services from individual fields
    const reconstructedServices = [];
    let serviceIndex = 0;
    
    while (data[`services_${serviceIndex}_service_title`]) {
      const service = {
        service_title: data[`services_${serviceIndex}_service_title`],
        service_description: data[`services_${serviceIndex}_service_description`],
        service_link: data[`services_${serviceIndex}_service_link`],
        service_icon: data[`services_${serviceIndex}_service_icon`]
      };
      reconstructedServices.push(service);
      serviceIndex++;
    }
    
    console.log('Reconstructed services:', reconstructedServices);
    
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f5e8', 
        border: '2px solid #4caf50',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#388e3c' }}>Service Details Section - Debug Info</h3>
        <p><strong>Heading:</strong> {data.heading}</p>
        <p><strong>Sub Heading:</strong> {data.sub_heading || 'None'}</p>
        <p><strong>Background Color:</strong> {data.background_color || 'Default'}</p>
        <p><strong>Grid Columns:</strong> {data.grid_columns || '3'}</p>
        <p><strong>Services Array:</strong> {Array.isArray(data.services) ? `Array with ${data.services.length} items` : `Not an array: ${data.services}`}</p>
        <p><strong>Individual Service Fields:</strong> {serviceFields.length} found</p>
        {reconstructedServices.length > 0 && (
          <div>
            <p><strong>Reconstructed Services:</strong></p>
            <ul>
              {reconstructedServices.map((service, index) => (
                <li key={index}>
                  {service.service_title} - {service.service_description}
                </li>
              ))}
            </ul>
          </div>
        )}
        <details>
          <summary>Full Data Structure</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    );
  }

  console.log('✅ All checks passed, rendering component');
  
  return (
    <>
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <strong>Debug:</strong> Services count: {data.services.length}, 
          Grid: {data.grid_columns || '3'}, 
          Background: {data.background_color || 'default'}
        </div>
      )}
      
      <ServiceDetailsSection data={data} />
    </>
  );
};

export default DebugServiceDetailsSection;