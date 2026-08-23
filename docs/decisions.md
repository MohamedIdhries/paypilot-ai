# Technology decisions

## Decision summary

| Area | Choice | Reason |
| --- | --- | --- |
| Frontend | React + Vite + TypeScript | Fast iteration, component ecosystem, and a good fit for a chat-first web experience |
| Backend | Python + FastAPI | Clear typed request boundaries, async support, and strong AI ecosystem support |
| Agent orchestration | LangGraph | Explicit stateful nodes and guarded transitions instead of an opaque autonomous loop |
| LLM access | Replit AI Integration | Keeps provider credentials out of the repository and makes the first build portable |
| Product data | PostgreSQL | Reliable source of truth for catalog, cart, orders, and memory metadata |
| Search | PostgreSQL filtering/ranking first | Deterministic and easy to demo; embeddings can be added only when product text requires them |
| Payments | Razorpay Test Mode | Matches the target Indian checkout flow and supports server-created orders plus signature verification |
| Authentication | Managed authentication provider | Avoids building and maintaining custom password/JWT issuance in the MVP |
| Version control | GitHub | Collaboration, review, and hackathon presentation |

## Why the stack is intentionally small

The first success criterion is one trustworthy end-to-end purchase loop, not a broad platform. Each choice should reduce the number of moving parts between intent and verified order:

- Use one backend boundary for AI, catalog, cart, and payments.
- Keep ranking deterministic so explanations can be checked.
- Keep the product catalog curated until live data quality is solved.
- Add RAG only when keyword/attribute retrieval is insufficient.
- Treat payment state as transactional backend data, never model-generated prose.

## Authentication note

The user-facing product will need authenticated carts and orders. Implementation should use a managed auth integration and verify its issued identity at the FastAPI boundary. A custom local password system or hand-rolled JWT issuer is out of scope.

## Payment invariants

- Create a Razorpay order before opening Checkout.
- Keep `RAZORPAY_KEY_SECRET` and webhook secrets on the server.
- Recompute the payable amount from the server-side cart.
- Verify the checkout signature on the server.
- Verify webhook signatures and make event handling idempotent.
- Never mark an order paid from a browser-only callback.

## Delivery sequence

1. Lock the contract and seed catalog.
2. Build chat-to-recommendation with explanations.
3. Add cart persistence and explicit action gating.
4. Add Razorpay order creation and test checkout.
5. Add signature verification, webhook handling, and receipt states.
6. Add consented memory and the hackathon polish layer.