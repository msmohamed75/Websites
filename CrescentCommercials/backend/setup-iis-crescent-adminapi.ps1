$ErrorActionPreference = 'Stop'
$siteName = 'Crescent.AdminApi'
$appPool = 'Crescent.AdminApi'
$physicalPath = 'D:\Syed\Technophile\GoldenHorseWax\Development\MicroServices\C#\Crescent.AdminApi\publish'
$certThumbprint = '57D638BA4B5DF6829DD67BB962BE98758DCD5CB2'
$appId = '{8D17E891-6C5C-4C1B-95D5-86E9C8303021}'
$appcmd = "$env:windir\System32\inetsrv\appcmd.exe"

if (-not (Test-Path -LiteralPath $physicalPath)) { throw "Publish folder not found: $physicalPath" }

$poolExists = & $appcmd list apppool /name:$appPool 2>$null
if (-not $poolExists) {
  & $appcmd add apppool /name:$appPool
}
& $appcmd set apppool /apppool.name:$appPool /managedRuntimeVersion:""

$siteExists = & $appcmd list site /name:$siteName 2>$null
if (-not $siteExists) {
  & $appcmd add site /name:$siteName /bindings:http/*:3021: /physicalPath:$physicalPath
} else {
  & $appcmd set site /site.name:$siteName /[path='/'].physicalPath:$physicalPath
}

& $appcmd set app $siteName/ /applicationPool:$appPool

$bindings = & $appcmd list site /name:$siteName /text:bindings
if ($bindings -notmatch ':3021:') {
  & $appcmd set site /site.name:$siteName "/+bindings.[protocol='http',bindingInformation='*:3021:']"
}
if ($bindings -notmatch ':3023:') {
  & $appcmd set site /site.name:$siteName "/+bindings.[protocol='https',bindingInformation='*:3023:']"
}

$sslBinding = netsh http show sslcert ipport=0.0.0.0:3023 2>$null
if ($LASTEXITCODE -ne 0 -or $sslBinding -notmatch $certThumbprint) {
  if ($LASTEXITCODE -eq 0) { netsh http delete sslcert ipport=0.0.0.0:3023 | Out-Null }
  netsh http add sslcert ipport=0.0.0.0:3023 certhash=$certThumbprint appid=$appId certstorename=MY
}

icacls $physicalPath /grant "IIS AppPool\${appPool}:(OI)(CI)RX" | Out-String
& $appcmd start site /site.name:$siteName
& $appcmd list site /name:$siteName


