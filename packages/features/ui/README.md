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
@import "@liteflow/ui/dist/styles/globals.css";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@liteflow/ui";

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
</Card>;
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
  DialogFooter,
} from "@liteflow/ui";

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
    <div>Dialog Content</div>
    <DialogFooter>Dialog Footer</DialogFooter>
  </DialogContent>
</Dialog>;
```

### Select

A dropdown select component with support for grouping and labels.

```tsx
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@liteflow/ui";

<Select>
  <SelectTrigger>
    <span>Select option</span>
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectSeparator />
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="potato">Potato</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>;
```

### Checkbox

A checkbox component with error handling and helper text.

```tsx
import { Checkbox } from '@liteflow/ui';

// Basic checkbox
<Checkbox aria-label="Accept terms" />

// With error and helper text
<Checkbox
  error={true}
  helperText="This field is required"
  aria-label="Accept terms"
/>

// Disabled
<Checkbox disabled aria-label="Disabled option" />
```

### Toast

A toast notification system with variants and actions.

```tsx
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastAction,
} from '@liteflow/ui';

<ToastProvider>
  <Toast>
    <ToastTitle>Title</ToastTitle>
    <ToastDescription>Description</ToastDescription>
    <ToastAction altText="Action">Action</ToastAction>
  </Toast>
  <ToastViewport />
</ToastProvider>

// Variants
<Toast variant="default" />
<Toast variant="destructive" />
<Toast variant="success" />
```

### RadioGroup

A radio button group component with error handling.

```tsx
import { RadioGroup, RadioGroupItem } from '@liteflow/ui';

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <label htmlFor="option1">Option 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <label htmlFor="option2">Option 2</label>
  </div>
</RadioGroup>

// With error and helper text
<RadioGroup
  error={true}
  helperText="Please select an option"
  defaultValue="option1"
>
  <RadioGroupItem value="option1" error />
</RadioGroup>
```

### Switch

A toggle switch component with animations.

```tsx
import { Switch } from '@liteflow/ui';

// Basic switch
<Switch aria-label="Toggle feature" />

// With helper text
<Switch
  helperText="Enable this feature"
  aria-label="Toggle feature"
/>

// With error
<Switch
  error={true}
  helperText="This field is required"
  aria-label="Toggle feature"
/>

// Disabled
<Switch disabled aria-label="Disabled feature" />
```

### Tabs

A tabbed interface component.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@liteflow/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Tab 1 content</TabsContent>
  <TabsContent value="tab2">Tab 2 content</TabsContent>
</Tabs>

// Disabled tab
<TabsTrigger value="tab3" disabled>
  Tab 3
</TabsTrigger>
```

### Accordion

A collapsible content component with single or multiple sections.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@liteflow/ui';

// Single section open at a time
<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple sections can be open
<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Tooltip

A popup component that displays information when hovering over or focusing an element.

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from '@liteflow/ui';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      Tooltip content
      <TooltipArrow />
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// With side offset
<TooltipContent sideOffset={8}>
  Tooltip content
</TooltipContent>

// With custom styles
<TooltipContent className="custom-tooltip">
  Tooltip content
  <TooltipArrow className="custom-arrow" />
</TooltipContent>
```

## Utility Functions

The package also includes several utility functions:

### cn

Merges class names with Tailwind CSS classes.

```tsx
import { cn } from "@liteflow/ui";

const className = cn(
  "base-class",
  conditional && "conditional-class",
  "override-class"
);
```

### formatDate

Formats a date string or timestamp.

```tsx
import { formatDate } from "@liteflow/ui";

const formattedDate = formatDate("2023-12-05"); // December 5, 2023
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
