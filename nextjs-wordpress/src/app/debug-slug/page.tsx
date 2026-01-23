'use client';

import { useState } from 'react';
import { sanitizeSlug, isValidSlug, isMalformedSlug, generateSlugFromTitle } from '@/utils/slugUtils';

export default function DebugSlugPage() {
  const [inputSlug, setInputSlug] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  
  const sanitized = sanitizeSlug(inputSlug);
  const isValid = isValidSlug(inputSlug);
  const isMalformed = isMalformedSlug(inputSlug);
  const generatedFromTitle = generateSlugFromTitle(inputTitle);
  
  const testCases = [
    'valid-slug',
    'invalid--slug',
    'slug-with-special-chars!@#',
    'very-long-slug-that-might-be-too-long-for-normal-use-and-could-cause-issues-with-url-handling-and-database-storage-limits-especially-when-dealing-with-wordpress-post-slugs-that-have-character-limits',
    '-leading-hyphen',
    'trailing-hyphen-',
    'UPPERCASE-SLUG',
    'slug with spaces',
    '',
    'a',
    'normal-case-study-slug'
  ];
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Slug Utility Debug Tool</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Test Slug Validation</h2>
        <input
          type="text"
          value={inputSlug}
          onChange={(e) => setInputSlug(e.target.value)}
          placeholder="Enter a slug to test..."
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Original:</strong> &quot;{inputSlug}&quot;</p>
          <p><strong>Sanitized:</strong> &quot;{sanitized}&quot;</p>
          <p><strong>Is Valid:</strong> {isValid ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Is Malformed:</strong> {isMalformed ? '⚠️ Yes' : '✅ No'}</p>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Generate Slug from Title</h2>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Enter a title to generate slug..."
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        
        <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Title:</strong> &quot;{inputTitle}&quot;</p>
          <p><strong>Generated Slug:</strong> &quot;{generatedFromTitle}&quot;</p>
        </div>
      </div>
      
      <div>
        <h2>Test Cases</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Original</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Sanitized</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Valid</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Malformed</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testSlug, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #ccc', fontFamily: 'monospace' }}>
                  &quot;{testSlug}&quot;
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc', fontFamily: 'monospace' }}>
                  &quot;{sanitizeSlug(testSlug)}&quot;
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isValidSlug(testSlug) ? '✅' : '❌'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isMalformedSlug(testSlug) ? '⚠️' : '✅'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
        <h3>How to Test Case Study URLs:</h3>
        <ol>
          <li>Try accessing: <code>/case-study/valid-slug</code></li>
          <li>Try accessing: <code>/case-study/invalid--slug--with--problems</code></li>
          <li>Try accessing: <code>/case-study/very-long-slug-that-should-be-truncated-and-sanitized-properly</code></li>
          <li>Check if malformed URLs redirect to sanitized versions</li>
          <li>Check if invalid slugs redirect to the case studies list page</li>
        </ol>
      </div>
    </div>
  );
}