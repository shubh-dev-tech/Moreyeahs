# Troubleshoot Stories & Blog Block

## Issue: Posts Show Blank When Selected

### Quick Diagnosis Steps

1. **Check if regular posts exist**:
   - Visit: `http://your-site.com/test-posts-and-case-studies.php`
   - If no posts exist, visit: `http://your-site.com/create-test-posts.php`

2. **Test API endpoints**:
   - Open browser console
   - Copy and paste the contents of `debug-stories-blog-block.js`
   - Run: `testStoriesBlogAPI()`

3. **Monitor component behavior**:
   - Open browser console
   - Run: `monitorStoriesBlogBlock()`
   - Reload the page with Stories & Blog Block
   - Check console for API calls and errors

### Common Causes & Solutions

#### 1. No Regular Posts Exist
**Symptoms**: Block shows "No posts found" when "Posts" is selected
**Solution**: Create some regular posts
```bash
# Visit: http://your-site.com/create-test-posts.php
# Click "Create Test Posts"
```

#### 2. API Endpoint Issues
**Symptoms**: Console shows API errors
**Solutions**:
- Check if WordPress REST API is enabled
- Verify permalink structure (Settings → Permalinks → Save Changes)
- Check for plugin conflicts

#### 3. Category Filter Issues
**Symptoms**: Posts show when no category selected, but disappear with category
**Solution**: Check if posts have categories assigned

#### 4. Caching Issues
**Symptoms**: Changes don't appear immediately
**Solutions**:
- Clear WordPress cache
- Clear browser cache
- Disable caching plugins temporarily

### Debug Console Commands

```javascript
// Test all API endpoints
testStoriesBlogAPI()

// Monitor component logs
monitorStoriesBlogBlock()

// Check block data
const blockElement = document.querySelector('.stories-blog-block-data');
console.log('Block data:', {
    postType: blockElement?.getAttribute('data-post-type'),
    category: blockElement?.getAttribute('data-category'),
    heading: blockElement?.getAttribute('data-heading')
});

// Test specific endpoint
fetch('/wp-json/wp/v2/posts?per_page=4&_embed=true')
    .then(r => r.json())
    .then(data => console.log('Posts:', data));
```

### API Call Flow

The component tries these endpoints in order:

1. **For Posts (`post_type: 'post'`)**:
   ```
   /wp-json/wp/v2/posts?per_page=4&_embed=true
   ```

2. **For Case Studies (`post_type: 'case_study'`)**:
   ```
   /wp-json/wp/v2/case_study?per_page=4&_embed=true
   ```

3. **Fallback (Custom Endpoint)**:
   ```
   POST /wp-json/wp/v2/posts-data
   Body: { post_type: 'post', per_page: 4 }
   ```

4. **Final Fallback**:
   ```
   /wp-json/wp/v2/posts?per_page=4&_embed=true (for posts)
   /wp-json/wp/v2/case_study?per_page=4&_embed=true (for case studies)
   ```

### Expected Console Output

When working correctly, you should see:
```
🎯 STORIES BLOG: Fetching posts from: /wp/v2/posts
🎯 STORIES BLOG: POST data: {per_page: 4, _embed: true, orderby: 'date', order: 'desc'}
🎯 STORIES BLOG: Category filter: 
🎯 STORIES BLOG: Post type: post
🎯 STORIES BLOG: Fetched posts: 4 posts
```

### Test Files Available

1. **test-posts-and-case-studies.php** - Comprehensive test of both post types
2. **create-test-posts.php** - Creates sample regular posts
3. **create-test-case-studies.php** - Creates sample case studies
4. **test-case-study-api.php** - Tests case study functionality
5. **test-acf-dynamic-fields.php** - Tests ACF field population
6. **debug-stories-blog-block.js** - Browser console debugging

### WordPress Admin Checks

1. **Posts Menu**:
   - Go to Posts → All Posts
   - Verify posts exist and are published
   - Check if posts have categories assigned

2. **Case Studies Menu**:
   - Go to Case Studies → All Case Studies
   - Verify case studies exist and are published
   - Check if case studies have categories assigned

3. **Categories**:
   - Go to Posts → Categories
   - Verify categories exist
   - Check category assignments

4. **Permalinks**:
   - Go to Settings → Permalinks
   - Click "Save Changes" to flush rewrite rules

### Network Tab Debugging

1. Open browser Developer Tools
2. Go to Network tab
3. Reload page with Stories & Blog Block
4. Look for API calls to:
   - `/wp-json/wp/v2/posts`
   - `/wp-json/wp/v2/case_study`
   - `/wp-json/wp/v2/posts-data`

5. Check response status and data

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "No posts found" | No posts exist or API failing | Create posts, check API |
| Console: 404 on API | Permalinks not flushed | Settings → Permalinks → Save |
| Console: 500 error | Server error | Check error logs |
| Blank/loading forever | JavaScript error | Check console for errors |

### Quick Fixes

1. **Flush Permalinks**: Settings → Permalinks → Save Changes
2. **Clear Cache**: Clear all caches (WordPress, browser, CDN)
3. **Check Posts**: Ensure posts exist and are published
4. **Test API**: Use test files to verify API functionality
5. **Console Debug**: Use debug script to monitor API calls

### Still Not Working?

If the issue persists:

1. Check WordPress error logs
2. Disable all plugins temporarily
3. Switch to default theme temporarily
4. Check server PHP error logs
5. Verify WordPress REST API is working: `/wp-json/wp/v2/posts`