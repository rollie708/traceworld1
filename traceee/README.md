# TraceWorld

**Decode. Trace. Understand.**

TraceWorld is a small Next.js + TypeScript smart contract intelligence interface for Ethereum mainnet. It retrieves public contract metadata and verified ABI information from Etherscan API V2 and presents the result with clear evidence.

## What is included

- `app/page.tsx` — branded homepage and contract search form.
- `app/analyze/page.tsx` — analyzer screen with loading, error, unverified, and results states.
- `app/methodology/page.tsx` — explains the data source and analysis limits.
- `app/api/analyze/route.ts` — the only server-side API route. It validates addresses, calls Etherscan, and never sends the API key to the browser.
- `components/` — reusable header, search form, and analyzer UI.
- `lib/analysis.ts` — ABI parsing and evidence-based indicator logic.
- `public/traceworld-logo.svg` — standalone TraceWorld brand asset inspired by the supplied black-and-gold logo direction.
- `.env.example` — safe environment variable template.
- `.gitignore` — excludes dependencies, builds, local environment files, and secrets.

## Run locally

You need Node.js 18.17 or newer.

```bash
npm install
copy .env.example .env.local
```

Open `.env.local` and replace the placeholder with an Etherscan API key:

```env
ETHERSCAN_API_KEY=your_real_key_here
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The API key is read only by `app/api/analyze/route.ts`. Do not put it in a `NEXT_PUBLIC_` variable and do not commit `.env.local`.

## Checks and production build

```bash
npm run typecheck
npm run build
npm run start
```

The app handles invalid addresses before making a request. With no API key, it shows a configuration error instead of creating fake analysis data. To test the live integration, add the key and analyze a known Ethereum address with a browser or curl:

```bash
curl "http://localhost:3000/api/analyze?address=0x0000000000000000000000000000000000000000"
```

## Upload to GitHub

### GitHub website

1. Create a new empty repository on GitHub named `traceworld`.
2. Do not add a README, `.gitignore`, or license during repository creation.
3. Open the repository, choose **Add file → Upload files**, and upload the contents of this folder.
4. Confirm that `.env.local`, `node_modules`, and `.next` are not selected.
5. Commit the files.

### Git commands

From this folder:

```bash
git init
git add .
git commit -m "Create TraceWorld contract intelligence app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/traceworld.git
git push -u origin main
```

## Deploy to Vercel

1. Sign in at [vercel.com](https://vercel.com) and choose **Add New → Project**.
2. Import the GitHub repository.
3. Keep the detected Next.js settings.
4. In **Settings → Environment Variables**, add `ETHERSCAN_API_KEY` with your real key for Production, Preview, and Development as needed.
5. Deploy.
6. Open the generated Vercel domain, submit an Ethereum contract address, and confirm that the analysis appears.

The first version intentionally has no database, accounts, wallet connection, payments, token, or claims of contract safety. A detected or not-detected indicator is a useful research signal, not a professional security audit.
