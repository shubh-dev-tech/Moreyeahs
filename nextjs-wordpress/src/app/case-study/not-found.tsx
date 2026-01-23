import React from 'react';
import Link from 'next/link';

export default function CaseStudyNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Case Study Not Found</h2>
          <p className="text-gray-500 mb-8">
            Sorry, the case study you are looking for does not exist or may have been moved.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/case-study" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Case Studies
            </Link>
            
            <div className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-600 underline">
                Go back home
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-left">
            <h3 className="text-lg font-semibold mb-4">Popular Case Studies:</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/case-study" className="text-blue-600 hover:text-blue-800 underline">
                  Browse all case studies
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-blue-600 hover:text-blue-800 underline">
                  View our services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}