#!/bin/bash

# script d'automatisation de push

echo "Entrer un message de commit : "
read commit_message

git add .
git commit -m "$commit_message"
git push

echo "Push effectué avec succès!"