# Theme System with Page Overrides (Server-Side)

## Overview

This system allows themes to override entire pages using **Server Components** with full SSR support. When a user loads a route like `/shop`, the server checks if the current theme has an override for that page and renders it server-side.

## How It Works

1. **Theme Selection via Server-Side API Call**
   - Each page calls `getTheme()` on the server during SSR
   - The function fetches the current theme from your backend
   - Replace the simulated API in `app/lib/get-theme.ts` with your real backend call

2. **Page Loading Priority (Server-Side)**
   ```
   User visits /shop
   ↓
   Server calls getTheme() → returns "construction"
   ↓
   Server checks: themes/construction/pages/shop/page.tsx exists?
   ↓ YES                                    ↓ NO
   Server renders theme override            Server renders default page
   themes/construction/pages/shop/          DefaultShopPage component
   ↓
   HTML sent to client (fully rendered)
   ```

3. **Server Component Benefits**
   - Full SSR - pages are pre-rendered on the server
   - No client-side loading states
   - Better SEO and performance
   - Reduced JavaScript bundle size

## File Structure

```
app/
├── themes/
│   ├── default/
│   │   ├── config.ts
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── pages/              # Theme page overrides
│   │       └── shop/
│   │           └── page.tsx
│   ├── construction/
│   │   ├── config.ts
│   │   ├── layout.tsx          # Complete layout override!
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── pages/
│   │       └── shop/
│   │           └── page.tsx    # Construction-specific shop
│   └── clothing/
│       ├── config.ts
│       └── components/
│
├── (pages)/                     # Default pages
│   ├── shop/
│   │   └── page.tsx            # Uses ThemePageWrapper
│   ├── cart/
│   │   └── page.tsx
│   └── ...
│
└── lib/
    ├── get-theme.ts             # Server-side theme fetcher
    └── theme-loader.ts          # Dynamic import utilities
```

## Theme Override Priority

The system checks for overrides in this order:

### Layout Priority
```
1. themes/{theme}/layout.tsx          (Complete layout override)
   ↓ If not found
2. themes/{theme}/components/Header.tsx + Footer.tsx
   ↓ If not found
3. Default Header + Footer from app/global-components/
```

### Page Priority
```
1. themes/{theme}/pages/{page}/page.tsx    (Theme-specific page)
   ↓ If not found
2. app/(pages)/{page}/page.tsx             (Default page)
```

## Usage

### 1. Setting Up the Server-Side API Call

In `app/lib/get-theme.ts`, replace the simulated API call:

```typescript
export async function getTheme(): Promise<string> {
  // Replace simulation with your actual backend call
  const response = await fetch('https://your-backend.com/api/theme', {
    headers: {
      // Add auth headers, tenant-id, etc.
    },
    cache: 'no-store', // or use Next.js revalidation
  });
  const data = await response.json();
  return data.theme;
}
```

### 2. Creating a Complete Theme Layout Override

Create a `layout.tsx` file in your theme for complete control:

```typescript
// app/themes/construction/layout.tsx
import Header from './components/Header';

export default function ConstructionLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="construction-theme">
      {/* Custom banner */}
      <div className="bg-orange-500 text-white py-2">
        🏗️ Construction Theme Active
      </div>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {children}
      </main>

      {/* Custom footer */}
      <footer className="bg-gray-900 text-white py-8">
        {/* Custom footer content */}
      </footer>
    </div>
  );
}
```

**If your theme doesn't have a `layout.tsx` file**, it will automatically use the theme's Header and Footer components.

### 3. Creating a Theme Page Override

Create a page in your theme's `pages/` directory:

```typescript
// app/themes/construction/pages/shop/page.tsx
export default function ConstructionShopPage() {
  return (
    <div>
      <h1>Construction Equipment Shop</h1>
      {/* Construction-specific shop UI */}
    </div>
  );
}
```

### 4. Creating Pages with Theme Override Support

Make your page an async Server Component:

```typescript
// app/(pages)/shop/page.tsx
import { getTheme } from '@/app/lib/get-theme';
import { getThemePageComponent } from '@/app/lib/theme-loader';

// Default page content
function DefaultShopPage() {
  return <div>Default shop content</div>;
}

// Server Component - runs on server, supports SSR
export default async function ShopPage() {
  // Fetch theme on server
  const themeName = await getTheme();

  // Check for theme override
  const { Component, isOverride } = await getThemePageComponent(
    themeName,
    'shop'
  );

  // Render override or default
  if (isOverride && Component) {
    return <Component />;
  }

  return <DefaultShopPage />;
}
```

## Testing

### Test Different Themes

**Option 1: Environment Variable**
```bash
# .env.local
NEXT_PUBLIC_THEME=construction
```

**Option 2: Modify Server-Side Function**
Edit `app/lib/get-theme.ts`:

```typescript
export async function getTheme(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return 'construction'; // Change this to test different themes
}
```

### Verify Override Works

1. Start the dev server: `npm run dev`
2. Visit `/shop`
3. You should see the construction theme's shop page if theme is set to "construction"
4. Change theme to "default" and verify it shows the default shop page

## How Layouts Work

The app uses a two-tier layout system:

1. **Root Layout** (`app/layout.tsx`) - Never changes, wraps entire app
   - Sets up HTML structure, fonts, metadata
   - Contains `<ThemeLayout>` component

2. **Theme Layout** (`app/components/ThemeLayout.tsx`) - Dynamic
   - Fetches current theme on server
   - Checks if theme has `layout.tsx`
   - If yes → Use theme's complete layout
   - If no → Load theme's Header + Footer components

### Example Flow:

```
User visits site
  ↓
app/layout.tsx renders (always)
  ↓
<ThemeLayout> checks current theme = "construction"
  ↓
Checks: themes/construction/layout.tsx exists?
  ↓ YES
Renders ConstructionLayout with custom banner + footer
```

## Key Files

- `app/lib/get-theme.ts` - Server-side theme fetcher (replace simulation with real API)
- `app/lib/theme-loader.ts:46` - Layout and component loader
- `app/components/ThemeLayout.tsx` - Dynamic layout wrapper
- `app/(pages)/shop/page.tsx` - Example page with theme override support
- `app/themes/construction/layout.tsx` - Example complete layout override
- `app/themes/construction/pages/shop/page.tsx` - Example page override

## Benefits

- **Server-Side Rendering** - Full SSR support with Next.js
- **Better Performance** - No client-side loading, smaller bundle
- **SEO Friendly** - Pages are fully rendered on server
- **Complete theme isolation** - Themes can have completely different UIs
- **Industry-specific customization** - Construction site vs clothing store
- **No code duplication** - Only override what's different
- **Fallback support** - Always falls back to default pages
- **Type-safe** - Full TypeScript support

## Important Notes

- All pages using theme overrides must be **async Server Components**
- Theme fetching happens on the server during each request (cache as needed)
- Theme overrides are checked at build time for static pages
- For dynamic routes, theme resolution happens at request time
