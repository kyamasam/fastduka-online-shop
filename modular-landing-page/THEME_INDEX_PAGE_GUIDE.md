# Theme Index Page Configuration Guide

This guide explains how to create custom index (home) pages for your themes.

## How It Works

The system now supports theme-specific index pages. When a user visits the root URL (`/`), the system will:

1. Detect the current theme (from `getTheme()`)
2. Check if that theme has a custom index page at `app/themes/{theme-name}/page.tsx`
3. If found, render the theme-specific page
4. If not found, render the default index page from `app/page.tsx`

## File Structure

```
app/
├── page.tsx                          # Default/fallback index page
├── themes/
│   ├── default/
│   │   ├── config.ts
│   │   ├── components/
│   │   └── page.tsx                  # Custom index page for default theme
│   ├── construction/
│   │   ├── config.ts
│   │   ├── components/
│   │   └── page.tsx                  # Custom index page for construction theme
│   └── clothing/
│       ├── config.ts
│       ├── components/
│       └── page.tsx                  # Custom index page for clothing theme
```

## Creating a Custom Index Page

### Step 1: Create the Page File

Create a file named `page.tsx` in your theme directory:

```bash
app/themes/your-theme-name/page.tsx
```

### Step 2: Define Your Component

```tsx
// app/themes/your-theme-name/page.tsx

export default function YourThemeIndexPage() {
  return (
    <div>
      <h1>Welcome to Your Theme</h1>
      {/* Your custom content here */}
    </div>
  );
}
```

### Step 3: Test Your Theme

Set your theme in the environment variable:

```env
# .env.local
NEXT_PUBLIC_THEME=your-theme-name
```

Or modify the `getTheme()` function in `app/lib/get-theme.ts` to return your theme name.

## Example: Construction Theme Index Page

```tsx
// app/themes/construction/page.tsx

export default function ConstructionIndexPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Build Your Future</h1>
          <p className="text-xl mb-8">Quality construction equipment</p>
          <button className="bg-black text-white px-8 py-3 rounded-lg">
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product cards */}
        </div>
      </div>
    </div>
  );
}
```

## Features Available in Index Pages

### 1. Full Styling Control

You have complete control over the styling. Use Tailwind CSS classes or any custom styling:

```tsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
  {/* Your content */}
</div>
```

### 2. Dynamic Data Fetching

Since this is a Next.js Server Component, you can fetch data:

```tsx
export default async function YourIndexPage() {
  // Fetch data from your API
  const response = await fetch('https://your-api.com/data');
  const data = await response.json();

  return (
    <div>
      {/* Use the data */}
    </div>
  );
}
```

### 3. Client-Side Interactivity

For client-side features, create separate client components:

```tsx
// app/themes/your-theme/components/Hero.tsx
'use client';

import { useState } from 'react';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div>
      {/* Interactive hero slider */}
    </div>
  );
}
```

Then import it in your index page:

```tsx
// app/themes/your-theme/page.tsx
import Hero from './components/Hero';

export default function YourIndexPage() {
  return (
    <div>
      <Hero />
      {/* Other content */}
    </div>
  );
}
```

### 4. Using Theme Configuration

Access your theme's configuration:

```tsx
import { themeConfig } from './config';

export default function YourIndexPage() {
  return (
    <div style={{ backgroundColor: themeConfig.colors.primary }}>
      <h1 style={{ fontFamily: themeConfig.fonts.heading }}>
        {themeConfig.displayName}
      </h1>
    </div>
  );
}
```

## Best Practices

### 1. Keep Theme-Specific Logic Isolated

```tsx
// ✅ Good - Theme-specific design
export default function ClothingIndexPage() {
  return (
    <div className="fashion-focused-layout">
      {/* Clothing-specific hero, categories, etc. */}
    </div>
  );
}

// ❌ Avoid - Generic content that could be in default theme
export default function YourIndexPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Generic content</p>
    </div>
  );
}
```

### 2. Use Consistent Component Structure

Create reusable components within your theme:

```
app/themes/your-theme/
├── page.tsx
├── config.ts
└── components/
    ├── Hero.tsx
    ├── FeaturedProducts.tsx
    ├── Newsletter.tsx
    └── Testimonials.tsx
```

### 3. Handle Loading States

```tsx
import { Suspense } from 'react';

export default function YourIndexPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    </div>
  );
}
```

### 4. Optimize Images

```tsx
import Image from 'next/image';

export default function YourIndexPage() {
  return (
    <div>
      <Image
        src="/images/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        priority
      />
    </div>
  );
}
```

## Fallback to Default

If your theme doesn't have a custom index page, the system automatically falls back to the default page in `app/page.tsx`. This ensures the site always has a working homepage.

## Testing Different Themes

### Method 1: Environment Variable

```env
# .env.local
NEXT_PUBLIC_THEME=construction
```

### Method 2: Modify getTheme() Function

```typescript
// app/lib/get-theme.ts
export async function getTheme(): Promise<string> {
  return 'construction'; // Change this to test different themes
}
```

### Method 3: Dynamic Theme Selection (Advanced)

Implement theme selection based on:
- URL subdomain
- User preferences
- Database configuration
- Request headers

```typescript
// app/lib/get-theme.ts
export async function getTheme(): Promise<string> {
  // Example: Theme based on API response
  const response = await fetch('https://your-backend.com/api/theme');
  const data = await response.json();
  return data.theme;
}
```

## Troubleshooting

### Issue: Custom Index Page Not Loading

**Check:**
1. File is named exactly `page.tsx` (not `Page.tsx` or `index.tsx`)
2. File is in the correct location: `app/themes/{theme-name}/page.tsx`
3. Component is exported as default: `export default function...`
4. Theme name is correct in `getTheme()` function

### Issue: Styles Not Applying

**Solution:**
Make sure Tailwind CSS is configured to scan your theme files:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './app/themes/**/*.{js,ts,jsx,tsx}', // Include theme files
  ],
  // ...
};
```

## Examples in This Project

Check out the example index pages already created:

- **Default Theme**: `app/themes/default/page.tsx`
- **Construction Theme**: `app/themes/construction/page.tsx`
- **Clothing Theme**: `app/themes/clothing/page.tsx`

Each example demonstrates different design approaches and features specific to that theme's target audience.
