# ⲥⲙⲟⲩ ⲉⲣⲟϥ - تطبيق الألحان القبطية

تطبيق ويب تفاعلي لتعليم الألحان القبطية وطقس اللحن للمراحل التعليمية المختلفة.

## ✨ المميزات

- 🎵 **الألحان القبطية**: مجموعة شاملة من الألحان لجميع المراحل التعليمية
- 📖 **طقس اللحن**: شرح مفصل لطقوس الألحان القبطية
- 🎓 **التمهيدي**: محتوى تعليمي خاص للمراحل التمهيدية
- 📱 **متجاوب**: يعمل على جميع الأجهزة (هواتف، أجهزة لوحية، كمبيوتر)
- 🎨 **تصميم حديث**: واجهة مستخدم جميلة وسهلة الاستخدام
- 🚀 **أداء عالي**: بناء على React Router v7 و TypeScript

## 🚀 التحسينات الجديدة

### ⚡ تحسينات الأداء
- **Lazy Loading للفيديوهات**: تحميل الفيديوهات فقط عند الحاجة لتوفير البيانات والذاكرة
- **تقسيم الكود**: تحميل أجزاء التطبيق بشكل منفصل لسرعة أكبر
- **ضغط الملفات**: تقليل أحجام الملفات مع الحفاظ على الجودة

### 📱 العمل بدون إنترنت
- **Service Worker**: تخزين مؤقت ذكي للفيديوهات والملفات
- **Progressive Web App**: يمكن تثبيت التطبيق على الهاتف
- **مؤشر حالة الاتصال**: عرض حالة الإنترنت والتخزين المؤقت

### 🎯 تحسينات تجربة المستخدم
- **تحميل تدريجي**: مؤشرات تحميل جميلة ومعلومات واضحة
- **معالجة الأخطاء**: رسائل خطأ مفيدة مع إمكانية إعادة المحاولة
- **تحسين الصور**: دعم تنسيق WebP للصور الأصغر حجماً

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

## Centralized Analytics (Supabase)

Set these environment variables on Vercel:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- MGMT_SECRET (a random long string used by management UI when calling /api/events)

Run the SQL below in Supabase SQL Editor to create the table and policies.

```sql
-- 1) Table
create table if not exists public.events (
  id uuid primary key,
  timestamp bigint not null,
  path text,
  action text not null,
  sessionId text,
  deviceId text,
  userAgent text,
  deviceType text,
  deviceVendor text,
  stage text,
  level text,
  videoId text,
  videoTitle text,
  currentTime numeric,
  watchedSeconds numeric
);

-- Helpful indexes
create index if not exists idx_events_timestamp on public.events (timestamp desc);
create index if not exists idx_events_device on public.events (deviceId);
create index if not exists idx_events_session on public.events (sessionId);

-- 2) RLS
alter table public.events enable row level security;

-- Insert allowed for anon (optional). If you prefer to route inserts via server only, skip this policy.
create policy if not exists events_insert_anon on public.events
for insert to anon using (true) with check (true);

-- Deny select to anon by not creating a select policy for anon
-- Select is allowed only via Service Role key from the server (api/events).
```

## Management UI protection
Set MGMT_SECRET in Vercel env. The dashboard fetches `/api/events` with header `x-mgmt-secret: MGMT_SECRET`.


Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
