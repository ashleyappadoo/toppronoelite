-- ============================================================
-- TPE — Top Prono Élite · Schéma Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- Joueurs
create table if not exists users (
  id           text primary key,
  pseudo       text unique not null,
  email        text unique not null,
  password_hash text not null,
  role         text not null default 'user',
  created_at   timestamptz not null default now()
);

-- Ligues privées
create table if not exists leagues (
  id          text primary key,
  code        text unique not null,
  nom         text not null,
  created_by  text references users(id),
  created_at  timestamptz not null default now(),
  membres     text[] not null default '{}'
);

-- Pronostics des joueurs
create table if not exists pronos (
  id            text primary key,
  user_id       text not null references users(id),
  league_id     text not null references leagues(id),
  match_id      integer not null,
  score_a       integer not null,
  score_b       integer not null,
  justification text,
  bonus_x2      boolean not null default false,
  soumis_at     timestamptz not null default now(),
  unique(user_id, league_id, match_id)
);

-- Pronostics El Oraculo (générés par l'IA par ligue)
create table if not exists oraculo_pronos (
  id           text not null default gen_random_uuid()::text,
  league_id    text not null references leagues(id),
  match_id     integer not null,
  score_a      integer not null,
  score_b      integer not null,
  replique     text,
  generated_at timestamptz not null default now(),
  primary key(league_id, match_id)
);

-- Résultats officiels (saisis par l'admin)
create table if not exists results (
  match_id  integer primary key,
  score_a   integer not null,
  score_b   integer not null,
  saisi_par text references users(id),
  saisi_at  timestamptz not null default now()
);

-- Débriefings El Oraculo post-match
create table if not exists debriefs (
  id           text not null default gen_random_uuid()::text,
  match_id     integer not null,
  league_id    text not null references leagues(id),
  texte        text not null,
  generated_at timestamptz not null default now(),
  primary key(match_id, league_id)
);

-- Votes pré-match (D'accord / Il délire)
create table if not exists votes (
  user_id  text not null references users(id),
  match_id integer not null,
  vote     text not null,
  primary key(user_id, match_id)
);

-- ============================================================
-- RLS (Row Level Security) — permissif pour le MVP
-- L'anon key (publique) peut tout lire/écrire.
-- ============================================================
alter table users        enable row level security;
alter table leagues      enable row level security;
alter table pronos       enable row level security;
alter table oraculo_pronos enable row level security;
alter table results      enable row level security;
alter table debriefs     enable row level security;
alter table votes        enable row level security;

create policy "tpe_public" on users          for all to anon using (true) with check (true);
create policy "tpe_public" on leagues        for all to anon using (true) with check (true);
create policy "tpe_public" on pronos         for all to anon using (true) with check (true);
create policy "tpe_public" on oraculo_pronos for all to anon using (true) with check (true);
create policy "tpe_public" on results        for all to anon using (true) with check (true);
create policy "tpe_public" on debriefs       for all to anon using (true) with check (true);
create policy "tpe_public" on votes          for all to anon using (true) with check (true);
