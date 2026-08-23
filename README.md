# PayPilot AI

AI-powered autonomous commerce agent for intelligent product discovery, recommendations, and Razorpay payments.

## Project status

Phase 1 is complete: the MVP journey, agent boundaries, technology choices, repository structure, and delivery guardrails are documented. The first working product will focus on one complete path:

**Natural-language request → product recommendation → cart → Razorpay test payment → verified order confirmation**

## MVP user journey

1. The shopper describes what they need in natural language, including budget, use case, and preferences.
2. PayPilot extracts the intent into structured constraints and asks one focused clarification only when necessary.
3. The product search tool retrieves matching items from the catalog.
4. The recommendation engine ranks the candidates against the shopper's hard and soft constraints.
5. The agent explains the top recommendation and offers a short comparison.
6. The shopper confirms a product with an action such as “Buy #1”.
7. The server adds the selected item to the cart and creates a Razorpay order.
8. The client opens Razorpay Checkout using the server-created order.
9. The server verifies the payment signature and processes the webhook idempotently.
10. PayPilot confirms the order and stores only the memory the shopper has explicitly allowed.

## Repository map

```text
paypilot-ai/
├── frontend/       # React + Vite shopper experience
├── backend/        # FastAPI HTTP API and commerce orchestration boundary
├── ai/             # LangGraph agent nodes, prompts, ranking, and memory policy
├── database/       # PostgreSQL schema, seed data, and migrations
├── docs/           # Product journey, architecture, and technology decisions
├── .env.example    # Names and safe placeholders for local configuration
├── .gitignore
├── README.md
└── LICENSE
```

The Replit workspace currently contains the shared API and design-preview foundations. The runnable frontend and backend implementation will be added in the next phase without changing the product contract in `docs/`.

## Architecture at a glance

The frontend talks only to the backend. The backend owns catalog access, cart mutations, Razorpay order creation, signature verification, webhook handling, and persistence. The AI layer can propose an action, but payment state is always decided by server-side verification.

See:

- [`docs/product-journey.md`](docs/product-journey.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/decisions.md`](docs/decisions.md)

## Local setup

The application packages are intentionally scaffolded before implementation. Copy `.env.example` to `.env` when development begins, fill values through the project's secret manager, and keep real credentials out of Git.

## Security guardrails

- Razorpay secrets stay on the server.
- The browser never decides whether a payment succeeded.
- Webhook processing is signature-verified and idempotent.
- Product prices are read again on the server before creating an order.
- Agent actions require explicit shopper confirmation.
- Memory is opt-in and scoped to the shopper.

## License

MIT. See [`LICENSE`](LICENSE).