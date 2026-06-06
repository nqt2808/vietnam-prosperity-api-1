$sourcePath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx.bak-utf8"
$bytes = [System.IO.File]::ReadAllBytes($sourcePath)

# Tìm chuỗi "sang" trong mảng byte
$pattern = [System.Text.Encoding]::UTF8.GetBytes("sang")
$patternLen = $pattern.Length

for ($i = 0; $i -le ($bytes.Length - $patternLen); $i++) {
    $match = $true
    for ($j = 0; $j -lt $patternLen; $j++) {
        if ($bytes[$i + $j] -ne $pattern[$j]) {
            $match = $false
            break
        }
    }
    if ($match) {
        # In ra 20 byte tiếp theo sau chữ "sang"
        $subset = $bytes[$i..($i + 25)]
        $hex = ($subset | ForEach-Object { "0x{0:X2}" -f $_ }) -join " "
        $str = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($subset)
        Write-Output ("Index " + $i + ": " + $hex + " -> " + $str)
    }
}
