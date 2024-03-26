# Set Execution Policy for Current User
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install Scoop
if (-not (Test-Path $env:USERPROFILE\scoop)) {
    # Install Scoop if not already installed
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
} else {
    # Display message if Scoop is already installed
    Write-Host "Scoop is already installed. Run 'scoop update' to get the latest version."
}

# Install git
scoop install git

# Add Scoop buckets
scoop bucket add extras

# Add local-connector bucket
scoop bucket add local-connector https://github.com/souldpark/local-connector

# Install local-connector (with elevated privileges)
scoop install local-connector

# Installation finished message
Write-Host "Installation finished. Press Enter to close..."
# Wait for user input
Read-Host "Press Enter to close."