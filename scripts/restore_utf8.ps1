$sourcePath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-utf8"
$destPath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx"
$backupPath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-before-powershell-new"

# Backup file đích hiện tại
[System.IO.File]::Copy($destPath, $backupPath, $true)
Write-Output "Created backup at: $backupPath"

# Đọc file nguồn bằng ISO-8859-1 để bảo toàn 100% byte
$iso = [System.Text.Encoding]::GetEncoding("iso-8859-1")
$rawText = [System.IO.File]::ReadAllText($sourcePath, $iso)

# Convert sang bytes bằng ISO-8859-1 để lấy byte gốc của file
$rawBytes = $iso.GetBytes($rawText)

# Decode byte gốc bằng UTF-8 để có chuỗi Mojibake nguyên bản không bị lỗi FFFD
$utf8 = [System.Text.Encoding]::UTF8
$text = $utf8.GetString($rawBytes)

# Map cp1252 đặc biệt
$cp1252Map = @{
    0x80 = 0x20AC; 0x82 = 0x201A; 0x83 = 0x0192; 0x84 = 0x201E; 0x85 = 0x2026;
    0x86 = 0x2020; 0x87 = 0x2021; 0x88 = 0x02C6; 0x89 = 0x2030; 0x8A = 0x0160;
    0x8B = 0x2039; 0x8C = 0x0152; 0x8E = 0x017D; 0x91 = 0x2018; 0x92 = 0x2019;
    0x93 = 0x201C; 0x94 = 0x201D; 0x95 = 0x2022; 0x96 = 0x2013; 0x97 = 0x2014;
    0x98 = 0x02DC; 0x99 = 0x2122; 0x9A = 0x0161; 0x9B = 0x203A; 0x9C = 0x0153;
    0x9E = 0x017E; 0x9F = 0x0178
}

$unicodeToCp1252 = @{}
foreach ($key in $cp1252Map.Keys) {
    $val = $cp1252Map[$key]
    $unicodeToCp1252[$val] = $key
}

# Tạo MemoryStream để ghi byte khôi phục
$ms = New-Object System.IO.MemoryStream

for ($i = 0; $i -lt $text.Length; $i++) {
    $c = $text[$i]
    if ([System.Char]::IsHighSurrogate($c) -and ($i + 1 -lt $text.Length)) {
        $str = $text.Substring($i, 2)
        $charBytes = $utf8.GetBytes($str)
        $ms.Write($charBytes, 0, $charBytes.Length)
        $i++
        continue
    }

    $code = [int]$c
    if ($code -le 0xFF) {
        $ms.WriteByte($code)
    } elseif ($unicodeToCp1252.ContainsKey($code)) {
        $ms.WriteByte($unicodeToCp1252[$code])
    } else {
        $charBytes = $utf8.GetBytes($c)
        $ms.Write($charBytes, 0, $charBytes.Length)
    }
}

$bytes = $ms.ToArray()
$decoded = $utf8.GetString($bytes)

[System.IO.File]::WriteAllText($destPath, $decoded, $utf8)
Write-Output "Restored UTF-8 text successfully without U+FFFD!"
