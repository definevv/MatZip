/*
  # Create restaurants table

  1. New Tables
    - `restaurants`
      - `id` (uuid, primary key) - Unique identifier for each restaurant
      - `name` (text) - Restaurant name
      - `category` (text) - Restaurant category (e.g., Korean, Chinese, Japanese)
      - `address` (text) - Full address of the restaurant
      - `rating` (numeric) - Rating score (0-5)
      - `review_count` (integer) - Number of reviews
      - `image` (text) - URL to restaurant image
      - `description` (text) - Restaurant description
      - `lat` (numeric) - Latitude coordinate
      - `lng` (numeric) - Longitude coordinate
      - `menu` (text[]) - Array of menu items
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `restaurants` table
    - Add policy for anyone to read restaurant data (public access)
    - Add policy for authenticated users to insert/update/delete restaurants
*/

CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  address text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  image text NOT NULL,
  description text,
  lat numeric(10,7) NOT NULL,
  lng numeric(10,7) NOT NULL,
  menu text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurants"
  ON restaurants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update restaurants"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete restaurants"
  ON restaurants FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants(name);
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(lat, lng);