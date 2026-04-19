$dir = "$PSScriptRoot\content\Ete-real El *lago\Personajes y NPCs\Personajes"
$dir = Resolve-Path $dir | Select-Object -ExpandProperty Path

$translateMap = @{
    "Status:" = "Estado:"
    "Biography:" = "Biografía:"
    "First Appearance:" = "Primera Aparición:"
    "Relationships:" = "Relaciones:"
    "Profession:" = "Profesión:"
    "Gender:" = "Género:"
    "Species:" = "Especie:"
    "Faction:" = "Facción:"
    "Residence:" = "Residencia:"
}

Get-ChildItem -Path $dir -Recurse -Include *.md, *.base | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content -Path $file -Raw -Encoding UTF8
    $hasChanges = $false

    foreach ($key in $translateMap.Keys) {
        $val = $translateMap[$key]
        if ($content -match "(?m)^$key") {
            $content = $content -replace "(?m)^$key", $val
            $hasChanges = $true
        }
    }

    if ($hasChanges) {
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "Updated $file"
    }
}
