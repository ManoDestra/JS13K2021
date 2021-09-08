@echo off
del *.zip
7z a Rogue-19.zip index.html assets\css assets\js\*.min.js assets\js\entities\*.min.js assets\js\screens\*.min.js
@echo on
