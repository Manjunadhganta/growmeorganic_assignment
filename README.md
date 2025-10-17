# GrowMeOrganic Assignment

A React + TypeScript project using Vite and PrimeReact to display artworks in a table with server-side pagination and row selection.

## Screenshot

![Artworks Table](public/screenshots/image.png)


## Features

- Built with **React** and **TypeScript** using **Vite**
- Displays a table of artworks using **PrimeReact DataTable**
- Fetches first page data from the server initially
- **Server-side pagination**: fetches data for the page when changed
- **Multiple row selection** with checkboxes
- **Custom selection panel** for selecting top N rows
- Selection persists across page changes

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Manjunadhganta/growmeorganic_assignment
   cd assignment
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm run dev
4. Build the project for production:
   ```bash
   npm run build

## Usage

- Select rows individually using checkboxes
- Click the chevron icon in the header to open the custom selection panel
- Enter a number to select the top N rows across all pages
- Navigate between pages using the paginator; row selections persist

## Tech Stack

- React with Vite and TypeScript
- PrimeReact for DataTable
- Lucide React for icons
- Tailwind CSS for styling

## Live Demo
https://manjunadhs-artwork-assignment.netlify.app/
