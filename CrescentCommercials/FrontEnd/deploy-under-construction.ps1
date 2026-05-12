# ===================================================================
#  Upload under-construction page to techwander.net root
# ===================================================================

$SERVER  = "64.227.178.219"
$USER    = "root"
$HOSTKEY = "SHA256:HI4NyNWZYq8AgKbfj1HPaYHyB+AWyU9/jkTSFuar77k"
$LOCAL   = "D:\Syed\Technophile\GoldenHorseWax\AngularApp\crescent-angular\under-construction.html"

$SecurePass = Read-Host "Enter SSH password for $USER@$SERVER" -AsSecureString
$PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass))

function Invoke-SSH($cmd) {
    plink -batch -pw $PASS -hostkey $HOSTKEY -no-antispoof $USER@$SERVER $cmd 2>&1
}

Write-Host "`nUploading under-construction page..." -ForegroundColor Cyan
Invoke-SSH "mkdir -p /var/www/html"
pscp -batch -pw $PASS -hostkey $HOSTKEY $LOCAL "${USER}@${SERVER}:/var/www/html/index.html" 2>&1

Write-Host "Done! techwander.net now shows the under-construction page." -ForegroundColor Green
Write-Host "   techwander.net     -> Under Construction" -ForegroundColor White
Write-Host "   techwander.net/cc/ -> Crescent Commercials" -ForegroundColor White
