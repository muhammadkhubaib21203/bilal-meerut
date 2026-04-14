alter table public.orders
add column order_type text null check (order_type in ('delivery', 'pickup'));
