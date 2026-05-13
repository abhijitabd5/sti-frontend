# Promotion - Create Link Module - UI Component Guide

## Create Referral Link Flow

### Generating a Referral Link
1. Admin navigates to Create Referral Link page
2. Selects source from dropdown (Facebook/Instagram/YouTube/etc.)
3. Selects partner from dropdown (shows referral code)
4. Optionally selects post from dropdown (filtered by partner)
5. Link is auto-generated in real-time
6. Admin clicks "Copy" button to copy link
7. Success tooltip shows "Link copied"

---

## API Endpoints

### Partners
- `GET /internal/promotion/partners` - Get active partners list

### Posts
- `GET /internal/promotion/partners/:partnerId/posts` - Get posts by partner

---

## Create Referral Link Page (`/admin/promotion/links/create`)

### Page Header
- **Title**: "Create Referral Link"
- **Subtitle**: "Generate a referral link by selecting source, partner, and post"

### Form Section

**Fields (3 columns):**

1. **Select Source** (dropdown, required)
   - Options: Facebook, Instagram, YouTube, TikTok, WhatsApp, Threads, Offline, SMS Campaign, Other
   - Default: Facebook

2. **Select Partner** (dropdown, required)
   - Shows: Partner Name (Referral Code)
   - Loading state: "Loading..."
   - Empty state: "Select Partner"
   - Populated from active partners

3. **Select Post** (dropdown, optional)
   - Disabled until partner is selected
   - Shows: Post Title
   - Loading state: "Loading..."
   - Empty state: "Select partner first" or "Select Post"
   - Filtered by selected partner

### Generated Link Section

**Fields:**
- **Generated Link** (readonly input)
  - Placeholder: "Select source, partner and post to generate link"
  - Shows full URL when source and partner are selected
  - Format: `{BASE_URL}/ref?source={source}&code={referral_code}&post={post_id}`
  - Copy button on the right side

**Copy Button:**
- Label: "Copy" (changes to "Copied!" on success)
- Icon: Clipboard icon
- Color: Blue gradient (changes to green on success)
- Disabled when no link generated
- Shows tooltip "Link copied" on success (1.2 seconds)

**Link Preview:**
- Shows full URL below input field
- Text size: Extra small
- Color: Gray
- Word break: Break all

---

## Link Generation Logic

### Link becomes active when:
- Source is selected (required)
- Partner is selected (required)
- Post is optional

### URL Structure:
```
{BASE_URL}/ref?source={source}&code={referral_code}&post={post_id}
```

**Parameters:**
- `source`: Selected source (facebook, instagram, etc.)
- `code`: Partner's referral code
- `post`: Post ID (optional, only if post selected)

---

## Field Behavior

### Source Dropdown
- Always enabled
- Pre-selected with "facebook"
- Changes trigger link regeneration

### Partner Dropdown
- Always enabled
- Shows loading state while fetching partners
- Displays partner name with referral code in parentheses
- Changes trigger:
  - Link regeneration
  - Post dropdown reset
  - Post list reload

### Post Dropdown
- Disabled until partner is selected
- Shows loading state while fetching posts
- Filtered by selected partner
- Changes trigger link regeneration
- Optional field

### Copy Button
- Disabled when link is empty
- Copies link to clipboard
- Shows success state for 1.2 seconds
- Displays tooltip on success

---

## Notes
- Link generation is real-time (no submit button needed)
- Base URL comes from environment variable `VITE_PROMOTION_BASE_URL`
- Partners list filtered to show only active partners
- Posts list shows up to 500 posts per partner
- Copy functionality uses browser's clipboard API
- Success feedback via button color change and tooltip
