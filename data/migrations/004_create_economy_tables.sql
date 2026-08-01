BEGIN;

CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cat text NOT NULL,
  description text,
  owner_id uuid REFERENCES auth.users(id),
  address text,
  phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','active','suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses (status);
CREATE INDEX IF NOT EXISTS idx_businesses_cat ON businesses (cat);

CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('basic','comercio','premium')),
  status text DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id uuid,
  to_id uuid,
  amount numeric NOT NULL,
  currency text DEFAULT 'MX' CHECK (currency IN ('MX','LTOS')),
  type text CHECK (type IN ('payment','donation','membership')),
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  created_at timestamptz DEFAULT now()
);

COMMIT;
