# Restaurant POS – New Order Module

This project is a premium, high-performance **Restaurant Point of Sale (POS) - New Order Module** web application. It was implemented as a frontend developer technical assessment for Divergent Technologies Ltd., using Next.js (App Router), Tailwind CSS v4, Redux Toolkit, and TanStack Query.

---

## 🚀 Live Demo & Key Pages

- **Home / Products Grid (`/`)**: Discover items, search with debouncing, select categories, and manage cart items directly.
- **Product Details (`/products/[id]`)**: Full specifications, brand, rating star indicators, review comments carousel, and active stock indicators.
- **Shopping Cart (`/cart`)**: Complete cart list, quantity manager, line items totals, dynamic order summary, coupons module, and checkout options.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & `redux-persist` (localStorage sync)
- **Server Cache & Queries**: [TanStack React Query v5](https://tanstack.com/query)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Vanilla CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) (based on `DESIGN.md`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: Native Fetch API with custom typed wrapper

---

## ✅ Functional Requirements Met

1. **Product Grid**: Displays product cards containing high-resolution thumbnails, title links, price, original price (with crossed-out discount styling), review rating (numerical + stars), and availability badge.
2. **Debounced Search (300ms)**: Instant typing filter that updates URL query parameters with a 300ms debounce to avoid excessive API requests.
3. **Category Filtering**: Dropdown listing all categories fetched directly from the API. Includes active filter tags (chips) with clear buttons and a "Clear All" action.
4. **Product Details Page**: Dedicated dynamic route `/products/[id]` showcasing detailed specifications (shipping, warranty, SKU), description, review ratings/comments, and image thumbnail selector gallery.
5. **Shopping Cart Management**: Add, remove, and update quantities from any page. Uses Redux persisted storage to keep items in `localStorage` across page reloads.
6. **Order Summary**: Real-time calculations for:
    - **Subtotal**: Sum of all line items.
    - **Discount**: Based on the applied coupon.
    - **VAT**: 15% rate applied to the discounted subtotal.
    - **Grand Total**: Final order sum.
7. **Coupon Support**: Validation rules and discounts implemented:
    - `SAVE10`: 10% percentage discount.
    - `SAVE20`: 20% percentage discount.
    - `WELCOME`: $5 fixed discount (requires minimum order of $20).
8. **Checkout Confirmation Modal**: Detailed recap of order items, summary totals, and confirmation action.
9. **API Checkout Post**: Submits order details to `POST https://dummyjson.com/carts/add` and displays success feedback before clearing the active cart.
10. **Skeletons, Empty, and Error States**: Built-in loading skeletons for grids/lists, placeholder icons for empty searches or cart items, and custom error boundaries for API failures.
11. **Responsive UI**: Seamlessly shifts between desktop, tablet, and mobile views using grid column breakpoints and flex configurations.

---

## 🎨 Design System & Aesthetics (Vercel-inspired)

The user interface follows the core specifications detailed in `DESIGN.md`:

- **Color Palette**: Minimalist stark duet featuring an ink-black (`#171717`) primary tone and pristine background canvas (`#ffffff`), offset by soft canvas shades (`#fafafa` & `#f5f5f5`) and error/warning/success accent fills.
- **Interactive States**: Smooth scaling transitions (`duration-200`) and stacked box shadows (Level 1 to Level 5) to reflect page elevation.
- **Global Pointers**: Forced pointer hands on buttons, link tags, selects, and summary toggles to elevate desktop interactivity.
- **Hydration Guards**: Client hydration protections implemented on cart counters and persistent elements to prevent Server-Client mismatches.

---

## 💻 Getting Started

### Prerequisites

Make sure you have Node.js installed (v18.0.0 or higher recommended).

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Running Locally (Development)

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the POS interface.

### Running Linting (Static Analysis)

Verify code standards and check for ESLint warnings:

```bash
npm run lint
```

### Building for Production

Create an optimized production bundle:

```bash
npm run build
```

---

## 🧪 Testing and Verification

To verify the POS functionality, you can run through these core test cases:

1. **Search**: Enter "mascara" or "perfume" in the search box; the list should update 300ms after you stop typing.
2. **Category**: Select a category from the dropdown; the grid updates. Click the `X` button on the filter chip to remove it.
3. **Cart Operations**: Click "Add to Cart" on a product. The button swaps to `- 1 +` controls. Increasing or decreasing values should reflect immediately in the Header badge.
4. **Detail Page**: Click a product title to open `/products/[id]`. Confirm you can switch images, check customer reviews, and alter cart quantity.
5. **Coupons**: Navigate to `/cart`. Try adding `SAVE20` (reflects 20% discount). Try adding `WELCOME` with an order less than $20 (shows error banner), then add more items and verify it applies.
6. **Checkout**: Click "Proceed to Checkout" in the cart. Confirm the modal details, click "Place Order", and watch the cart reset upon successful completion.
