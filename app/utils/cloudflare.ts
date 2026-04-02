/**
 * Cloudflare R2 Configuration for Video Storage (Updated)
 * إعدادات Cloudflare R2 الجديدة
 */

// الرابط الجديد من صفحة Settings في Cloudflare
const CLOUDFLARE_R2_PUBLIC_URL = "https://pub-25e727cf0c0e49799268f333275e7cf2.r2.dev";

// رابط الـ S3 API الجديد (موجود في صورة image_f4e99c.png)
const CLOUDFLARE_R2_STORAGE_URL = "https://fa9d3a6b5a5a53a3eef94672a5564036.r2.cloudflarestorage.com/melodies-videos";

export const CLOUDFLARE_VIDEO_BASE_URL = CLOUDFLARE_R2_PUBLIC_URL;

/**
 * دالة مساعدة للحصول على رابط الفيديو
 * ملاحظة: بما إن الفيديوهات جوه فولدر اسمه melodies-videos جوه الـ Bucket
 * لازم نضيف اسم الفولدر في الرابط
 */
export function getVideoUrl(filename: string): string {
  // بناءً على صورة الـ Objects، الفيديوهات موجودة داخل فولدر melodies-videos
  return `${CLOUDFLARE_VIDEO_BASE_URL}/melodies-videos/${filename}`;
}

export const CLOUDFLARE_R2_STORAGE_ENDPOINT = CLOUDFLARE_R2_STORAGE_URL;