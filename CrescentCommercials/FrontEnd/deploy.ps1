# ===================================================================
#  Crescent Commercials - Deploy to techwander.net/cc
#  Server : 64.227.178.219  |  User: root  |  Nginx
# ===================================================================

$SERVER  = "64.227.178.219"
$USER    = "root"
$DIST    = "D:\Syed\Technophile\GoldenHorseWax\AngularApp\crescent-angular\dist\crescent-commerce\browser"
$REMOTE  = "/var/www/cc"
$HOSTKEY = "SHA256:HI4NyNWZYq8AgKbfj1HPaYHyB+AWyU9/jkTSFuar77k"

$SecurePass = Read-Host "Enter SSH password for $USER@$SERVER" -AsSecureString
$PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass))

function Invoke-SSH($cmd) {
    plink -batch -pw $PASS -hostkey $HOSTKEY -no-antispoof $USER@$SERVER $cmd 2>&1
}

# Write a file on the remote server via base64 (avoids all heredoc/quoting issues)
function Write-RemoteFile($remotePath, $content) {
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
    Invoke-SSH "echo '$b64' | base64 -d > $remotePath"
}

# ── Diagnose: show current nginx state ──────────────────────────
Write-Host "`n[0/6] Checking server nginx state..." -ForegroundColor Cyan
$diagOutput = Invoke-SSH "echo '--- sites-enabled ---' && ls /etc/nginx/sites-enabled/ && echo '--- disk ---' && df -h / && echo '--- techwander config ---' && cat /etc/nginx/sites-enabled/techwander.net 2>/dev/null || echo '(no techwander.net in sites-enabled)'"
Write-Host ($diagOutput | Out-String) -ForegroundColor Gray


# ── Step 1: Create remote dir ────────────────────────────────────
Write-Host "`n[1/6] Creating $REMOTE on server..." -ForegroundColor Cyan
Invoke-SSH "mkdir -p $REMOTE && chmod 755 $REMOTE"

# ── Step 2: Create remote subdirectory structure ─────────────────
Write-Host "[2/6] Creating remote directory structure..." -ForegroundColor Cyan
$localDirs = Get-ChildItem -Path $DIST -Recurse -Directory
if ($localDirs.Count -gt 0) {
    $remoteDirs = ($localDirs | ForEach-Object {
        $rel = $_.FullName.Substring($DIST.Length).Replace("\", "/")
        "$REMOTE$rel"
    }) -join " "
    Invoke-SSH "mkdir -p $remoteDirs"
}

# ── Step 3: Upload files via pscp ────────────────────────────────
Write-Host "[3/6] Uploading Angular build files..." -ForegroundColor Cyan
pscp -batch -pw $PASS -hostkey $HOSTKEY -r "$DIST\*" "${USER}@${SERVER}:${REMOTE}/" 2>&1
Invoke-SSH "chmod -R 755 $REMOTE"

# ── Step 4: Write nginx /cc/ snippet ─────────────────────────────
Write-Host "[4/6] Writing nginx /cc/ snippet..." -ForegroundColor Cyan
Invoke-SSH "mkdir -p /etc/nginx/snippets"
$ccConf = "    location = /cc {`n        return 301 /cc/;`n    }`n    location /cc/ {`n        alias /var/www/cc/;`n        index index.html;`n        try_files `$uri `$uri/ /cc/index.html;`n        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|ttf|eot)`$ {`n            expires 1y;`n            add_header Cache-Control `"public, immutable`";`n        }`n    }`n"
Write-RemoteFile "/etc/nginx/snippets/cc.conf" $ccConf

# ── Step 5: Always write techwander.net nginx config ─────────────
Write-Host "[5/6] Writing techwander.net nginx config..." -ForegroundColor Cyan
$twConf = "server {`n    listen 80;`n    listen [::]:80;`n    server_name techwander.net www.techwander.net;`n`n    root /var/www/html;`n    index index.html;`n`n    include /etc/nginx/snippets/cc.conf;`n}`n"
Write-RemoteFile "/etc/nginx/sites-available/techwander.net" $twConf
Invoke-SSH "ln -sf /etc/nginx/sites-available/techwander.net /etc/nginx/sites-enabled/techwander.net"
Write-Host "  Config written and linked." -ForegroundColor Green

# ── Step 6: Test nginx and reload ────────────────────────────────
Write-Host "[6/6] Testing nginx config and reloading..." -ForegroundColor Cyan
$testResult = Invoke-SSH "nginx -t 2>&1"
Write-Host $testResult

if ($testResult -match "syntax is ok" -and $testResult -match "test is successful") {
    Invoke-SSH "systemctl reload nginx"
    Write-Host "`nDeployment complete!" -ForegroundColor Green
    Write-Host "   Open: http://techwander.net/cc/" -ForegroundColor White
} else {
    Write-Host "`nNginx config test FAILED - NOT reloading. Check manually." -ForegroundColor Red
    Write-Host "   SSH in and run: nginx -t" -ForegroundColor Yellow
}
