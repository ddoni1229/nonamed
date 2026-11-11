-- nonamed · Supabase 스키마 (2단계) — 기존 trade-system 프로젝트에 함께 올리는 버전
-- 모든 표·함수·트리거 이름에 nm_ 접두어를 붙여 기존 표(profiles, companies 등)와 겹치지 않게 했습니다.
-- 기존 표·함수·트리거는 건드리지 않습니다. 여러 번 실행해도 안전합니다.
-- Supabase 대시보드 › SQL Editor › New query 에 전체 붙여넣고 Run.

-- ── 회사·구성원 ─────────────────────────────────────────
create table if not exists public.nm_profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.nm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ceo text, biz text, phone text,
  owner uuid not null references auth.users,
  invite text unique not null default upper(substr(md5(random()::text), 1, 4) || '-' || substr(md5(random()::text), 1, 4)),
  trial_end timestamptz not null default now() + interval '7 days',
  billing jsonb,                       -- { status, card:{brand,last4}, next_bill } — 5단계에서 서버만 기록
  created_at timestamptz default now()
);

create table if not exists public.nm_members (
  company_id uuid references public.nm_companies on delete cascade,
  user_id uuid references auth.users on delete cascade,
  name text,
  role text not null default '일반' check (role in ('관리자','일반','조회전용')),
  perms jsonb default '{}'::jsonb,     -- 메뉴별 { "purchase":"조회", "tax":"숨김", ... }
  joined_at timestamptz default now(),
  primary key (company_id, user_id)
);

-- ── 업무 데이터 (회사 단위) ───────────────────────────────
create table if not exists public.nm_records (
  id text not null,                    -- 화면에서 쓰는 코드 (P-001, I-0001, P-26-0142 …)
  company_id uuid not null references public.nm_companies on delete cascade,
  kind text not null check (kind in ('partner','item','purchase','sales','adjust','cash','tax','activity')),
  data jsonb not null,
  updated_by uuid references auth.users,
  updated_at timestamptz default now(),
  deleted boolean default false,
  primary key (company_id, kind, id)
);
create index if not exists nm_records_company_kind on public.nm_records (company_id, kind) where not deleted;

create table if not exists public.nm_settings (
  company_id uuid not null references public.nm_companies on delete cascade,
  key text not null,
  value jsonb,
  updated_at timestamptz default now(),
  primary key (company_id, key)
);

-- ── 헬퍼 함수 ──────────────────────────────────────────
create or replace function public.nm_is_member(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from nm_members where company_id = cid and user_id = auth.uid());
$$;

create or replace function public.nm_my_role(cid uuid) returns text
language sql stable security definer set search_path = public as $$
  select role from nm_members where company_id = cid and user_id = auth.uid();
$$;

-- 쓰기 가능 여부: 조회전용 아님 + 트라이얼 중이거나 결제 활성
create or replace function public.nm_can_write(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from nm_members m join nm_companies c on c.id = m.company_id
    where m.company_id = cid and m.user_id = auth.uid()
      and m.role <> '조회전용'
      and (c.trial_end > now() or (c.billing->>'status') = 'active')
  );
$$;

-- 회사 만들기 (만든 사람 = 관리자)
create or replace function public.nm_create_company(p_name text, p_ceo text default null, p_biz text default null, p_phone text default null)
returns public.nm_companies language plpgsql security definer set search_path = public as $$
declare c nm_companies;
begin
  insert into nm_companies (name, ceo, biz, phone, owner) values (p_name, p_ceo, p_biz, p_phone, auth.uid()) returning * into c;
  insert into nm_members (company_id, user_id, name, role)
    values (c.id, auth.uid(), coalesce((select name from nm_profiles where id = auth.uid()), p_ceo), '관리자');
  return c;
end $$;

-- 초대코드로 합류 (일반 권한)
create or replace function public.nm_join_company(p_code text)
returns public.nm_companies language plpgsql security definer set search_path = public as $$
declare c nm_companies;
begin
  select * into c from nm_companies where replace(invite, '-', '') = upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g'));
  if c.id is null then raise exception '일치하는 회사가 없습니다'; end if;
  insert into nm_members (company_id, user_id, name, role)
    values (c.id, auth.uid(), (select name from nm_profiles where id = auth.uid()), '일반')
    on conflict do nothing;
  return c;
end $$;

-- 가입 시 nm_profiles 자동 생성 (기존 trade-system 트리거와 별개로 동작)
-- 오류가 나도 가입 자체는 막지 않도록 예외를 삼킵니다 (trade-system 가입에 영향 없게).
create or replace function public.nm_handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  begin
    insert into nm_profiles (id, name, phone) values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone')
    on conflict (id) do nothing;
  exception when others then null;
  end;
  return new;
end $$;
drop trigger if exists nm_on_auth_user_created on auth.users;
create trigger nm_on_auth_user_created after insert on auth.users for each row execute function public.nm_handle_new_user();

-- 이미 가입된 계정도 nm_profiles 채우기
insert into public.nm_profiles (id, name, phone)
select id, raw_user_meta_data->>'name', raw_user_meta_data->>'phone' from auth.users
on conflict (id) do nothing;

-- ── 보안 규칙 (RLS) — 회사끼리 데이터가 절대 섞이지 않게 ─────
alter table public.nm_profiles  enable row level security;
alter table public.nm_companies enable row level security;
alter table public.nm_members   enable row level security;
alter table public.nm_records   enable row level security;
alter table public.nm_settings  enable row level security;

drop policy if exists "nm profile self" on public.nm_profiles;
create policy "nm profile self" on public.nm_profiles for all using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "nm profile co-members read" on public.nm_profiles;
create policy "nm profile co-members read" on public.nm_profiles for select using (
  exists (select 1 from nm_members a join nm_members b on a.company_id = b.company_id where a.user_id = auth.uid() and b.user_id = nm_profiles.id));

drop policy if exists "nm company read" on public.nm_companies;
create policy "nm company read" on public.nm_companies for select using (nm_is_member(id));
drop policy if exists "nm company admin update" on public.nm_companies;
create policy "nm company admin update" on public.nm_companies for update using (nm_my_role(id) = '관리자') with check (nm_my_role(id) = '관리자');
-- billing·trial_end·owner 는 화면에서 못 바꾸게: 표 전체 수정권한을 빼고 허용할 열만 다시 줌
revoke update on public.nm_companies from authenticated, anon;
grant update (name, ceo, biz, phone, invite) on public.nm_companies to authenticated;

drop policy if exists "nm members read" on public.nm_members;
create policy "nm members read" on public.nm_members for select using (nm_is_member(company_id));
drop policy if exists "nm members admin write" on public.nm_members;
create policy "nm members admin write" on public.nm_members for update using (nm_my_role(company_id) = '관리자') with check (nm_my_role(company_id) = '관리자');
drop policy if exists "nm members admin delete" on public.nm_members;
create policy "nm members admin delete" on public.nm_members for delete using (
  nm_my_role(company_id) = '관리자'
  and user_id <> (select c.owner from public.nm_companies c where c.id = nm_members.company_id));

drop policy if exists "nm records read" on public.nm_records;
create policy "nm records read" on public.nm_records for select using (nm_is_member(company_id));
drop policy if exists "nm records write" on public.nm_records;
create policy "nm records write" on public.nm_records for insert with check (nm_can_write(company_id));
drop policy if exists "nm records update" on public.nm_records;
create policy "nm records update" on public.nm_records for update using (nm_can_write(company_id)) with check (nm_can_write(company_id));

drop policy if exists "nm settings read" on public.nm_settings;
create policy "nm settings read" on public.nm_settings for select using (nm_is_member(company_id));
drop policy if exists "nm settings write" on public.nm_settings;
create policy "nm settings write" on public.nm_settings for all using (nm_can_write(company_id)) with check (nm_can_write(company_id));

-- 실시간 반영 (다른 직원이 입력하면 바로 보이게)
do $$ begin
  begin alter publication supabase_realtime add table public.nm_records; exception when others then null; end;
  begin alter publication supabase_realtime add table public.nm_members; exception when others then null; end;
end $$;
