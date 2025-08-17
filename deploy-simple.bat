@echo off
chcp 65001 >nul
echo 🚀 نشر سريع على Vercel...
echo.

cd /d "%~dp0"

echo ➕ إضافة التعديلات...
git add .

set /p commit_msg="📝 أدخل وصف التعديل: "
if "%commit_msg%"=="" set commit_msg=Update files

echo 💾 حفظ التعديلات...
git commit -m "%commit_msg%"

echo ⬆️ رفع التعديلات...
git push origin main

echo 🌐 النشر على Vercel...
vercel --prod

echo.
echo ✅ تم النشر بنجاح!
echo 🔗 الموقع: https://esmo-erof.vercel.app
echo.
pause
