import React from 'react';
import './styles.scss';

interface Credential {
  credentialTitle?: string;
  credential_title?: string;
  dotColor?: string;
  dot_color?: string;
}

interface CredentialsAcquiredBlockProps {
  data?: {
    heading?: string;
    backgroundColor?: string;
    background_color?: string;
    textColor?: string;
    text_color?: string;
    credentialsList?: Credential[];
    credentials_list?: Credential[];
  };
  heading?: string;
  backgroundColor?: string;
  textColor?: string;
  credentialsList?: Credential[];
  className?: string;
}

const CredentialsAcquiredBlock: React.FC<CredentialsAcquiredBlockProps> = ({
  data,
  heading: headingProp,
  backgroundColor: backgroundColorProp,
  textColor: textColorProp,
  credentialsList: credentialsListProp,
  className = ''
}) => {
  // Support both direct props and data object, and both snake_case and camelCase
  const heading = data?.heading || headingProp || 'Credentials Acquired';
  const backgroundColor = data?.backgroundColor || data?.background_color || backgroundColorProp || '#1a1a2e';
  const textColor = data?.textColor || data?.text_color || textColorProp || '#ffffff';
  const rawCredentialsList = data?.credentialsList || data?.credentials_list || credentialsListProp || [];
  
  // Default credentials for preview/fallback
  const defaultCredentials: Credential[] = [
    { credentialTitle: 'Azure DevOps Engineer Expert', dotColor: '#00A3E0' },
    { credentialTitle: 'GCP Professional Cloud DevOps Engineer', dotColor: '#4285F4' },
    { credentialTitle: 'AWS Certified Solutions Architect - Professional', dotColor: '#32CD32' },
    { credentialTitle: 'AWS Certified Solutions Architect – Associate', dotColor: '#FFD700' },
    { credentialTitle: 'AWS Certified Cloud Practitioner', dotColor: '#FFD700' },
    { credentialTitle: 'Azure Developer Associate', dotColor: '#00A3E0' },
    { credentialTitle: 'Azure AI Fundamentals AI-900', dotColor: '#00A3E0' },
    { credentialTitle: 'Red Hat Certified System Administrator (RHCSA)', dotColor: '#8A2BE2' },
    { credentialTitle: 'Red Hat Certified Engineer (RHCE)', dotColor: '#8A2BE2' },
    { credentialTitle: 'Microsoft 365 Certified: Teams Administrator Associate', dotColor: '#00A3E0' },
    { credentialTitle: 'Microsoft 365 Certified: Administrator Expert', dotColor: '#00A3E0' }
  ];

  // Normalize the credentials list to handle both naming conventions
  const normalizedCredentials = rawCredentialsList.map(cred => ({
    credentialTitle: cred.credentialTitle || cred.credential_title || '',
    dotColor: cred.dotColor || cred.dot_color || '#00A3E0'
  }));

  const credentials = normalizedCredentials.length > 0 ? normalizedCredentials : defaultCredentials;

  return (
    <section 
      className={`credentials-acquired-block ${className}`}
      style={{ 
        backgroundColor,
        color: textColor 
      }}
    >
      <div className="credentials-container">
        <h2 className="credentials-heading">{heading}</h2>
        
        <div className="credentials-list">
          {credentials.map((credential, index) => (
            <div key={`credential-${index}`} className="credential-item">
              <span 
                className="credential-dot" 
                style={{ backgroundColor: credential.dotColor }}
              />
              <span className="credential-title">
                {credential.credentialTitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredentialsAcquiredBlock;