@echo off
set msg=%~1
if "%msg%"=="" set msg=Añadiendo index a las carpetas

echo Ejecutando: git add .
git add .

echo Ejecutando: git commit -m "%msg%"
git commit -m "%msg%"

echo Ejecutando: git push origin v4
git push origin v4

echo.
echo ===============================
echo ¡Commit y push completados!
echo ===============================
pause
