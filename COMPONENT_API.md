# VRAP Component API Documentation

## StatCard

Beautiful metric card with gradient background, trend indicator, and icon.

### Props

```typescript
interface StatCardProps {
  title: string;              // Label for the metric
  value: string | number;     // The displayed value
  icon: React.ReactNode;      // Icon component (24px)
  trend?: {
    value: number;            // Percentage change
    isPositive: boolean;       // Direction of change
  };
  color?: 'blue' | 'teal' | 'green' | 'amber' | 'red'; // Color variant
}
```

### Usage Example

```tsx
<StatCard
  title="Pending Approvals"
  value="12"
  icon={<CheckCircle2 className="w-6 h-6" />}
  trend={{ value: 5, isPositive: false }}
  color="amber"
/>
```

### Features

- Gradient background with color-coded variants
- Automatic trend indicator styling
- Hover animation (lift effect)
- Responsive layout
- Icon background color matching

---

## WelcomeHero

Large hero section with personalized greeting and quick stats.

### Props

```typescript
interface WelcomeHeroProps {
  name?: string;              // User's name (default: "User")
  pendingRequests?: number;   // Count for requests stat
  upcomingEvents?: number;    // Count for events stat
  notifications?: number;     // Count for notifications stat
}
```

### Usage Example

```tsx
<WelcomeHero
  name="John"
  pendingRequests={18}
  upcomingEvents={8}
  notifications={5}
/>
```

### Features

- Time-based greeting (morning/afternoon/evening)
- Gradient background with primary color accent
- Three quick stat cards with gradients
- Action buttons for common tasks
- Smooth fade-in animations

---

## FormStepper

Multi-step form indicator with progress tracking.

### Props

```typescript
interface Step {
  id: string;                 // Unique step identifier
  label: string;              // Step display name
  description?: string;       // Optional description
}

interface FormStepperProps {
  steps: Step[];              // Array of step definitions
  currentStep: number;        // Current active step (0-indexed)
  onStepClick?: (step: number) => void; // Optional click handler
}
```

### Usage Example

```tsx
const steps = [
  { id: 'details', label: 'Event Details', description: 'Basic info' },
  { id: 'venue', label: 'Select Venue' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'review', label: 'Review & Submit' },
];

<FormStepper
  steps={steps}
  currentStep={1}
  onStepClick={(step) => setCurrentStep(step)}
/>
```

### Features

- Desktop: Horizontal with connecting lines
- Mobile: Vertical progress bar
- Completed steps show checkmark
- Current step has primary color
- Clickable steps with optional handler
- Responsive design

---

## StatusTimeline

Vertical timeline showing status progression with timestamps.

### Props

```typescript
interface TimelineItem {
  status: 'completed' | 'pending' | 'rejected' | 'expired'; // Status type
  label: string;              // Status label
  timestamp?: Date;           // Optional timestamp
  note?: string;              // Optional note/description
}

interface StatusTimelineProps {
  items: TimelineItem[];      // Array of timeline items
  vertical?: boolean;         // Layout direction (default: true)
}
```

### Usage Example

```tsx
const timeline = [
  {
    status: 'completed',
    label: 'Request Submitted',
    timestamp: new Date('2024-07-01'),
  },
  {
    status: 'completed',
    label: 'Received by Authority',
    timestamp: new Date('2024-07-02'),
  },
  {
    status: 'pending',
    label: 'Under Review',
    note: 'Currently being evaluated',
  },
];

<StatusTimeline items={timeline} />
```

### Features

- Color-coded status indicators
- Icon per status type
- Timestamps displayed in human-readable format
- Optional notes for additional context
- Smooth staggered animations
- Horizontal or vertical layout option

---

## FormStepper

Multi-step form progression component.

### Props

```typescript
interface Step {
  id: string;
  label: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}
```

### Status Colors

- **Completed**: Green (`#22C55E`)
- **Current**: Primary Blue (`#2563EB`)
- **Pending**: Muted Gray (`#E2E8F0`)

---

## VenueCard

Card component for displaying venue information with booking options.

### Props

```typescript
interface VenueCardProps {
  id: string;                 // Unique venue identifier
  name: string;               // Venue name (e.g., "Auditorium A")
  code: string;               // Venue code (e.g., "LT-101")
  capacity: number;           // Seating/standing capacity
  building: string;           // Building name
  floor: number;              // Floor number
  imageUrl?: string;          // Optional image URL
  status: 'available' | 'unavailable' | 'maintenance'; // Venue status
  facilities: string[];       // Array of facility names
  authority?: string;         // Authority person name
  onRequest?: () => void;     // Request button handler
  onDetails?: () => void;     // Details button handler
}
```

### Usage Example

```tsx
<VenueCard
  id="aud-001"
  name="Main Auditorium"
  code="AUD-001"
  capacity={500}
  building="Academic Block"
  floor={1}
  status="available"
  facilities={["WiFi", "Projector", "AC"]}
  authority="Dr. Rahul Sharma"
  onRequest={() => navigate('/request')}
  onDetails={() => showDetails(id)}
/>
```

### Features

- Status badge with color-coded styling
- Facility icons display
- Capacity information
- Building and floor details
- Authority person information
- Image placeholder with gradient
- Request and details buttons
- Hover lift animation

---

## Sidebar

Navigation sidebar with collapsible menu.

### Features

- Dark theme with gradient accents
- Collapsible menu (20px icon mode, 64px expanded)
- Active state highlighting
- Role-based navigation items
- Admin and student views
- Logout button
- Smooth transitions
- Responsive padding

### Navigation Items (Admin)

- Dashboard
- Users Management
- Venues Management
- Authorities
- Analytics
- Audit Logs
- Settings

### Navigation Items (Student)

- Dashboard
- Request Venue
- My Requests
- Calendar
- Notifications

---

## Header

Top navigation bar with search, notifications, and user menu.

### Features

- Glass-morphism background
- Global search with keyboard shortcut hint
- Dark mode toggle
- Notification bell with badge
- User profile menu
- Mobile responsive menu
- Responsive layout

### Actions

- Search venues and requests
- Toggle dark/light mode
- View notifications
- Access profile settings
- Logout

---

## DashboardLayout

Main layout wrapper for dashboard pages.

### Props

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;  // Page content
}
```

### Structure

```
┌──────────────────────────────────┐
│ Sidebar (64px fixed)  │ Header   │
├──────────────────────────────────┤
│                       │ Content  │
│                       │ (Main)   │
├──────────────────────────────────┤
│                       │ Footer   │
└──────────────────────────────────┘
```

### Features

- Fixed sidebar navigation
- Sticky header
- Main content with max-width container
- Footer with credits
- Smooth page transitions
- Fade-in animations

---

## Color System

### Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| primary | #2563EB | #3B82F6 | Buttons, links, active states |
| secondary | #0D9488 | #14B8A6 | Accents, highlights |
| background | #F8FAFC | #0F172A | Page background |
| card | #FFFFFF | #1E293B | Card/panel background |
| border | #E2E8F0 | #334155 | Dividers, borders |
| foreground | #0F172A | #F1F5F9 | Text color |
| muted | #E2E8F0 | #334155 | Secondary backgrounds |
| success | #22C55E | #22C55E | Success states |
| warning | #F59E0B | #F59E0B | Warning states |
| error | #EF4444 | #EF4444 | Error states |

---

## Animation System

### Keyframe Animations

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Framer Motion Usage

- `initial={{ opacity: 0, y: 20 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.4 }}`
- `whileHover={{ y: -4 }}`
- `whileTap={{ scale: 0.95 }}`

---

## Responsive Breakpoints

- **Mobile**: < 768px - Single column, simplified navigation
- **Tablet**: 768px - 1024px - Two column, responsive grid
- **Desktop**: > 1024px - Full layout with all features

---

## Accessibility Features

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly
- Alt text for all images

---

## Performance Considerations

- Lazy loading for images
- Hardware-accelerated animations
- Optimized gradients
- Minimal DOM updates
- Efficient re-renders with React.memo
- Optimized CSS selectors

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions
- Requires CSS Grid, Flexbox, CSS Variables

---

## Dependencies

- `framer-motion` - Animations
- `lucide-react` - Icons
- `date-fns` - Date formatting
- `tailwindcss` - Styling
- `next/link` - Navigation
- `next/image` - Image optimization

