-- Ensure the UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clusters Table
-- Stores cluster centroids and metadata for grouping nearby orders.
CREATE TABLE IF NOT EXISTS clusters (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    centroid_lat NUMERIC(10, 7) NOT NULL,
    centroid_lon NUMERIC(10, 7) NOT NULL,
    order_count INTEGER DEFAULT 0
);

-- Add cluster_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES clusters(id) ON DELETE SET NULL;

-- Index for efficient querying by cluster
CREATE INDEX IF NOT EXISTS idx_orders_cluster_id ON orders(cluster_id);
