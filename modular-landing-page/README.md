# FastDuka - Self-Hosted Ecommerce Platform

A themeable, self-hosted ecommerce platform built with Next.js.

## Features

- 🎨 Multiple pre-built themes (Default, Construction, Clothing)
- 🛒 Full ecommerce functionality (Cart, Orders, Checkout)
- 💳 M-Pesa integration for Kenya
- 📦 Easy self-hosting
- 🔧 Highly customizable

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your theme and configurations:

```env
NEXT_PUBLIC_THEME=default  # Options: default, construction, clothing
NEXT_PUBLIC_SITE_NAME=Your Store Name
DATABASE_URL=your_database_url
```

### 3. Run

```bash
npm run dev
```

Visit `http://localhost:3000`

## Available Themes

### Default
Clean and minimal design suitable for general ecommerce.

### Construction
Bold theme optimized for construction and industrial businesses.
- Orange and black color scheme
- Industrial typography
- Robust layout

### Clothing
Elegant theme perfect for fashion and clothing stores.
- Sophisticated color palette
- Serif headings
- Minimal, clean layout

## Changing Themes

Simply update the `NEXT_PUBLIC_THEME` environment variable in your `.env` file:

```env
NEXT_PUBLIC_THEME=clothing
```

Restart your server to see the changes.

## Project Structure

```
├── app/                    # Next.js app router (pages)
├── themes/                 # Theme system
│   ├── default/           # Default theme
│   ├── construction/      # Construction theme
│   └── clothing/          # Clothing theme
├── core/                  # Core ecommerce logic
│   ├── components/        # Shared components
│   ├── lib/              # Utilities, DB, theme loader
│   └── types/            # TypeScript types
├── config/               # Site configuration
└── public/               # Static assets
```

## Creating Custom Themes

1. Create a new folder in `themes/` with your theme name
2. Add a `config.ts` file with your theme configuration
3. Create a `components/` folder with themed components
4. Set `NEXT_PUBLIC_THEME=your-theme-name` in `.env`

## Payment Integration

### M-Pesa (Kenya)
Configure M-Pesa credentials in `.env`:
```env
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
```

## License

MIT
