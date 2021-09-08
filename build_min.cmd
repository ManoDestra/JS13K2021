@echo off
del Rogue-19.min.zip
7z a Rogue-19.min.zip index_min.html assets\css assets\js\*.min.js assets\js\entities\*.min.js assets\js\screens\*.min.js
@echo on
