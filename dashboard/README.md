# TradingAgents Local Dashboard

This dashboard is a simple Streamlit UI for running the project locally on Windows.

## Requirements

- Python 3.11+
- An LLM provider API key or a local model endpoint configured for TradingAgents

## Install

From the repo root:

```powershell
python -m pip install -e ".[dashboard]"
```

## Run it

```powershell
streamlit run dashboard\streamlit_app.py
```

Or use the Windows batch helper:

```powershell
run_dashboard.bat
```

## Notes

- The form lets you choose the ticker, analysis date, analyst set, provider, models, and whether analysts run concurrently or sequentially.
- The app uses the same underlying TradingAgents graph as the CLI, so it behaves like the project’s normal analysis pipeline.
- If the selected provider requires an API key, set the matching environment variable before starting the run.
