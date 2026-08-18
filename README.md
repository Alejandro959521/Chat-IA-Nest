# AI Chat - Backend (NestJS)

Backend API for an AI-powered chat application built with NestJS. Connects to the repository [Chat-IA-React](https://github.com/Alejandro959521/Chat-IA-React) (frontend).

**Demo en vivo:** [chat-ia-react.vercel.app](https://chat-ia-react.vercel.app)

## Features

- AI-powered chat response generation
- Image upload and processing (Multer + Sharp)
- Data validation with class-validator / class-transformer
- Centralized configuration with @nestjs/config

## Technologies

- NestJS 11
- TypeScript
- SDK de OpenAI 
- Multer (file uploads)
- Class-validator / Class-transformer

## Installation

# Clone the repository
git clone https://github.com/Alejandro959521/Chat-IA-Nest.git

# Instalar dependencias
npm install

# Create a .env file based on .env.template
# define the required variables here, e.g. GROQ_API_KEY)

# Run in development mode
npm run start:dev


## Environment Variables

| Variable         | Description                          |
|------------------|---------------------------------------|
| `OPENAI_API_KEY` | API key  |
| `PORT`           | Server port                   |

## Scripts disponibles

- `npm run start:dev` — development mode with hot-reload
- `npm run build` — builds the project



## Related Project

Frontend: [Chat-IA-React](https://github.com/Alejandro959521/Chat-IA-React)
