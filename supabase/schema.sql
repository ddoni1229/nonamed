-- nonamed · Supabase 스키마 (2단계)
-- Supabase 대시보드 › SQL Editor › New query 에 전체 붙여넣고 Run.
-- 여러 번 실행해도 안전합니다 (if not exists / or replace).

-- ── 회사·구성원 ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ceo text, biz text, phone text,
  owner uuid not null references auth.users,
  invite text unique not null default upper(substr(md5(random()::text), 1, 4) || '-' || substr(md5(random()::text), 1, 4)),
  trial_end timestamptz not null default now() + interval '7 days',
  billing jsonb,                       -- { status, card:{brand,last4}, next_bill } — 5단계에서 서버만 기록
  created_at timestamptz default now()
);

create table if not exists public.members (
  company_id uuid references public.companies on delete cascade,
  user_id uuid references auth.users on delete cascade,
  name text,
  role text not null default '일반' check (role in ('관리자','일반','조회전용')),
  perms jsonb default '{}'::jsonb,     -- 메뉴별 { "purchase":"조회", "tax":"숨김", ... }
  joined_at timestamptz default now(),
  primary key (company_id, user_id)
);

-- ── 업무 데이터 (회사 단위) ───────────────────────────────
-- 화면마다 필드가 자주 바뀌므로 공통 열 + data(jsonb) 구조로 둡니다.
create table if not exists public.records (
  id text not null,                    -- 화면에서 쓰는 코드 (P-001, I-0001, P-26-0142 …)
  company_id uuid not null references public.companies on delete cascade,
  kind text not null check (kind in ('partner','item','purchase','sales','adjust','cash','tax','activity')),
  data jsonb not null,
  updated_by uuid references auth.users,
  updated_at timestamptz default now(),
  deleted boolean default false,
  primary key (company_id, kind, id)
);
create index if not exists records_company_kind on public.records (company_id, kind) where not deleted;

-- 화면설정·저장양식 (회사 공용)
create table if not exists public.settings (
  company_id uuid not null references public.companies on delete cascade,
  key text not null,                   -- 예: nonamed.purchase.columns.v5
  value jsonb,
  updated_at timestamptz default now(),
  primary key (company_id, key)
);

-- ── 헬퍼 함수 ──────────────────────────────────────────
create or replace function public.is_member(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where company_id = cid and user_id = auth.uid());
$$;

create or replace function public.my_role(cid uuid) returns text
language sql stable security definer set search_path = public as $$
  select role from members where company_id = cid and user_id = auth.uid();
$$;

-- 쓰기 가능 여부: 조회전용 아님 + 트라이얼 중이거나 결제 활성
create or replace function public.can_write(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from members m join companies c on c.id = m.company_id
    where m.company_id = cid and m.user_id = auth.uid()
      and m.role <> '조회전용'
      and (c.trial_end > now() or (c.billing->>'status') = 'active')
  );
$$;

-- 회사 만들기 (만든 사람 = 관리자)
create or replace function public.create_company(p_name text, p_ceo text default null, p_biz text default null, p_phone text default null)
returns public.companies language plpgsql security definer set search_path = public as $$
declare c companies;
begin
  insert into companies (name, ceo, biz, phone, owner) values (p_name, p_ceo, p_biz, p_phone, auth.uid()) returning * into c;
  insert into members (company_id, user_id, name, role)
    values (c.id, auth.uid(), coalesce((select name from profiles where id = auth.uid()), p_ceo), '관리자');
  return c;
end $$;

-- 초대코드로 합류 (일반 권한)
create or replace function public.join_company(p_code text)
returns public.companies language plpgsql security definer set search_path = public as $$
declare c companies;
begin
  select * into c from companies where replace(invite, '-', '') = upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g'));
  if c.id is null then raise exception '일치하는 회사가 없습니다'; end if;
  insert into members (company_id, user_id, name, role)
    values (c.id, auth.uid(), (select name from profiles where id = auth.uid()), '일반')
    on conflict do nothing;
  return c;
end $$;

-- 가입 시 profiles 자동 생성
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name, phone) values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ── 보안 규칙 (RLS) — 회사끼리 데이터가 절대 섞이지 않게 ─────
alter table public.profiles  enable row level security;
alter table public.companies enable row level security;
alter table public.members   enable row level security;
alter table public.records   enable row level security;
alter table public.settings  enable row level security;

drop policy if exists "profile self" on public.profiles;
create policy "profile self" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "profile co-members read" on public.profiles;
create policy "profile co-members read" on public.profiles for select using (
  exists (select 1 from members a join members b on a.company_id = b.company_id where a.user_id = auth.uid() and b.user_id = profiles.id));

drop policy if exists "company read" on public.companies;
create policy "company read" on public.companies for select using (is_member(id));
drop policy if exists "company admin update" on public.companies;
create policy "company admin update" on public.companies for update using (my_role(id) = '관리자') with check (my_role(id) = '관리자');
-- billing 열은 화면에서 못 바꾸게 (5단계 서버 함수만)
revoke update (billing, trial_end, owner) on public.companies from authenticated;

drop policy if exists "members read" on public.members;
create policy "members read" on public.members for select using (is_member(company_id));
drop policy if exists "members admin write" on public.members;
create policy "members admin write" on public.members for update using (my_role(company_id) = '관리자') with check (my_role(company_id) = '관리자');
drop policy if exists "members admin delete" on public.members;
create policy "members admin delete" on public.members for delete using (
  my_role(company_id) = '관리자' and user_id <> (select owner from companies where id = company_id));

drop policy if exists "records read" on public.records;
create policy "records read" on public.records for select using (is_member(company_id));
drop policy if exists "records write" on public.records;
create policy "records write" on public.records for insert with check (can_write(company_id));
drop policy if exists "records update" on public.records;
create policy "records update" on public.records for update using (can_write(company_id)) with check (can_write(company_id));

drop policy if exists "settings read" on public.settings;
create policy "settings read" on public.settings for select using (is_member(company_id));
drop policy if exists "settings write" on public.settings;
create policy "settings write" on public.settings for all using (can_write(company_id)) with check (can_write(company_id));

-- 실시간 반영 (다른 직원이 입력하면 바로 보이게)
do $$ begin
  begin alter publication supabase_realtime add table public.records; exception when others then null; end;
  begin alter publication supabase_realtime add table public.members; exception when others then null; end;
end $$;
