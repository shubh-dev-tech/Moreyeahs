import React from 'react';
import './styles.scss';

interface CounterItem {
  number?: string;
  prefix?: string;
  suffix?: string;
  label?: string;
}

interface CounterBlockProps {
  data: {
    heading?: string;
    sub_heading?: string;
    counters?: CounterItem[];
  };
}

export default function CounterBlock({ data }: CounterBlockProps) {
  const {
    heading,
    sub_heading,
    counters
  } = data || {};

  if (!heading && !sub_heading && (!counters || counters.length === 0)) {
    return null;
  }

  const blockId = `counter-block-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <section id={blockId} className="counter-block">
      <div className="counter-block__container">
        {(heading || sub_heading) && (
          <div className="counter-block__header">
            {heading && (
              <h2 className="counter-block__heading">{heading}</h2>
            )}
            
            {sub_heading && (
              <p className="counter-block__sub-heading">{sub_heading}</p>
            )}
          </div>
        )}
        
        {counters && counters.length > 0 && (
          <div className="counter-block__counters">
            {counters.map((counter, index) => (
              <div key={index} className="counter-block__item">
                <div className="counter-block__number">
                  {counter.prefix && (
                    <span className="counter-block__prefix">{counter.prefix}</span>
                  )}
                  <span className="counter-block__value">{counter.number}</span>
                  {counter.suffix && (
                    <span className="counter-block__suffix">{counter.suffix}</span>
                  )}
                </div>
                {counter.label && (
                  <p className="counter-block__label">{counter.label}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
