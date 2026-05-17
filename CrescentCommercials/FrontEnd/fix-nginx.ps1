# ===================================================================
#  Fix nginx config for techwander.net/cc (no file upload)
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

function Write-RemoteFile($remotePath, $content) {
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
    Invoke-SSH "echo '$b64' | base64 -d > $remotePath"
}

Write-Host "`nCurrent sites-enabled:" -ForegroundColor Cyan
Invoke-SSH "ls /etc/nginx/sites-enabled/"

Write-Host "`nWriting /etc/nginx/snippets/cc.conf..." -ForegroundColor Cyan
Invoke-SSH "mkdir -p /etc/nginx/snippets"
$ccConf = "    location = /cc {`n        return 301 /cc/;`n    }`n    location /cc/ {`n        alias /var/www/cc/;`n        index index.html;`n        try_files `$uri `$uri/ /cc/index.html;`n        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|ttf|eot)`$ {`n            expires 1y;`n            add_header Cache-Control `"public, immutable`";`n        }`n    }`n"
Write-RemoteFile "/etc/nginx/snippets/cc.conf" $ccConf
Write-Host "  cc.conf written." -ForegroundColor Green

Write-Host "`nCreating techwander.net server block..." -ForegroundColor Cyan
$twConf = "server {`n    listen 80;`n    listen [::]:80;`n    server_name techwander.net www.techwander.net;`n`n    root /var/www/html;`n    index index.html;`n`n    include /etc/nginx/snippets/cc.conf;`n}`n"
Write-RemoteFile "/etc/nginx/sites-available/techwander.net" $twConf
Invoke-SSH "ln -sf /etc/nginx/sites-available/techwander.net /etc/nginx/sites-enabled/techwander.net"
Write-Host "  Config written and linked." -ForegroundColor Green

Write-Host "`nVerifying config content:" -ForegroundColor Cyan
Invoke-SSH "cat /etc/nginx/sites-available/techwander.net"

Write-Host "`nTesting nginx..." -ForegroundColor Cyan
$test = Invoke-SSH "nginx -t 2>&1"
Write-Host $test

if ($test -match "syntax is ok" -and $test -match "test is successful") {
    Invoke-SSH "systemctl reload nginx"
    Write-Host "`nDone! http://techwander.net/cc/ should now load correctly." -ForegroundColor Green
} else {
    Write-Host "`nNginx test FAILED - not reloading." -ForegroundColor Red
}
