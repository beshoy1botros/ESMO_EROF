# ⚙️ إعدادات تطبيق الألحان القبطية ESMO EROF

## 🎯 نظرة عامة

هذا الملف يحتوي على جميع الإعدادات والمميزات المتقدمة للتطبيق، مصمم خصيصاً للعمل بكفاءة على الأجهزة المحمولة مع دعم كامل لجميع المميزات الحديثة.

## 📱 المميزات المتنقلة

### 1. PWA (تطبيق ويب تقدمي)
- ✅ **التثبيت التلقائي**: يدعم التثبيت على الشاشة الرئيسية
- ✅ **العمل بدون اتصال**: يعمل حتى بدون إنترنت
- ✅ **إشعارات دفع**: تنبيهات بأحدث الألحان
- ✅ **تحديثات تلقائية**: تحديثات في الخلفية

### 2. التوافق مع الأجهزة
- ✅ **iPhone/iPad**: دعم كامل لجميع مميزات iOS
- ✅ **Android**: دعم كامل لجميع مميزات Android
- ✅ **الأجهزة اللوحية**: واجهة متجاوبة لجميع الأحجام
- ✅ **ساعات ذكية**: إشعارات على الساعة الذكية

### 3. الأداء المحسن
- ✅ **تحميل سريع**: أقل من 3 ثوانٍ
- ✅ **ذاكرة تخزين ذكية**: تخزين مؤقت ذكي
- ✅ **توفير البيانات**: وضع خاص لتوفير البيانات
- ✅ **توفير البطارية**: تحسين استهلاك البطارية

## 🎨 التصميم والواجهة

### 1. الوضع المظلم التلقائي
```css
@media (prefers-color-scheme: dark) {
  :root {
    --mobile-background: #0f172a;
    --mobile-surface: #1e293b;
    --mobile-text: #f1f5f9;
  }
}
```

### 2. أحجام متجاوبة
- ✅ **خطوط متجاوبة**: `clamp(14px, 4vw, 18px)`
- ✅ **أزرار لمسية**: الحد الأدنى 44×44 بكسل
- ✅ **مسافات متجاوبة**: تتكيف مع حجم الشاشة
- ✅ **زوايا مقوسة**: متناسبة مع التصميم

### 3. إيماءات اللمس
- ✅ **السحب لليمين**: فتح القائمة
- ✅ **السحب لليسار**: إغلاق القائمة/التالي
- ✅ **السحب لأعلى**: التمرير لأعلى
- ✅ **السحب لأسفل**: التحديث أو إظهار الشريط

## 🔧 المميزات التقنية

### 1. Service Worker
```javascript
// دعم شامل للعمل بدون اتصال
const CACHE_VERSION = "esmo-erof-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const VIDEO_CACHE = `${CACHE_VERSION}-videos`;
```

### 2. البحث الصوتي
```javascript
// دعم البحث الصوتي باللغة العربية
this.recognition = new SpeechRecognition();
this.recognition.lang = 'ar-SA';
this.recognition.continuous = false;
```

### 3. الإشعارات الذكية
```javascript
// إشعارات دفع مع دعم كامل
navigator.serviceWorker.ready.then(registration => {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: this.urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
  });
});
```

## 🚀 الإعدادات المتقدمة

### 1. إعدادات العرض
```javascript
const settings = {
  fontSize: 'medium', // small, medium, large, x-large
  theme: 'auto', // light, dark, auto
  language: 'ar', // ar, cop, en
  textAlign: 'justify', // left, right, center, justify
  lineHeight: 1.6, // 1.2 - 2.0
};
```

### 2. إعدادات الصوت
```javascript
const audioSettings = {
  autoPlay: true,
  quality: 'high', // low, medium, high
  volume: 0.8, // 0.0 - 1.0
  playbackRate: 1.0, // 0.5 - 2.0
  loop: false,
};
```

### 3. إعدادات الإشعارات
```javascript
const notificationSettings = {
  prayerTimes: true,
  dailyHymn: true,
  newContent: true,
  updates: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00'
  }
};
```

## 📊 التحليلات والأداء

### 1. مؤشرات الأداء
- ⏱️ **وقت التحميل**: < 3 ثوانٍ
- 📱 **حجم التطبيق**: < 5 ميجابايت
- 🔋 **استهلاك البطارية**: < 2% في الساعة
- 📡 **استهلاك البيانات**: < 10 ميجابايت في اليوم

### 2. متطلبات النظام
- 📱 **iOS**: 12.0 أو أحدث
- 🤖 **Android**: 6.0 أو أحدث
- 🌐 **المتصفح**: Chrome 80+, Safari 13+, Firefox 75+
- 📶 **الإنترنت**: 3G أو أعلى (يوصى بـ 4G/WiFi)

## 🔧 أدوات التطوير

### 1. ملفات الاختبار
- ✅ **اختبار التوافق**: `test-mobile-optimization.html`
- ✅ **اختبار الأداء**: أدوات Lighthouse
- ✅ **اختبار PWA**: أدوات Chrome DevTools
- ✅ **اختبار الإمكانية**: WAVE Accessibility Tool

### 2. أدوات التصحيح
```javascript
// تفعيل وضع التصحيح
window.DEBUG_MODE = true;

// عرض معلومات التصحيح
console.log('Device Info:', {
  isMobile: mobileFeatures.isMobile,
  isStandalone: mobileFeatures.isStandalone,
  isIOS: mobileFeatures.isIOS,
  isAndroid: mobileFeatures.isAndroid,
  screenSize: `${window.innerWidth}x${window.innerHeight}`,
  pixelRatio: window.devicePixelRatio
});
```

## 🛠️ حل المشكلات

### 1. مشاكل التثبيت
```bash
# مسح ذاكرة التخزين المؤقت
Settings > Apps > ESMO EROF > Storage > Clear Cache

# إعادة التثبيت
1. حذف التطبيق
2. إعادة التحميل من المتصفح
3. التثبيت مرة أخرى
```

### 2. مشاكل الأداء
```javascript
// فحص استخدام الذاكرة
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(estimate => {
    console.log(`Storage used: ${(estimate.usage / estimate.quota * 100).toFixed(2)}%`);
  });
}
```

### 3. مشاكل الإشعارات
```javascript
// فحص حالة الإشعارات
Notification.permission.then(permission => {
  console.log('Notification permission:', permission);
});
```

## 📚 الوثائق الإضافية

### 1. روابط مفيدة
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

### 2. معايير الوصول
- ✅ **WCAG 2.1**: مستوى AA
- ✅ **Section 508**: متوافق بالكامل
- ✅ **ARIA**: علامات واضحة
- ✅ **Keyboard Navigation**: دعم كامل

## 🤝 المساهمة

للمساهمة في تطوير التطبيق:

1. 🍴 **Fork** المشروع
2. 🌿 **Create** فرع جديد
3. 💻 **Code** التحسينات
4. 🧪 **Test** على الأجهزة المحمولة
5. 📤 **Submit** طلب السحب

## 📄 الترخيص

هذا المشروع مرخص تحت **MIT License** - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 الشكر والتقدير

- **الله المبارك** على نعمة التكنولولوجيا
- **الكنيسة القبطية الأرثوذكسية** على حفظ التراث
- **المطورين** المساهمين في المشروع
- **المستخدمين** الذين يشاركون في التحسين

---

<div align="center">
  <strong>صُنع بحب ❤️ لخدمة الكنيسة القبطية الأرثوذكسية</strong>
  <br>
  <em>"فَلْيَخْرُجِ الْمُنَادِي وَلْيَصْرُخْ فِي أُذُنِ الشَّعْبِ"</em>
</div>