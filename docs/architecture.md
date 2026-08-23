# Architecture

## System boundary

```text
┌─────────────────────────┐
│ Shopper                 │
└───────────┬─────────────┘
            │ chat, comparison, explicit action
            ▼
┌─────────────────────────┐
│ React + Vite frontend   │
│ chat, products, checkout│
└───────────┬─────────────┘
            │ HTTPS API
            ▼
┌─────────────────────────┐
│ FastAPI backend         │
│ auth, cart, order state  │
└─────┬────────┬──────────┘
      │        │
      │        ├──────────────────────┐
      ▼        ▼                      ▼
┌──────────┐ ┌───────────────┐ ┌──────────────┐
│ LangGraph│ │ Catalog tool  │ │ PostgreSQL   │
│ agent    │ │ + ranker      │ │ users/orders │
└────┬─────┘ └───────────────┘ └──────────────┘
     │
     ├── intent parser
     ├── recommendation explainer
     ├── comparison node
     └── memory policy

FastAPI ───────────────► Razorpay Orders API
FastAPI ◄─────────────── Razorpay webhook
Frontend ─────────────── Razorpay Checkout
```

## Component responsibilities

### Frontend

- Render the conversation and product recommendations.
- Send shopper messages to the backend.
- Display loading, empty, error, payment pending, and confirmed states.
- Trigger Razorpay Checkout only with server-provided order data.
- Never calculate or trust the final payable amount.

### Backend

- Own the public API and session/user boundary.
- Orchestrate agent runs through a narrow tool interface.
- Validate all request and response data.
- Read product and price data from PostgreSQL.
- Own cart mutations and order state transitions.
- Create Razorpay orders and verify payment signatures.
- Authenticate and verify Razorpay webhooks.
- Enforce idempotency and audit important agent actions.

### AI agent

The agent is a bounded workflow, not an unrestricted loop. Its nodes are:

1. **Intent node** — parse category, budget, use case, constraints, preferences, and confidence.
2. **Clarification node** — ask only for information required to search safely.
3. **Product search tool** — retrieve product IDs and factual catalog attributes.
4. **Ranking node** — apply deterministic hard/soft constraint scoring.
5. **Explanation node** — describe the recommendation from retrieved facts.
6. **Comparison node** — compare only retrieved candidates.
7. **Action gate** — require explicit shopper confirmation before cart or payment actions.
8. **Memory node** — save only consented, non-sensitive preferences.

The LLM can choose among these bounded nodes, but it cannot directly call Razorpay, write payment state, change prices, or bypass the action gate.

### Catalog and ranking

Phase 1 uses a curated PostgreSQL catalog with normalized product attributes. Retrieval and ranking remain separate:

- Retrieval finds plausible candidates.
- Ranking applies hard constraints first, then weighted preference scoring.
- Explanation receives the winning score breakdown and source attributes.

Embeddings/RAG can be added later for unstructured product descriptions, but they are not a prerequisite for a reliable MVP purchase loop.

### Memory

Memory is a separate, consent-aware store containing preferences, not a transcript dump. Each memory has a source, confidence, scope, and optional expiry. The agent must be able to answer without memory and must never store payment credentials or secrets.

### Payments

Payment is a backend-owned state machine:

```text
cart
  → order_created
  → checkout_opened
  → payment_pending
  → paid
  → confirmed
```

Failure branches include cancelled, failed, expired, and webhook-retry states. Only verified server events can move an order to `paid` or `confirmed`.

## API shape for the MVP

The implementation phase should expose:

- `POST /api/chat` — run the bounded commerce workflow.
- `GET /api/products/:id` — retrieve a product detail.
- `POST /api/cart/items` — add a validated product to the cart.
- `GET /api/cart` — read the current cart.
- `POST /api/checkout/order` — create a Razorpay order from the server cart.
- `POST /api/payments/verify` — verify checkout response signatures.
- `POST /api/payments/webhook` — receive and idempotently process Razorpay events.
- `GET /api/orders/:id` — read the shopper's order state.

All mutating endpoints should accept an idempotency key where retries can create duplicate effects.

## Trust boundaries

1. Browser to backend: validate identity, schema, and ownership.
2. Backend to LLM: send the minimum context and treat model output as untrusted data.
3. Backend to catalog: use server-side product IDs and current prices.
4. Backend to Razorpay: keep the secret and signing logic server-side.
5. Razorpay webhook to backend: verify signature before parsing the event as authoritative.

## Deployment shape

The first implementation can run as a small frontend plus FastAPI service with PostgreSQL. Deployment details should remain portable: the frontend can be served statically, while the backend needs a long-lived HTTPS endpoint for webhooks. The production provider choice is intentionally deferred until the MVP is working.