# My Reservations & Reservation Details - Gameplan

## 🎯 Overview
Create a polished, brand-consistent experience for managing reservations that supports:
- **Regular users** (logged in and non-logged in)
- **Studio owners** (logged in)
- **Incoming reservations** (bookings made by others for studio owner's items)
- **Outgoing reservations** (bookings made by the user)

---

## 📋 Current State Analysis

### Existing Implementation
- **Reservation Type**: `Reservation` interface with `userId`, `customerId`, `customerName`, `customerPhone`
- **Current Components**: 
  - `ReservationsDetails.tsx` - Basic reservation info display
  - `ReservationDetailsForm.tsx` - Customer details form for booking
- **Services**: Full CRUD operations available in `reservation-service.ts`
- **Hooks**: `useReservations()`, `useStudioReservations(studioId)`, `useReservation(id)`
- **Storage**: Reservations stored in localStorage with key `reservation_${itemId}` for non-logged-in users

### Key Insights
1. **Non-logged-in users** can book using `customerName` and `customerPhone` (no `userId`)
2. **Logged-in users** have `userId` or `customerId` set
3. **Studio owners** need to filter by their studio's items
4. **Reservations** can be: `pending`, `confirmed`, or `expired`
5. **Brand styling** uses dark theme with brand color (`rgb(16, 185, 129)` - teal/green)

---

## 🏗️ Architecture Plan

### 1. Route Structure
```
/:lang?/reservations                    → My Reservations List Page
/:lang?/reservations/:reservationId     → Reservation Details Page
```

### 2. Component Structure
```
src/features/entities/reservations/
├── pages/
│   ├── MyReservationsPage.tsx          → Main list page
│   └── ReservationDetailsPage.tsx      → Details page
├── components/
│   ├── ReservationsList.tsx            → List container component
│   ├── ReservationCard.tsx              → Individual reservation card
│   ├── ReservationFilters.tsx          → Filter controls (status, date, type)
│   ├── ReservationDetailsView.tsx       → Enhanced details view
│   └── ReservationActions.tsx           → Action buttons (cancel, modify, etc.)
├── hooks/
│   ├── useReservationsList.ts           → Enhanced list hook with filtering
│   └── useReservationAccess.ts          → Access control logic
└── styles/
    ├── _my-reservations-page.scss
    ├── _reservation-card.scss
    ├── _reservation-filters.scss
    └── _reservation-details-page.scss
```

### 3. Data Access Strategy

#### For Logged-In Users
- **Regular Users**: Fetch reservations where `userId === user._id` OR `customerId === user._id`
- **Studio Owners**: Fetch reservations where `itemId` matches any item in their studios
- Use existing `useReservations()` hook with filtering

#### For Non-Logged-In Users
- **Access Method**: Use phone number + reservation ID from localStorage
- **Storage Pattern**: `reservation_${itemId}` → reservationId
- **Lookup Strategy**: 
  - Check localStorage for reservation IDs
  - Fetch reservations by ID using `useReservation(id)`
  - Match by `customerPhone` stored in localStorage
- **Alternative**: Create a "guest access" endpoint that accepts phone + reservation ID

#### API Enhancements Needed
```typescript
// New service methods
getReservationsByPhone(phone: string): Promise<Reservation[]>
getReservationsByCustomerId(customerId: string): Promise<Reservation[]>
getReservationsByStudioOwner(userId: string): Promise<Reservation[]>
```

---

## 🎨 UI/UX Design Plan

### My Reservations Page

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Header: "My Reservations"              │
│  Subtitle: "Manage your bookings"       │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Filters Bar                             │
│  [All] [Upcoming] [Past] [Pending]      │
│  [Incoming ▼] [Outgoing ▼]              │
│  [Date Range Picker]                     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Reservation Cards (List View)          │
│  ┌─────────────────────────────────┐   │
│  │ [Image] Item Name                │   │
│  │ Studio Name                      │   │
│  │ Date | Time | Duration           │   │
│  │ Status Badge | Price             │   │
│  │ [View Details] [Actions ▼]      │   │
│  └─────────────────────────────────┘   │
│  ...                                    │
└─────────────────────────────────────────┘
```

#### Key Features
1. **Dual View Toggle** (for studio owners):
   - "My Bookings" (outgoing - what I booked)
   - "Studio Reservations" (incoming - bookings for my studios)
   - Default: Show both with visual distinction

2. **Filtering Options**:
   - Status: All, Pending, Confirmed, Expired
   - Time: Upcoming, Past, All
   - Type: Incoming, Outgoing (studio owners only)
   - Date Range: Custom date picker

3. **Empty States**:
   - No reservations: "You haven't made any reservations yet"
   - No incoming: "No bookings for your studios yet" (studio owners)
   - No matching filters: "No reservations match your filters"

4. **Reservation Card Information**:
   - Item image (thumbnail)
   - Item name (with link to item page)
   - Studio name (with link to studio page)
   - Booking date & time
   - Duration (hours)
   - Status badge (color-coded)
   - Total price
   - Quick actions (View Details, Cancel if allowed)

### Reservation Details Page

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Back Button | Reservation Details      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [Item Image - Large]                   │
│  Item Name                               │
│  Studio Name                             │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Booking Information                     │
│  ─────────────────────────────────────  │
│  Date: [value]                           │
│  Time: [value]                           │
│  Duration: [value] hours                 │
│  Status: [Badge]                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Customer Information                    │
│  ─────────────────────────────────────  │
│  Name: [value]                            │
│  Phone: [value]                          │
│  Notes: [value]                          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Pricing                                 │
│  ─────────────────────────────────────  │
│  Price per hour: ₪[value]                │
│  Total: ₪[value]                         │
│  Order ID: [value] (if exists)           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Actions                                 │
│  [Cancel Reservation] [Modify] [Contact] │
└─────────────────────────────────────────┘
```

#### Key Features
1. **Role-Based Information Display**:
   - **Regular Users**: See their own booking details
   - **Studio Owners (Incoming)**: See customer details (name, phone, notes)
   - **Studio Owners (Outgoing)**: See their own booking details

2. **Actions Available**:
   - **Cancel**: Only if status is `pending` or `confirmed` and not expired
   - **Modify**: Change date/time (if allowed by business rules)
   - **Contact**: 
     - Users → Contact studio
     - Studio owners → Contact customer (phone/email if available)

3. **Status Indicators**:
   - Pending: Yellow/Orange badge
   - Confirmed: Green badge
   - Expired: Gray/Red badge

---

## 🔐 Access Control & Non-Logged-In Support

### Strategy 1: Phone-Based Access (Recommended)
1. **During Booking**: Store `customerPhone` in localStorage
2. **Access Page**: 
   - Check if user is logged in
   - If not, show phone input form
   - Verify phone matches stored phone
   - Fetch reservations by phone number

### Strategy 2: Reservation ID + Phone Verification
1. **During Booking**: Store reservation IDs in localStorage array
2. **Access Page**:
   - Retrieve reservation IDs from localStorage
   - For each ID, fetch reservation
   - Verify phone number matches
   - Display matching reservations

### Strategy 3: Guest Access Token (Future Enhancement)
1. **During Booking**: Generate unique guest access token
2. **Email/SMS**: Send token to customer
3. **Access Page**: Enter token to view reservations

### Implementation Priority
- **Phase 1**: Strategy 2 (localStorage + phone verification)
- **Phase 2**: Strategy 1 (phone-based API endpoint)
- **Phase 3**: Strategy 3 (token-based access)

---

## 🎨 Styling & Brand Consistency

### Design System Alignment
- **Colors**: Use brand color `rgb(16, 185, 129)` for primary actions
- **Background**: Dark theme (`$bg-color-primary: #000000`, `$bg-color-secondary: #242728`)
- **Typography**: 'DM Sans' for body, 'IBM Plex Sans' for paragraphs
- **Border Radius**: `$border-radius-medium` (8px) for cards
- **Spacing**: Use spacing variables (`$spacing-medium`, `$spacing-large`, etc.)

### Component Styling Patterns
- **Cards**: Glassmorphic effect with border (`border: 1px solid rgba(255, 255, 255, 0.1)`)
- **Buttons**: Brand-colored with hover effects
- **Badges**: Status-based color coding
- **Empty States**: Centered, with icon and helpful message

### Responsive Design
- **Mobile-first**: Stack filters vertically on small screens
- **Tablet**: 2-column grid for reservation cards
- **Desktop**: 3-column grid for reservation cards

---

## 🔄 State Management

### React Query Setup
```typescript
// Enhanced hooks
useReservationsList(filters) → {
  data: Reservation[],
  incoming: Reservation[],
  outgoing: Reservation[],
  isLoading,
  error
}

useReservationAccess() → {
  isLoggedIn: boolean,
  isStudioOwner: boolean,
  canViewIncoming: boolean,
  accessMethod: 'user' | 'phone' | 'token'
}
```

### Local Storage Management
- **Non-logged-in users**: 
  - `reservation_${itemId}` → reservationId
  - `customerPhone` → phone number
  - `customerName` → name
  - `guestReservations` → array of reservation IDs

---

## 📱 User Flows

### Flow 1: Logged-In User Viewing Their Reservations
1. Navigate to `/reservations`
2. See all reservations (incoming + outgoing if studio owner)
3. Filter by status, date, type
4. Click reservation card → Details page
5. View full details, cancel/modify if allowed

### Flow 2: Non-Logged-In User Accessing Reservations
1. Navigate to `/reservations`
2. See "Access Your Reservations" form
3. Enter phone number
4. System verifies phone against localStorage
5. Fetch and display matching reservations
6. View details (limited actions available)

### Flow 3: Studio Owner Viewing Incoming Reservations
1. Navigate to `/reservations`
2. See toggle: "My Bookings" / "Studio Reservations"
3. Select "Studio Reservations"
4. See all bookings for their studios' items
5. Filter by studio, status, date
6. Click reservation → See customer details
7. Contact customer or manage reservation

---

## 🛠️ Implementation Phases

### Phase 1: Core Structure (Week 1)
- [ ] Create route structure
- [ ] Build `MyReservationsPage` component
- [ ] Build `ReservationDetailsPage` component
- [ ] Create `ReservationsList` component
- [ ] Create `ReservationCard` component
- [ ] Basic styling and layout

### Phase 2: Filtering & Access (Week 1-2)
- [ ] Implement `ReservationFilters` component
- [ ] Build filtering logic (status, date, type)
- [ ] Implement logged-in user access
- [ ] Implement non-logged-in user access (localStorage + phone)
- [ ] Create `useReservationsList` hook

### Phase 3: Studio Owner Features (Week 2)
- [ ] Implement incoming/outgoing toggle
- [ ] Filter reservations by studio ownership
- [ ] Display customer information for incoming reservations
- [ ] Add studio owner actions

### Phase 4: Actions & Interactions (Week 2-3)
- [ ] Implement cancel reservation
- [ ] Implement modify reservation (if applicable)
- [ ] Add contact functionality
- [ ] Add status updates
- [ ] Error handling and loading states

### Phase 5: Polish & Enhancement (Week 3)
- [ ] Empty states
- [ ] Loading skeletons
- [ ] Animations and transitions
- [ ] Responsive design refinement
- [ ] Accessibility improvements
- [ ] i18n translations

### Phase 6: API Enhancements (If Needed)
- [ ] Backend endpoint for phone-based lookup
- [ ] Backend endpoint for studio owner reservations
- [ ] Optimize reservation queries

---

## 🔍 Technical Considerations

### Performance
- **Pagination**: Consider pagination for large reservation lists
- **Virtual Scrolling**: For very long lists
- **Optimistic Updates**: For cancel/modify actions
- **Caching**: Use React Query's caching effectively

### Error Handling
- **Network Errors**: Show user-friendly messages
- **Access Denied**: Clear messaging for unauthorized access
- **Not Found**: Handle missing reservations gracefully

### Accessibility
- **ARIA Labels**: Proper labels for all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and proper roles
- **Focus Management**: Proper focus handling on navigation

### Internationalization
- **Translations**: All text in i18n files
- **RTL Support**: Proper RTL layout for Hebrew
- **Date Formatting**: Locale-aware date/time display

---

## 📊 Success Metrics

### User Experience
- Users can easily find their reservations
- Non-logged-in users can access their bookings
- Studio owners can manage incoming bookings efficiently
- Clear visual distinction between incoming/outgoing

### Technical
- Page load time < 2 seconds
- Smooth filtering and navigation
- No console errors
- Responsive on all devices

---

## 🚀 Future Enhancements

1. **Calendar View**: Toggle between list and calendar view
2. **Export**: Download reservations as PDF/CSV
3. **Notifications**: Real-time updates via Socket.io
4. **Recurring Reservations**: Support for recurring bookings
5. **Waitlist**: Join waitlist for unavailable slots
6. **Reviews**: Link to review creation after completed reservation
7. **Share**: Share reservation details via link/email

---

## 📝 Notes

- **Brand Consistency**: All components should match existing design system
- **Mobile Priority**: Ensure excellent mobile experience
- **Progressive Enhancement**: Core functionality works without JS
- **Security**: Validate all user inputs, especially phone numbers
- **Privacy**: Protect customer information appropriately

---

## ✅ Next Steps

1. Review and approve this gameplan
2. Set up project structure and routes
3. Begin Phase 1 implementation
4. Regular check-ins for feedback and adjustments

