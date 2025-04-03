/* eslint-disable import/prefer-default-export */

import { createBrowserClient } from '@supabase/ssr';

import { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// 注意：此下方函数仅用于App Router，不能在Pages Router中使用
// This function can only be used in App Router, not in Pages Router
// 不要在Pages目录的组件中导入此函数
// eslint-disable-next-line
export async function createServerComponentClient() {
  // 动态导入，这样在构建时不会被包含到Pages路由的客户端代码中
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();

  const { createServerClient } = await import('@supabase/ssr');
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
}
