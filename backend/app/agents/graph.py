from langgraph.graph import END, START, StateGraph

from app.agents.analytics_agent import interpret_analytics
from app.agents.business_agent import build_business_context
from app.agents.content_agent import build_content_creatives
from app.agents.optimization_agent import build_optimization_recommendations
from app.agents.planner_agent import build_campaign_plan
from app.agents.state import MarketingState
from app.agents.strategy_agent import build_strategy
from app.schemas.analytics import AnalyticsSummary
from app.services.analytics_service import MetricRecord, summarize_analytics


def _business_node(state: MarketingState) -> dict[str, object]:
    campaign = state["campaign"]
    business = state["business"]
    return {"business_context": build_business_context(campaign, business)}


def _strategy_node(state: MarketingState) -> dict[str, object]:
    return {"strategy": build_strategy(state["business_context"])}


def _content_node(state: MarketingState) -> dict[str, object]:
    return {"content_items": build_content_creatives(state["business_context"], state["strategy"])}


def _planner_node(state: MarketingState) -> dict[str, object]:
    return {
        "campaign_plan": build_campaign_plan(
            state["campaign"],
            state["strategy"],
            state["content_items"],
        )
    }


def _analytics_node(state: MarketingState) -> dict[str, object]:
    campaign = state["campaign_record"]
    content_lookup = {content.id: content.content_type for content in campaign.content_items}
    metrics = [
        MetricRecord(
            content_item_id=metric.content_item_id,
            channel=metric.channel,
            content_type=content_lookup.get(metric.content_item_id, metric.channel),
            impressions=metric.impressions,
            reach=metric.reach,
            engagements=metric.engagements,
            clicks=metric.clicks,
            conversions=metric.conversions,
            spend=float(metric.spend),
        )
        for metric in getattr(campaign, "metrics", [])
    ]
    analytics = summarize_analytics(campaign.id, metrics)
    return {"analytics": analytics, "insights": interpret_analytics(analytics)}


def _optimization_node(state: MarketingState) -> dict[str, object]:
    return {
        "recommendations": build_optimization_recommendations(
            state["business_context"],
            state["strategy"],
            state["insights"],
        )
    }


_workflow = StateGraph(MarketingState)
_workflow.add_node("business", _business_node)
_workflow.add_node("strategy", _strategy_node)
_workflow.add_node("content", _content_node)
_workflow.add_node("planner", _planner_node)
_workflow.add_node("analytics", _analytics_node)
_workflow.add_node("optimization", _optimization_node)

_workflow.add_edge(START, "business")
_workflow.add_edge("business", "strategy")
_workflow.add_edge("strategy", "content")
_workflow.add_edge("content", "planner")
_workflow.add_edge("planner", "analytics")
_workflow.add_edge("analytics", "optimization")
_workflow.add_edge("optimization", END)

marketing_graph = _workflow.compile()
