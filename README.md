# Interactive RAG Tutorial

Welcome to the Interactive RAG Tutorial, a web-based, hands-on guide to the art and science of Retrieval-Augmented Generation (RAG). This application is designed to provide an immersive learning experience through interactive simulations, detailed explanations, and visual diagrams.

## Core Features

- **Interactive Simulations**: Engage with concepts like RAG flow, chunking strategies, LLM parameters (Temperature, Top-K, Top-P), and evaluation metrics through hands-on simulators.
- **Advanced RAG Techniques**: Explore and visualize advanced strategies like Agentic RAG, HyDE, Sub-Query Generation, and more.
- **Comprehensive Evaluation Module**: Understand and simulate key RAGAS evaluation metrics, including Context Precision, Context Recall, Faithfulness, and Noise Sensitivity.
- **Visual Ecosystem Diagram**: Get a high-level overview of the entire RAG landscape, from core concepts to the latest research trends.
- **Further Reading**: A curated list of influential academic papers for those who want to dive deeper into RAG research.
- **Modern & Themed UI**: A sleek, professional interface built with shadcn/ui, featuring dark/light mode and a custom-styled scrollbar for a polished user experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI/LLM Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    Run the following command to install all the necessary packages.
    ```bash
    npm install
    ```

### Environment Variables

Some parts of this application, particularly the AI-powered features, require an API key for Google's Gemini models.

1.  **Create an environment file:**
    Create a file named `.env` in the root of the project directory.

2.  **Add your API key:**
    Open the `.env` file and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/).
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Application

This project requires two services to be run concurrently in separate terminals for full functionality: the Next.js web application and the Genkit AI service.

1.  **Start the Next.js Development Server:**
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    This will start the web application on [http://localhost:9002](http://localhost:9002).

2.  **Start the Genkit Development Service:**
    Open a second terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This starts the local Genkit service that the Next.js app communicates with for AI features. You can view the Genkit developer UI at [http://localhost:4000](http://localhost:4000).

## Available Scripts

Here are the main scripts you can run from the `package.json`:

-   `npm run dev`: Starts the Next.js application in development mode with Turbopack.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server for the built application.
-   `npm run lint`: Runs ESLint to check for code quality and style issues.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
-   `npm run genkit:dev`: Starts the Genkit service for local development.
-   `npm run genkit:watch`: Starts the Genkit service with a file watcher to automatically restart on changes.
