# RAG-Powered AI Agent

A Retrieval-Augmented Generation (RAG) system that enhances AI responses by retrieving relevant context from a document database.

## Features

- PDF document processing and chunking
- Vector embeddings using Nomic models via Ollama
- Vector database storage options:
  - ChromaDB (local or remote)
  - Pinecone (cloud-based vector DB)
- AI query capabilities with:
  - Google AI (Gemini) integration
  - Ollama local LLM integration
- Context-aware responses using RAG methodology

## Use Cases

This RAG-powered AI agent can be used in various scenarios, including:

### Document Analysis and Question Answering

- Extract insights from research papers, books, or technical documentation
- Answer specific questions about PDF content with precise context
- Generate summaries of lengthy documents with accurate references

### Knowledge Base Enhancement

- Transform corporate handbooks into interactive Q&A systems
- Create intelligent assistants for technical support using product manuals
- Build educational tools that explain complex topics from textbooks

### Information Retrieval

- Search through large document collections more effectively than keyword search
- Find relevant information across multiple documents simultaneously
- Retrieve contextual information based on semantic meaning rather than exact text matches

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Ollama installed locally (for embeddings and local LLM)
- Vector database (choose one):
  - ChromaDB instance (local or remote)
  - Pinecone account (for cloud vector storage)
- Google AI API key (for Gemini integration)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kaweendras/RAG-powered-AI-agent.git
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
   - Choose your vector database (CHROMADB or PINECONE)
   - Add your Google API key for Gemini integration
   - Configure Pinecone details if using Pinecone
   - Set your preferred ChromaDB collection name
   - Adjust model settings and other parameters as needed

## Vector Database Setup

This project supports two vector database options for storing document embeddings:

### ChromaDB (Default)

For local or self-hosted vector storage, the project uses ChromaDB.

- For ChromaDB installation and configuration, please refer to the official documentation: [ChromaDB Getting Started](https://docs.trychroma.com/docs/overview/getting-started?lang=typescript)
- Default URL: http://localhost:8000 (configurable in .env)

### Pinecone

For cloud-based vector storage with higher scalability, you can use Pinecone.

- Sign up at [Pinecone](https://www.pinecone.io/) and create an index
- Set your API key and index name in the .env file
- Set `VECTORDB_TYPE=PINECONE` in your .env file

**Note about dimensions:** This project uses embeddings with 768 dimensions. The vector database configurations are set up to automatically handle the collection/index creation with the correct dimension settings.

## Project Structure

- **src/config**: Configuration settings
- **src/db**: Vector database connections
  - **chromaDB.ts**: ChromaDB connection and management
  - **pineDB.ts**: Pinecone connection and management
- **src/embed**: Document embedding functionality
- **src/llmClients**: Integration with AI models
  - **googleClient**: Google Gemini API integration
  - **ollamaClient**: Ollama API integration
- **src/utils**: Utility functions for document processing

## Known Issues and Troubleshooting

### Vector Database Issues

#### ChromaDB Dimension Mismatch

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

## Embedding Model Information

This project uses the Nomic embedding model (`nomic-embed-text:v1.5`) which produces **dense vectors** with 768 dimensions. These dense vectors are ideal for semantic search capabilities:

- **Dense vectors**: Fixed-length arrays with mostly non-zero values, optimized for semantic similarity searches
- The vector databases (ChromaDB and Pinecone) are configured to work with these dense embeddings
- Each PDF chunk is converted to a dense embedding vector that represents its semantic meaning

For advanced applications, hybrid search approaches combining dense vectors with sparse vectors (like BM25) could be implemented as a future enhancement.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
