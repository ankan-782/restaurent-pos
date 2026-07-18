# Restaurant POS – New Order Module

This project is a premium, high-performance **Restaurant Point of Sale (POS) - New Order Module** web application. It was implemented as a frontend developer technical assessment for Divergent Technologies Ltd., using Next.js (App Router), Tailwind CSS v4, Redux Toolkit, and TanStack Query.

---

## 🚀 Live Demo & Key Pages

- **Home / Products Grid (`/`)**: Discover items, search with debouncing, select categories, and manage cart items directly.
- **Product Details (`/products/[id]`)**: Full specifications, brand, rating star indicators, review comments carousel, and active stock indicators.
- **Shopping Cart (`/cart`)**: Complete cart list, quantity manager, line items totals, dynamic order summary, coupons module, and checkout options.
- **Wishlist (`/wishlist`)**: Manage bookmarked products, view stock availability, and add items directly to the shopping cart.

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
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/) (JSDOM environment)

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

## ✨ Bonus Features Implemented

To provide a premium and professional user experience, the following optional features from the assessment criteria are implemented:

1. **Wishlist Module (`/wishlist`)**: Bookmarking system allowing users to save items for future orders. Items are saved in Redux persisted state, display live stock indicators, and support single-click add-to-cart.
2. **Keyboard Shortcuts**: Built-in hotkeys enabling keyboard-only navigation and faster operations:
    - `S` or `/`: Focus the product search input.
    - `C`: Route instantly to the Shopping Cart.
    - `H`: Route back to the main Products Grid.
    - `W`: Route instantly to the Wishlist.
    - `?`: Toggle the interactive Keyboard Shortcuts list modal.
    - `Esc`: Close open modal overlays (such as Checkout or Keyboard Shortcuts) and dismiss toasts.
3. **Infinite Scroll**: Automatically fetches the next page of products when scrolling to the bottom of the catalog. The trigger mechanism is throttled and debounced to prevent rapid, consecutive API calls.
4. **Undo Remove Toast**: Removing a line item from the shopping cart triggers an overlay toast with a countdown and an "Undo" action, letting the user restore the item with its exact original quantity.
5. **Automated Unit Tests**: Vitest suite covering core application logic such as cart management, VAT calculations, and coupon eligibility validation.
6. **Scroll to Top Button**: A smooth, elegant scroll-to-top button that fades in dynamically after the user scrolls down, styled to fit the clean, premium design system.

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

### Running Automated Tests

Run the Vitest test suite to execute the unit tests:

```bash
npm run test
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
7. **Wishlist**: Click the heart button on a product card or product details page to add it to your Wishlist. Navigate to `/wishlist` to confirm it is saved. Add it directly to the cart from there.
8. **Keyboard Shortcuts**: Press `?` (when not typing in an input field) to toggle the shortcut guide overlay. Press `C` to go to the cart, `W` to go to the wishlist, and `H` to return home.
9. **Scroll to Top**: Scroll down the products grid or other long pages; a minimalist scroll-to-top button will appear in the bottom-right corner. Clicking it smoothly scrolls the page back to the top.
