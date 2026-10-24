@echo off
setlocal
cd /d "%~dp0"
python -m pip install -e ".[dashboard]" >nul 2>&1
python -m streamlit run dashboard\streamlit_app.py --server.headless true --server.port 8501
