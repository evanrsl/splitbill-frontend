# Split Bill Frontend

A Next.js web application for splitting bills using OCR technology to extract items from receipt images.

## Features

- 📱 **Mobile-First Design** - Fully responsive for all devices
- 📷 **Receipt Upload** - Take photos or upload receipt images
- 🔍 **OCR Processing** - Automatically extract items and prices
- ✏️ **Edit Items** - Modify descriptions, prices, add or remove items
- 👥 **Member Management** - Add people to split the bill with
- 🎯 **Item Assignment** - Assign specific items to specific people
- 💰 **Smart Summary** - Calculate individual totals and bill breakdown

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Communication**: Fetch API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or create the project**:

```bash
npx create-next-app@latest split-bill-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd split-bill-frontend
```

2. **Install dependencies**:

```bash
npm install zustand axios uuid
npm install -D @types/uuid
```

3. **Set up environment variables**:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── steps/
│   │   ├── UploadStep.tsx
│   │   ├── ConfirmStep.tsx
│   │   ├── AssignStep.tsx
│   │   └── SummaryStep.tsx
│   └── ui/
│       └── EditableListItem.tsx
├── lib/
│   └── api.ts
├── store/
│   └── billStore.ts
└── types/
    └── index.ts
```

## API Integration

The app communicates with a backend OCR service:

**Endpoint**: `POST /api/v1/extract`

**Request**: FormData with image file
**Response**: JSON with extracted items

```typescript
{
  "items": [
    { "description": "Burger", "price": 15.50 },
    { "description": "Soda", "price": 2.75 }
  ]
}
```

## Usage Flow

1. **Upload Receipt**: Take a photo or select an image
2. **Process**: Click "Process Receipt" to extract items via OCR
3. **Confirm Items**: Review, edit, add, or remove items
4. **Add Members**: Add people who will split the bill
5. **Assign Items**: Assign specific items to specific people
6. **View Summary**: See individual totals and bill breakdown

## State Management

Uses Zustand for simple, efficient state management:

- **BillState**: Central store for all app state
- **Actions**: Methods to update state (setters, add/remove items, etc.)
- **Derived Data**: Calculated values like member totals

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Build

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
