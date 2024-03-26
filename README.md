NFC

sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install pcscd


Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
scoop install git
scoop bucket add extras
scoop bucket add local-connector https://github.com/souldpark/local-connector
scoop install local-connector

Una vez instalado el archivo de configuracion se encuentra en la carpeta C:\Windows\system32\config\systemprofile\.local-connector
