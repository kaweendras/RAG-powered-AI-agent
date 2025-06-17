-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
-- Create 'hp2' table with Nomic embeddings (768 dimensions)
CREATE TABLE IF NOT EXISTS hp2 (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(768)
);
-- Create vector index on the embedding column for faster similarity search
CREATE INDEX IF NOT EXISTS hp2_vector_idx ON hp2 USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Function to search documents in 'hp2' table by embedding similarity
CREATE OR REPLACE FUNCTION match_documents (
        query_embedding VECTOR(768),
        similarity_threshold FLOAT,
        match_count INT
    ) RETURNS TABLE (
        id TEXT,
        title TEXT,
        content TEXT,
        metadata JSONB,
        similarity FLOAT
    ) AS $$ BEGIN RETURN QUERY
SELECT d.id,
    d.title,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
FROM hp2 d
WHERE 1 - (d.embedding <=> query_embedding) > similarity_threshold
ORDER BY similarity DESC
LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
-- Function to create a vector table with a given name and dimension
CREATE OR REPLACE FUNCTION create_vector_table(table_name TEXT, dimension INTEGER) RETURNS VOID AS $$ BEGIN EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I (
        id TEXT PRIMARY KEY,
        content TEXT,
        embedding VECTOR(%s),
        metadata JSONB
    )',
        table_name,
        dimension
    );
EXECUTE format(
    'CREATE INDEX IF NOT EXISTS %I_vector_idx 
     ON %I USING ivfflat (embedding vector_cosine_ops) 
     WITH (lists = 100)',
    table_name,
    table_name
);
EXCEPTION
WHEN others THEN RAISE EXCEPTION 'Error creating vector table: %',
SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to match embeddings from any given table
CREATE OR REPLACE FUNCTION match_embeddings(
        query_embedding VECTOR,
        match_threshold FLOAT,
        match_count INT,
        table_name TEXT
    ) RETURNS TABLE (
        id TEXT,
        content TEXT,
        metadata JSONB,
        similarity FLOAT
    ) AS $$ BEGIN RETURN QUERY EXECUTE format(
        'SELECT 
        id, 
        content, 
        metadata,
        1 - (embedding <=> $1) AS similarity
     FROM %I
     WHERE 1 - (embedding <=> $1) > $2
     ORDER BY similarity DESC
     LIMIT $3',
        table_name
    ) USING query_embedding,
    match_threshold,
    match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Example RLS (Optional)
-- ALTER TABLE hp2 ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow full access to authenticated users"
-- ON hp2 FOR ALL
-- USING (auth.role() = 'authenticated');