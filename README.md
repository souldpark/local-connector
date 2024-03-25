NFC

sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install pcscd


Run PowerShell as Administrator

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

scoop install git
scoop bucket add extras
scoop bucket add local-connector https://github.com/souldpark/local-connector
scoop install local-connector