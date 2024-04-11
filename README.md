NFC

sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install pcscd


irm get.scoop.sh -outfile 'install.ps1'
.\install.ps1 -RunAsAdmin 
                Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
                Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
scoop install git
scoop bucket add extras
scoop bucket add local-connector https://github.com/souldpark/local-connector
scoop install local-connector

https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2019

Una vez instalado el archivo de configuracion se encuentra en la carpeta C:\Windows\system32\config\systemprofile\.local-connector

