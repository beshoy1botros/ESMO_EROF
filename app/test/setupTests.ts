import '@testing-library/jest-dom';

// تهيئة عامة للاختبارات
// محاكاة بسيطة لدوال الفيديو في jsdom
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: async () => {},
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: () => {},
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: () => {},
});

// scrollIntoView غير مدعوم في jsdom افتراضيًا
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

