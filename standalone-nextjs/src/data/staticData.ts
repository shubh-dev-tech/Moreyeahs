// Static data to replace WordPress content
export const siteData = {
  siteName: 'MoreYeahs',
  logo: null, // Add logo URL if you have one
  
  // Navigation menu
  primaryMenu: [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Services', url: '/services' },
    { label: 'Contact', url: '/contact' },
  ],
  
  // Homepage content blocks
  contentBlocks: [
    {
      type: 'moreyeahs-content-block',
      data: {
        heading: 'Welcome to MoreYeahs',
        description: '<p>We are a modern business platform that helps companies grow and succeed in today\'s digital landscape. Our innovative solutions and expert team deliver results that matter.</p>',
        image: {
          url: 'https://picsum.photos/600/400?random=1',
          alt: 'MoreYeahs Hero Image',
          width: 600,
          height: 400
        },
        buttonText: 'Learn More',
        buttonUrl: '/about'
      }
    },
    {
      type: 'moreyeahs-service-block',
      data: {
        heading: 'Our Services',
        subheading: 'Comprehensive solutions for your business needs',
        serviceSections: [
          {
            serviceHeading: 'Digital Solutions',
            serviceHeadingUrl: '/digital-solutions',
            services: [
              { serviceName: 'Web Development', serviceUrl: '/web-development' },
              { serviceName: 'Mobile Apps', serviceUrl: '/mobile-apps' },
              { serviceName: 'E-commerce', serviceUrl: '/ecommerce' },
              { serviceName: 'Digital Marketing', serviceUrl: '/digital-marketing' }
            ]
          },
          {
            serviceHeading: 'Business Consulting',
            serviceHeadingUrl: '/consulting',
            services: [
              { serviceName: 'Strategy Planning', serviceUrl: '/strategy' },
              { serviceName: 'Process Optimization', serviceUrl: '/optimization' },
              { serviceName: 'Market Analysis', serviceUrl: '/analysis' },
              { serviceName: 'Growth Consulting', serviceUrl: '/growth' }
            ]
          },
          {
            serviceHeading: 'Technical Support',
            serviceHeadingUrl: '/support',
            services: [
              { serviceName: '24/7 Support', serviceUrl: '/support-24-7' },
              { serviceName: 'System Maintenance', serviceUrl: '/maintenance' },
              { serviceName: 'Security Audits', serviceUrl: '/security' },
              { serviceName: 'Performance Monitoring', serviceUrl: '/monitoring' }
            ]
          }
        ]
      }
    },
    {
      type: 'moreyeahs-content-block',
      data: {
        heading: 'Why Choose MoreYeahs?',
        description: '<p>With over 10 years of experience in the industry, we have helped hundreds of businesses achieve their goals. Our team of experts is dedicated to providing innovative solutions that drive real results.</p><ul><li>Expert team with proven track record</li><li>Cutting-edge technology solutions</li><li>24/7 customer support</li><li>Competitive pricing</li></ul>',
        image: {
          url: 'https://picsum.photos/600/400?random=2',
          alt: 'Why Choose MoreYeahs',
          width: 600,
          height: 400
        },
        buttonText: 'Get Started',
        buttonUrl: '/contact'
      }
    }
  ],
  
  // Footer data
  footer: {
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About Us', url: '/about' },
          { label: 'Our Team', url: '/team' },
          { label: 'Careers', url: '/careers' },
          { label: 'News', url: '/news' }
        ]
      },
      {
        title: 'Services',
        links: [
          { label: 'Web Development', url: '/web-development' },
          { label: 'Mobile Apps', url: '/mobile-apps' },
          { label: 'Consulting', url: '/consulting' },
          { label: 'Support', url: '/support' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'Blog', url: '/blog' },
          { label: 'Documentation', url: '/docs' },
          { label: 'Help Center', url: '/help' },
          { label: 'Contact', url: '/contact' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', url: '/privacy' },
          { label: 'Terms of Service', url: '/terms' },
          { label: 'Cookie Policy', url: '/cookies' }
        ]
      }
    ],
    copyrightLeft: '© 2024 MoreYeahs. All rights reserved.',
    copyrightRight: 'Powered by Next.js'
  }
};