# Contributing

Thanks for helping improve LocalAI Growth Agent.

## Local setup

```bash
npm ci
copy .env.example .env.local
npm test
npm run lint
npm run build
```

Add your own provider key to `.env.local`. Never commit API keys or `.env.local`.

Small documentation and bug fixes can go directly to a pull request. For larger changes, open an issue first so the scope can be agreed before implementation.

Useful contribution areas include:

- merchant and industry examples;
- provider adapters;
- output safety and validation;
- accessibility and interface improvements;
- setup and usage documentation.

In a pull request, explain the user-facing change, link the related issue when one exists, and confirm that test, lint, and build checks pass.
