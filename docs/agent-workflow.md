# Agent Workflow

MarketFlow AI uses a modular agent workflow instead of a single prompt-to-content generation step.

## Workflow
1. Business Understanding Agent
2. Marketing Strategist Agent
3. Content Agent
4. Campaign Planner Agent
5. Analytics Agent
6. Optimization Agent

## State
The backend keeps structured state using Pydantic models for:
- business context
- campaign strategy
- content plan
- analytics summary
- optimization recommendations

## Key Principle
Deterministic analytics are calculated in Python. The LLM is used to interpret the metrics and recommend the next campaign plan.
