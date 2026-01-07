'use client';

import React from 'react';
import Hero2Service from './Hero2Service';

const Hero2ServiceDemo: React.FC = () => {
  const demoData = {
    title: "DevOps Implementation Process",
    subtitle: "Streamlined Development and Operations",
    description: "Our comprehensive DevOps approach ensures seamless integration between development and operations teams, delivering faster, more reliable software deployments.",
    left_image: {
      url: "/images/devops-illustration.png",
      alt: "DevOps Process Illustration"
    },
    content_type: 'bullet_points',
    bullet_points: [
      {
        heading: "Assess and Analyze",
        subheading: "Current State Evaluation",
        description: "Evaluate current DevOps maturity using industry frameworks, identify capabilities gaps and establish baseline metrics for improvement tracking",
        bullet_color: "#7ED4AD",
        heading_color: "#333333",
        subheading_color: "#666666",
        description_color: "#555555"
      },
      {
        heading: "Implement Automation",
        subheading: "CI/CD Pipeline Setup",
        description: "Deploy CI/CD pipelines with clear milestones, automate testing and deployment processes and establish measurable success criteria.",
        bullet_color: "#4ECDC4",
        heading_color: "#333333",
        subheading_color: "#666666",
        description_color: "#555555"
      },
      {
        heading: "Build Culture",
        subheading: "Team Collaboration",
        description: "Foster transparency through open communication channels, establish shared responsibility models, and create psychological safety for innovation",
        bullet_color: "#FF6B6B",
        heading_color: "#333333",
        subheading_color: "#666666",
        description_color: "#555555"
      },
      {
        heading: "Refine and Optimize",
        subheading: "Continuous Improvement",
        description: "Continuously enhance processes based on real-time feedback, performance metrics, and lessons learned from each interaction",
        bullet_color: "#FFE66D",
        heading_color: "#333333",
        subheading_color: "#666666",
        description_color: "#555555"
      }
    ],
    background_type: 'gradient',
    gradient_color1: '#f8f9fa',
    gradient_color2: '#e9ecef',
    gradient_direction: 'to right'
  };

  return (
    <div className="demo-container">
      <h1 style={{ textAlign: 'center', margin: '2rem 0', color: '#333' }}>
        Hero2Service - Bullet Points Demo
      </h1>
      <Hero2Service data={demoData} />
      
      <div style={{ margin: '2rem auto', maxWidth: '800px', padding: '0 1rem' }}>
        <h2>Features Demonstrated:</h2>
        <ul>
          <li>✅ Bullet points with custom colors</li>
          <li>✅ Heading and sub-heading support</li>
          <li>✅ Individual color controls for each text element</li>
          <li>✅ Responsive design</li>
          <li>✅ Gradient background</li>
        </ul>
      </div>
    </div>
  );
};

export default Hero2ServiceDemo;