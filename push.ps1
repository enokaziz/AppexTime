# Script PowerShell d'automatisation de push Git

Write-Host "Entrer un message de commit : "
$commit_message = Read-Host

git add .
git commit -m "$commit_message"
git push

Write-Host "Push effectué avec succès!"
