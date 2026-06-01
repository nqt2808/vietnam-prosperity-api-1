-- Drop the CHECK constraints on orders table to support custom Vietnamese statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
