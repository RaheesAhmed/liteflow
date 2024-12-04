# LiteFlow UI Components

A collection of accessible, reusable, and composable React components built with Radix UI and Tailwind CSS.

## Installation

```bash
npm install @liteflow/ui
```

## Setup

1. Add the following to your tailwind.config.js:

```js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    // ... your content
    "./node_modules/@liteflow/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ... copy the theme configuration from our tailwind.config.js
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

2. Add the CSS variables to your global CSS:

```css
@import '@liteflow/ui/dist/styles/globals.css';
```

## Components

### Button

A button component with multiple variants and sizes.

```tsx
import { Button } from '@liteflow/ui';

// Default button
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Input

A form input component with error handling and helper text.

```tsx
import { Input } from '@liteflow/ui';

// Basic input
<Input placeholder="Enter your name" />

// With error
<Input 
  error={true}
  helperText="This field is required"
  placeholder="Username"
/>

// Disabled
<Input disabled placeholder="Disabled input" />
```

### Card

A card component for displaying content in a box.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@liteflow/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

### Dialog

A modal dialog component.

```tsx
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@liteflow/ui';

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog Description
      </DialogDescription>
    </DialogHeader>
    <div>Dialog Content</div>
    <DialogFooter>
      Dialog Footer
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Utility Functions

The package also includes several utility functions:

### cn

Merges class names with Tailwind CSS classes.

```tsx
import { cn } from '@liteflow/ui';

const className = cn('base-class', conditional && 'conditional-class', 'override-class');
```

### formatDate

Formats a date string or timestamp.

```tsx
import { formatDate } from '@liteflow/ui';

const formattedDate = formatDate('2023-12-05'); // December 5, 2023
```

### Other Utilities

- `truncate`: Truncates a string to a specified length
- `isValidEmail`: Validates email addresses
- `debounce`: Debounces a function call
- `throttle`: Throttles a function call

## Development

```bash
# Install dependencies
npm install

# Run development build
npm run dev

# Run tests
npm test

# Build package
npm run build
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

## License

MIT © LiteFlow Team 