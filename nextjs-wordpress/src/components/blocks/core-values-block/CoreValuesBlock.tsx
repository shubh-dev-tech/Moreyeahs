import React from 'react';
import Image from 'next/image';
import { transformMediaUrl } from '@/lib/wpFetch';
import './styles.scss';

interface CoreValue {
  title: string;
  description: string;
}

interface CoreValuesBlockProps {
  data: {
    values?: CoreValue[];
    team_image?: {
      url: string;
      alt: string;
      width?: number;
      height?: number;
    };
    center_heading?: string;
    center_description?: string;
    background_image?: {
      url: string;
      alt: string;
    };
  };
}

export default function CoreValuesBlock({ data }: CoreValuesBlockProps) {
  const rawValues = (data as any)?.values;
  const teamImage = data?.team_image;
  const centerHeading = data?.center_heading || 'Push Beyond Boundaries';
  const centerDescription = data?.center_description || 'We challenge the ordinary, question limits, and pursue bold ideas with courage. By stepping out of comfort zones, we drive innovation and open new possibilities. Pushing boundaries empowers us to stay ahead of change, inspire creativity, and achieve extraordinary results.';
  const backgroundImage = data?.background_image;

  let values: CoreValue[] = [];

  // Parse values array
  if (Array.isArray(rawValues)) {
    values = rawValues;
  } else if (rawValues && typeof rawValues === 'object') {
    values = Object.values(rawValues) as CoreValue[];
  } else if (typeof rawValues === 'number' && rawValues > 0) {
    // Handle flattened ACF repeater data
    values = [];
    for (let i = 0; i < rawValues; i++) {
      const title = (data as any)[`values_${i}_title`];
      const description = (data as any)[`values_${i}_description`];
      
      if (title && description) {
        values.push({ title, description });
      }
    }
  }

  if (values.length === 0) {
    return null;
  }

  // Split values into rows: 4 + 2 + 2 = 8 total
  const row1Values = values.slice(0, 4); // First 4 values
  const row2Left = values[4]; // 5th value (left of image)
  const row2Right = values[5]; // 6th value (right of image)
  const row3Left = values[6]; // 7th value (left of center)
  const row3Right = values[7]; // 8th value (right of center)

  return (
    <section 
      className="core-values-block"
      style={backgroundImage?.url ? {
        backgroundImage: `url(${transformMediaUrl(backgroundImage.url)})`
      } : undefined}
    >
      <div className="core-values-block__container">
        {/* Row 1: 4 Values */}
        <div className="core-values-block__row core-values-block__row--four">
          {row1Values.map((value, index) => (
            <div key={index} className="core-values-block__card">
              <h3 className="core-values-block__card-title">{value.title}</h3>
              <p className="core-values-block__card-description">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Row 2: Value + Team Image + Value */}
        <div className="core-values-block__row core-values-block__row--image">
          {row2Left && (
            <div className="core-values-block__card">
              <h3 className="core-values-block__card-title">{row2Left.title}</h3>
              <p className="core-values-block__card-description">{row2Left.description}</p>
            </div>
          )}
          
          {teamImage?.url && (
            <div className="core-values-block__team-image">
              <Image
                src={transformMediaUrl(teamImage.url)}
                alt={teamImage.alt || 'Our Team'}
                width={teamImage.width || 1200}
                height={teamImage.height || 400}
                className="core-values-block__image"
                priority
              />
            </div>
          )}
          
          {row2Right && (
            <div className="core-values-block__card">
              <h3 className="core-values-block__card-title">{row2Right.title}</h3>
              <p className="core-values-block__card-description">{row2Right.description}</p>
            </div>
          )}
        </div>

        {/* Row 3: Value + Center Content + Value */}
        <div className="core-values-block__row core-values-block__row--center">
          {row3Left && (
            <div className="core-values-block__card">
              <h3 className="core-values-block__card-title">{row3Left.title}</h3>
              <p className="core-values-block__card-description">{row3Left.description}</p>
            </div>
          )}
          
          <div className="core-values-block__center-text">
            <h2 className="core-values-block__center-heading">{centerHeading}</h2>
            <p className="core-values-block__center-description">{centerDescription}</p>
          </div>
          
          {row3Right && (
            <div className="core-values-block__card">
              <h3 className="core-values-block__card-title">{row3Right.title}</h3>
              <p className="core-values-block__card-description">{row3Right.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
