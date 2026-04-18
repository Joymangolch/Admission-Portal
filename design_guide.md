# UI Design Guide - Admission Portal

## Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Design Tokens](#design-tokens)
5. [Layout System](#layout-system)
6. [Grid & Responsive Design](#grid--responsive-design)
7. [Component Library](#component-library)
8. [Design Patterns](#design-patterns)
9. [Dark Mode](#dark-mode)
10. [Accessibility Guidelines](#accessibility-guidelines)

---

## Design System Overview

The Admission Portal uses a comprehensive design system built on **Tailwind CSS** and **shadcn/ui** component library. The system emphasizes clarity, accessibility, and role-based user experiences across public, candidate, admin, and departmental dashboards.

**Technology Stack:**
- **CSS Framework:** Tailwind CSS 4
- **Component Library:** shadcn/ui (45+ components)
- **Design Tokens:** CSS Custom Properties (CSS Variables)
- **Typography:** Google Fonts (Roboto)
- **Build Tool:** Vite with TypeScript

---

## Color Palette

### Light Mode (Default)

| Color | Name | Hex Value | Usage |
|-------|------|-----------|-------|
| Primary | Dark Blue | `#1E3A8A` | Primary buttons, heading accent, sidebar background |
| Secondary | Medium Blue | `#3B82F6` | Secondary elements, links, hover states |
| Accent | Dark Blue | `#1E3A8A` | Accent elements, focus states |
| Background | White | `#FFFFFF` | Page background |
| Card | White | `#FFFFFF` | Card backgrounds, white surfaces |
| Foreground | Dark Gray | `#1A1F35` | Body text, primary text color |
| Muted | Light Gray | `#F0F4F8` | Disabled state, subtle backgrounds |
| Muted Foreground | Gray | `#64748B` | Secondary text, helper text |
| Border | Light Gray | `#E2E8F0` | Borders, dividers |
| Input | White | `#FFFFFF` | Input field background |
| Input Background | Very Light Gray | `#F8FAFC` | Input field subtle background |
| Destructive | Red | `#D4183D` | Error states, delete actions, rejection |
| Ring | Dark Blue | `#1E3A8A` | Focus ring, focus states |

### Dark Mode

| Color | Name | Hex Value | Usage |
|-------|------|-----------|-------|
| Primary | Medium Blue | `#3B82F6` | Primary buttons, accents |
| Secondary | Dark Blue | `#1E3A8A` | Secondary elements |
| Accent | Medium Blue | `#3B82F6` | Accent elements |
| Background | Very Dark Blue | `#0F172A` | Page background |
| Card | Dark Gray-Blue | `#1E293B` | Card backgrounds |
| Foreground | White | `#FFFFFF` | Text color |
| Muted | Medium Gray-Blue | `#334155` | Disabled state backgrounds |
| Muted Foreground | Light Gray | `#CBD5E1` | Secondary text |
| Border | Medium Gray-Blue | `#334155` | Borders, dividers |
| Input | Dark Gray-Blue | `#1E293B` | Input field background |
| Destructive | Red | `#EF4444` | Error states, delete actions |
| Ring | Medium Blue | `#3B82F6` | Focus ring |

### Status Colors

Use these colors for status indicators across the application:

| Status | Color | Hex Value | Meaning |
|--------|-------|-----------|---------|
| Draft | Gray | - | Application not yet submitted |
| Submitted | Blue | `#3B82F6` | Application received |
| Under Review | Amber | `#F59E0B` | Being processed by admin |
| Approved | Green | `#10B981` | Application accepted |
| Rejected | Red | `#EF4444` | Application declined |
| Pending | Yellow | `#F59E0B` | Awaiting user action |

### Chart Colors (Data Visualization)

| Chart Color | Light Mode | Dark Mode | Usage |
|-------------|-----------|-----------|--------|
| Chart 1 | `#1E3A8A` | `#3B82F6` | Primary data series |
| Chart 2 | `#3B82F6` | `#0EA5E9` | Secondary data series |
| Chart 3 | `#0EA5E9` | `#06B6D4` | Tertiary data series |
| Chart 4 | `#0284C7` | `#0284C7` | Quaternary data series |
| Chart 5 | `#0369A1` | `#0369A1` | Quinary data series |

### Sidebar Theme

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `#1E3A8A` (Dark Blue) | `#1E293B` (Dark Gray) |
| Foreground Text | `#FFFFFF` (White) | `#FFFFFF` (White) |
| Primary Accent | `#1E3A8A` | `#3B82F6` |
| Secondary Accent | `#3B82F6` | `#1E3A8A` |
| Border | `#1E3A8A` | `#334155` |

---

## Typography

### Font Family
- **Primary Font:** Roboto
- **Source:** Google Fonts (`https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap`)
- **Fallback:** sans-serif
- **Font Weights Available:** 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|------------|-------|
| H1 | 32px (2xl) | 500 (Medium) | 1.5 | Page titles, main headings |
| H2 | 28px (xl) | 500 (Medium) | 1.5 | Section titles, major headings |
| H3 | 24px (lg) | 500 (Medium) | 1.5 | Subsection titles |
| H4 | 16px (base) | 500 (Medium) | 1.5 | Minor headings, labels |
| Body | 16px (base) | 400 (Regular) | 1.5 | Paragraph text, body copy |
| Body Small | 14px (sm) | 400 (Regular) | 1.5 | Secondary text, captions |
| Button | 16px (base) | 500 (Medium) | 1.5 | Button text |
| Input | 16px (base) | 400 (Regular) | 1.5 | Form input text |
| Label | 16px (base) | 500 (Medium) | 1.5 | Form labels |

### Typography Usage Rules

- **Headings:** Use Roboto Medium (500) for hierarchy and emphasis
- **Body Text:** Use Roboto Regular (400) for readable, flowing content
- **Labels & UI Text:** Use Roboto Medium (500) for clarity and distinction
- **Line Height:** Maintain 1.5 line height for readability (minimum)
- **Font Size Base:** 16px (set on html element)
- **Responsive Typography:** Scale typography for mobile using Tailwind responsive prefixes

### Text Color References

| Type | Color | Hex Value |
|------|-------|-----------|
| Primary Text | Foreground | `#1A1F35` (Light) / `#FFFFFF` (Dark) |
| Secondary Text | Muted Foreground | `#64748B` (Light) / `#CBD5E1` (Dark) |
| Link Text | Secondary | `#3B82F6` |
| Error Text | Destructive | `#D4183D` (Light) / `#EF4444` (Dark) |
| Success Text | Green | `#10B981` |
| Warning Text | Amber | `#F59E0B` |

---

## Design Tokens

### Spacing Scale

Spacing follows Tailwind's default scale (in rem, where 1 rem = 16px base):

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| xs | 0.25rem | 4px | Minimal spacing |
| sm | 0.5rem | 8px | Small gaps, icon spacing |
| md | 1rem | 16px | Standard padding, margins |
| lg | 1.5rem | 24px | Section spacing |
| xl | 2rem | 32px | Major sections |
| 2xl | 2.5rem | 40px | Layout spacing |
| 3xl | 3rem | 48px | Large components |

### Border Radius

| Token | Size | Radius Value | Usage |
|-------|------|--------------|-------|
| sm | Small | `calc(0.625rem - 4px)` = 2.625px | Small components |
| md | Medium | `calc(0.625rem - 2px)` = 4.625px | Most components |
| lg | Large | 0.625rem | 10px | Standard corner rounding |
| xl | Extra Large | `calc(0.625rem + 4px)` = 14.625px | Large dialogs |

**Base Radius:** 0.625rem (10px) - used as default for most components

### Shadows

Use Tailwind's shadow utilities for depth:
- `shadow-sm` - Subtle shadows on cards in light mode
- `shadow-md` - Standard shadows on elevated surfaces
- `shadow-lg` - Strong shadows on dialogs and popovers
- `shadow-xl` - Maximum emphasis shadows (use sparingly)

### Visual Effects

- **Border Width:** 1px (default for all borders)
- **Focus Ring:** 2px solid with color `--ring` (`#1E3A8A` light / `#3B82F6` dark)
- **Transition Duration:** 200-300ms for smooth state changes
- **Z-Index Hierarchy:**
  - Base elements: z-0
  - Dropdowns/popovers: z-40
  - Modals/dialogs: z-50
  - Modals overlay: z-40
  - Notifications: z-[100]

---

## Layout System

### Layout Components

#### 1. **PublicLayout**
- **Location:** `src/app/components/layouts/PublicLayout.tsx`
- **Purpose:** Wraps public pages (Landing, Admission Pathway)
- **Features:**
  - Navigation header
  - Footer
  - Public content area
  - No authentication required
- **Used By:** Landing page, Admission pathway page

#### 2. **DashboardLayout**
- **Location:** `src/app/components/layouts/DashboardLayout.tsx`
- **Purpose:** Main authenticated wrapper for all user dashboards
- **Features:**
  - Sidebar navigation with role-based menu items
  - Responsive sidebar (collapsible on mobile)
  - Top header with user profile, notifications, settings
  - Main content area
  - Role-based navigation items
  - Breadcrumb navigation
- **Used By:** Candidate, Admin, HOD, Exam Coordinator, Registrar, Accounts dashboards

### Layout Structure

```
PublicLayout
├── Header/Navigation
├── Main Content Area (Outlet)
└── Footer

DashboardLayout
├── Sidebar (responsive)
│   ├── Logo/Brand
│   ├── Navigation Menu (role-based)
│   ├── User Profile (collapsible)
│   └── Logout Button
├── Header
│   ├── Breadcrumbs
│   ├── Spacer
│   ├── Notifications Icon
│   ├── User Menu
│   └── Theme Toggle
└── Main Content Area (Outlet)
```

---

## Grid & Responsive Design

### Responsive Breakpoints

The design uses Tailwind's responsive prefixes:

| Breakpoint | Size | Usage |
|-----------|------|-------|
| (none) | 0px+ | Mobile-first base styles |
| sm | 640px+ | Tablets (portrait) |
| md | 768px+ | Tablets (landscape) |
| lg | 1024px+ | Desktops |
| xl | 1280px+ | Large desktops |
| 2xl | 1536px+ | Extra large screens |

### Grid System

**Base Approach:** Mobile-first responsive design

- **Mobile (0px+):** 1-column layout, full width
- **Tablet (md: 768px+):** 2-column layout, responsive padding
- **Desktop (lg: 1024px+):** 3+ column layout, wider content areas

### Container & Max-Width

- `container` class: Centers content with responsive padding
- Maximum content width: varies by breakpoint, auto-sizing for readability
- Dashboard main content: typically 1-2 columns on mobile, 2-3 on desktop

### Common Patterns

```html
<!-- Card Grid: 1 col mobile, 2 col tablet, 3 col desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Cards -->
</div>

<!-- Dashboard Form: Full width mobile, 2-column tablet+ -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- Form fields -->
</div>

<!-- Flex Row: Stack mobile, row desktop -->
<div class="flex flex-col lg:flex-row gap-4">
  <!-- Sections -->
</div>
```

### Padding & Margins

- **Page/Section Padding:** `p-4` (mobile) to `p-8` (desktop)
- **Card/Component Spacing:** `gap-4` (16px) standard
- **Section Margins:** `mb-6` (24px) between major sections
- **Header Height:** ~60px (varies by device)
- **Sidebar Width:** ~280px (desktop), collapsible on mobile

---

## Component Library

All components are from **shadcn/ui** and are located in `src/app/components/ui/`.

### Form & Input Components

#### Button
- **File:** `button.tsx`
- **Purpose:** Interactive action triggers
- **Variants:** primary, secondary, destructive, ghost, outline
- **Sizes:** sm, md (default), lg
- **States:** hover, active, disabled, loading
- **Usage:** Form submissions, navigation, actions
- **Props:** variant, size, disabled, onClick

#### Input
- **File:** `input.tsx`
- **Purpose:** Text input fields
- **Types:** text, email, password, number, search
- **Sizes:** Standard height 40px
- **States:** focus, disabled, error, readonly
- **Usage:** Forms, search bars, filters
- **Props:** type, placeholder, value, onChange, disabled

#### TextArea
- **File:** `textarea.tsx`
- **Purpose:** Multi-line text input
- **Default Rows:** 4
- **Auto-expand:** Optional
- **States:** focus, disabled, error
- **Usage:** Long-form text, descriptions, comments
- **Props:** placeholder, value, onChange, rows, disabled

#### Label
- **File:** `label.tsx`
- **Purpose:** Form input labels
- **Weight:** Medium (500)
- **Associated:** Links to input via htmlFor
- **States:** default, required indicator
- **Usage:** Every form input must have a label
- **Props:** htmlFor, children

#### Checkbox
- **File:** `checkbox.tsx`
- **Purpose:** Toggle boolean options
- **States:** checked, unchecked, indeterminate (partial)
- **Accessibility:** Disabled support, keyboard navigation
- **Usage:** Agreement checkboxes, multi-select filters
- **Props:** checked, onChange, disabled

#### Radio Group
- **File:** `radio-group.tsx`
- **Purpose:** Single selection from multiple options
- **Grouping:** RadioGroup wrapper with Radio children
- **States:** selected, disabled
- **Usage:** Admission type selection, single choice questions
- **Props:** value, onChange

#### Switch
- **File:** `switch.tsx`
- **Purpose:** Toggle settings on/off
- **Size:** Standard toggle height
- **States:** on/off, disabled
- **Usage:** Feature toggles, preference settings, theme toggle
- **Props:** checked, onChange, disabled

#### Select
- **File:** `select.tsx`
- **Purpose:** Dropdown menu selection
- **Behavior:** Opens on click, keyboard navigation support
- **States:** default, open, disabled
- **Usage:** Category selection, filtering, form selection
- **Props:** value, onChange, placeholder, disabled
- **Variants:** Standard dropdown, searchable options

#### Toggle
- **File:** `toggle.tsx`
- **Purpose:** Single action toggle button
- **Appearance:** Button-like toggle
- **States:** pressed, unpressed
- **Usage:** Tool buttons, formatting in editors
- **Props:** pressed, onChange

#### Toggle Group
- **File:** `toggle-group.tsx`
- **Purpose:** Group of toggle buttons (single/multi-select)
- **Type:** "single" | "multiple"
- **States:** selected, unselected
- **Usage:** Button selection groups, view mode toggles
- **Props:** value, onChange, type

#### Slider
- **File:** `slider.tsx`
- **Purpose:** Range input slider
- **Supports:** Single & range sliders
- **States:** dragging, hover, disabled
- **Usage:** Score ranges, fee sliders, date ranges
- **Props:** value, onChange, min, max, step, disabled

#### Form (Context Provider)
- **File:** `form.tsx`
- **Purpose:** React Hook Form integration wrapper
- **Features:** Validation, error messages, field state
- **Usage:** Complex form management
- **Pattern:** Wrap inputs with `<FormField>` components

#### Input OTP
- **File:** `input-otp.tsx`
- **Purpose:** One-time password input
- **Digits:** Configurable (typically 4-6)
- **States:** empty, partial, complete
- **Usage:** 2FA, email verification
- **Props:** length, onChange, value

---

### Display Components

#### Badge
- **File:** `badge.tsx`
- **Purpose:** Status or label indicator
- **Variants:** default, secondary, destructive, info, success, warning
- **Sizes:** sm, md (default), lg
- **Use Cases:** Status labels (Draft, Approved, Rejected), tags, indicators
- **Example:** `<Badge variant="success">Approved</Badge>`

#### Avatar
- **File:** `avatar.tsx`
- **Purpose:** User profile image with fallback
- **Size:** Customizable (sm, md, lg)
- **Fallback:** Initials if image fails to load
- **Usage:** User profiles, comment authors, team member lists
- **Props:** src, alt, fallback

#### Card
- **File:** `card.tsx`
- **Purpose:** Container for grouping related content
- **Structure:** Card (wrapper), CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Styling:** White background, subtle shadow, rounded corners
- **Usage:** Dashboard cards, content containers, information panels
- **Pattern:** `<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader>...</Card>`

#### Progress
- **File:** `progress.tsx`
- **Purpose:** Visual progress indicator
- **Appearance:** Horizontal bar
- **Value:** 0-100
- **Usage:** Application progress, completion percentage, loading progress
- **Props:** value (0-100)

#### Skeleton
- **File:** `skeleton.tsx`
- **Purpose:** Content loading placeholder
- **Animation:** Shimmer effect
- **Shapes:** Rectangular (default), circular for avatars
- **Usage:** Loading states for cards, lists, images
- **Props:** className for customization

#### Table
- **File:** `table.tsx`
- **Purpose:** Structured data display
- **Components:** Table, TableHeader, TableBody, TableRow, TableCell, TableCaption
- **Responsive:** Horizontal scroll on mobile
- **Features:** Sortable columns, pagination integration
- **Usage:** Application lists, result tables, user management
- **Pattern:** `<Table><TableHeader><TableRow>...</TableRow></TableHeader>...</Table>`

#### Carousel
- **File:** `carousel.tsx`
- **Purpose:** Rotating content carousel
- **Navigation:** Arrows, indicators
- **Responsive:** Auto-sizing
- **Usage:** Featured items, testimonials, image galleries
- **Props:** auto-scroll, duration, loop

#### Chart
- **File:** `chart.tsx`
- **Purpose:** Data visualization (Recharts integration)
- **Types:** Line, Bar, Area, Pie charts
- **Data:** Array of objects with x, y values
- **Theming:** Uses chart color palette
- **Usage:** Admission statistics, result distributions, metrics
- **Integration:** Recharts library

#### Alert
- **File:** `alert.tsx`
- **Purpose:** Information message display
- **Variants:** default, success, warning, destructive, info
- **Components:** Alert (wrapper), AlertTitle, AlertDescription
- **Icons:** Optional icon
- **Usage:** Status messages, notifications, warnings
- **Pattern:** `<Alert variant="success"><AlertTitle>Success</AlertTitle>...</Alert>`

#### Accordion
- **File:** `accordion.tsx`
- **Purpose:** Expandable content sections
- **Behavior:** Single or multiple open items
- **Type:** "single" | "multiple"
- **Usage:** FAQ sections, collapsible details, grouped information
- **Components:** Accordion, AccordionItem, AccordionTrigger, AccordionContent

---

### Navigation Components

#### Button
- (See Form & Input Components above)

#### Breadcrumb
- **File:** `breadcrumb.tsx`
- **Purpose:** Navigation path indicator
- **Structure:** Breadcrumb (wrapper), Breadcrumb Items with separators
- **Usage:** Show current page in hierarchy
- **Example:** `Home > Dashboard > Applications > Review`
- **Mobile:** Collapse with ellipsis on small screens

#### Dropdown Menu
- **File:** `dropdown-menu.tsx`
- **Purpose:** Context or action menu
- **Trigger:** Button icon or text
- **Items:** DropdownMenuItem with icons, labels
- **Keyboard:** Arrow navigation, Enter to select
- **Usage:** User menu, bulk actions, filters

#### Context Menu
- **File:** `context-menu.tsx`
- **Purpose:** Right-click context menu
- **Appearance:** Floating menu
- **Items:** DropdownMenuItem style items
- **Usage:** Right-click actions on rows, cards
- **Trigger Event:** contextmenu (right-click)

#### Menubar
- **File:** `menubar.tsx`
- **Purpose:** Horizontal menu bar (top navigation)
- **Structure:** Menubar wrapper, MenubarMenu items
- **Appearance:** Horizontal row of menus
- **Usage:** Application top menu (less common in modern SPA)
- **Keyboard:** Tab navigation, arrow keys

#### Navigation Menu
- **File:** `navigation-menu.tsx`
- **Purpose:** Main site/app navigation structure
- **Appearance:** Horizontal or vertical menu
- **Items:** NavigationMenuItem with links
- **Submenus:** Nested MenuContent items
- **Usage:** Primary navigation structure

#### Sidebar
- **File:** `sidebar.tsx`
- **Purpose:** Side navigation panel
- **Structure:** Multiple components (Sidebar, SidebarHeader, SidebarContent, SidebarFooter, etc.)
- **Features:** Collapsible, responsive, theme-aware
- **Usage:** Dashboard left navigation
- **States:** expanded/collapsed

#### Pagination
- **File:** `pagination.tsx`
- **Purpose:** Page navigation for lists
- **Components:** Pagination, PaginationItem, PaginationButton, etc.
- **Features:** Next/Previous, page numbers, ellipsis
- **Usage:** Table pagination, list pagination
- **Events:** onChange to load new page

#### Tabs
- **File:** `tabs.tsx`
- **Purpose:** Tab navigation for content sections
- **Structure:** Tabs (wrapper), TabsList (headers), TabsContent (panels)
- **Behavior:** Click to switch, single open
- **Usage:** Multi-section content (Applications, Results, etc.)
- **Props:** value, onChange

#### Collapsible
- **File:** `collapsible.tsx`
- **Purpose:** Expandable/collapsible content
- **Structure:** Collapsible, CollapsibleTrigger, CollapsibleContent
- **State:** open, closed
- **Usage:** Expandable details, hidden sections
- **Props:** open, onChange

#### Resizable
- **File:** `resizable.tsx`
- **Purpose:** Resizable panel dividers
- **Behavior:** Drag to resize panels
- **Direction:** Horizontal or vertical
- **Usage:** Adjustable layout sections (less common)
- **Props:** defaultSize, onResize

#### Scroll Area
- **File:** `scroll-area.tsx`
- **Purpose:** Scrollable content container
- **Features:** Custom scrollbar styling
- **Usage:** Long lists, overflow content
- **Props:** className, children

---

### Dialog & Popover Components

#### Dialog
- **File:** `dialog.tsx`
- **Purpose:** Modal dialog for focused interaction
- **Structure:** Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter
- **Backdrop:** Click outside to close (optional)
- **Usage:** Confirmation, form submission, alerts
- **Pattern:** Click button → modal appears, user action → modal closes

#### Alert Dialog
- **File:** `alert-dialog.tsx`
- **Purpose:** High-priority confirmation dialog
- **Variant:** Dialog with destructive styling
- **Usage:** Confirm deletion, critical actions
- **Pattern:** Warn user, require explicit confirmation

#### Drawer
- **File:** `drawer.tsx`
- **Purpose:** Slide-out side panel (mobile-friendly)
- **Animation:** Slides from side (left/right)
- **Backdrop:** Dimmed background
- **Usage:** Mobile navigation, filters, actions
- **Structure:** Similar to Dialog with side-specific animation

#### Popover
- **File:** `popover.tsx`
- **Purpose:** Non-modal floating content panel
- **Positioning:** Anchor to trigger element
- **Dismissal:** Click outside or button click
- **Usage:** Additional options, inline help, quick actions
- **Props:** align, side (top, right, bottom, left)

#### Hover Card
- **File:** `hover-card.tsx`
- **Purpose:** Preview content on hover
- **Trigger:** Mouse hover over element
- **Display:** Rich preview/tooltip
- **Usage:** User profile preview, inline help
- **Props:** delay before show

#### Sheet
- **File:** `sheet.tsx`
- **Purpose:** Modal drawer/panel
- **Animation:** Slide in from side
- **Dismissal:** Close button, ESC key, backdrop click
- **Usage:** Mobile-optimized dialogs, side panels
- **Responsive:** Drawer on mobile, side panel on desktop

#### Tooltip
- **File:** `tooltip.tsx`
- **Purpose:** Simple text tooltip on hover
- **Content:** Shorter text (< 1 line)
- **Trigger:** Mouse hover
- **Dismissal:** Mouse leave
- **Usage:** Icon explanations, help text
- **Props:** content, side (top, right, bottom, left)

#### Command
- **File:** `command.tsx`
- **Purpose:** Command palette / fuzzy search interface
- **Behavior:** Type to filter, arrow keys to navigate
- **Usage:** Quick navigation, command search
- **Structure:** Command (wrapper), CommandInput, CommandList, CommandItem

---

### Utility Components

#### Aspect Ratio
- **File:** `aspect-ratio.tsx`
- **Purpose:** Maintain fixed aspect ratio container
- **Ratio:** 16:9, 1:1, 4:3, etc.
- **Usage:** Image containers, video embeds, placeholder boxes
- **Props:** ratio (number)

#### Separator
- **File:** `separator.tsx`
- **Purpose:** Visual divider line
- **Orientation:** Horizontal or vertical
- **Styling:** Border color, thickness
- **Usage:** Section dividers, menu separators

#### Sonner (Toast Notifications)
- **File:** `sonner.tsx`
- **Purpose:** Notification toast system
- **Types:** toast, success, error, warning, info, loading
- **Position:** Top/bottom, center/left/right
- **Duration:** Auto-dismiss (configurable)
- **Usage:** Action confirmations, error messages, notifications
- **API:** `toast()` function with type and message

#### Use Mobile Hook
- **File:** `use-mobile.ts`
- **Purpose:** React hook for detecting mobile viewport
- **Returns:** boolean (true if mobile)
- **Breakpoint:** Matches `md` breakpoint (768px)
- **Usage:** Conditional rendering based on device

#### Utils
- **File:** `utils.ts`
- **Purpose:** Utility functions, cn() class merger
- **Functions:** cn() for Tailwind class concatenation with conflict resolution
- **Usage:** Conditionally adding classes to components

---

## Design Patterns

### 1. Status-Based Styling

**Application Status Flow:**

```
Stage 1: Draft
├─ User fills form
├─ Auto-save as Draft
└─ Draft badge (gray)

Stage 2: Submitted
├─ User submits form
├─ Submitted badge (blue)
└─ Read-only mode

Stage 3: Under Review
├─ Admin reviews
├─ Under Review badge (amber)
└─ Review timeline shown

Stage 4: Approved/Rejected
├─ Admin decision
├─ Approved badge (green) or Rejected badge (red)
└─ Result visible to candidate
```

**Styling Convention:**
- Use Badge component with appropriate variant
- Status color reflects workflow stage
- Combine with status text for clarity
- Example: `<Badge variant="success">Approved</Badge>`

### 2. Role-Based Architecture

**User Roles & Navigation:**

| Role | Dashboard | Sidebar Items | Access |
|------|-----------|---------------|--------|
| Candidate | `/dashboard` | Application, Documents, Notifications, Payment, Status, Admit Card, Results | Own application, profile |
| Admin | `/admin` | Dashboard, Applications, Review, Verification, Users, Exams, Results, Notifications | All applications, system settings |
| HOD | `/hod` | Dashboard, Candidates, Courses | Department candidates, course management |
| Exam Coordinator | `/exam` | Dashboard, Results, Reports | Exam management, score entry |
| Registrar | `/registrar` | Dashboard, Enrollments, Records | Student enrollments, academic records |
| Accounts Officer | `/accounts` | Dashboard, Payments, Reports | Payment management, financial reports |

**Pattern:** Each role has unique sidebar menu, access controls via ProtectedRoute component

### 3. Form Patterns

**Standard Form Structure:**

```html
<form className="space-y-6">
  <!-- Form Header -->
  <div>
    <h2 className="text-xl font-medium">Form Title</h2>
    <p className="text-sm text-muted-foreground">Description</p>
  </div>

  <!-- Form Sections (if needed) -->
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Section 1</h3>
    <!-- Form fields -->
  </div>

  <!-- Form Actions -->
  <div className="flex gap-4 justify-end">
    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
    <Button onClick={handleSubmit}>Save</Button>
  </div>
</form>
```

**Form Field Pattern:**
```html
<div className="space-y-2">
  <Label htmlFor="field-id">Field Label</Label>
  <Input id="field-id" placeholder="..." />
  <p className="text-xs text-muted-foreground">Helper text or validation message</p>
</div>
```

### 4. Card Grid Pattern

**Responsive Card Grid:**

```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
  </Card>
  <!-- More cards -->
</div>
```

**Spacing:** `gap-4` (16px) between cards, responsive columns

### 5. Data Table Pattern

**Responsive Table with Pagination:**

```html
<div className="space-y-4">
  <!-- Table -->
  <div className="rounded-lg border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Column 1</TableCell>
          <TableCell>Column 2</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.col1}</TableCell>
            <TableCell>{item.col2}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  
  <!-- Pagination -->
  <Pagination />
</div>
```

**Mobile:** Horizontal scroll for table on small screens

### 6. Navigation Patterns

**Sidebar + Breadcrumb Pattern:**
```
Sidebar (collapsed on mobile)
├─ Logo
├─ Navigation Items (role-based)
└─ User Profile

Header
├─ Breadcrumb
├─ Search/Actions
└─ User Menu, Theme Toggle
```

### 7. Loading & Empty States

**Loading State:**
```html
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-64 w-full" />
  <Skeleton className="h-8 w-20" />
</div>
```

**Empty State:**
```html
<div className="text-center py-12">
  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
  <h3 className="text-lg font-medium">No items found</h3>
  <p className="text-muted-foreground">Try adjusting your filters or create a new item</p>
</div>
```

### 8. Action Confirmation Pattern

**Delete with Confirmation:**
```html
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} className="bg-red-500">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 9. Notification Pattern

**Toast Notification Usage:**
```typescript
import { toast } from '@/components/ui/sonner';

// Success
toast.success('Application submitted successfully');

// Error
toast.error('Failed to upload document');

// Warning
toast.warning('This action cannot be undone');

// Info
toast.info('New notification received');
```

### 10. Error Handling Pattern

**Input Validation Error:**
```html
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" className="border-destructive" />
  <p className="text-xs text-destructive">Invalid email address</p>
</div>
```

**Alert Error:**
```html
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Failed to process request. Please try again.</AlertDescription>
</Alert>
```

---

## Dark Mode

### Dark Mode Implementation

**Method:** CSS class-based dark mode using `.dark` class

**Activation:**
```typescript
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

**CSS Variables:** All color tokens have light and dark variants defined in `src/styles/theme.css`

**Light Mode (Default):**
- Light backgrounds (`#FFFFFF`)
- Dark text (`#1A1F35`)
- Blue sidebar (`#1E3A8A`)

**Dark Mode (.dark class):**
- Dark backgrounds (`#0F172A`)
- Light text (`#FFFFFF`)
- Dark gray sidebar (`#1E293B`)
- Blue accents (`#3B82F6`)

### Dark Mode Styles

All components automatically adapt to dark mode via CSS variables. When `.dark` class is present on `<html>` or parent:

```css
:root {
  --background: #ffffff;
  --foreground: #1a1f35;
  /* ... light colors ... */
}

.dark {
  --background: #0f172a;
  --foreground: #ffffff;
  /* ... dark colors ... */
}
```

### Dark Mode Usage in Components

```typescript
// Component automatically renders in current theme
<Card>
  <CardHeader>
    <CardTitle>This adapts to light/dark mode</CardTitle>
  </CardHeader>
</Card>
```

**No conditional rendering needed** — all components respond to `.dark` class automatically through CSS variables.

---

## Accessibility Guidelines

### Semantic HTML

- Use semantic elements: `<button>`, `<a>`, `<header>`, `<nav>`, `<main>`, `<footer>`
- Avoid `<div>` for interactive elements — use proper semantic HTML
- Use `<label>` with `htmlFor` for all form inputs

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order: logical top-to-bottom, left-to-right flow
- Buttons, links, and form controls: Enter/Space to activate
- Dropdowns: Arrow keys to navigate, Enter to select
- Dialogs: ESC to close, focus trap inside dialog
- All custom components must support keyboard interaction

### Color Contrast

**Minimum Contrast Ratios (WCAG AA):**

| Element | Minimum Ratio |
|---------|---------------|
| Normal Text | 4.5:1 |
| Large Text (18px+) | 3:1 |
| UI Components (borders, icons) | 3:1 |

**Current Palette Compliance:**
- Primary (`#1E3A8A`) on white: 12.6:1 ✓
- Secondary (`#3B82F6`) on white: 4.5:1 ✓
- Text (`#1A1F35`) on white: 14.8:1 ✓
- Destructive (`#D4183D`) on white: 6.4:1 ✓

### Focus Indicators

- Always provide visible focus ring: 2px blue ring with offset
- Default Tailwind focus rings used on buttons and inputs
- Never remove outline/focus styles
- Focus ring should be clearly visible (WCAG AAA requires 3:1 contrast against surrounding colors)

### ARIA Attributes

**Common ARIA attributes used:**

| Attribute | Usage |
|-----------|-------|
| `aria-label` | Label for icon-only buttons |
| `aria-expanded` | Expandable elements (accordion, dropdown) |
| `aria-selected` | Tab selection state |
| `aria-disabled` | Disabled element indication |
| `aria-invalid` | Form validation errors |
| `aria-describedby` | Link help text to input |
| `role="button"` | Non-button interactive elements |
| `role="menu"` | Menu structures |

### Form Accessibility

- Every input must have associated `<Label>`
- Error messages linked with `aria-describedby`
- Required fields marked with `aria-required="true"` or asterisk with tooltip
- Error field has `aria-invalid="true"`
- Helper text for complex inputs

**Pattern:**
```html
<div className="space-y-2">
  <Label htmlFor="name">Full Name <span aria-label="required">*</span></Label>
  <Input 
    id="name" 
    aria-required="true"
    aria-describedby="name-help"
  />
  <p id="name-help" className="text-xs text-muted-foreground">
    Please enter your legal name
  </p>
</div>
```

### Image Alt Text

- All images must have meaningful `alt` text
- Decorative images: `alt=""` (empty)
- Functional images: descriptive alt text
- Avatar images: alt shows user name

### Mobile & Touch Accessibility

- Touch targets minimum 44px × 44px
- Adequate spacing between interactive elements
- Touch-friendly dropdown/popover positioning
- Consider mobile keyboard restrictions

### Screen Reader Support

- Semantic HTML structure helps screen readers
- Use `role` attributes where semantic HTML isn't possible
- Announce dynamic content with `aria-live="polite"`
- Provide text descriptions for data visualizations

### Testing Accessibility

- Test keyboard navigation (Tab, Shift+Tab, Arrow keys)
- Use screen reader (NVDA, JAWS, Safari VoiceOver)
- Check color contrast with tools (WCAG contrast checker)
- Validate HTML with W3C validator
- Test mobile accessibility with native accessibility tools

---

## Best Practices

### 1. Color Usage
- Never rely solely on color to convey information
- Pair colors with patterns, icons, or text labels
- Use status colors consistently (green = success, red = error, blue = info, amber = warning)

### 2. Typography
- Maintain consistent text hierarchy
- Use font weights to create emphasis
- Line height 1.5 minimum for body text
- Limit line length to 65-75 characters for readability

### 3. Whitespace
- Use padding/margin consistently
- Create visual breathing room
- Group related items with spacing
- Section spacing: 24px, item spacing: 16px, element spacing: 8px

### 4. Components
- Use shadcn/ui components as-is when possible
- Compose components using composition pattern
- Pass data via props, not direct state manipulation
- Keep components focused and single-responsibility

### 5. Responsive Design
- Mobile-first approach: style for mobile, add breakpoints for larger screens
- Test on actual devices, not just browser zoom
- Touch-friendly (44px minimum touch targets)
- Appropriate font sizes and spacing for all breakpoints

### 6. Performance
- Lazy load images and heavy components
- Use code splitting for page components
- Minimize CSS in JS usage
- Optimize Tailwind purging in build

### 7. Consistency
- Use design tokens for all values (colors, spacing, radius)
- Follow naming conventions for CSS classes
- Maintain consistent component API patterns
- Document design decisions and patterns

---

## Design System Files

| File | Purpose | Location |
|------|---------|----------|
| theme.css | Design tokens (colors, spacing, radius) | `src/styles/theme.css` |
| fonts.css | Typography configuration | `src/styles/fonts.css` |
| tailwind.css | Tailwind CSS imports and base styles | `src/styles/tailwind.css` |
| index.css | Global styles, resets | `src/styles/index.css` |
| UI Components | Reusable shadcn/ui components | `src/app/components/ui/` |
| Layouts | DashboardLayout, PublicLayout | `src/app/components/layouts/` |

---

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/FUNDAMENTALS/)

---

**Design Guide Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** Development Team
