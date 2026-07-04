import { useEffect, useState } from "react";

interface UpdateToastProps {
  visible?: boolean;
  duration?: number; // milliseconds
  onDismiss?: () => void;
}

/**
 * UpdateToast Component
 * عرض إشعار قصير عند تحديث التطبيق
 *
 * الميزات:
 * - اختفاء تلقائي بعد المدة المحددة
 * - عدم مقاطعة المستخدم
 * - تصميم بسيط وأنيق
 */
export function UpdateToast({
  visible = false,
  duration = 2000,
  onDismiss,
}: UpdateToastProps) {
  const [isShowing, setIsShowing] = useState(visible);

  useEffect(() => {
    setIsShowing(visible);
    if (visible) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
        isShowing
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
      aria-label="تحديث التطبيق"
    >
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap">
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">تم تحديث التطبيق ✓</span>
      </div>
    </div>
  );
}

/**
 * Hook للتحكم في UpdateToast
 * الاستخدام:
 *
 * const { visible, show } = useUpdateToast();
 *
 * <UpdateToast visible={visible} onDismiss={() => setVisible(false)} />
 *
 * // عند التحديث:
 * show();
 */
export function useUpdateToast(duration = 2000) {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const dismiss = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(dismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  return { visible, show, dismiss };
}
