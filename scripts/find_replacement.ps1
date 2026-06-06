[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = "d:\Du-an\website-vpc\src\components\shared\storefront-client.tsx"

$lines = [System.IO.File]::ReadAllLines($filePath, [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line.Contains([char]0xFFFD)) {
        $lineNum = $i + 1
        Write-Output ("" + $lineNum + ": " + $line)
    }
}
