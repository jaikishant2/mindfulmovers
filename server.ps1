# Lightweight Static File HTTP Server in PowerShell (.NET HttpListener)
param(
    [int]$Port = 8080,
    [string]$Root = "E:\Mindful movers website"
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
} catch {
    Write-Host "Port $Port is in use, trying port 8081..."
    $Port = 8081
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
}

Write-Host "=========================================================="
Write-Host "  Mindful Movers Chess Club - Local Dev Server Started!  "
Write-Host "  URL: http://localhost:$Port/                            "
Write-Host "=========================================================="

# Automatically open browser
Start-Process "http://localhost:$Port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpeg" = "image/jpeg"
    ".jpg"  = "image/jpeg"
    ".png"  = "image/png"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        # URL decode path
        $decodedPath = [System.Uri]::UnescapeDataString($urlPath)
        $filePath = [System.IO.Path]::Combine($Root, $decodedPath.Replace('/', '\'))

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $decodedPath")
            $response.StatusCode = 404
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Keep listening despite client disconnects
    }
}
