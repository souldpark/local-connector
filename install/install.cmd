curl -o nodeinstaller.msi https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi
msiexec /i nodeinstaller.msi /quiet

mkcert -install -cert-file local-connector.pem -key-file local-connector-key.pem localhost