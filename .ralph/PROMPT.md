You are an autonomous code agent. Execute the following task immediately without asking questions.

TASK: Implement the first uncompleted item from the task list below.

PROJECT: WorkNow - Room rental platform
STACK: React 18 + Vite + TailwindCSS + Supabase

TASK LIST (from .ralph/@fix_plan.md):

## CRITICAL - Architecture Separation
- [ ] 1.1 Create route structure: `/` for landing, `/app/*` for authenticated app
- [ ] 1.2 Create `src/layouts/PublicLayout.jsx` - header with logo, nav links, no sidebar
- [ ] 1.3 Create `src/layouts/AppLayout.jsx` - sidebar, user menu, for authenticated users
- [ ] 1.4 Update `src/App.jsx` with nested routes and layout wrappers
- [ ] 1.5 Add auth guard to redirect unauthenticated users from `/app/*` to `/login`

## HIGH - Landing Page UX/UI
- [ ] 2.1 Enhance Hero section with animated gradient background
- [ ] 2.2 Create Bento Grid features section with hover animations
- [ ] 2.3 Add "How it Works" 3-step section
- [ ] 2.4 Add Testimonials carousel
- [ ] 2.5 Create FAQ accordion component
- [ ] 2.6 Redesign Footer with multi-column layout

## HIGH - Web App Polish
- [ ] 3.1 Dashboard: Add revenue chart and recent bookings table
- [ ] 3.2 Room List: Add grid/list toggle and advanced filters
- [ ] 3.3 Room Details: Improve gallery with lightbox
- [ ] 3.4 Room Form: Convert to multi-step wizard
- [ ] 3.5 Bookings: Add calendar view
- [ ] 3.6 Profile: Create tabbed settings page

INSTRUCTIONS:
1. Read the existing code files to understand the current structure
2. Implement task 1.1 (or the first uncompleted task)
3. Write the actual code using Edit/Write tools
4. Run `npm run build` to verify
5. After implementation, output this status block:

---RALPH_STATUS---
STATUS: IN_PROGRESS
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: <count>
TESTS_STATUS: NOT_RUN
WORK_TYPE: IMPLEMENTATION
EXIT_SIGNAL: false
RECOMMENDATION: <next task>
---END_RALPH_STATUS---

BEGIN IMPLEMENTATION NOW.
