@echo off
setlocal
cd /d "%~dp0"

echo === CarrierNest - Push to GitHub ===
echo Repo: https://github.com/coder-soumyadip29/Careernest_project
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed or not on PATH.
  pause
  exit /b 1
)

git remote set-url origin https://github.com/coder-soumyadip29/Careernest_project.git

echo.
echo [1/4] Status before commit...
git status

echo.
echo [2/4] Staging files...
git add -A
git reset HEAD .env 2>nul

echo.
echo [3/4] Committing...
git commit -m "Add complete CarrierNest frontend per internship requirements"
if errorlevel 1 (
  echo Note: Nothing new to commit, or commit failed. Continuing to push...
)

echo.
echo [4/4] Pushing to origin main...
git push -u origin main
if errorlevel 1 (
  echo.
  echo PUSH FAILED. Common fixes:
  echo   - Run: gh auth login
  echo   - Or use a GitHub Personal Access Token as password when prompted
  echo   - Or: git pull origin main --rebase   then push again
  pause
  exit /b 1
)

echo.
echo SUCCESS! View your repo:
echo https://github.com/coder-soumyadip29/Careernest_project
pause
