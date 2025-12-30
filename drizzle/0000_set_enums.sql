-- Custom SQL migration file, put your code below! --
CREATE TYPE quantity_unit AS ENUM (
  'kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'box', 'bag', 'carton', 'ton'
);

CREATE TYPE vehicle_type AS ENUM (
  'bike', 'van', 'truck', 'tractor', 'car'
);

CREATE TYPE delivery_status AS ENUM (
  'pending', 'delivered', 'cancelled'
);

CREATE TYPE media_resource_type AS ENUM (
  'user_profile', 'user_cover', 'product_gallery', 'vehicle_gallery'
);

CREATE TYPE auction_status AS ENUM (
  'pending', 'active', 'completed', 'cancelled'
);

