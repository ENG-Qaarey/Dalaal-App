# PowerShell script to generate all 10 page.tsx files
$BASE = "D:\LocalD\All-MyTest\ICT-Project\Dalaal\web\app"

function Write-TsxFile {
    param($RelPath, $Content)
    $full = Join-Path $BASE $RelPath
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    # Use UTF8 without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($full, $Content, $utf8NoBom)
    Write-Host "✓  Created: $full"
}
