# AIREACH

An advanced AI-powered webinar platform for marketers and business owners built with Next.js 15, TypeScript, and modern web technologies. This platform enables seamless webinar creation, hosting, and monetization with interactive AI-powered features.

## 🚀 Features

- **AI-Powered Webinar Hosts**: Create webinars with AI hosts that can present content and engage with attendees
- **Interactive Call Popups**: Display popups for attendees to book calls with trained AI sales agents
- **E-commerce Integration**: Allow attendees to purchase products during livestreams
- **Lead Generation**: Capture and manage leads from webinar registrations
- **Sales Tracking**: Monitor real-time sales generated from your webinars
- **Analytics Dashboard**: Track attendance, engagement, and performance metrics
- **Secure Authentication**: Built with Clerk for secure user management
- **Responsive Design**: Works seamlessly across all devices
- **Video Integration**: Powered by Stream for high-quality video streaming
- **Payment Processing**: Integrated with Stripe for secure transactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: Clerk
- **Payments**: Stripe
- **Video**: Stream
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui
- **Animation**: GSAP, Framer Motion
- **Form Handling**: React Hook Form, Zod
- **State Management**: Zustand

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Clerk account (for authentication)
- Stripe account (for payments)
- Stream account (for video)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-webinar-platform.git
   cd ai-webinar-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your API keys and configuration.

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_webinar?schema=public"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Stream
NEXT_PUBLIC_STREAM_KEY=your_stream_key
STREAM_SECRET=your_stream_secret

# Vapi (AI Voice Agent)
NEXT_PUBLIC_VAPI_KEY=your_vapi_key

# Other
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🏗️ Project Structure

```
ai-webinar-platform/
├── prisma/               # Database schema and migrations
├── public/              # Static files
└── src/
    ├── app/             # Next.js 15 app directory
    │   ├── (dashboard)  # Dashboard routes (protected)
    │   │   └── dashboard/ # User dashboard for webinar management
    │   ├── api/         # API routes
    │   │   ├── attendees/ # Attendee management APIs
    │   │   ├── leads/   # Lead generation and management
    │   │   ├── sales/   # Sales tracking APIs
    │   │   ├── vapi/    # AI agent integration
    │   │   └── webinars/ # Webinar creation and management
    │   ├── attend/      # Attendee webinar experience
    │   └── webinar/     # Public webinar pages & registration
    ├── components/      # Reusable UI components
    │   ├── AiAgentSelector.tsx # AI agent selection interface
    │   ├── CallSession.tsx  # AI voice call component
    │   ├── WebinarForm.tsx  # Create/edit webinar form
    │   └── ui/          # UI component library
    ├── lib/             # Core utilities and services
    └── providers/       # React context providers
```

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
# or
pnpm test
```

## 🤖 AI Integration

### AI Webinar Hosts

The platform features AI-powered webinar hosts that can:

- Present prepared content to attendees
- Respond to common questions in real-time
- Maintain engagement throughout the webinar
- Generate dynamic content based on audience feedback

### AI Sales Agents

Our integration with Vapi AI allows:

- Creation of specialized AI sales agents for different products
- Real-time voice conversations between attendees and AI agents
- Automated call booking and follow-up
- Lead qualification and scoring

## 📊 Analytics and Reporting

- **Attendance tracking**: Monitor registration and attendance rates
- **Engagement metrics**: Track viewer retention, chat activity, and interaction
- **Lead generation**: Measure lead capture effectiveness
- **Sales conversion**: Track revenue generated from webinar attendees
- **Performance insights**: Get AI-powered recommendations to improve future webinars
