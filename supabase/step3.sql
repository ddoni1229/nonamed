-- nonamed · 3단계 추가 SQL (로그인 연동) — schema.sql 실행 후 한 번 실행. 여러 번 실행해도 안전합니다.

-- 회사별 메뉴 권한(일반/조회전용) 저장 칸
alter table public.nm_companies add column if not exists perms jsonb;
grant update (perms) on public.nm_companies to authenticated;

-- 구성원 목록에 이메일 표시
alter table public.nm_members add column if not exists email text;
update public.nm_members m set email = u.email from auth.users u where u.id = m.user_id and m.email is null;

create or replace function public.nm_create_company(p_name text, p_ceo text default null, p_biz text default null, p_phone text default null)
returns public.nm_companies language plpgsql security definer set search_path = public as $$
declare c nm_companies;
begin
  insert into nm_companies (name, ceo, biz, phone, owner) values (p_name, p_ceo, p_biz, p_phone, auth.uid()) returning * into c;
  insert into nm_members (company_id, user_id, name, email, role)
    values (c.id, auth.uid(), coalesce((select name from nm_profiles where id = auth.uid()), p_ceo), auth.jwt()->>'email', '관리자');
  return c;
end $$;

create or replace function public.nm_join_company(p_code text)
returns public.nm_companies language plpgsql security definer set search_path = public as $$
declare c nm_companies;
begin
  select * into c from nm_companies where replace(invite, '-', '') = upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g'));
  if c.id is null then raise exception '일치하는 회사가 없습니다'; end if;
  insert into nm_members (company_id, user_id, name, email, role)
    values (c.id, auth.uid(), (select name from nm_profiles where id = auth.uid()), auth.jwt()->>'email', '일반')
    on conflict do nothing;
  return c;
end $$;
