# AI Vendor Accountability Dashboard

This project is a lightweight DataTables-based dashboard for tracking AI tools and vendors across a set of accountability criteria. It pulls data from Google Sheets, renders it in a searchable table, and color-codes key fields to make policy and usage status easier to scan.

## What this project does

- Loads vendor/tool information from Google Sheets
- Displays the data in a responsive DataTable
- Shows fields such as:
  - Database Vendor / Publisher
  - AI Tool Name (with access link)
  - AI functionality type
  - Third-party AI usage disclosure
  - Third-party AI providers
  - Whether the resource can be used without AI
  - Whether the model trains on user data
  - Whether data is retained
- Uses badge styling to represent status values such as Yes, No, Partial, Unclear, and No Data Found
- Includes a simple filtering setup for the main table categories

## Project structure

- [index.html](index.html) — main HTML entry point
- [demo.js](demo.js) — DataTables setup, Google Sheets load logic, and row transformation
- [demo.css](demo.css) — styling for the dashboard layout and badges
- [expanded2026/index.html](expanded2026/index.html) — alternate/expanded version of the dashboard
- [expanded2026/demo.js](expanded2026/demo.js) — expanded dashboard logic and field handling
- [expanded2026/demo.css](expanded2026/demo.css) — styling for the expanded version

## Data flow

The JavaScript fetches CSV data from a Google Sheet and parses it with Papa Parse. Each row is normalized into object properties that match the DataTable columns, then rendered as HTML with badges and labels.

Example fields include:

- `displayName`
- `productName`
- `aiTypes`
- `thirdPartyAIUsage`
- `thirdPartyAIProviders`
- `useResourceWithoutAI`
- `modelTrainOnData`
- `dataRetained`

## Recent fixes and improvements

We updated the data handling so fields that are single string values are treated as strings rather than arrays. This avoided runtime errors caused by calling `.map()` on a string.

The fixed fields include:

- `thirdPartyAIUsage`
- `useResourceWithoutAI`
- `dataRetained`

The logic still preserves the same badge-color behavior:

- Yes → primary color
- No → danger color
- Partial → info color
- Unclear → warning color
- No Data Found → success/info styling depending on the case
- default values fall back to a neutral secondary style

## How to run

Open the project in a browser from the root folder or the expanded dashboard folder. Because the page reads from Google Sheets, it should be served over a local web server or opened in a browser with the same origin restrictions in mind.

A simple local server can be used if needed, such as:

```bash
python3 -m http.server
```

Then open the relevant HTML page in the browser.

## Notes

This repository is intentionally lightweight and meant for dashboard prototyping and data presentation. It is a practical example of combining DataTables, Google Sheets, and UI badges for a policy/accountability review workflow.
