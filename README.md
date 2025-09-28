# Kingpin OKR Tracker

A visually stunning OKR (Objectives and Key Results) tracking application inspired by Airbnb's clean design and Kelly Services' professional branding.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/seanperry/kingpin)

Kingpin is a sophisticated and visually stunning OKR (Objectives and Key Results) tracking application designed for modern teams. It combines the clean, spacious, and user-centric design principles of Airbnb with the professional and established brand identity of Kelly Services. The application provides a central dashboard to view all company and team objectives at a glance. Each objective is displayed in a beautifully designed card, featuring a title, owner, a dynamic progress bar, and a summary of key results. Users can create, update, and manage objectives and their associated key results through intuitive modals and forms. The interface is crafted to be highly interactive, with smooth animations, clear visual hierarchy, and delightful micro-interactions, making goal tracking an engaging and motivating experience.

## ✨ Key Features

- **Visual Excellence:** A beautiful, modern UI inspired by Airbnb's design language and Kelly Services' color palette.
- **Interactive Dashboard:** View all company and team objectives in a clean, responsive grid layout.
- **Dynamic Progress Tracking:** At-a-glance progress bars for both individual Objectives and their underlying Key Results.
- **Intuitive OKR Management:** Easily create, read, update, and delete OKRs through a seamless modal interface.
- **Robust Form Validation:** Client-side validation powered by Zod and React Hook Form ensures data integrity.
- **Client-Side State Management:** Fast and predictable state management using Zustand, with no backend required for the initial phase.

## 🚀 Technology Stack

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form & Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## 🏁 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- You must have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd kingpin_okr_tracker
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running the Development Server

To start the local development server, run the following command:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view the application in your browser.

## 🔧 Usage

Once the application is running, you will land on the main OKR Dashboard.

- **View Objectives:** Browse the grid of existing Objective cards to see their current progress.
- **Add a New Objective:** Click the "Add Objective" button in the header to open the management modal.
- **Fill out the Form:** Provide a title, owner, and description for the Objective. Add one or more Key Results with their titles and target values.
- **Submit:** Save the new Objective. It will appear on the dashboard.
- **Edit an Objective:** Click on any existing Objective card to open the modal pre-filled with its data. You can update any field, including the current value of Key Results to see progress change.

## ☁️ Deployment

This project is optimized for deployment on the Cloudflare network.

To deploy your application, run the build command and then the deploy command:

1.  **Build the project for production:**
    ```bash
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    ```bash
    bun run deploy
    ```

This will deploy your application using Wrangler to Cloudflare Pages.

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/seanperry/kingpin)