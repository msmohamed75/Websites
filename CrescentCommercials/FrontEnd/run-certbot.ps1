# ===================================================================
#  Get Let's Encrypt SSL cert for techwander.net
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

Write-Host "`nObtaining SSL certificate for techwander.net..." -ForegroundColor Cyan
$result = Invoke-SSH "certbot --nginx -d techwander.net -d www.techwander.net --non-interactive --agree-tos --email text2syedm@gmail.com --redirect 2>&1"
Write-Host $result

Write-Host "`nTesting nginx config..." -ForegroundColor Cyan
Invoke-SSH "nginx -t 2>&1"

Write-Host "`nReloading nginx..." -ForegroundColor Cyan
Invoke-SSH "systemctl reload nginx"

Write-Host "`nDone! https://techwander.net/cc/ should now work." -ForegroundColor Green
