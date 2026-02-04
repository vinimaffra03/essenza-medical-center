# WorkNow - Task List

## CRITICAL - Architecture Separation
- [x] 1.1 Create route structure: `/` for landing, `/app/*` for authenticated app
- [x] 1.2 Create `src/layouts/PublicLayout.jsx` - header with logo, nav links, no sidebar
- [x] 1.3 Create `src/layouts/AppLayout.jsx` - sidebar, user menu, for authenticated users
- [x] 1.4 Update `src/App.jsx` with nested routes and layout wrappers
- [x] 1.5 Add auth guard to redirect unauthenticated users from `/app/*` to `/login`

## HIGH - Landing Page UX/UI
- [x] 2.1 Enhance Hero section with animated gradient background
- [x] 2.2 Create Bento Grid features section with hover animations
- [x] 2.3 Add "How it Works" 3-step section
- [x] 2.4 Add Testimonials carousel
- [x] 2.5 Create FAQ accordion component
- [x] 2.6 Redesign Footer with multi-column layout

## HIGH - Web App Polish
- [x] 3.1 Dashboard: Add revenue chart and recent bookings table
- [x] 3.2 Room List: Add grid/list toggle and advanced filters
- [x] 3.3 Room Details: Improve gallery with lightbox
- [x] 3.4 Room Form: Convert to multi-step wizard
- [x] 3.5 Bookings: Add calendar view
- [ ] 3.6 Profile: Create tabbed settings page

## MEDIUM - Technical
- [ ] 4.1 Fix all build errors (npm run build)
- [ ] 4.2 Fix all lint warnings (npm run lint)
- [ ] 4.3 Add loading states to async operations
- [ ] 4.4 Add form validation with error messages
- [ ] 4.5 Test mobile viewport

## COMPLETED
- [x] React + Vite + Tailwind setup
- [x] Supabase integration
- [x] Stripe payment
- [x] Basic CRUD rooms
- [x] Booking flow
- [x] Edge Functions
