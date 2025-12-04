/**
 * Moreyeahs Slider Block - Editor JavaScript
 */

(function(wp) {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, Button, TextControl, IconButton } = wp.components;
    const { Fragment } = wp.element;
    const { __ } = wp.i18n;

    registerBlockType('moreyeahs/slider', {
        title: __('Moreyeahs Slider', 'moreyeahs'),
        description: __('A dynamic slider with image, heading, and CTA', 'moreyeahs'),
        icon: 'slides',
        category: 'media',
        keywords: ['slider', 'carousel', 'moreyeahs', 'hero'],
        
        attributes: {
            slides: {
                type: 'array',
                default: []
            }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { slides } = attributes;

            function addSlide() {
                const newSlides = [...slides, {
                    image: '',
                    subheading: '',
                    heading: '',
                    cta_text: '',
                    cta_url: ''
                }];
                setAttributes({ slides: newSlides });
            }

            function updateSlide(index, field, value) {
                const newSlides = [...slides];
                newSlides[index][field] = value;
                setAttributes({ slides: newSlides });
            }

            function removeSlide(index) {
                const newSlides = slides.filter((_, i) => i !== index);
                setAttributes({ slides: newSlides });
            }

            function moveSlide(index, direction) {
                const newSlides = [...slides];
                const newIndex = index + direction;
                
                if (newIndex >= 0 && newIndex < slides.length) {
                    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
                    setAttributes({ slides: newSlides });
                }
            }

            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody title={__('Slider Settings', 'moreyeahs')} initialOpen={true}>
                            <Button 
                                isPrimary 
                                onClick={addSlide}
                                style={{ marginBottom: '20px' }}
                            >
                                {__('Add Slide', 'moreyeahs')}
                            </Button>

                            {slides.map((slide, index) => (
                                <div key={index} style={{ 
                                    marginBottom: '30px', 
                                    padding: '15px', 
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    background: '#f9f9f9'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <strong>{__('Slide', 'moreyeahs')} {index + 1}</strong>
                                        <div>
                                            {index > 0 && (
                                                <Button 
                                                    isSmall 
                                                    onClick={() => moveSlide(index, -1)}
                                                    style={{ marginRight: '5px' }}
                                                >
                                                    ↑
                                                </Button>
                                            )}
                                            {index < slides.length - 1 && (
                                                <Button 
                                                    isSmall 
                                                    onClick={() => moveSlide(index, 1)}
                                                    style={{ marginRight: '5px' }}
                                                >
                                                    ↓
                                                </Button>
                                            )}
                                            <Button 
                                                isDestructive 
                                                isSmall 
                                                onClick={() => removeSlide(index)}
                                            >
                                                {__('Remove', 'moreyeahs')}
                                            </Button>
                                        </div>
                                    </div>

                                    <MediaUploadCheck>
                                        <MediaUpload
                                            onSelect={(media) => updateSlide(index, 'image', media.url)}
                                            allowedTypes={['image']}
                                            value={slide.image}
                                            render={({ open }) => (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <Button onClick={open} isSecondary style={{ marginBottom: '10px' }}>
                                                        {slide.image ? __('Change Image', 'moreyeahs') : __('Select Image', 'moreyeahs')}
                                                    </Button>
                                                    {slide.image && (
                                                        <div>
                                                            <img 
                                                                src={slide.image} 
                                                                alt="" 
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: 'auto',
                                                                    maxHeight: '150px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '4px'
                                                                }} 
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </MediaUploadCheck>

                                    <TextControl
                                        label={__('Subheading', 'moreyeahs')}
                                        value={slide.subheading}
                                        onChange={(value) => updateSlide(index, 'subheading', value)}
                                        placeholder={__('Enter subheading...', 'moreyeahs')}
                                    />

                                    <TextControl
                                        label={__('Heading', 'moreyeahs')}
                                        value={slide.heading}
                                        onChange={(value) => updateSlide(index, 'heading', value)}
                                        placeholder={__('Enter heading...', 'moreyeahs')}
                                    />

                                    <TextControl
                                        label={__('CTA Text', 'moreyeahs')}
                                        value={slide.cta_text}
                                        onChange={(value) => updateSlide(index, 'cta_text', value)}
                                        placeholder={__('Read more', 'moreyeahs')}
                                    />

                                    <TextControl
                                        label={__('CTA URL', 'moreyeahs')}
                                        value={slide.cta_url}
                                        onChange={(value) => updateSlide(index, 'cta_url', value)}
                                        placeholder={__('https://...', 'moreyeahs')}
                                    />
                                </div>
                            ))}
                        </PanelBody>
                    </InspectorControls>

                    <div className="moreyeahs-slider-editor" style={{
                        padding: '40px',
                        background: '#f0f0f0',
                        border: '2px dashed #ccc',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0' }}>
                            {__('Moreyeahs Slider', 'moreyeahs')}
                        </h3>
                        
                        {slides.length === 0 ? (
                            <div>
                                <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                                    {__('No slides added yet', 'moreyeahs')}
                                </p>
                                <Button isPrimary onClick={addSlide}>
                                    {__('Add First Slide', 'moreyeahs')}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                                    {slides.length} {slides.length === 1 ? __('slide', 'moreyeahs') : __('slides', 'moreyeahs')}
                                </p>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                    gap: '10px',
                                    marginTop: '20px'
                                }}>
                                    {slides.map((slide, index) => (
                                        <div key={index} style={{
                                            padding: '10px',
                                            background: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd'
                                        }}>
                                            {slide.image && (
                                                <img 
                                                    src={slide.image} 
                                                    alt="" 
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                        marginBottom: '8px'
                                                    }} 
                                                />
                                            )}
                                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                                {slide.heading || __('Slide', 'moreyeahs') + ' ' + (index + 1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button 
                                    isPrimary 
                                    onClick={addSlide}
                                    style={{ marginTop: '20px' }}
                                >
                                    {__('Add Another Slide', 'moreyeahs')}
                                </Button>
                            </div>
                        )}
                    </div>
                </Fragment>
            );
        },

        save: function() {
            // Dynamic block - rendered by PHP
            return null;
        }
    });
})(window.wp);
