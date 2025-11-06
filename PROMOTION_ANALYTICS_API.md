# Promotion Analytics & Tracking API (Phase 2)

Internal analytics + public referral tracking endpoints.

- Internal base: `/api/internal/promotion/analytics`
- Public base: `/api/public`
- Auth: Internal endpoints require JWT (roles: `super_admin`, `admin`, `marketing`)
- Sources enum: `facebook | youtube | instagram | tiktok | whatsapp | threads | offline | sms_campaign | other`
- Device types: `mobile | desktop | tablet`

---

## Public Endpoints (no auth)

### Track referral click and redirect
GET `/ref?code=ABC123&post=5&source=facebook`

- Params
  - `code` (required): partner referral_code
  - `post` (optional): promotional post id
  - `source` (required): one of sources enum
- Behavior
  - Extracts IP, user-agent; determines device_type and browser
  - Uniqueness rule: same `referral_code` + `post_id` + `ip_address` + `user_agent` within last 24h => `is_unique = false`, else true
  - Creates analytics entry and redirects to post.target_url or `APP_URL`
- Response: HTTP 302 redirect

### Validate referral code
GET `/promotion/validate/:code`

Response
```
{
  "success": true,
  "data": { "valid": true, "partner": { "id": 1, "name": "ABC", "referral_code": "k9x2ab1" } },
  "timestamp": "..."
}
```

### Public post details
GET `/promotion/post/:id`

Response
```
{
  "success": true,
  "data": {
    "id": 5,
    "partner_id": 1,
    "partner_name": "ABC Influencer",
    "post_code": "q7m3p0c",
    "title": "EM Academy Offer",
    "description": "…",
    "post_platform": "facebook",
    "post_url": "https://fb.com/...",
    "target_url": "https://...",
    "is_active": true
  },
  "timestamp": "..."
}
```

---

## Internal Analytics (JWT auth)
Base: `/api/internal/promotion/analytics`

### Dashboard overview
GET `/dashboard`

Returns
```
{ "totalClicks": 1200, "totalConversions": 45, "partners": 8, "posts": 23 }
```

### Partner analytics
GET `/partner/:partnerId?from=2025-11-01&to=2025-11-30`

Returns
```
{
  "clicks": [ ClickRecord, ... ],
  "conversions": 12
}
```

### Post analytics
GET `/post/:postId?from=2025-11-01&to=2025-11-30`

Returns same shape as partner analytics.

### Source analytics (grouped)
GET `/source?from=2025-11-01&to=2025-11-30`

Returns
```
[
  { "source": "facebook", "clicks": 800, "conversions": 20 },
  { "source": "instagram", "clicks": 200, "conversions": 5 }
]
```

### Clicks by date range
GET `/clicks?from=2025-11-01&to=2025-11-30`

Returns
```
[ ClickRecord, ... ]
```

### Conversion rate
GET `/conversion-rate?from=2025-11-01&to=2025-11-30`

Returns
```
{ "total": 1200, "converted": 45, "rate": 3.75 }
```

### Top performers
GET `/top/partners?limit=10`
GET `/top/posts?limit=10`

Returns
```
[ { "partner_id": 1, "clicks": 500, "conversions": 15 }, ... ]
[ { "post_id": 5, "clicks": 220, "conversions": 7 }, ... ]
```

### Export report
GET `/export?format=csv|pdf&from=...&to=...`

- `csv`: returns `{ filePath }` to `/uploads/reports/...csv`
- `pdf`: placeholder implementation; CSV recommended

---

## Data Shapes

ClickRecord
```
{
  "id": 101,
  "partner_id": 1,
  "post_id": 5,
  "source": "facebook",
  "referral_code": "k9x2ab1",
  "post_code": "q7m3p0c",
  "ip_address": "1.2.3.4",
  "user_agent": "Mozilla/5.0 ...",
  "device_type": "mobile",
  "browser": "chrome",
  "city": null,
  "state": null,
  "country": null,
  "is_unique": true,
  "is_converted": false,
  "is_enquiry_submitted": false,
  "clicked_at": "2025-11-04T10:15:00Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Notes
- Public endpoints are safe to call cross-origin (CORS handled globally).
- Uniqueness window: 24 hours per (referral_code, post_id, ip_address, user_agent).
- Location resolution is currently stubbed and returns nulls.
- Rate limit the `/ref` endpoint at the gateway if needed.
