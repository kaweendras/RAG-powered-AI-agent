# RAG-Powered AI Agent

A Retrieval-Augmented Generation (RAG) system that enhances AI responses by retrieving relevant context from a document database.

## Features

- PDF document processing and chunking
- Vector embeddings using Nomic models via Ollama
- Vector database storage using ChromaDB
- AI query capabilities with:
  - Google AI (Gemini) integration
  - Ollama local LLM integration
- Context-aware responses using RAG methodology

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Ollama installed locally (for embeddings and local LLM)
- ChromaDB instance (local or remote)
- Google AI API key (for Gemini integration)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/RAG-powered-AI-agent.git
cd RAG-powered-AI-agent
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file by copying the provided sample:

```bash
cp .env.sample .env
```

4. Edit the `.env` file to include your specific configuration:
   - Add your Google API key
   - Set your preferred ChromaDB collection name
   - Adjust any other settings as needed

## ChromaDB Setup

This project uses ChromaDB as its vector database for storing document embeddings to enable efficient similarity search.

For ChromaDB installation and configuration, please refer to the official documentation: [ChromaDB Getting Started](https://docs.trychroma.com/docs/overview/getting-started?lang=typescript)

**Note about dimensions:** This project uses embeddings with 768 dimensions. The ChromaDB configuration in `src/db/chromaDB.ts` is set up to automatically handle the collection creation with the correct dimension settings.

## Project Structure

- **src/config**: Configuration settings
- **src/db**: ChromaDB connection and management
- **src/embed**: Document embedding functionality
- **src/llmClients**: Integration with AI models
  - **googleClient**: Google Gemini API integration
  - **ollamaClient**: Ollama API integration
- **src/utils**: Utility functions for document processing

## Known Issues and Troubleshooting

### ChromaDB Dimension Mismatch

If you receive an error like:

```
InvalidArgumentError: Collection expecting embedding with dimension of 384, got 768
```

This means there's a mismatch between the dimensions of your embeddings and what ChromaDB expects.

**Fix:** The system will automatically attempt to recreate the collection with the correct dimensions. If issues persist, you can:

1. Delete the collection manually:
   ```bash
   curl -X DELETE http://localhost:8000/api/v1/collections/your_collection_name
   ```
2. The next query will automatically recreate it with correct dimensions.

### Ollama Connection Issues

If you can't connect to Ollama:

1. Ensure Ollama is running:
   ```bash
   ollama serve
   ```
2. Verify the models are downloaded:
   ```bash
   ollama list
   ```
3. Download required models if needed:
   ```bash
   ollama pull nomic-embed-text:v1.5
   ollama pull llama2
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
