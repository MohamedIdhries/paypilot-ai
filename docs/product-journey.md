# Product journey

## Product promise

PayPilot AI is a conversational shopping companion for Indian shoppers who want useful product decisions without manually searching through dozens of filters. It understands the reason behind a purchase, recommends with evidence, and can complete the payment flow after the shopper explicitly confirms.

## Exact MVP journey

### 1. Discover

The shopper opens the chat and writes a request such as:

> I need wireless headphones under ₹3000 with good battery life for gaming.

The request can include:

- Product category
- Maximum budget
- Intended use or occasion
- Must-have requirements
- Nice-to-have preferences
- Brand or compatibility preferences

### 2. Understand intent

The intent node converts the message into:

```json
{
  "category": "wireless headphones",
  "budget": { "currency": "INR", "max": 3000 },
  "use_case": ["gaming"],
  "hard_constraints": ["wireless"],
  "soft_preferences": ["long battery life"],
  "missing_information": [],
  "confidence": 0.93
}
```

If a hard requirement is missing or ambiguous, the agent asks one concise question rather than guessing. If the intent is sufficient, it proceeds directly to search.

### 3. Search

The product tool searches the curated catalog using normalized attributes, availability, and the latest server-side price. Phase 1 uses a seeded product catalog so the entire purchase loop can be demonstrated reliably.

### 4. Rank

Candidates are scored using:

1. Hard-constraint satisfaction, which can disqualify a product.
2. Budget fit and value.
3. Use-case fit.
4. Preference match.
5. Catalog quality signals such as rating, stock, and warranty.

The score is deterministic for the same catalog snapshot. The LLM explains the result but does not invent product facts or prices.

### 5. Recommend and compare

The agent presents up to three matches. Each recommendation includes:

- Product name and current price
- The strongest matching attributes
- A concise reason for the ranking
- Any meaningful trade-off

The shopper can ask a follow-up question or request a comparison. Comparison is limited to the retrieved candidates and cites the attributes used.

### 6. Confirm an action

The shopper says “Buy #1”, “Add #2 to cart”, or an equivalent explicit command. The agent must not create an order from a recommendation alone.

The server revalidates the product ID, price, stock, and quantity before changing the cart.

### 7. Create a Razorpay order

The backend creates a Razorpay order in test mode using the validated cart total in paise. The response contains only the checkout-safe values needed by the browser, including the Razorpay order ID and public key ID.

### 8. Complete Checkout

The frontend opens Razorpay Checkout with the server-created order. The amount is never accepted from the browser as authoritative.

### 9. Verify payment

The backend verifies the Razorpay signature using the server secret. A client callback is treated as a signal to verify, not as proof of success. The webhook is the durable payment-state update and is processed idempotently.

### 10. Confirm the order

After verified payment, the order moves to paid/confirmed and the shopper sees a clear receipt state. Failed, cancelled, and pending states are explicit and recoverable.

### 11. Remember with consent

The agent may offer to remember a useful preference such as “prefers long battery life under ₹3000.” The shopper must opt in. Payment details and sensitive information are never stored in agent memory.

## Non-goals for the first build

- Live marketplace scraping
- Automatic purchase without confirmation
- Production shipping and fulfillment
- Multi-vendor settlement
- Storing card, UPI, or bank credentials
- A general-purpose autonomous agent with unrestricted tool access

## Hackathon differentiators

### Purchase intent

The shopper can describe a goal rather than a filter set, for example:

> I need something for gaming, but I don't want to spend more than ₹5k.

### Explainable recommendations

Every recommendation answers “why this one?” using the structured intent and catalog attributes:

> I recommend Product A because it fits your ₹5,000 budget, has the longest battery life among the available options, and is better suited for gaming.