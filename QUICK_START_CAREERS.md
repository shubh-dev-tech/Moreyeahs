# Quick Start Guide - Careers Setup

## Step-by-Step Setup Instructions

### Step 1: Flush Permalinks (IMPORTANT!)
1. Log in to WordPress Admin
2. Go to **Settings > Permalinks**
3. Click **Save Changes** (don't change anything, just save)
4. This activates the careers post type

### Step 2: Verify Careers Post Type
1. Check your WordPress admin sidebar
2. You should see a new menu item: **Careers** (with a groups icon)
3. Click on it to verify it's working

### Step 3: Create ACF Field Group

#### Go to Custom Fields
1. In WordPress admin, go to **Custom Fields > Add New**
2. Title: `Career Details`

#### Add Fields (in order):

**Field 1: Background Image**
- Field Label: `Background Image`
- Field Name: `background_image`
- Field Type: `Image`
- Return Format: `Image Array`
- Click "Add Field"

**Field 2: Job Type**
- Field Label: `Job Type`
- Field Name: `job_type`
- Field Type: `Text`
- Placeholder: `e.g., Full-time`
- Click "Add Field"

**Field 3: Department**
- Field Label: `Department`
- Field Name: `department`
- Field Type: `Text`
- Placeholder: `e.g., Engineering`
- Click "Add Field"

**Field 4: Location**
- Field Label: `Location`
- Field Name: `location`
- Field Type: `Text`
- Placeholder: `e.g., Remote`
- Click "Add Field"

**Field 5: Job Sections (REPEATER)**
- Field Label: `Job Sections`
- Field Name: `job_sections`
- Field Type: `Repeater`
- Layout: `Block`
- Button Label: `Add Section`

  **Sub-field 5.1: Section Heading**
  - Field Label: `Section Heading`
  - Field Name: `section_heading`
  - Field Type: `Text`
  - Required: Yes
  
  **Sub-field 5.2: Section Content (NESTED REPEATER)**
  - Field Label: `Section Content`
  - Field Name: `section_content`
  - Field Type: `Repeater`
  - Layout: `Block`
  - Button Label: `Add Content Block`
  
    **Sub-field 5.2.1: Paragraph**
    - Field Label: `Paragraph`
    - Field Name: `paragraph`
    - Field Type: `Textarea`
    - Rows: 4
    
    **Sub-field 5.2.2: Bullet Points (NESTED REPEATER)**
    - Field Label: `Bullet Points`
    - Field Name: `bullet_points`
    - Field Type: `Repeater`
    - Layout: `Table`
    - Button Label: `Add Bullet Point`
    
      **Sub-field 5.2.2.1: Bullet Text**
      - Field Label: `Bullet Text`
      - Field Name: `bullet_text`
      - Field Type: `Text`
      - Required: Yes

#### Set Location Rule
1. Scroll down to "Location" section
2. Set rule: **Post Type** is equal to **Careers**
3. Click "Publish"

### Step 4: Create Your First Career Post

1. Go to **Careers > Add New**
2. Title: `Full Stack Developer - Engineering`

#### Fill in ACF Fields:

**Background Image:**
- Upload an image or use default

**Job Type:** `Engineering`

**Department:** `Engineering`

**Location:** `Remote`

**Job Sections:**

**Section 1:**
- Section Heading: `Overview`
- Add Content Block:
  - Paragraph: `We are looking for an experienced Full Stack Developer to join our Engineering team and contribute to the design, development, and delivery of innovative software solutions. In this role, you will work across the full stack building intuitive front-end experiences and website back-end services while collaborating closely with Product, Design, and other engineering teams.`
  - (Leave bullet points empty)

**Section 2:**
- Section Heading: `Responsibilities`
- Add Content Block:
  - (Leave paragraph empty)
  - Add Bullet Points:
    - `Develop and maintain front-end applications using React.`
    - `Build and support back-end services and APIs with Node.js.`
    - `Collaborate cross-functionally to translate requirements into technical solutions.`
    - `Write clean, maintainable, and well-tested code.`
    - `Debug, optimize, and improve application performance.`
    - `Participate in code reviews and engineering best practices.`
    - `Support deployment and ongoing maintenance of production systems.`

**Section 3:**
- Section Heading: `Requirements`
- Add Content Block:
  - (Leave paragraph empty)
  - Add Bullet Points:
    - `3+ years of experience with React and Node.js.`
    - `Strong understanding of TypeScript and state management.`
    - `Experience with PostgreSQL and/or MongoDB.`
    - `Solid knowledge of RESTful APIs.`
    - `Familiarity with Git and modern development workflows.`
    - `Ability to work independently and communicate effectively.`

**Section 4:**
- Section Heading: `What We Offer`
- Add Content Block:
  - (Leave paragraph empty)
  - Add Bullet Points:
    - `Competitive compensation`
    - `Flexible work environment`
    - `Opportunity to work on meaningful, production-scale products`
    - `Collaborative and supportive engineering culture`

3. Click **Publish**

### Step 5: Test the Frontend

1. Open your Next.js site
2. Navigate to `/careers`
3. You should see your job listing
4. Click on the job to see the detail page
5. Verify all sections and the application form are displaying correctly

### Step 6: Add More Jobs (Optional)

Create a few more sample jobs to test the filters:

**Application Developer (React Native) - Engineering**
- Job Type: `Engineering`
- Department: `Engineering`
- Location: `Hybrid`

**Senior Product Designer - Product**
- Job Type: `Product`
- Department: `Design`
- Location: `Remote`

**Product Manager - Product**
- Job Type: `Product`
- Department: `Product`
- Location: `On-Site`

**UI/UX Designer - Design**
- Job Type: `Design`
- Department: `Design`
- Location: `Remote`

**Digital Marketer - Marketing**
- Job Type: `Marketing`
- Department: `Marketing`
- Location: `Remote`

### Step 7: Test Filters

1. Go to `/careers`
2. Try filtering by:
   - Experience Level
   - Department
   - Job Type
3. Verify the job count updates
4. Verify the correct jobs are displayed

## Troubleshooting

### Careers menu not showing in WordPress admin?
- Go to Settings > Permalinks and click Save Changes
- Refresh your WordPress admin page

### ACF fields not showing on career posts?
- Make sure the Location Rule is set to "Post Type is equal to Careers"
- Check that ACF plugin is activated

### Jobs not showing on frontend?
- Verify the WordPress REST API is working: Visit `/wp-json/wp/v2/careers`
- Check browser console for errors
- Verify Next.js is running

### 404 error on career detail pages?
- Flush permalinks in WordPress (Settings > Permalinks > Save)
- Restart your Next.js development server

## REST API Endpoints

Test these in your browser:
- All careers: `https://your-site.com/wp-json/wp/v2/careers`
- Single career: `https://your-site.com/wp-json/wp/v2/careers?slug=full-stack-developer-engineering`

## Default Background Image

If you don't upload a background image, this default will be used:
`https://dev.moreyeahs.com/wp-content/uploads/2026/02/Group-1000001836.webp`

## Need Help?

Refer to these detailed guides:
- `CAREERS_ACF_SETUP.md` - Complete ACF field setup guide
- `CAREERS_IMPLEMENTATION_SUMMARY.md` - Full implementation details
