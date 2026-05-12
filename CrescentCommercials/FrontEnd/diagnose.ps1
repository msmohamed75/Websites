# ===================================================================
#  Diagnose techwander.net/cc deployment
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

Write-Host "`n--- Nginx status ---" -ForegroundColor Cyan
Invoke-SSH "systemctl status nginx --no-pager | head -20"

Write-Host "`n--- Port 80 listening ---" -ForegroundColor Cyan
Invoke-SSH "ss -tlnp | grep ':80'"

Write-Host "`n--- sites-enabled ---" -ForegroundColor Cyan
Invoke-SSH "ls -la /etc/nginx/sites-enabled/"

Write-Host "`n--- techwander.net config ---" -ForegroundColor Cyan
Invoke-SSH "cat /etc/nginx/sites-enabled/techwander.net 2>/dev/null || echo NOT FOUND"

Write-Host "`n--- default-redirect config ---" -ForegroundColor Cyan
Invoke-SSH "cat /etc/nginx/sites-enabled/default-redirect 2>/dev/null || echo NOT FOUND"

Write-Host "`n--- cc.conf snippet ---" -ForegroundColor Cyan
Invoke-SSH "cat /etc/nginx/snippets/cc.conf 2>/dev/null || echo NOT FOUND"

Write-Host "`n--- /var/www/cc contents ---" -ForegroundColor Cyan
Invoke-SSH "ls /var/www/cc/ 2>/dev/null || echo EMPTY"

Write-Host "`n--- nginx config test ---" -ForegroundColor Cyan
Invoke-SSH "nginx -t 2>&1"

Write-Host "`n--- nginx error log (last 20 lines) ---" -ForegroundColor Cyan
Invoke-SSH "tail -20 /var/log/nginx/error.log 2>/dev/null"
