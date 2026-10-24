import datetime as dt
import os

import streamlit as st

from cli.models import AnalystType
from cli.prompts import detect_asset_type
from tradingagents.default_config import DEFAULT_CONFIG
from tradingagents.graph.trading_graph import TradingAgentsGraph

ANALYST_CHOICES = [
    ("Market Analyst", "market"),
    ("Sentiment Analyst", "social"),
    ("News Analyst", "news"),
    ("Fundamentals Analyst", "fundamentals"),
]

PROVIDERS = [
    "openai",
    "google",
    "anthropic",
    "deepseek",
    "qwen",
    "mistralai",
    "ollama",
    "openai_compatible",
]


def _provider_options() -> list[str]:
    """Choose providers the app offers in a local Windows setup."""
    return [provider for provider in PROVIDERS if provider in PROVIDERS]


def _analyst_keys(selected: list[str]) -> list[str]:
    selected_map = {value: key for _, key in ANALYST_CHOICES}
    return [selected_map[item] for item in selected]


def _run_analysis(ticker: str, trade_date: str, analysts: list[str], provider: str,
                  quick_model: str, deep_model: str, depth: int, analyst_mode: str):
    normalized_ticker = ticker.strip()
    if not normalized_ticker:
        raise ValueError("Ticker is required.")
    if not analysts:
        raise ValueError("Select at least one analyst.")

    config = DEFAULT_CONFIG.copy()
    config.update({
        "llm_provider": provider,
        "quick_think_llm": quick_model,
        "deep_think_llm": deep_model,
        "backend_url": None,
        "output_language": "English",
        "max_debate_rounds": depth,
        "max_risk_discuss_rounds": depth,
        "analyst_run_mode": analyst_mode,
    })

    asset_type = detect_asset_type(normalized_ticker).value
    selected_analyst_keys = _analyst_keys(analysts)
    graph = TradingAgentsGraph(selected_analyst_keys, config=config, debug=False)
    final_state, rating = graph.propagate(normalized_ticker, trade_date, asset_type=asset_type)
    return graph, final_state, rating


def main():
    st.set_page_config(page_title="TradingAgents Dashboard", page_icon="📈", layout="wide")
    st.title("TradingAgents Local Dashboard")
    st.caption("Run the project on Windows with a local Streamlit interface.")

    required_keys = [
        "OPENAI_API_KEY",
        "GOOGLE_API_KEY",
        "ANTHROPIC_API_KEY",
        "DEEPSEEK_API_KEY",
        "FRED_API_KEY",
    ]
    missing = [key for key in required_keys if key and not os.getenv(key)]
    if missing:
        st.info(
            "Some providers may require API keys. You can still use the UI and fill in the model settings; "
            "set the matching environment variables before running the analysis."
        )

    with st.form("tradingagents_form"):
        col1, col2 = st.columns(2)
        with col1:
            ticker = st.text_input("Ticker", value="NVDA")
            selected_analysts = st.multiselect(
                "Analysts",
                options=[label for label, _ in ANALYST_CHOICES],
                default=["Market Analyst", "News Analyst"],
            )
            provider = st.selectbox("LLM Provider", options=_provider_options(), index=0)

        with col2:
            trade_date = st.date_input(
                "Analysis date",
                value=dt.date.today() - dt.timedelta(days=1),
                min_value=dt.date(2000, 1, 1),
                max_value=dt.date.today(),
            )
            analyst_mode = st.selectbox(
                "Analyst execution mode",
                options=["concurrent", "sequential"],
                index=0,
                help="Concurrent starts all selected analysts together; sequential runs one after another.",
            )
            depth = st.selectbox(
                "Research depth",
                options=[1, 3, 5],
                index=1,
            )
            quick_model = st.text_input("Quick analyst model", value=DEFAULT_CONFIG["quick_think_llm"])
            deep_model = st.text_input("Deep manager model", value=DEFAULT_CONFIG["deep_think_llm"])

        run_clicked = st.form_submit_button("Run analysis")

    if run_clicked:
        try:
            with st.spinner(f"Running {ticker} on {trade_date.isoformat()}..."):
                graph, final_state, rating = _run_analysis(
                    ticker=ticker,
                    trade_date=trade_date.isoformat(),
                    analysts=selected_analysts,
                    provider=provider,
                    quick_model=quick_model,
                    deep_model=deep_model,
                    depth=depth,
                    analyst_mode=analyst_mode,
                )

            st.success(f"Analysis complete. Rating: {rating}")

            st.subheader("Decision")
            st.write(final_state.get("final_trade_decision", "No final decision produced."))

            st.subheader("Investment plan")
            st.write(final_state.get("investment_plan", "No investment plan produced."))

            st.subheader("Analyst reports")
            report_map = {
                "market": final_state.get("market_report"),
                "social": final_state.get("sentiment_report"),
                "news": final_state.get("news_report"),
                "fundamentals": final_state.get("fundamentals_report"),
            }
            for label, key in ANALYST_CHOICES:
                report = report_map.get(key)
                if report:
                    with st.expander(label):
                        st.markdown(report)

            if st.button("Save HTML report"):
                save_path = graph.default_report_path(ticker)
                graph.save_reports(final_state, ticker, save_path, html=True)
                st.success(f"Report saved to: {save_path}")

        except Exception as exc:  # pragma: no cover - UI path
            st.error(f"The run failed: {exc}")
            st.caption("Check your LLM provider, API key, and model names before retrying.")


if __name__ == "__main__":
    main()
