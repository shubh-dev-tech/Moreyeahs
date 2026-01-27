/**
 * Image Grid Hover Block Component
 * ACF Block: acf/image-grid-hover
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { transformMediaUrl } from '@/lib/wpFetch';
import './styles.scss';

interface ImageData {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageItem {
  image: ImageData;
  heading: string;
  subheading: string;
  text: string;
  url: string;
}

interface ImageGridHoverProps {
  data: {
    section_heading?: string;
    section_subheading?: string;
    image_1?: ImageData;
    image_1_heading?: string;
    image_1_subheading?: string;
    image_1_text?: string;
    image_1_url?: string;
    image_2?: ImageData;
    image_2_heading?: string;
    image_2_subheading?: string;
    image_2_text?: string;
    image_2_url?: string;
    image_3?: ImageData;
    image_3_heading?: string;
    image_3_subheading?: string;
    image_3_text?: string;
    image_3_url?: string;
    image_4?: ImageData;
    image_4_heading?: string;
    image_4_subheading?: string;
    image_4_text?: string;
    image_4_url?: string;
    image_5?: ImageData;
    image_5_heading?: string;
    image_5_subheading?: string;
    image_5_text?: string;
    image_5_url?: string;
  };
}

const ImageGridHover: React.FC<ImageGridHoverProps> = ({ data }) => {
  const {
    section_heading,
    section_subheading,
    image_1,
    image_1_heading,
    image_1_subheading,
    image_1_text,
    image_1_url,
    image_2,
    image_2_heading,
    image_2_subheading,
    image_2_text,
    image_2_url,
    image_3,
    image_3_heading,
    image_3_subheading,
    image_3_text,
    image_3_url,
    image_4,
    image_4_heading,
    image_4_subheading,
    image_4_text,
    image_4_url,
    image_5,
    image_5_heading,
    image_5_subheading,
    image_5_text,
    image_5_url,
  } = data;

  const images: ImageItem[] = [
    {
      image: image_1!,
      heading: image_1_heading || '',
      subheading: image_1_subheading || '',
      text: image_1_text || '',
      url: image_1_url || '',
    },
    {
      image: image_2!,
      heading: image_2_heading || '',
      subheading: image_2_subheading || '',
      text: image_2_text || '',
      url: image_2_url || '',
    },
    {
      image: image_3!,
      heading: image_3_heading || '',
      subheading: image_3_subheading || '',
      text: image_3_text || '',
      url: image_3_url || '',
    },
    {
      image: image_4!,
      heading: image_4_heading || '',
      subheading: image_4_subheading || '',
      text: image_4_text || '',
      url: image_4_url || '',
    },
    {
      image: image_5!,
      heading: image_5_heading || '',
      subheading: image_5_subheading || '',
      text: image_5_text || '',
      url: image_5_url || '',
    },
  ].filter(item => item.image && item.image.url);

  const renderImageItem = (item: ImageItem, index: number) => {
    // First image (index 0) is the large one on the left
    const itemClass = `image-grid-item${index === 0 ? ' large-item' : ''}`;
    
    const content = (
      <div className="image-wrapper">
        <Image
          src={transformMediaUrl(item.image.url)}
          alt={item.image.alt || item.heading}
          width={item.image.width || 800}
          height={item.image.height || 600}
          className="grid-image"
        />
        <div className="image-overlay">
          {item.heading && <h3 className="image-heading">{item.heading}</h3>}
          {item.subheading && <h4 className="image-subheading">{item.subheading}</h4>}
          {item.text && <p className="image-text">{item.text}</p>}
        </div>
      </div>
    );

    return (
      <div key={index} className={itemClass}>
        {item.url ? (
          <Link href={item.url} className="image-grid-link">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <section className="image-grid-hover-block">
      {(section_heading || section_subheading) && (
        <div className="image-grid-header">
          {section_heading && <h2 className="section-heading">{section_heading}</h2>}
          {section_subheading && <p className="section-subheading">{section_subheading}</p>}
        </div>
      )}
      
      <div className="image-grid-container">
        {images.map((item, index) => renderImageItem(item, index))}
      </div>
    </section>
  );
};

export default ImageGridHover;
