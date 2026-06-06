[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx"
$backupPath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-before-spelling"

# Backup
[System.IO.File]::Copy($filePath, $backupPath, $true)

$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Đọc file replacements
$repPath = "d:\Du-an\website-vpc\scripts\replacements.txt"
$lines = [System.IO.File]::ReadAllLines($repPath, [System.Text.Encoding]::UTF8)

$fixCount = 0
foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $parts = $line.Split("|")
    if ($parts.Length -lt 2) { continue }
    
    $src = $parts[0]
    $dst = $parts[1]
    
    # Thay thế placeholder [REPLACEMENT_CHAR] bằng U+FFFD thực tế
    $src = $src.Replace("[REPLACEMENT_CHAR]", [char]0xFFFD)
    
    if ($content.Contains($src)) {
        $content = $content.Replace($src, $dst)
        $fixCount++
    }
}

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Output ("Da sua hoan tat " + $fixCount + " mau tu loi!")
