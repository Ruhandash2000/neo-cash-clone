Add-Type -AssemblyName System.Drawing
$imgPath = "C:\Users\ruhan\.gemini\antigravity-ide\brain\0843ea99-423b-492e-a94b-3a68bfdc4895\.user_uploaded\media_1790347425303.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
$w = $img.Width
$h = $img.Height
Write-Host "Image dimensions: $w x $h"

# Crop out outer white margins so the pastel card extends to the edges
# The pastel square is centered in the image
$cropX = [int]($w * 0.055)
$cropY = [int]($h * 0.055)
$cropW = [int]($w * 0.89)
$cropH = [int]($h * 0.85)

$bmp = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$dstRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
$g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$img.Dispose()

$outPath = "c:\Users\ruhan\.gemini\antigravity-ide\scratch\neo-cash-clone\src\assets\signup-skeleton-illustration.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Tightly cropped signup illustration saved to: $outPath"
