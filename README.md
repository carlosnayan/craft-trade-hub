# Craft Trade Hub

Craft Trade Hub is a tool for Albion Online players to analyze market prices and calculate crafting profitability.

## Features

- **Market Analysis**: View current Sell Orders and Buy Orders for items across different cities.
- **Crafting Calculator**: Calculate crafting costs and potential profit based on resource prices and return rates.
- **Enchantment Support**: Easily switch between enchantment levels (.0, .1, .2, .3, .4).
- **Multi-language Support**: Available in English (EN) and Portuguese (PT).
- **Real-time Data**: Fetches data from the Albion Online Data Project.

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: Shadcn UI, Tailwind CSS
- **State Management**: React Query, React Context
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js & npm (or yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd craft-trade-hub
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

## Usage

1. **Select an Item**: Use the search bar to find an item or enter a custom Item ID.
2. **Choose Mode**: Toggle between "Market" and "Craft" views.
3. **Analyze**:
   - In **Market** mode, view prices across focused cities (e.g., Martlock, Bridgewatch, Lymhurst, Fort Sterling, Thetford, Caerleon).
   - In **Craft** mode, see the breakdown of resource costs, city bonuses, and estimated profit.

## Credits

- Data provided by the [Albion Online Data Project](https://www.albion-online-data.com/).
