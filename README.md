# AI Therapy - Digital Wellness Companion

A modern web application providing AI-powered therapeutic support with empathetic conversations, designed to create a safe digital space for mental wellness.

## Features

- **AI-Powered Conversations**: Intelligent responses powered by Think AI with O(1) performance
- **Real-time Streaming**: Server-Sent Events for smooth, real-time message streaming
- **Session Persistence**: Eternal context that never forgets conversation history
- **Web Search Integration**: Real-time information with automatic fact-checking
- **Dark Mode Support**: Comfortable viewing in any lighting condition
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG AAA compliant with full keyboard navigation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **API**: Think AI API for conversational AI
- **Testing**: Jest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier with pre-commit hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai_therapy
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run E2E tests with Playwright

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and API clients
├── styles/          # Global styles and Tailwind config
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Design System

The application uses a carefully crafted design system focused on creating a calming, therapeutic environment:

- **Colors**: Soft pastels with semantic meaning
- **Typography**: Inter font family for readability
- **Animations**: Subtle micro-interactions for engagement
- **Layout**: 12-column grid with responsive breakpoints

## Testing

The project aims for 100% test coverage:

- **Unit Tests**: Component and utility testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user journey testing with Playwright

Run tests:

```bash
npm test
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (pre-commit hooks will run automatically)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
