// Service Templates for Quick Setup
export interface ServiceTemplate {
  service_category: string;
  service_title: string;
  service_subtitle?: string;
  service_description_type: 'bullet_list' | 'paragraph' | 'features';
  service_description?: string;
  service_features?: Array<{
    feature_text: string;
  }>;
  service_priority: string;
  service_status: 'active' | 'coming_soon' | 'featured' | 'legacy';
}

export const SERVICE_TEMPLATES: Record<string, ServiceTemplate[]> = {
  tech_services: [
    {
      service_category: 'technical',
      service_title: 'Data Science & AI',
      service_subtitle: 'Advanced Analytics Solutions',
      service_description_type: 'bullet_list',
      service_description: '• AI/ML models\n• Computer vision\n• Predictive analytics\n• Data visualization\n• Natural language processing',
      service_priority: '4',
      service_status: 'featured'
    },
    {
      service_category: 'technical',
      service_title: 'Data Engineering',
      service_subtitle: 'Scalable Data Infrastructure',
      service_description_type: 'bullet_list',
      service_description: '• Cloud data pipelines\n• Modern data platforms\n• Real-time analytics\n• Data warehouse design\n• ETL/ELT processes',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'technical',
      service_title: 'DevOps & Cloud Engineering',
      service_subtitle: 'Infrastructure Automation',
      service_description_type: 'bullet_list',
      service_description: '• CI/CD pipelines\n• Cloud migration\n• Infrastructure automation\n• Container orchestration\n• Monitoring & logging',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'technical',
      service_title: 'Full Stack Development',
      service_subtitle: 'End-to-End Solutions',
      service_description_type: 'bullet_list',
      service_description: '• End-to-end development\n• Scalable architectures\n• Secure integrations\n• Performance optimization\n• Code quality assurance',
      service_priority: '2',
      service_status: 'active'
    }
  ],

  business_services: [
    {
      service_category: 'business',
      service_title: 'Digital Marketing',
      service_subtitle: 'Growth-Driven Strategies',
      service_description_type: 'bullet_list',
      service_description: '• Performance marketing\n• SEO-driven growth\n• Data-backed campaigns\n• Conversion optimization\n• Marketing automation',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'business',
      service_title: 'UI/UX Design',
      service_subtitle: 'User-Centered Design',
      service_description_type: 'bullet_list',
      service_description: '• User-centered design\n• Intuitive interfaces\n• Conversion-focused UX\n• Design systems\n• Usability testing',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'business',
      service_title: 'Business Intelligence',
      service_subtitle: 'Data-Driven Insights',
      service_description_type: 'bullet_list',
      service_description: '• Executive dashboards\n• KPI tracking\n• Predictive analytics\n• Business reporting\n• Decision support systems',
      service_priority: '2',
      service_status: 'active'
    },
    {
      service_category: 'consulting',
      service_title: 'Digital Transformation',
      service_subtitle: 'Strategic Technology Consulting',
      service_description_type: 'bullet_list',
      service_description: '• Technology strategy\n• Process optimization\n• Change management\n• Digital roadmaps\n• Innovation workshops',
      service_priority: '4',
      service_status: 'featured'
    }
  ],

  enterprise_solutions: [
    {
      service_category: 'enterprise',
      service_title: 'SharePoint & Enterprise Collaboration',
      service_subtitle: 'Modern Workplace Solutions',
      service_description_type: 'bullet_list',
      service_description: '• Modern intranets\n• Workflow automation\n• Knowledge management\n• Document collaboration\n• Teams integration',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'enterprise',
      service_title: 'Microsoft Dynamics',
      service_subtitle: 'Business Process Automation',
      service_description_type: 'bullet_list',
      service_description: '• Dynamics 365 implementation\n• ERP/CRM modernization\n• Business process automation\n• Custom integrations\n• User training & support',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'enterprise',
      service_title: 'Salesforce',
      service_subtitle: 'Customer Relationship Excellence',
      service_description_type: 'bullet_list',
      service_description: '• CRM implementation\n• Marketing Cloud setup\n• Sales automation\n• Custom app development\n• Integration services',
      service_priority: '3',
      service_status: 'active'
    },
    {
      service_category: 'enterprise',
      service_title: 'Enterprise Security',
      service_subtitle: 'Comprehensive Security Solutions',
      service_description_type: 'bullet_list',
      service_description: '• Security assessments\n• Identity management\n• Compliance frameworks\n• Threat monitoring\n• Incident response',
      service_priority: '2',
      service_status: 'active'
    }
  ]
};

export const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical Services',
  business: 'Business Services',
  enterprise: 'Enterprise Solutions',
  consulting: 'Consulting Services',
  support: 'Support Services'
};

export const PRIORITY_LABELS: Record<string, string> = {
  '1': 'Low Priority',
  '2': 'Normal Priority',
  '3': 'High Priority',
  '4': 'Featured Service'
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  coming_soon: 'Coming Soon',
  featured: 'Featured',
  legacy: 'Legacy Support'
};

// Helper function to get template by name
export function getServiceTemplate(templateName: string): ServiceTemplate[] {
  return SERVICE_TEMPLATES[templateName] || [];
}

// Helper function to get all available templates
export function getAvailableTemplates(): Array<{ key: string; label: string; count: number }> {
  return Object.entries(SERVICE_TEMPLATES).map(([key, services]) => ({
    key,
    label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: services.length
  }));
}

// Helper function to merge template with custom data
export function mergeServiceTemplate(template: ServiceTemplate, customData: Partial<ServiceTemplate>): ServiceTemplate {
  return {
    ...template,
    ...customData
  };
}