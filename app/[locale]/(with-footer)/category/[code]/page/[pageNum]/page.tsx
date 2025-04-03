/* eslint-disable react/jsx-props-no-spreading */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@/db/supabase/client';

import { InfoPageSize, RevalidateOneHour } from '@/lib/constants';

import Content from '../../Content';

export const revalidate = RevalidateOneHour * 6;

export async function generateMetadata({ params }: { params: { code: string; pageNum?: string } }): Promise<Metadata> {
  const supabase = createServerComponentClient();
  const { data: categoryList } = await supabase.from('navigation_category').select().eq('name', params.code);

  if (!categoryList || !categoryList[0]) {
    notFound();
  }

  return {
    title: categoryList[0].title,
  };
}

export default async function Page({ params }: { params: { code: string; pageNum?: string } }) {
  const supabaseClient = await createServerComponentClient();
  const currentPage = Number(params?.pageNum || 1);

  const startIndex = (currentPage - 1) * InfoPageSize;
  const endIndex = startIndex + InfoPageSize - 1;

  const [{ data: categoryList }, { data: navigationList, count }] = await Promise.all([
    supabaseClient.from('navigation_category').select().eq('name', params.code),
    supabaseClient
      .from('web_navigation')
      .select('*', { count: 'exact' })
      .eq('category', params.code)
      .order('collection_time', { ascending: false })
      .range(startIndex, endIndex),
  ]);

  if (!categoryList || !categoryList[0]) {
    notFound();
  }

  return (
    <Content
      headerTitle={categoryList[0]!.title || params.code}
      navigationList={navigationList!}
      currentPage={currentPage}
      total={count!}
      pageSize={InfoPageSize}
      route={`/category/${params.code}`}
    />
  );
}
