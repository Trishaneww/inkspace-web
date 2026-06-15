<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Multi-phase dialog forms

Any multi-step / phase dialog form (booking flow, onboarding, future ones) MUST follow the onboarding-dialog architecture. Reference: `components/onboarding/*` and `components/book/*` (BookingFlowDialog).

- **Slim dialog** — only header + content + footer. The content renders the heading from a config constant and delegates the body to a `PhaseContent`/`renderPhaseContent` **switch** over the current phase. Never inline phase markup or stuff JSX into a `node` field on a steps array.
- **One component per phase** in the feature folder, props `{ form, update, ...extras }`. Local array-field helpers (toggle/setTime) live in the phase, driven by the generic `update`.
- **Config constant** `*_PHASE_META: Record<Phase, { lead; rest }>` holds header/title copy, keyed by phase — not scattered through JSX.
- **Phase identity** is an enum in `types/` (discriminated union when a phase carries data, e.g. custom questions).
- **State lives in hooks, not the component.** Collapse many `useState`s into one `form` object + a generic `update(patch)`. Split into related hooks when cleaner: an orchestrator (`useXFlow`: navigation/validation/submit) plus focused concerns (e.g. `useReferenceUploads`). Pure logic (phase-list building, validation, payload building) goes in `lib/`.
- **React Compiler gotcha:** don't pass a hook/controller object that holds a ref straight into a child's render or a render helper ("Cannot access refs during render"). Destructure it into locals at the top of the component first.
