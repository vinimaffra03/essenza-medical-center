# WorkNow - Agent Instructions

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Environment Variables

Create `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## Project Structure

```
src/
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── index.css            # Global styles + Tailwind
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Layout.jsx
│   ├── Toast.jsx
│   ├── Skeleton.jsx
│   └── DateTimePicker.jsx
├── features/
│   ├── auth/            # Login, Register, Unauthorized
│   ├── bookings/        # BookingList
│   ├── dashboard/       # Dashboard
│   ├── landing/         # LandingPage, sections
│   └── rooms/           # RoomList, RoomDetails, RoomForm
├── store/               # Zustand stores
├── lib/                 # Supabase client
└── utils/               # Helper functions
```

## Supabase Edge Functions

```bash
# Deploy functions
supabase functions deploy checkout
supabase functions deploy stripe-webhook

# Test locally
supabase functions serve
```

## Common Issues

1. **Build fails**: Check for import errors, run `npm run lint`
2. **Supabase errors**: Verify `.env` variables are set
3. **Stripe errors**: Check webhook configuration in Stripe dashboard

## Testing Checklist

- [ ] Login/Register flow
- [ ] Room listing and filtering
- [ ] Room details page
- [ ] Booking creation
- [ ] Stripe checkout
- [ ] Dashboard stats
