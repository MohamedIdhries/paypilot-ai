import { type KeyboardEvent, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  Command,
  Gift,
  History,
  Lightbulb,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type NavKey = 'current' | 'past' | 'gift';

type Recommendation = {
  name: string;
  brand: string;
  price: string;
  reason: string;
};

const examples = [
  'A carry-on for frequent trips',
  'Headphones for deep work',
  'A gift for a new parent',
];

const recommendations: Recommendation[] = [
  {
    name: 'Transit 40L Carry-On',
    brand: 'Monarc',
    price: '$295',
    reason: 'The best fit for a frequent traveler who wants a calm, flexible interior without giving up a compact footprint.',
  },
  {
    name: 'Everywhere Bag 40L',
    brand: 'Pakt',
    price: '$295',
    reason: 'A considered alternative with an unusually good laptop compartment and a thoughtful split-case opening.',
  },
  {
    name: 'Carry-On Pro',
    brand: 'July',
    price: '$275',
    reason: 'The lighter pick: smooth wheels and a clean silhouette, with a little less room for overpackers.',
  },
];

function App() {
  const [brief, setBrief] = useState('');
  const [submittedBrief, setSubmittedBrief] = useState('');
  const [activeNav, setActiveNav] = useState<NavKey>('current');
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalog, setCatalog] = useState('Core catalog');

  const hasShortlist = submittedBrief.trim().length > 0;

  const startNewSession = () => {
    setBrief('');
    setSubmittedBrief('');
    setActiveNav('current');
  };

  const sendBrief = () => {
    if (!brief.trim()) return;
    setSubmittedBrief(brief.trim());
  };

  const chooseExample = (example: string) => {
    setBrief(example);
    setActiveNav('current');
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendBrief();
    }
  };

  return (
    <main className="paypilot-app">
      <aside className="left-rail">
        <button className="wordmark" onClick={startNewSession} aria-label="Start a new PayPilot AI session">
          <span className="wordmark-name">PayPilot AI</span>
          <span className="wordmark-subline">Buy with clarity</span>
        </button>

        <button className="new-session-button" onClick={startNewSession}>
          <span className="flex items-center gap-2">
            <Plus size={15} strokeWidth={1.8} />
            New buying session
          </span>
          <span className="shortcut">
            <Command size={9} /> K
          </span>
        </button>

        <nav className="nav-stack" aria-label="Workspace">
          <p className="nav-label">Workspace</p>
          <button
            className={`nav-item ${activeNav === 'current' ? 'active' : ''}`}
            onClick={() => setActiveNav('current')}
          >
            <Sparkles />
            <span>Current session</span>
          </button>
          <button
            className={`nav-item ${activeNav === 'past' ? 'active' : ''}`}
            onClick={() => setActiveNav('past')}
          >
            <History />
            <span>Past sessions</span>
          </button>
          <button
            className={`nav-item ${activeNav === 'gift' ? 'active' : ''}`}
            onClick={() => setActiveNav('gift')}
          >
            <Gift />
            <span>Gift finder</span>
          </button>
        </nav>

        <div className="trust-card">
          <div className="trust-mark">
            <ShieldCheck />
          </div>
          <h3>Grounded, not sponsored</h3>
          <p>Recommendations are shaped by your brief, not by paid placement or affiliate pressure.</p>
        </div>
      </aside>

      <section className="workspace">
        <section className="brief-panel" aria-label="Buying brief">
          <header className="workspace-bar">
            <div className="session-meta">
              <span className="session-title">Shopping companion</span>
              <span className="session-index">/ 01</span>
            </div>
            <div className="bar-right">
              <span className="status-pill">Catalog live</span>
              <div className="catalog-wrap">
                <button
                  className="catalog-button"
                  aria-expanded={catalogOpen}
                  onClick={() => setCatalogOpen((open) => !open)}
                >
                  <span className="catalog-label">{catalog}</span>
                  <ChevronDown />
                </button>
                {catalogOpen && (
                  <div className="catalog-menu">
                    <button className="catalog-option" onClick={() => { setCatalog('Core catalog'); setCatalogOpen(false); }}>
                      Core catalog <small>LIVE</small>
                    </button>
                    <button className="catalog-option" onClick={() => { setCatalog('Independent makers'); setCatalogOpen(false); }}>
                      Independent makers <small>NEW</small>
                    </button>
                    <button className="catalog-option" onClick={() => { setCatalog('All sources'); setCatalogOpen(false); }}>
                      All sources <small>WIDE</small>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="brief-content">
            <div className="brief-label">Your brief</div>
            <h1 className="headline">
              Find the one
              <span>worth buying.</span>
            </h1>
            <p className="brief-description">
              A smarter conversation for considered purchases. I will translate your words into a shortlist you can actually trust.
            </p>
            <div className="assistant-hint">
              <Sparkles />
              <span>Tell me what you are shopping for. Include a budget, where you will use it, and anything you refuse to compromise on.</span>
            </div>

            <div className="example-row" aria-label="Example briefs">
              {examples.map((example) => (
                <button className="example-chip" key={example} onClick={() => chooseExample(example)}>
                  {example}
                </button>
              ))}
            </div>

            <div className="composer">
              <textarea
                value={brief}
                maxLength={1000}
                onChange={(event) => setBrief(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Describe the thing you want to buy..."
                aria-label="Describe the thing you want to buy"
              />
              <div className="composer-footer">
                <span className="composer-meta">{brief.length}/1000 · Enter to send</span>
                <button className="send-button" onClick={sendBrief} disabled={!brief.trim()} aria-label="Send buying brief">
                  <Send />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="shortlist-panel" aria-label="Curated shortlist">
          <header className="shortlist-header">
            <div>
              <div className="eyebrow">Curated for you</div>
              <h2 className="shortlist-title">The shortlist</h2>
            </div>
            <span className="status-awaiting">{hasShortlist ? 'READY TO REVIEW' : 'AWAITING BRIEF'}</span>
          </header>

          {hasShortlist ? (
            <>
              <div className="recommendation-list">
                {recommendations.map((recommendation, index) => (
                  <article className="recommendation-card" key={recommendation.name}>
                    <div className="recommendation-top">
                      <span className="recommendation-rank">0{index + 1} / MATCH</span>
                      <span className="recommendation-price">{recommendation.price}</span>
                    </div>
                    <h3>{recommendation.name}</h3>
                    <div className="recommendation-brand">{recommendation.brand}</div>
                    <p className="recommendation-reason">
                      <strong>Why it made the cut.</strong> {recommendation.reason}
                    </p>
                  </article>
                ))}
              </div>
              <p className="shortlist-caption">
                Built from “{submittedBrief.length > 72 ? `${submittedBrief.slice(0, 72)}…` : submittedBrief}”
              </p>
              <button className="reset-link" onClick={startNewSession}>Start another brief</button>
            </>
          ) : (
            <div className="empty-shortlist">
              <div className="lightning-mark">
                <Lightbulb />
              </div>
              <h3>Start with a feeling.</h3>
              <p>Your shortlist will show up here with the reasoning, not just a star rating.</p>
              <div className="empty-note">Waiting for your first brief</div>
            </div>
          )}
        </section>

        <aside className="decision-rail" aria-label="How PayPilot decides">
          <div className="rail-eyebrow">How I decide</div>
          <h2>A good recommendation makes its logic visible.</h2>
          <p className="decision-intro">No mystery scores. Just a few clear steps between what you said and what belongs on your list.</p>

          <div className="step-list">
            <div className="step">
              <span className="step-number">01</span>
              <div>
                <div className="step-label">Understand</div>
                <p>I pull out your real priorities, constraints, and the trade-offs you will actually notice.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">02</span>
              <div>
                <div className="step-label">Compare</div>
                <p>I weigh the meaningful differences, not an endless pile of near-identical options.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">03</span>
              <div>
                <div className="step-label">Explain</div>
                <p>Every pick comes with a reason you can agree with, question, or take somewhere else.</p>
              </div>
            </div>
          </div>

          <div className="spiral-callout">
            <strong>No browsing spiral.</strong>
            <p>Just a focused path from “maybe” to “this is the one.”</p>
          </div>
          <button className="flex items-center gap-1 mt-7 border-0 bg-transparent p-0 text-[10px] text-foreground" onClick={() => setActiveNav('current')}>
            See how it works <ArrowUpRight size={13} />
          </button>
        </aside>
      </section>
    </main>
  );
}

export default App;