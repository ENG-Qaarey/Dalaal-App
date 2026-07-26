$BASE = "D:\LocalD\All-MyTest\ICT-Project\Dalaal\web\app"

function Write-File($rel, $content) {
    $full = Join-Path $BASE $rel
    $dir = [System.IO.Path]::GetDirectoryName($full)
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($full, $content, $utf8)
    Write-Host "OK $rel"
}
