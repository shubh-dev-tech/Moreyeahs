/**
 * Moreyeahs Slider Block - Editor JavaScript
 * Using createElement instead of JSX for browser compatibility
 */

(function(wp) {
    console.log('Moreyeahs Slider Block: Script loaded', wp);
    
    if (!wp || !wp.blocks) {
        console.error('Moreyeahs Slider Block: wp.blocks not available');
        return;
    }
    
    var registerBlockType = wp.blocks.registerBlockType;
    var InspectorControls = (wp.blockEditor || wp.editor).InspectorControls;
    var MediaUpload = (wp.blockEditor || wp.editor).MediaUpload;
    var MediaUploadCheck = (wp.blockEditor || wp.editor).MediaUploadCheck;
    var PanelBody = wp.components.PanelBody;
    var Button = wp.components.Button;
    var TextControl = wp.components.TextControl;
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var __ = wp.i18n.__;

    console.log('Moreyeahs Slider Block: Registering block...');
    
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
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var slides = attributes.slides;

            function addSlide() {
                var newSlides = slides.slice();
                newSlides.push({
                    image: '',
                    subheading: '',
                    heading: '',
                    cta_text: '',
                    cta_url: ''
                });
                setAttributes({ slides: newSlides });
            }

            function updateSlide(index, field, value) {
                var newSlides = slides.slice();
                newSlides[index][field] = value;
                setAttributes({ slides: newSlides });
            }

            function removeSlide(index) {
                var newSlides = slides.filter(function(_, i) { return i !== index; });
                setAttributes({ slides: newSlides });
            }

            function moveSlide(index, direction) {
                var newSlides = slides.slice();
                var newIndex = index + direction;
                
                if (newIndex >= 0 && newIndex < slides.length) {
                    var temp = newSlides[index];
                    newSlides[index] = newSlides[newIndex];
                    newSlides[newIndex] = temp;
                    setAttributes({ slides: newSlides });
                }
            }

            // Build slide controls
            var slideControls = slides.map(function(slide, index) {
                return el('div', {
                    key: index,
                    style: {
                        marginBottom: '30px',
                        padding: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#f9f9f9'
                    }
                },
                    // Header with slide number and controls
                    el('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }
                    },
                        el('strong', {}, __('Slide', 'moreyeahs') + ' ' + (index + 1)),
                        el('div', {},
                            index > 0 && el(Button, {
                                isSmall: true,
                                onClick: function() { moveSlide(index, -1); },
                                style: { marginRight: '5px' }
                            }, '↑'),
                            index < slides.length - 1 && el(Button, {
                                isSmall: true,
                                onClick: function() { moveSlide(index, 1); },
                                style: { marginRight: '5px' }
                            }, '↓'),
                            el(Button, {
                                isDestructive: true,
                                isSmall: true,
                                onClick: function() { removeSlide(index); }
                            }, __('Remove', 'moreyeahs'))
                        )
                    ),
                    // Media upload
                    el(MediaUploadCheck, {},
                        el(MediaUpload, {
                            onSelect: function(media) { updateSlide(index, 'image', media.url); },
                            allowedTypes: ['image'],
                            value: slide.image,
                            render: function(obj) {
                                return el('div', { style: { marginBottom: '10px' } },
                                    el(Button, {
                                        onClick: obj.open,
                                        isSecondary: true,
                                        style: { marginBottom: '10px' }
                                    }, slide.image ? __('Change Image', 'moreyeahs') : __('Select Image', 'moreyeahs')),
                                    slide.image && el('div', {},
                                        el('img', {
                                            src: slide.image,
                                            alt: '',
                                            style: {
                                                width: '100%',
                                                height: 'auto',
                                                maxHeight: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }
                                        })
                                    )
                                );
                            }
                        })
                    ),
                    // Text controls
                    el(TextControl, {
                        label: __('Subheading', 'moreyeahs'),
                        value: slide.subheading,
                        onChange: function(value) { updateSlide(index, 'subheading', value); },
                        placeholder: __('Enter subheading...', 'moreyeahs')
                    }),
                    el(TextControl, {
                        label: __('Heading', 'moreyeahs'),
                        value: slide.heading,
                        onChange: function(value) { updateSlide(index, 'heading', value); },
                        placeholder: __('Enter heading...', 'moreyeahs')
                    }),
                    el(TextControl, {
                        label: __('CTA Text', 'moreyeahs'),
                        value: slide.cta_text,
                        onChange: function(value) { updateSlide(index, 'cta_text', value); },
                        placeholder: __('Read more', 'moreyeahs')
                    }),
                    el(TextControl, {
                        label: __('CTA URL', 'moreyeahs'),
                        value: slide.cta_url,
                        onChange: function(value) { updateSlide(index, 'cta_url', value); },
                        placeholder: __('https://...', 'moreyeahs')
                    })
                );
            });

            // Build preview thumbnails
            var previewThumbs = slides.map(function(slide, index) {
                return el('div', {
                    key: index,
                    style: {
                        padding: '10px',
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }
                },
                    slide.image && el('img', {
                        src: slide.image,
                        alt: '',
                        style: {
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '8px'
                        }
                    }),
                    el('div', {
                        style: { fontSize: '12px', fontWeight: 'bold' }
                    }, slide.heading || __('Slide', 'moreyeahs') + ' ' + (index + 1))
                );
            });

            return el(Fragment, {},
                // Inspector Controls (sidebar)
                el(InspectorControls, {},
                    el(PanelBody, {
                        title: __('Slider Settings', 'moreyeahs'),
                        initialOpen: true
                    },
                        el(Button, {
                            isPrimary: true,
                            onClick: addSlide,
                            style: { marginBottom: '20px' }
                        }, __('Add Slide', 'moreyeahs')),
                        slideControls
                    )
                ),
                // Editor preview
                el('div', {
                    className: 'moreyeahs-slider-editor',
                    style: {
                        padding: '40px',
                        background: '#f0f0f0',
                        border: '2px dashed #ccc',
                        textAlign: 'center'
                    }
                },
                    el('h3', {
                        style: { margin: '0 0 20px 0' }
                    }, __('Moreyeahs Slider', 'moreyeahs')),
                    
                    slides.length === 0 ? el('div', {},
                        el('p', {
                            style: { margin: '0 0 15px 0', color: '#666' }
                        }, __('No slides added yet', 'moreyeahs')),
                        el(Button, {
                            isPrimary: true,
                            onClick: addSlide
                        }, __('Add First Slide', 'moreyeahs'))
                    ) : el('div', {},
                        el('p', {
                            style: { margin: '0 0 10px 0', color: '#666' }
                        }, slides.length + ' ' + (slides.length === 1 ? __('slide', 'moreyeahs') : __('slides', 'moreyeahs'))),
                        el('div', {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '10px',
                                marginTop: '20px'
                            }
                        }, previewThumbs),
                        el(Button, {
                            isPrimary: true,
                            onClick: addSlide,
                            style: { marginTop: '20px' }
                        }, __('Add Another Slide', 'moreyeahs'))
                    )
                )
            );
        },

        save: function() {
            // Dynamic block - rendered by PHP
            return null;
        }
    });
    
    console.log('Moreyeahs Slider Block: Successfully registered!');
})(window.wp);
