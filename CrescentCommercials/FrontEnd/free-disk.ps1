# ===================================================================
#  Free disk space on 64.227.178.219 before deployment
# ===================================================================

$SERVER  = "64.227.178.219"
$USER    = "root"
$HOSTKEY = "SHA256:HI4NyNWZYq8AgKbfj1HPaYHyB+AWyU9/jkTSFuar77k"

$SecurePass = Read-Host "Enter SSH password for $USER@$SERVER" -AsSecureString
$PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass))

function Invoke-SSH($cmd) {
    plink -batch -pw $PASS -hostkey $HOSTKEY -no-antispoof $USER@$SERVER $cmd 2>&1
}

Write-Host "`nDisk usage BEFORE cleanup:" -ForegroundColor Cyan
Invoke-SSH "df -h /"

Write-Host "`nTop 10 largest directories:" -ForegroundColor Cyan
Invoke-SSH "du -h / --max-depth=3 2>/dev/null | sort -rh | head -20"

Write-Host "`nCleaning apt cache..." -ForegroundColor Cyan
Invoke-SSH "apt-get clean 2>&1"

Write-Host "Removing old apt packages..." -ForegroundColor Cyan
Invoke-SSH "apt-get autoremove -y 2>&1"

Write-Host "Truncating old journal logs (keep last 50MB)..." -ForegroundColor Cyan
Invoke-SSH "journalctl --vacuum-size=50M 2>&1"

Write-Host "Removing compressed log files..." -ForegroundColor Cyan
Invoke-SSH "find /var/log -name '*.gz' -delete && find /var/log -name '*.1' -delete 2>&1"

Write-Host "Clearing /tmp..." -ForegroundColor Cyan
Invoke-SSH "rm -rf /tmp/* 2>&1"

Write-Host "Removing any partial uploads..." -ForegroundColor Cyan
Invoke-SSH "rm -f /var/www/cc-deploy.tar.gz /tmp/cc-deploy.tar.gz 2>&1"

Write-Host "`nDisk usage AFTER cleanup:" -ForegroundColor Cyan
Invoke-SSH "df -h /"

Write-Host "`nNow run .\deploy.ps1 to deploy the site." -ForegroundColor Green
