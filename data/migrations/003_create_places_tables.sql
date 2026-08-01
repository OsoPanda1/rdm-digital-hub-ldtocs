BEGIN;

CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cat text NOT NULL CHECK (cat IN ('museo','historico','mineria','arquitectura','gastronomia','naturaleza','plaza','cultura')),
  description text,
  lat double precision,
  lng double precision,
  address text,
  image_url text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_places_cat ON places (cat);
CREATE INDEX IF NOT EXISTS idx_places_status ON places (status);

CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  duration text,
  distance numeric,
  places uuid[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('easy','medium','hard')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  location text,
  category text CHECK (category IN ('cultural','gastronomia','turismo','festividad','tradicion','cultura','musica','naturaleza')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events (date);

COMMIT;
