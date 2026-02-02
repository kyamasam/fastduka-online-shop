# Theme Index Page - Quick Start

## What Changed?

Your system now supports custom index pages per theme! 🎉

## Quick Summary

- **Location**: Create `page.tsx` in any theme folder: `app/themes/{theme-name}/page.tsx`
- **Fallback**: If no custom page exists, uses default from `app/page.tsx`
- **Dynamic**: Automatically loads the correct page based on active theme

## Try It Now!

### Step 1: Set Your Theme

```env
# .env.local
NEXT_PUBLIC_THEME=construction
```

Or edit `app/lib/get-theme.ts`:
```typescript
return 'construction'; // or 'default' or 'clothing'
```

### Step 2: Run Your App

```bash
npm run dev
```

### Step 3: Visit the Homepage

Go to `http://localhost:3001` and you'll see:
- **construction** theme → Industrial/construction themed homepage
- **clothing** theme → Fashion/clothing themed homepage
- **default** theme → General e-commerce homepage

## Example Index Pages Already Created

✅ **app/themes/default/page.tsx** - General e-commerce homepage
✅ **app/themes/construction/page.tsx** - Construction equipment homepage
✅ **app/themes/clothing/page.tsx** - Fashion/clothing homepage

## Creating Your Own

```tsx
// app/themes/your-theme/page.tsx

export default function YourThemeIndexPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Your Custom Homepage</h1>
        {/* Add your sections here */}
      </div>
    </div>
  );
}
```

## Key Benefits

1. **Theme-Specific Design** - Each theme can have a completely different homepage
2. **No Code Changes** - Switch themes without modifying code
3. **Automatic Fallback** - If theme doesn't have custom page, shows default
4. **Type-Safe** - Full TypeScript support
5. **Server Components** - Can fetch data directly in the page

## Files Modified

- ✏️ `app/page.tsx` - Updated to dynamically load theme pages
- ✏️ `app/lib/theme-loader.ts` - Added `loadThemeIndexPage()` function
- ✨ `app/themes/default/page.tsx` - New default theme index page
- ✨ `app/themes/construction/page.tsx` - New construction theme index page
- ✨ `app/themes/clothing/page.tsx` - New clothing theme index page

## Need More Details?

See the comprehensive guide: [THEME_INDEX_PAGE_GUIDE.md](./THEME_INDEX_PAGE_GUIDE.md)
