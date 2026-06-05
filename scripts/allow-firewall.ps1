# Run in PowerShell as Administrator
New-NetFirewallRule -DisplayName "Dalaal Backend 3002" -Direction Inbound -LocalPort 3002 -Protocol TCP -Action Allow -Profile Private,Public
Write-Host "Firewall rule added for port 3002"
