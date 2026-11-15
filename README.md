# Nestly Co-Living — Multi-Page Website & Resident/Admin Portal (v1.0.0)

> *"Live well. Grow together."*

**Nestly Co-Living** is a complete, award-level, multi-page HTML5, CSS3, and vanilla ES6+ JavaScript website and portal crafted for a **Co-Living Space for Young Professionals**.

---

## 1. Architecture & Page Inventory (38 Pages)

### Public Pages (22 Pages at Root)
- `index.html` — **Home 1 ("Community Collage" Direction)**: Split hero with 4-tile rotated photo collage mosaic, floating glass availability bar, marquee perks strip, 3 tilt value cards, horizontal scroll-snap shared spaces gallery, 4-step move-in timeline, featured rooms, animated counters, resident stories, and pure CSS device mockup.
- `home-2.html` — **Home 2 ("Day in the Life" Direction)**: Fullscreen Ken Burns hero with centered typography & bottom glass search bar, partner wordmarks, sticky scroll "A Day at Nestly" chapters (Morning, Work, Evening, Weekend), mixed-span Bento grid, interactive "Renting Alone vs. Living at Nestly" toggle, live savings calculator, neighbourhood tabs, RSVP events, awards + 4-FAQ teaser, and newsletter signup.
- `rooms.html` — Live filtering by neighbourhood, room type, budget slider, and sort order + 12 unique tilt room cards + Compare Rooms tray (up to 3) + wishlist.
- `room-details.html` — Multi-photo lightbox gallery, architectural zoning floor plan, floor neighbour profiles, specs, sticky reservation sidebar, and similar suites.
- `amenities.html` — Category tabs, 6 detailed zones, floor-by-floor architecture overview, and Included vs. Optional Add-Ons comparison table.
- `community.html` — Manifesto, 5 resident-led interest clubs, upcoming RSVP events, 4 member spotlights, and 6-photo community wall.
- `pricing.html` — 1 / 6 / 12-month interactive billing toggle, 3 plan tiers, full comparison table, and 48-hour escrow deposit breakdown.
- `book-now.html` — 5-step interactive reservation & tour wizard with per-step validation and live summary sidebar.
- `gallery.html` — 12 unique photographs with category filters (`Rooms`, `Common Areas`, `Events`, `Neighbourhood`) and keyboard-accessible lightbox.
- `locations.html` — 3 Bengaluru house cards (`Indiranagar`, `Koramangala`, `HSR Layout`), map preview, and tech-park commute matrix.
- `about.html` — Founding story, leadership profiles, live-in House Captains, and solar/water sustainability commitments.
- `blog.html` & `blog-details.html` — Editorial journal listing and full long-form article with table of contents, author bio, related reads, and comment validation.
- `faq.html` — 12 detailed accordions across 6 categories with instant search-as-you-type filtering.
- `contact.html` — Direct inquiry & partnership form (with file upload), flagship lounge hours, and contact cards.
- `login.html`, `register.html`, `forgot-password.html` — Split-screen resident authentication pages with show/hide password and demo session redirect.
- `404.html`, `coming-soon.html`, `privacy-policy.html`, `terms.html` — Utility and legal pages.

### Resident Dashboard (`/dashboard/` — 8 Pages)
- `dashboard/dashboard.html` — Overview of rent status, active tickets, upcoming pod slot, and telemetry chart.
- `dashboard/pay-rent.html` — Interactive 1-click rent payment (`localStorage`-backed), escrow status, and downloadable PDF/TXT receipts.
- `dashboard/maintenance.html` — Ticket submission form with live table prepend and SLA timeline.
- `dashboard/amenity-booking.html` — Interactive time-slot picker for Zoom pods, laundry, gym, and cinema deck.
- `dashboard/community-board.html` — House events RSVP and live roommate notice posting.
- `dashboard/messages.html` — Real-time simulated chat with House Captain Karthik + parcel locker alerts.
- `dashboard/documents.html` — Signed residency agreement download, DigiLocker e-KYC slip, and encrypted document upload.
- `dashboard/profile-settings.html` — Profile editor, smart door PIN, Dark/Light theme toggle, and RTL layout toggle.

### Admin Operations Portal (`/admin/` — 8 Pages)
- `admin/overview.html`, `admin/residents.html`, `admin/rooms-occupancy.html`, `admin/payments.html`, `admin/maintenance-queue.html`, `admin/bookings.html`, `admin/announcements.html`, `admin/reports.html`.

---

## 2. Design System ("Warm Modern Home")

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0F2B2A` | Deep forest-teal primary dark, headings, footer |
| `--teal` | `#14746F` | Primary brand accent |
| `--clay` | `#E2674A` | Terracotta main CTA accent |
| `--saffron` | `#F5B84B` | Highlights, badges, rating stars |
| `--sage` | `#BFD8C5` | Soft botanical surfaces |
| `--cream` | `#FBF6EE` | Warm editorial page background |
| `--sand` | `#F1E7D6` | Alternate section background |
| `--mist` | `#E9F1EE` | Light card surface |

---

## 3. Customization & Owner Input Checklist (`TODO` Points)

Search for `TODO:` across the repository to configure:
1. **Brand Name & Tagline**: Update `Nestly Co-Living` and `Live well. Grow together.` in header/footer.
2. **Form Endpoints**: Connect Formspree / Netlify Forms in `contact.html`.
3. **Newsletter API**: Connect Mailchimp / ConvertKit in `home-2.html` and footer forms.
4. **Google Maps API Key**: Replace map placeholder containers in `home-2.html` and `locations.html`.
5. **Payment Gateways**: Connect Stripe / Razorpay UPI / PayPal checkout keys in `book-now.html` and `dashboard/pay-rent.html`.
