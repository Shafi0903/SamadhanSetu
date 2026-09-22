# SamadhanSetu Design System

This document defines the core visual language, color palette, typography, and UI component standards for the SamadhanSetu platform. Because this platform serves citizens, government officials, and academia, the design must prioritize **accessibility, clarity, trust, and multi-lingual readability**.

## 1. Overall Visual Style

* **Vibe:** Trustworthy, civic-minded, clean, and modern.

* **Space & Layout:** Generous whitespace to reduce cognitive load, especially when displaying complex civic issues. Use an 8-point grid system (Tailwind default).

* **Shapes:** Slightly rounded corners (`rounded-lg` or `8px`) on cards and buttons to make the interface feel approachable and friendly.

* **Accessibility:** All text and color combinations must meet WCAG 2.1 AA standards for contrast.

## 2. Color Palette

The color system uses semantic naming to ensure consistency across the application. (Values map closely to Tailwind CSS default palettes for easy implementation).

### Primary Colors (Brand & Action)

* **Primary (Trust & Tech):** Indigo (`#4F46E5` / `indigo-600`)

  * *Usage:* Main brand color, primary buttons, active states, key navigation links.

* **Secondary (Civic & Growth):** Emerald (`#10B981` / `emerald-500`)

  * *Usage:* Secondary actions, success indicators, "Resolved" status markers.

### Neutral Colors (Text & Backgrounds)

* **Background (Light):** Off-White (`#F9FAFB` / `gray-50`)

  * *Usage:* App background, keeping the canvas clean.

* **Surface:** White (`#FFFFFF` / `white`)

  * *Usage:* Card backgrounds, modals, dropdowns.

* **Text (Primary):** Dark Gray (`#111827` / `gray-900`)

  * *Usage:* Headings, highly emphasized text.

* **Text (Secondary):** Medium Gray (`#4B5563` / `gray-600`)

  * *Usage:* Body copy, descriptions, secondary labels.

* **Borders & Dividers:** Light Gray (`#E5E7EB` / `gray-200`)

### Semantic / Status Colors

Since SamadhanSetu tracks the lifecycle of problems, status colors are critical.

* **Info / Submitted:** Blue (`#3B82F6` / `blue-500`)

* **Warning / Pending / Verification:** Amber (`#F59E0B` / `amber-500`)

* **Urgent / Rejected:** Red (`#EF4444` / `red-500`)

* **Success / Resolved:** Emerald (`#10B981` / `emerald-500`)

## 3. Typography

To support multiple Indian languages and maintain a clean English interface, we use Google Fonts that are highly legible on all devices.

* **Primary Font (English):** `Inter`, sans-serif.

* **Secondary Font (Local Languages):** `Noto Sans` (e.g., Noto Sans Devanagari, Noto Sans Tamil), to ensure perfect rendering of complex scripts.

### Font Scale (Tailwind defaults)

* **H1 (Page Titles):** 2.25rem (`text-4xl`), Font Weight: 700 (Bold), Text: `gray-900`

* **H2 (Section Titles):** 1.5rem (`text-2xl`), Font Weight: 600 (Semibold), Text: `gray-900`

* **H3 (Card Titles):** 1.125rem (`text-lg`), Font Weight: 600 (Semibold), Text: `gray-900`

* **Body (Default):** 1rem (`text-base`), Font Weight: 400 (Regular), Text: `gray-600`

* **Caption/Metadata:** 0.875rem (`text-sm`), Font Weight: 400 or 500, Text: `gray-500`

## 4. UI Components

### 4.1. Buttons

Buttons should have clear states (default, hover, disabled, active).

* **Primary Button:**

  * *Style:* Solid Indigo background, white text, slightly rounded.

  * *Tailwind:* `bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition`

* **Secondary Button:**

  * *Style:* Transparent background, gray border, dark gray text.

  * *Tailwind:* `border border-gray-300 text-gray-700 bg-white rounded-lg px-4 py-2 hover:bg-gray-50 transition`

* **Ghost/Text Button:**

  * *Style:* No background, Indigo text. Used for less prominent actions.

### 4.2. Problem / Challenge Cards

Cards are the primary way information is digested on the platform.

* **Structure:**

  * Top: Status Badge (e.g., "Verified") & Category Icon.

  * Middle: Title (H3) and brief truncated description (2-3 lines max).

  * Bottom: Metadata (Location, Date submitted, Upvotes).

* **Style:** White background, subtle shadow, light border.

* *Tailwind:* `bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition`

### 4.3. Badges & Tags

Used extensively for categorizing problems (e.g., *Sanitation, Roads, Electricity*) and showing status.

* *Style:* Pill-shaped, light background of the semantic color, dark text of the semantic color.

* *Tailwind (Example for 'Pending'):* `bg-amber-100 text-amber-800 rounded-full px-2.5 py-0.5 text-xs font-medium`

### 4.4. Input Fields

Forms must be highly visible and easy to tap on mobile devices.

* *Style:* Light gray border, white background, distinct focus state.

* *Tailwind:* `border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900`

## 5. Iconography

* **Library:** Heroicons (Outline style for standard UI, Solid style for active states).

* **Usage:** Always pair icons with text labels where possible to avoid ambiguity, especially for non-technical citizen users.