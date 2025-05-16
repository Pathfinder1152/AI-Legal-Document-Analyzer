@echo off
REM Script to extract RoBERTa model files to the clause classifier directory
REM Usage: extract_model.bat <zip_file_path>

SET MODEL_DIR=D:\AI NEW\Pathfinder1152\AI-Legal-Document-Analyzer\backend\backend_core\models\clause_classifier

echo Extracting model files to %MODEL_DIR%...

if "%~1"=="" (
    echo Error: Please provide the path to the model zip file
    echo Usage: extract_model.bat ^<zip_file_path^>
    exit /b 1
)

if not exist "%~1" (
    echo Error: Model zip file does not exist: %~1
    exit /b 1
)

if exist "%MODEL_DIR%\model.safetensors" (
    echo Warning: Model files already exist in destination directory.
    set /p answer=Do you want to overwrite them? (y/n): 
    if /i not "%answer%"=="y" (
        echo Operation cancelled.
        exit /b 0
    )
)

REM Create temp directory
SET TEMP_DIR=%TEMP%\clause_model_extract
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

REM Extract to temp directory
echo Extracting zip file to temp directory...
powershell -command "Expand-Archive -Path '%~1' -DestinationPath '%TEMP_DIR%' -Force"

REM Copy files to model directory
echo Copying files to model directory...
xcopy /s /y "%TEMP_DIR%\*" "%MODEL_DIR%\"

REM Clean up
rmdir /s /q "%TEMP_DIR%"

echo Model extraction complete!
echo You can now use the clause classifier in the AI Legal Document Analyzer.
