# Job Management Interface

A modern job board application built with Next.js, TypeScript, and Tailwind CSS.

## Features

✅ **18 Diverse Job Listings** - Various roles across industries
✅ **Dark/Light Mode Toggle** - Theme switching capability
✅ **Advanced Filtering** - Search by title, location, type, salary
✅ **Responsive Design** - Works on all devices
✅ **Job Creation Modal** - Add new job postings
✅ **Company Logos** - Professional logo display

## Company Logos

The application includes placeholder logos for all companies. To use the actual high-quality logos:

### Replace these placeholder files in `/public/` with the actual logo images:

1. `google-logo.svg` - Replace with Google logo
2. `meta-logo.svg` - Replace with Meta logo
3. `adobe-logo.svg` - Replace with Adobe logo
4. `salesforce-logo.svg` - Replace with Salesforce logo
5. `flipkart-logo.svg` - Replace with Flipkart logo
6. `zomato-logo.svg` - Replace with Zomato logo
7. `paytm-logo.svg` - Replace with Paytm logo
8. `tcs-logo.svg` - Replace with TCS logo
9. `hubspot-logo.svg` - Replace with HubSpot logo
10. `uber-logo.svg` - Replace with Uber logo
11. `ibm-logo.svg` - Replace with IBM logo
12. `goldman-sachs-logo.svg` - Replace with Goldman Sachs logo
13. `microsoft-logo.svg` - Replace with Microsoft logo
14. `infosys-logo.svg` - Replace with Infosys logo
15. `byjus-logo.svg` - Replace with Byju's logo

### Already included (keep these):
- `amazon-logo.png`
- `tesla-logo.png`
- `swiggy-logo-orange.jpg`

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with theme support
│   ├── layout.tsx           # Root layout with ThemeProvider
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── job-card.tsx         # Individual job card component
│   ├── job-creation-modal.tsx # Job creation form
│   ├── job-list-page.tsx    # Main job listing page
│   ├── navigation.tsx       # Navigation with theme toggle
│   └── theme-provider.tsx   # Theme context provider
├── lib/
│   ├── job-store.ts         # Zustand state management
│   └── utils.ts             # Utility functions
├── public/
│   └── [company-logos]      # Company logo files
└── hooks/
    └── use-toast.ts         # Toast notification hook
```

## Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom OKLCH colors
- **UI Components:** shadcn/ui (39+ components)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Mono
- **Theme:** next-themes with dark/light mode

## Key Features Details

### Job Management
- **18 Job Listings** with diverse roles, locations, and salary ranges
- **Real-time Search** by job title and company name
- **Advanced Filters:** Location, job type, salary range
- **Job Creation:** Modal with form validation and draft/publish workflow

### Theme System
- **Dark/Light Mode Toggle** in navigation
- **System Theme Detection** with preference persistence
- **Smooth Transitions** between themes
- **Theme-aware Colors** using CSS custom properties

### Responsive Design
- **Mobile-first** approach
- **Grid Layout** adapts to screen size
- **Touch-friendly** interface elements

## Development

### Adding New Jobs
Jobs are managed in `lib/job-store.ts`. Add new entries to the `initialJobs` array with proper company logo mapping.

### Theme Customization
Theme colors are defined in `app/globals.css` using OKLCH color space for better color consistency.

### Component Development
All UI components follow the shadcn/ui pattern with proper TypeScript interfaces and theme support.

## Production Build

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note:** This is a frontend-only application. For production use, integrate with a backend API for data persistence and user authentication.