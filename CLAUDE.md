# CLAUDE.md — SpCare বাংলাদেশ জেলা সুপার অ্যাপ

## Master Agent Directive v3.0

-----

> ## ⚠️ এজেন্টের জন্য বাধ্যতামূলক নির্দেশনা
> 
> 1. **এই পুরো ফাইলটি প্রথমে সম্পূর্ণ পড়বে** — কোনো কোড লেখার আগে
> 1. **`## CURRENT STATUS`** সেকশন দেখবে — কোথা থেকে শুরু করতে হবে
> 1. **`PROGRESS.md`** দেখবে — আগের সেশনে কী হয়েছে
> 1. **`CODEX.md`** দেখবে — কোড লেখার আগে pattern চেক করবে
> 1. **কাজ শেষে** SESSION LOG + PROGRESS.md আপডেট করবে
> 1. **একটি সেশনে সর্বোচ্চ ২টি major task** নেবে

-----

## 1. PROJECT IDENTITY

|Field             |Value                             |
|------------------|----------------------------------|
|**App Name**      |SpCare                            |
|**Full Name**     |SpCare — বাংলাদেশ জেলা সুপার অ্যাপ          |
|**Type**          |Mobile-First PWA Super App        |
|**Architecture**  |Multi-District (Future-Ready)     |
|**Pilot District**|শেরপুর (Seed Data Only)             |
|**Language**      |বাংলা (Primary) + English (Secondary)|
|**Design Theme**  |Forest Green `#2D6A4F` — প্রকৃতি অনুপ্রাণিত|
|**Target Device** |Android/iOS Mobile (375px minimum)|

### Multi-District Strategy

```
এখন   → শেরপুর দিয়ে শুরু, সব কিছু districtId দিয়ে design
পরে   → যেকোনো জেলা যোগ করা যাবে, শুধু seed data দিলেই হবে
কখনো → App এর নাম বা core architecture পরিবর্তন করবে না
```

-----

## 2. TECH STACK

> ⛔ এই স্ট্যাক পরিবর্তন করা সম্পূর্ণ নিষিদ্ধ।
> নতুন library লাগলে আগে PROGRESS.md-তে justify করে লিখবে।

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Framework   : Next.js 14 (App Router) + TypeScript
Styling     : Tailwind CSS v3
Components  : shadcn/ui
State       : Zustand
Forms       : React Hook Form + Zod
HTTP        : Axios
Font BN     : Noto Sans Bengali (Google Fonts)
Font EN     : Geist (Vercel)
Icons       : Lucide React
Animation   : Framer Motion (subtle only)
Maps        : Google Maps JavaScript API

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Runtime     : Node.js + Express.js (TypeScript)
Database    : PostgreSQL
ORM         : Prisma
Auth        : NextAuth.js v5
Validation  : Zod (সব input)
Email OTP   : Nodemailer + custom OTP logic
Rate Limit  : express-rate-limit
Security    : Helmet.js + CORS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Images      : Cloudinary (upload + CDN)
Push Notif  : Firebase Cloud Messaging (FCM)
Maps/Geo    : Google Maps Platform API
Deploy FE   : Vercel
Deploy BE   : Railway
DB Host     : Railway PostgreSQL
```

-----

## 3. FOLDER STRUCTURE

```
spcare/                                    ← Root (Monorepo)
│
├── 📄 CLAUDE.md                           ← এই ফাইল (Master Directive)
├── 📄 PROGRESS.md                         ← প্রতিদিনের কাজের লগ
├── 📄 CODEX.md                            ← কোড প্যাটার্ন রেফারেন্স
├── 📄 package.json                        ← Root (workspaces config)
├── 📄 .env.example                        ← সব ENV variables template
├── 📄 .gitignore
│
├── 📁 apps/
│   │
│   ├── 📁 web/                            ← Next.js Frontend
│   │   ├── 📄 package.json
│   │   ├── 📄 next.config.js
│   │   ├── 📄 tailwind.config.ts          ← Design tokens (colors, spacing)
│   │   ├── 📄 tsconfig.json
│   │   │
│   │   ├── 📁 app/                        ← Next.js App Router
│   │   │   │
│   │   │   ├── 📄 layout.tsx              ← Root layout (fonts, providers)
│   │   │   ├── 📄 not-found.tsx           ← 404 page (বাংলায়)
│   │   │   ├── 📄 error.tsx               ← Error boundary
│   │   │   │
│   │   │   ├── 📁 (auth)/                 ← Auth pages (Bottom Nav নেই)
│   │   │   │   ├── 📄 layout.tsx          ← Minimal auth layout
│   │   │   │   ├── 📁 login/
│   │   │   │   │   └── 📄 page.tsx        ← Google + Email OTP login
│   │   │   │   ├── 📁 register/
│   │   │   │   │   └── 📄 page.tsx        ← নতুন account তৈরি
│   │   │   │   └── 📁 verify-otp/
│   │   │   │       └── 📄 page.tsx        ← 6-digit OTP screen
│   │   │   │
│   │   │   ├── 📁 (main)/                 ← Main App (TopBar + BottomNav)
│   │   │   │   ├── 📄 layout.tsx          ← Main shell layout
│   │   │   │   │
│   │   │   │   ├── 📄 page.tsx            ← 🏠 HOME
│   │   │   │   │                             Hero banner (swipeable)
│   │   │   │   │                             Emergency bar (999, 199)
│   │   │   │   │                             Service grid (6 icons)
│   │   │   │   │                             Recent community posts
│   │   │   │   │
│   │   │   │   ├── 📁 tourism/            ← 🌿 পর্যটন
│   │   │   │   │   ├── 📄 page.tsx        ← 2-column grid list
│   │   │   │   │   └── 📁 [slug]/
│   │   │   │   │       └── 📄 page.tsx    ← বিস্তারিত (hero img, gallery)
│   │   │   │   │
│   │   │   │   ├── 📁 hospitals/          ← 🏥 হাসপাতাল
│   │   │   │   │   ├── 📄 page.tsx        ← list (সরকারি/বেসরকারি filter)
│   │   │   │   │   └── 📁 [id]/
│   │   │   │   │       └── 📄 page.tsx    ← বিস্তারিত (specialty, beds)
│   │   │   │   │
│   │   │   │   ├── 📁 emergency/          ← 🚨 জরুরি সেবা
│   │   │   │   │   └── 📄 page.tsx        ← One-tap call বাটন
│   │   │   │   │
│   │   │   │   ├── 📁 donors/             ← 🩸 রক্তদান
│   │   │   │   │   ├── 📄 page.tsx        ← list + bloodType filter
│   │   │   │   │   └── 📁 [id]/
│   │   │   │   │       └── 📄 page.tsx    ← দাতার প্রোফাইল
│   │   │   │   │
│   │   │   │   ├── 📁 community/          ← 💬 কমিউনিটি ফিড
│   │   │   │   │   ├── 📄 page.tsx        ← feed (type filter tabs)
│   │   │   │   │   ├── 📁 [id]/
│   │   │   │   │   │   └── 📄 page.tsx    ← পোস্ট + কমেন্ট
│   │   │   │   │   └── 📁 new/
│   │   │   │   │       └── 📄 page.tsx    ← নতুন পোস্ট ফর্ম
│   │   │   │   │
│   │   │   │   ├── 📁 services/           ← 📋 সব সার্ভিস directory
│   │   │   │   │   └── 📄 page.tsx        ← Full grid (Phase 2 modules)
│   │   │   │   │
│   │   │   │   ├── 📁 search/             ← 🔍 গ্লোবাল সার্চ
│   │   │   │   │   └── 📄 page.tsx        ← multi-category results
│   │   │   │   │
│   │   │   │   ├── 📁 notifications/      ← 🔔 নোটিফিকেশন
│   │   │   │   │   └── 📄 page.tsx        ← notification list (isRead)
│   │   │   │   │
│   │   │   │   └── 📁 profile/            ← 👤 প্রোফাইল
│   │   │   │       ├── 📄 page.tsx        ← নিজের প্রোফাইল
│   │   │   │       ├── 📁 edit/
│   │   │   │       │   └── 📄 page.tsx    ← এডিট (name, phone, photo)
│   │   │   │       └── 📁 saved/
│   │   │   │           └── 📄 page.tsx    ← saved items by type
│   │   │   │
│   │   │   └── 📁 api/
│   │   │       └── 📁 auth/[...nextauth]/
│   │   │           └── 📄 route.ts        ← NextAuth handler
│   │   │
│   │   ├── 📁 components/
│   │   │   │
│   │   │   ├── 📁 ui/                     ← shadcn/ui (auto-generated, touch করবে না)
│   │   │   │   ├── 📄 button.tsx
│   │   │   │   ├── 📄 card.tsx
│   │   │   │   ├── 📄 input.tsx
│   │   │   │   ├── 📄 badge.tsx
│   │   │   │   ├── 📄 skeleton.tsx
│   │   │   │   ├── 📄 sheet.tsx
│   │   │   │   ├── 📄 dialog.tsx
│   │   │   │   ├── 📄 tabs.tsx
│   │   │   │   ├── 📄 avatar.tsx
│   │   │   │   └── 📄 toast.tsx
│   │   │   │
│   │   │   ├── 📁 layout/                 ← App shell
│   │   │   │   ├── 📄 BottomNav.tsx       ← নিচের nav (60px, 5 items + FAB)
│   │   │   │   ├── 📄 TopBar.tsx          ← উপরের bar (56px, title + icons)
│   │   │   │   ├── 📄 PageWrapper.tsx     ← Padding + safe area
│   │   │   │   └── 📄 Providers.tsx       ← Session + Zustand + Toast
│   │   │   │
│   │   │   ├── 📁 cards/                  ← Reusable cards
│   │   │   │   ├── 📄 ServiceCard.tsx     ← Tourism/Hospital/Bank সব এটা
│   │   │   │   ├── 📄 ServiceCardSkeleton.tsx
│   │   │   │   ├── 📄 HeroCard.tsx        ← Home hero banner
│   │   │   │   ├── 📄 PostCard.tsx        ← Community post
│   │   │   │   └── 📄 DonorCard.tsx       ← Blood donor
│   │   │   │
│   │   │   ├── 📁 shared/                 ← সব জায়গায় ব্যবহার হয়
│   │   │   │   ├── 📄 EmptyState.tsx      ← "কোনো তথ্য নেই"
│   │   │   │   ├── 📄 ErrorState.tsx      ← Error + retry button
│   │   │   │   ├── 📄 LoadingSpinner.tsx
│   │   │   │   ├── 📄 RatingStars.tsx     ← Star rating (read-only)
│   │   │   │   ├── 📄 ImageGallery.tsx    ← Horizontal scroll
│   │   │   │   ├── 📄 MapButton.tsx       ← Opens Google Maps
│   │   │   │   ├── 📄 CallButton.tsx      ← tel: link button
│   │   │   │   ├── 📄 ShareButton.tsx     ← Web Share API
│   │   │   │   ├── 📄 SaveButton.tsx      ← Bookmark toggle
│   │   │   │   └── 📄 SearchBar.tsx       ← Debounced search input
│   │   │   │
│   │   │   └── 📁 modules/                ← Feature-specific components
│   │   │       ├── 📁 home/
│   │   │       │   ├── 📄 HeroBanner.tsx       ← Swipeable carousel
│   │   │       │   ├── 📄 EmergencyBar.tsx     ← Quick 999/199 buttons
│   │   │       │   ├── 📄 ServiceGrid.tsx      ← 6-icon grid
│   │   │       │   └── 📄 RecentPosts.tsx      ← Last 3 posts
│   │   │       ├── 📁 community/
│   │   │       │   ├── 📄 PostFeed.tsx         ← Feed + type filter tabs
│   │   │       │   ├── 📄 PostTypeBadge.tsx    ← NEWS/SOS/BLOOD badge
│   │   │       │   ├── 📄 NewPostForm.tsx      ← Create post (type select)
│   │   │       │   └── 📄 CommentSection.tsx
│   │   │       ├── 📁 donors/
│   │   │       │   ├── 📄 BloodTypeFilter.tsx  ← A+/B+/O+ buttons
│   │   │       │   └── 📄 DonorList.tsx
│   │   │       └── 📁 auth/
│   │   │           ├── 📄 LoginForm.tsx
│   │   │           ├── 📄 OtpInput.tsx         ← 6-digit OTP boxes
│   │   │           └── 📄 GoogleButton.tsx
│   │   │
│   │   ├── 📁 lib/
│   │   │   ├── 📄 auth.ts                 ← NextAuth config
│   │   │   ├── 📄 api.ts                  ← Axios instance + interceptors
│   │   │   ├── 📄 cloudinary.ts           ← Image upload
│   │   │   ├── 📄 maps.ts                 ← Directions URL builder
│   │   │   ├── 📄 fcm.ts                  ← Push notification
│   │   │   ├── 📄 strings.ts              ← Bengali UI text constants
│   │   │   └── 📄 utils.ts                ← cn(), formatDate(), slugify()
│   │   │
│   │   ├── 📁 store/                      ← Zustand stores
│   │   │   ├── 📄 useAuthStore.ts         ← User + session
│   │   │   ├── 📄 useDistrictStore.ts     ← Active district
│   │   │   ├── 📄 useTourismStore.ts
│   │   │   ├── 📄 useHospitalStore.ts
│   │   │   ├── 📄 useDonorStore.ts
│   │   │   ├── 📄 usePostStore.ts
│   │   │   └── 📄 useSavedStore.ts
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 useGeolocation.ts       ← User location
│   │   │   ├── 📄 useInfiniteScroll.ts    ← Infinite feed
│   │   │   └── 📄 useDebounce.ts          ← Search input delay
│   │   │
│   │   ├── 📁 types/
│   │   │   └── 📄 index.ts                ← Frontend-only types
│   │   │
│   │   └── 📁 public/
│   │       ├── 📄 manifest.json           ← PWA manifest
│   │       ├── 📄 sw.js                   ← Service Worker (offline cache)
│   │       └── 📁 icons/                  ← PWA app icons
│   │
│   │
│   └── 📁 api/                            ← Express.js Backend
│       ├── 📄 package.json
│       ├── 📄 tsconfig.json
│       │
│       ├── 📁 src/
│       │   │
│       │   ├── 📄 index.ts                ← Server entry (port 4000)
│       │   │
│       │   ├── 📁 routes/                 ← HTTP route definitions (얇게)
│       │   │   ├── 📄 index.ts            ← সব route এখানে register
│       │   │   ├── 📄 auth.ts             ← /api/auth
│       │   │   ├── 📄 users.ts            ← /api/users
│       │   │   ├── 📄 districts.ts        ← /api/districts
│       │   │   ├── 📄 tourism.ts          ← /api/tourism
│       │   │   ├── 📄 hospitals.ts        ← /api/hospitals
│       │   │   ├── 📄 emergency.ts        ← /api/emergency
│       │   │   ├── 📄 donors.ts           ← /api/donors
│       │   │   ├── 📄 posts.ts            ← /api/posts
│       │   │   ├── 📄 comments.ts         ← /api/comments
│       │   │   ├── 📄 banks.ts            ← /api/banks
│       │   │   ├── 📄 pharmacies.ts       ← /api/pharmacies
│       │   │   ├── 📄 hotels.ts           ← /api/hotels
│       │   │   ├── 📄 transport.ts        ← /api/transport
│       │   │   ├── 📄 education.ts        ← /api/education
│       │   │   ├── 📄 government.ts       ← /api/government
│       │   │   ├── 📄 jobs.ts             ← /api/jobs
│       │   │   ├── 📄 saved.ts            ← /api/saved
│       │   │   ├── 📄 notifications.ts    ← /api/notifications
│       │   │   ├── 📄 upload.ts           ← /api/upload
│       │   │   └── 📄 admin.ts            ← /api/admin (ADMIN only)
│       │   │
│       │   ├── 📁 services/               ← Business logic (routes থেকে আলাদা)
│       │   │   ├── 📄 otpService.ts       ← OTP generate + email send
│       │   │   ├── 📄 fcmService.ts       ← Push notification
│       │   │   ├── 📄 cloudinaryService.ts← Image upload/delete
│       │   │   └── 📄 auditService.ts     ← AuditLog write helper
│       │   │
│       │   ├── 📁 middleware/
│       │   │   ├── 📄 auth.ts             ← Session/JWT verify
│       │   │   ├── 📄 requireRole.ts      ← requireRole('ADMIN') etc.
│       │   │   ├── 📄 validate.ts         ← Zod request validation
│       │   │   ├── 📄 rateLimit.ts        ← Rate limiting per route
│       │   │   └── 📄 errorHandler.ts     ← Global error → JSON response
│       │   │
│       │   └── 📁 lib/
│       │       ├── 📄 prisma.ts           ← Prisma client singleton
│       │       └── 📄 mailer.ts           ← Nodemailer config
│       │
│       └── 📁 prisma/
│           ├── 📄 schema.prisma           ← সব database models
│           ├── 📁 migrations/             ← Auto-generated
│           └── 📁 seed/
│               ├── 📄 index.ts            ← Seed runner
│               └── 📄 sherpur.ts          ← শেরপুরের real data
│
│
└── 📁 packages/
    └── 📁 types/                          ← Frontend + Backend shared types
        ├── 📄 package.json
        └── 📄 index.ts
```

-----

## 4. USER ROLES & AUTH

### Role Hierarchy (উপরে = বেশি permission)

```
SUPER_ADMIN    → সব কিছুর অ্যাক্সেস, সব জেলা manage
ADMIN          → একটি জেলার সব কিছু manage, audit log দেখা
MODERATOR      → পোস্ট approve/reject, report handle
BUSINESS_OWNER → নিজের business listing manage
VERIFIED_USER  → ভেরিফাইড ব্যাজ সহ সাধারণ ইউজার
USER           → Default — যেকোনো নতুন account
```

### Auth Methods (তিনটি)

```
1. Google OAuth     → one-click signup/login
2. Email + Password → traditional
3. Email OTP        → passwordless (6-digit, 10 min expiry)
```

### OTP Flow

```
Register:
  Email দাও → POST /api/auth/send-otp → Email আসবে →
  OTP দাও  → POST /api/auth/verify-otp → Account তৈরি

Login (OTP):
  Email দাও → POST /api/auth/send-otp → Email আসবে →
  OTP দাও  → POST /api/auth/verify-otp → Logged in
```

-----

## 5. DATABASE MODELS (সম্পূর্ণ)

> **Rule:** সব location-based model-এ `districtId` থাকবে — multi-district এর জন্য।

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORE / AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User
  id            Int
  name          String
  email         String       @unique
  phone         String?
  image         String?
  role          UserRole     @default(USER)
  isVerified    Boolean      @default(false)
  emailVerified DateTime?
  createdAt     DateTime
  updatedAt     DateTime
  → accounts[], sessions[], posts[], comments[]
  → savedItems[], notifications[], preference

UserRole (enum)
  USER | VERIFIED_USER | BUSINESS_OWNER | MODERATOR | ADMIN | SUPER_ADMIN

Account (NextAuth — touch করবে না)
  id, userId, provider, providerAccountId, ...tokens

Session (NextAuth — touch করবে না)
  id, sessionToken, userId, expires

OtpCode
  id         Int
  email      String
  code       String       (6-digit)
  expiresAt  DateTime     (createdAt + 10 min)
  used       Boolean      @default(false)
  createdAt  DateTime

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEOGRAPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
District
  id         Int
  name       String        (English)
  nameBn     String        (বাংলা)
  division   String
  latitude   Float
  longitude  Float
  isActive   Boolean       @default(true)

Upazila
  id         Int
  name       String
  nameBn     String
  districtId Int
  → district

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMUNITY / SOCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Post
  id         Int
  title      String?
  content    String
  images     String[]
  type       PostType      @default(GENERAL)
  status     PostStatus    @default(APPROVED)
  userId     Int
  districtId Int
  upazilaId  Int?
  createdAt  DateTime
  updatedAt  DateTime
  → user, comments[], reactions[], savedBy[]

PostType (enum)
  GENERAL | NEWS | LOST_FOUND | EMERGENCY | BLOOD_REQUEST | JOB | EVENT

PostStatus (enum)
  PENDING | APPROVED | REJECTED | REMOVED

Comment
  id         Int
  content    String
  userId     Int
  postId     Int
  parentId   Int?          (self-reference — reply to comment)
  createdAt  DateTime
  → user, post, parent, replies[]

Reaction
  id         Int
  type       ReactionType
  userId     Int
  postId     Int
  @@unique([userId, postId])   ← একজন user একটি post এ একটি reaction

ReactionType (enum)
  LIKE | LOVE | SAD | ANGRY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEALTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hospital
  id           Int
  name         String
  type         HospitalType
  address      String
  latitude     Float
  longitude    Float
  phone        String?
  emergency    String?       (জরুরি নম্বর)
  specialty    String?
  openingHours String?
  beds         Int?
  images       String[]
  rating       Float         @default(0)
  districtId   Int

HospitalType (enum)
  GOVERNMENT | PRIVATE | CLINIC | DIAGNOSTIC

BloodDonor
  id           Int
  name         String
  phone        String
  bloodType    BloodType
  lastDonation DateTime
  isAvailable  Boolean       @default(true)
  districtId   Int
  upazilaId    Int?
  userId       Int?          (optional — registered user হলে)

BloodType (enum)
  A_POS | A_NEG | B_POS | B_NEG | AB_POS | AB_NEG | O_POS | O_NEG

Pharmacy
  id           Int
  name         String
  address      String
  latitude     Float
  longitude    Float
  phone        String?
  openingHours String?
  isOpen24h    Boolean       @default(false)
  districtId   Int

EmergencyContact
  id           Int
  type         EmergencyType
  name         String
  phone        String
  districtId   Int

EmergencyType (enum)
  POLICE | AMBULANCE | FIRE | HOSPITAL | OTHER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOURISM & HOSPITALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TourismSpot
  id           Int
  name         String
  nameBn       String
  slug         String        @unique
  description  String?
  address      String
  latitude     Float
  longitude    Float
  openingHours String?
  entryFee     String?
  phone        String?
  images       String[]
  rating       Float         @default(0)
  districtId   Int

Accommodation                ← Hotel + Resort + GuestHouse একসাথে
  id           Int
  name         String
  type         AccomType
  address      String
  latitude     Float
  longitude    Float
  phone        String?
  priceRange   String?       (৫০০-১৫০০ টাকা)
  amenities    String[]
  images       String[]
  rating       Float         @default(0)
  districtId   Int

AccomType (enum)
  HOTEL | RESORT | GUESTHOUSE | OTHER

Restaurant
  id           Int
  name         String
  address      String
  latitude     Float
  longitude    Float
  phone        String?
  cuisine      String?
  priceRange   String?
  images       String[]
  rating       Float         @default(0)
  districtId   Int

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCE & SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bank
  id              Int
  name            String
  branchName      String
  address         String
  latitude        Float
  longitude       Float
  phone           String?
  services        String[]
  hasCashDeposit  Boolean   @default(false)
  districtId      Int

ATM
  id          Int
  bankName    String
  address     String
  latitude    Float
  longitude   Float
  isActive    Boolean       @default(true)
  districtId  Int

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRANSPORT & INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transport
  id         Int
  name       String
  type       TransportType
  address    String
  latitude   Float
  longitude  Float
  phone      String?
  districtId Int

TransportType (enum)
  BUS_STAND | RAILWAY | LAUNCH_GHAT | OTHER

GasStation
  id         Int
  name       String
  address    String
  latitude   Float
  longitude  Float
  fuelTypes  String[]
  districtId Int

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATION & GOVERNMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EducationInstitute
  id         Int
  name       String
  type       EduType
  address    String
  latitude   Float
  longitude  Float
  phone      String?
  districtId Int

EduType (enum)
  SCHOOL | COLLEGE | UNIVERSITY | MADRASA | OTHER

GovernmentOffice
  id         Int
  name       String
  type       GovType
  address    String
  latitude   Float
  longitude  Float
  phone      String?
  districtId Int

GovType (enum)
  DC_OFFICE | UPAZILA_OFFICE | POLICE | POST_OFFICE | COURT | OTHER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOBS & BUSINESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JobPost
  id          Int
  title       String
  company     String?
  description String
  location    String
  salary      String?
  type        JobType
  deadline    DateTime?
  userId      Int
  districtId  Int
  createdAt   DateTime

JobType (enum)
  FULL_TIME | PART_TIME | FREELANCE | INTERNSHIP

BusinessListing
  id                  Int
  name                String
  category            String
  address             String
  latitude            Float
  longitude           Float
  phone               String?
  description         String?
  images              String[]
  verificationStatus  VerifStatus    @default(PENDING)
  ownerId             Int
  districtId          Int
  createdAt           DateTime

VerifStatus (enum)
  PENDING | APPROVED | REJECTED
  ← APPROVED হলে frontend এ ✅ badge দেখাবে
  ← REJECTED হলে history থাকবে (isVerified boolean এ থাকত না)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SavedItem
  id         Int
  userId     Int
  itemType   SavedType    ← enum, typo হবে না
  itemId     Int
  createdAt  DateTime
  @@unique([userId, itemType, itemId])

SavedType (enum)
  TOURISM | HOSPITAL | POST | DONOR | ACCOMMODATION | JOB | BUSINESS | PHARMACY

Notification
  id         Int
  userId     Int
  title      String
  body       String
  type       String       (BLOOD_REQUEST, POST_COMMENT, SYSTEM etc.)
  link       String?      ← click করলে কোথায় যাবে (e.g. /community/123)
  image      String?      ← notification icon/thumbnail
  isRead     Boolean      @default(false)
  createdAt  DateTime
  → user

UserPreference               ← Phase 2 তে implement করবে, schema এখনই define
  id                  Int
  userId              Int   @unique
  preferredDistrictId Int?
  language            String  @default("bn")
  pushEnabled         Boolean @default(true)
  emailEnabled        Boolean @default(true)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN / AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AuditLog                     ← Admin কী edit/delete করেছে track করো
  id          Int
  actorId     Int            (কে করেছে)
  action      String         (CREATE | UPDATE | DELETE | APPROVE | REJECT)
  entityType  String         (Post, Hospital, BusinessListing etc.)
  entityId    Int
  metadata    Json?          (কী পরিবর্তন হয়েছে)
  createdAt   DateTime

Report
  id          Int
  reporterId  Int
  targetType  String         (Post, Comment, User)
  targetId    Int
  reason      String
  status      String         @default("PENDING")  (PENDING|REVIEWED|RESOLVED)
  createdAt   DateTime
```

-----

## 6. API ENDPOINTS

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST  /api/auth/send-otp           ← Email OTP পাঠাও
POST  /api/auth/verify-otp         ← OTP যাচাই → token return
POST  /api/auth/register           ← Password দিয়ে register
POST  /api/auth/login              ← Password login
GET   /api/auth/me                 ← Current user (session থেকে)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEOGRAPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET   /api/districts               ← সব active জেলা
GET   /api/districts/:id           ← একটি জেলার তথ্য
GET   /api/districts/:id/upazilas  ← জেলার উপজেলা list

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES (সব একই CRUD pattern)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET    /api/{resource}             ← List (filter: districtId, search, page)
GET    /api/{resource}/:id         ← Single item
POST   /api/{resource}             ← Create    (ADMIN only)
PUT    /api/{resource}/:id         ← Update    (ADMIN only)
DELETE /api/{resource}/:id         ← Delete    (ADMIN only)

Resources:
  tourism | hospitals | donors | pharmacies | emergency
  banks | hotels | restaurants | transport | education
  government | jobs | gas-stations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMUNITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET    /api/posts                  ← Feed (filter: type, districtId, page)
GET    /api/posts/:id              ← Single post + comments
POST   /api/posts                  ← Create post       (Auth)
DELETE /api/posts/:id              ← Delete            (Owner/Admin)
POST   /api/posts/:id/comments     ← Comment করো       (Auth)
DELETE /api/comments/:id           ← Comment delete    (Owner/Admin)
POST   /api/posts/:id/react        ← Like/Love/etc.    (Auth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUT    /api/users/me               ← Profile update    (Auth)
GET    /api/users/me/saved         ← Saved items       (Auth)
POST   /api/saved                  ← Save item         (Auth)
DELETE /api/saved/:id              ← Unsave            (Auth)
GET    /api/notifications          ← My notifications  (Auth)
PUT    /api/notifications/read-all ← Mark all read     (Auth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UTILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST   /api/upload                 ← Cloudinary upload (Auth)
GET    /api/search?q=...           ← Global search
POST   /api/report                 ← Report content    (Auth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN (requireRole('ADMIN'))
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET    /api/admin/dashboard        ← Stats overview
GET    /api/admin/users            ← User list + search
PUT    /api/admin/users/:id/role   ← Change user role
GET    /api/admin/posts/pending    ← Pending posts (MODERATOR+)
PUT    /api/admin/posts/:id/status ← Approve/Reject post
GET    /api/admin/reports          ← Report list
GET    /api/admin/audit-logs       ← Audit log         (ADMIN only)
GET    /api/admin/business/pending ← Pending verifications
PUT    /api/admin/business/:id/verify ← Approve/Reject business
POST   /api/admin/notifications/send  ← FCM broadcast  (ADMIN only)
```

-----

## 7. DESIGN SYSTEM

### Color Palette

```css
--color-primary:        #2D6A4F;   /* Forest Green */
--color-primary-light:  #40916C;
--color-primary-dark:   #1B4332;
--color-accent:         #52B788;   /* Mint */
--color-bg:             #F8FAF9;   /* Page background */
--color-surface:        #FFFFFF;   /* Card */
--color-text-primary:   #1A1A2E;
--color-text-secondary: #6B7280;
--color-border:         #E5E7EB;
--color-rating:         #F59E0B;   /* Star */
--color-emergency:      #EF4444;   /* Red */
--color-success:        #10B981;
--color-warning:        #F59E0B;
```

### Typography

```
বাংলা  : Noto Sans Bengali
English: Geist

H1  28px bold     (page title)
H2  22px semibold (section header)
H3  18px semibold (card title)
Body 15px regular
Sm  13px regular  (caption, badge)
```

### Component Specs (ডিজাইন screenshot অনুযায়ী)

```
Card radius     : 12px
Card shadow     : 0 2px 8px rgba(0,0,0,0.08)
Card img height : 160px (list) / full-screen (detail)
Bottom Nav      : 60px height
Top Bar         : 56px height
Service Grid    : 3 col (mobile) / 6 col (tablet)
Button height   : 44px
Button radius   : 8px
FAB             : 52px circular (center of bottom nav)
Input height    : 48px
Spacing base    : 8px grid (4, 8, 12, 16, 24, 32, 48)
```

-----

## 8. PHASE PLAN

### ✅ PHASE 1 — MVP (এখন)

|# |Task                                      |Priority|Status|
|--|------------------------------------------|--------|------|
|1 |Project Setup (monorepo, tsconfig, eslint)|P0      |⬜ TODO|
|2 |Tailwind config + Design tokens           |P0      |⬜ TODO|
|3 |Layout: TopBar + BottomNav + PageWrapper  |P0      |⬜ TODO|
|4 |Prisma Schema (Phase 1 models + enums)    |P0      |⬜ TODO|
|5 |Express API base + all middleware         |P0      |⬜ TODO|
|6 |Auth: Google OAuth + Email OTP            |P0      |⬜ TODO|
|7 |Home Page (Hero, EmergencyBar, Grid)      |P1      |⬜ TODO|
|8 |Tourism Module (List + Detail)            |P1      |⬜ TODO|
|9 |Hospital Module (List + Detail)           |P1      |⬜ TODO|
|10|Emergency Page (one-tap call)             |P1      |⬜ TODO|
|11|Blood Donor (list + bloodType filter)     |P1      |⬜ TODO|
|12|Community Feed (post + comment + types)   |P1      |⬜ TODO|
|13|Profile Page (view + edit + saved)        |P1      |⬜ TODO|
|14|Cloudinary image upload                   |P2      |⬜ TODO|
|15|Seed Data (শেরপুর real data)                |P2      |⬜ TODO|

### ⬜ PHASE 2 — Full Modules

```
Modules  : Bank/ATM, Pharmacy, Accommodation, Restaurant,
           Transport, Education, GovernmentOffice, Jobs
Features : Search/Filter, Rating/Review, SavedItems,
           i18next bilingual, PWA install prompt,
           FCM Push Notifications, UserPreference
```

### ⬜ PHASE 3 — Premium & Admin

```
Features : In-app Chat (Socket.io), Admin Dashboard,
           Business verification flow, AuditLog UI,
           Multi-district onboarding
Quality  : Lighthouse audit, Security audit,
           E2E tests (Cypress), Production deploy
```

-----

## 9. CURRENT STATUS

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase     : PHASE 1 — MVP
Last Done : [NOTHING — Fresh Start]
Next Task : #1 — Project Setup
Blocker   : None
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> ⚠️ **এজেন্ট:** কাজ শুরুর আগে এই সেকশন আপডেট করো।
> কাজ শেষে PROGRESS.md-তে লিখো এবং এই সেকশন আপডেট করো।

-----

## 10. SESSION LOG

```
DATE         | DONE                                  | NEXT
-------------|---------------------------------------|------------------
[শুরু হয়নি] | CLAUDE.md v3.0 + PROGRESS + CODEX    | Task #1: Setup
```

-----

## 11. AGENT RULES

### 🔴 কখনো করবে না

```
✗ Tech stack পরিবর্তন করবে না
✗ Folder structure ভাঙবে না
✗ Design token ignore করবে না
✗ districtId ছাড়া কোনো location model বানাবে না
✗ itemType string হিসেবে লিখবে না — SavedType enum ব্যবহার করো
✗ isVerified boolean ব্যবহার করবে না — VerifStatus enum ব্যবহার করো
✗ একসেশনে ২টির বেশি major task নেবে না
✗ Task order skip করবে না
✗ TypeScript `any` ব্যবহার করবে না
✗ Inline CSS ব্যবহার করবে না (Tailwind only)
✗ API key hardcode করবে না (.env ব্যবহার করো)
✗ console.log production code-এ রাখবে না
✗ Error handling ছাড়া API route বানাবে না
✗ Seed data ছাড়া UI test করবে না
```

### 🟢 সবসময় করবে

```
✓ সেশন শুরুতে CLAUDE.md + PROGRESS.md পড়বে
✓ কোড লেখার আগে CODEX.md চেক করবে
✓ সব component-এ Bengali font support দেবে
✓ Mobile-first লিখবে (min-width breakpoints)
✓ সব list page-এ Loading skeleton রাখবে
✓ সব list page-এ Empty state রাখবে
✓ সব API input-এ Zod validation করবে
✓ সব API route-এ try/catch + errorHandler করবে
✓ Admin action-এ AuditLog লিখবে
✓ সেশন শেষে SESSION LOG আপডেট করবে
✓ PROGRESS.md-তে আজকের কাজের বিস্তারিত লিখবে
```

-----

## 12. SHERPUR SEED DATA

```
জেলা       : শেরপুর
বিভাগ      : ময়মনসিংহ
উপজেলা ৫টি : শেরপুর সদর, নালিতাবাড়ী, শ্রীবরদী, নকলা, ঝিনাইগাতী

পর্যটন স্থান:
  গজনী অবকাশ কেন্দ্র     lat:25.0411  lng:90.0711  (ঝিনাইগাতী)
  মধুটিলা ইকোপার্ক        lat:25.1150  lng:90.2671  (নালিতাবাড়ী)
  ঝর্ণা পয়েন্ট            lat:25.0890  lng:90.1340  (শ্রীবরদী)
  লেঙুরা ইকোপার্ক          lat:25.0650  lng:90.2100  (শ্রীবরদী)
  বড় জমদ্দানি চা বাগান    lat:24.9800  lng:90.1500  (নকলা)

জরুরি নম্বর:
  জাতীয় জরুরি   : 999
  অ্যাম্বুলেন্স  : 199
  ফায়ার সার্ভিস : 199
  শেরপুর SP     : 0931-61234

রক্তের ধরন (BloodType): A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG
```

-----

## 13. ACCEPTANCE CRITERIA

### Phase 1 “Done” মানে নিচের সব কাজ করে:

```
AUTH         ✓ Google login কাজ করে
             ✓ Email OTP login কাজ করে
             ✓ Logout কাজ করে

HOME         ✓ Hero banner swipe করা যায়
             ✓ Emergency bar এ 999/199 বাটন দেখায়
             ✓ Service grid দেখায়

TOURISM      ✓ তালিকা লোড হয়
             ✓ বিস্তারিত পেজ খোলে
             ✓ Google Maps বাটন কাজ করে

HOSPITAL     ✓ তালিকা লোড হয় (সরকারি/বেসরকারি filter)
             ✓ Phone call বাটন কাজ করে

EMERGENCY    ✓ এক ক্লিকে call হয়

DONOR        ✓ BloodType দিয়ে filter হয়
             ✓ দাতার phone দেখা যায়

COMMUNITY    ✓ Feed লোড হয়
             ✓ PostType দিয়ে filter হয়
             ✓ নতুন পোস্ট করা যায়
             ✓ কমেন্ট করা যায়

PROFILE      ✓ প্রোফাইল দেখা যায়
             ✓ নাম/phone এডিট করা যায়

GENERAL      ✓ 375px mobile-এ সব ঠিকমতো দেখায়
             ✓ Bengali font সব জায়গায় কাজ করে
             ✓ Loading skeleton দেখায়
             ✓ Empty state দেখায়
             ✓ Error state + retry দেখায়
```

-----

## 14. ENV VARIABLES

```bash
# ─── Database ─────────────────────────────────
DATABASE_URL="postgresql://user:pass@host:5432/spcare"

# ─── NextAuth ─────────────────────────────────
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="from-google-cloud-console"
GOOGLE_CLIENT_SECRET="from-google-cloud-console"

# ─── Email OTP ────────────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="gmail-app-password"
OTP_EXPIRY_MINUTES="10"

# ─── Cloudinary ───────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ─── Google Maps ──────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_KEY="your-maps-key"

# ─── Firebase FCM ─────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-key"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
FIREBASE_SERVER_KEY="your-server-key"

# ─── App ──────────────────────────────────────
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

-----

## 15. QUICK COMMANDS

```bash
# Development
cd apps/web  && npm run dev      # Frontend  → :3000
cd apps/api  && npm run dev      # Backend   → :4000

# Database
cd apps/api && npx prisma migrate dev    # Migration
cd apps/api && npx prisma db seed        # Seed data
cd apps/api && npx prisma studio         # GUI browser

# Code Quality
npm run type-check    # TypeScript
npm run lint          # ESLint
npm run lint:fix      # Auto fix

# Build
cd apps/web && npm run build
```

-----

## 16. RELATED FILES

|ফাইল                              |কী কাজ করে                              |
|---------------------------------|-------------------------------------|
|`CLAUDE.md`                      |এই ফাইল — Master Directive            |
|`PROGRESS.md`                    |প্রতিদিনের session log                    |
|`CODEX.md`                       |কোড pattern, naming, reusable snippets|
|`apps/api/prisma/schema.prisma`  |Database schema (সব models)          |
|`apps/web/tailwind.config.ts`    |Design tokens                        |
|`apps/api/prisma/seed/sherpur.ts`|শেরপুর seed data                       |
|`.env.example`                   |সব ENV variables template            |

-----

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Version      : v3.0 — Final (10/10)
Last Updated : Session 0
Next Agent   : Task #1 — Project Setup শুরু করো
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```