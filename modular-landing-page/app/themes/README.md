# Theme System

## How Themes Work

Each theme is a self-contained folder with:
- `config.ts` - Theme configuration (colors, fonts, layout)
- `components/` - Theme-specific components (Header, Footer, etc.)
- `styles/` - Theme-specific styles (optional)

## Theme Structure

```
themes/
└── your-theme/
    ├── config.ts
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   └── ProductCard.tsx (optional - override core)
    └── styles/
        └── globals.css (optional)
```

## Creating a New Theme

1. **Copy an existing theme**
   ```bash
   cp -r themes/default themes/your-theme
   ```

2. **Update `config.ts`**
   ```typescript
   export const themeConfig = {
     name: "your-theme",
     displayName: "Your Theme Name",
     description: "Theme description",
     colors: {
       primary: "#000000",
       secondary: "#666666",
       accent: "#0070f3",
       background: "#ffffff",
       text: "#000000",
     },
     fonts: {
       heading: "Your Font, sans-serif",
       body: "Your Font, sans-serif",
     },
     layout: {
       maxWidth: "1200px",
       headerStyle: "default",
       footerStyle: "default",
     },
   };
   ```

3. **Customize components**
   Edit or create components in the `components/` folder.

4. **Activate your theme**
   ```env
   NEXT_PUBLIC_THEME=your-theme
   ```

## Theme Components

### Required Components
- `Header.tsx` - Site header/navigation
- `Footer.tsx` - Site footer

### Optional Components
You can override any core component by creating it in your theme:
- `ProductCard.tsx` - Product display card
- `Cart.tsx` - Shopping cart display
- Any other core component

If a component doesn't exist in the theme, the core component is used.

## Styling

Themes can use:
1. **CSS Variables** - Defined in `config.ts` colors
2. **Global Styles** - `styles/globals.css` in your theme
3. **Tailwind Classes** - With custom theme colors
4. **CSS Modules** - Component-specific styles

## Best Practices

1. **Keep core logic separate** - Themes should only handle presentation
2. **Don't duplicate code** - Override only what's necessary
3. **Use theme config** - Reference colors/fonts from config, not hardcode
4. **Test across themes** - Ensure core functionality works with any theme
5. **Document customizations** - Add comments for non-obvious changes
