/**
 * Admin JavaScript for Stories Blog Block
 * Handles dynamic category updates based on post type selection
 */

jQuery(document).ready(function($) {
    
    /**
     * Update categories when post type changes
     */
    function updateCategories(postType, categoryField) {
        if (!postType || categoryField.data('updating')) {
            return;
        }
        
        // Prevent multiple simultaneous updates
        categoryField.data('updating', true);
        
        // Show loading state
        categoryField.prop('disabled', true);
        var currentValue = categoryField.val();
        categoryField.html('<option value="">Loading categories...</option>');
        
        // Make AJAX request
        $.ajax({
            url: storiesBlogAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'update_categories',
                post_type: postType,
                nonce: storiesBlogAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Clear existing options
                    categoryField.empty();
                    
                    // Add new options
                    $.each(response.data, function(value, label) {
                        var option = $('<option>', {
                            value: value,
                            text: label
                        });
                        
                        // Restore previous selection if it exists
                        if (value === currentValue) {
                            option.prop('selected', true);
                        }
                        
                        categoryField.append(option);
                    });
                    
                    // Re-enable field
                    categoryField.prop('disabled', false);
                } else {
                    console.error('Failed to load categories:', response);
                    categoryField.html('<option value="">Error loading categories</option>');
                    categoryField.prop('disabled', false);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', error);
                categoryField.html('<option value="">Error loading categories</option>');
                categoryField.prop('disabled', false);
            },
            complete: function() {
                // Remove updating flag
                categoryField.removeData('updating');
            }
        });
    }
    
    /**
     * Handle post type change in ACF fields
     */
    function handlePostTypeChange() {
        // Find the post type and category fields using more specific selectors
        var postTypeField = $('select[data-name="post_type"]').first();
        var categoryField = $('select[data-name="category"]').first();
        
        if (postTypeField.length && categoryField.length && !postTypeField.data('stories-initialized')) {
            postTypeField.data('stories-initialized', true);
            
            // Update categories when post type changes
            postTypeField.off('change.stories-blog').on('change.stories-blog', function() {
                var selectedPostType = $(this).val();
                if (selectedPostType) {
                    updateCategories(selectedPostType, categoryField);
                }
            });
            
            // Initial load if post type is already selected
            var initialPostType = postTypeField.val();
            if (initialPostType) {
                setTimeout(function() {
                    updateCategories(initialPostType, categoryField);
                }, 500);
            }
        }
    }
    
    /**
     * Initialize when ACF is ready
     */
    if (typeof acf !== 'undefined') {
        acf.addAction('ready', function() {
            setTimeout(handlePostTypeChange, 100);
        });
        
        acf.addAction('append', function() {
            setTimeout(handlePostTypeChange, 100);
        });
    }
    
    // Also try immediate initialization
    setTimeout(handlePostTypeChange, 1000);
    
});