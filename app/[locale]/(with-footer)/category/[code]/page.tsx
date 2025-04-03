/* eslint-disable react/jsx-props-no-spreading */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@/db/supabase/client';

import { InfoPageSize, RevalidateOneHour } from '@/lib/constants';

import Content from './Content';

export const revalidate = RevalidateOneHour * 6;

// Utility function to check if text contains Chinese characters
const containsChinese = (text?: string): boolean => {
  if (!text) return false;
  return /[\u4e00-\u9fa5]/.test(text);
};

// Get English fallback for categories
const getEnglishCategory = (name: string): string => {
  const categoryMap: Record<string, string> = {
    'information-retrieval': 'Information Retrieval',
    'information-organization': 'Information Organization',
    'information-processing': 'Information Processing',
    'information-visualization': 'Information Visualization',
    'academic-research': 'Academic Research',
    'social-analysis': 'Social Analysis',
    'business-analysis': 'Business Analysis',
    'knowledge-management': 'Knowledge Management',
    'financial-analysis': 'Financial Analysis',
  };

  return (
    categoryMap[name] ||
    name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

// Get English fallback for content
const getEnglishContent = (content?: string): string => {
  if (!content) return 'Information analysis tool for efficient data processing and research';
  if (!containsChinese(content)) return content;

  return 'Advanced information analysis tool for data processing and research';
};

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const supabaseClient = await createServerComponentClient();
  const { data: categoryList } = await supabaseClient.from('navigation_category').select().eq('name', params.code);

  if (!categoryList || !categoryList[0]) {
    notFound();
  }

  const categoryTitle = containsChinese(categoryList[0].title)
    ? getEnglishCategory(params.code)
    : categoryList[0].title || getEnglishCategory(params.code);

  return {
    title: categoryTitle,
  };
}

export default async function Page({ params }: { params: { code: string } }) {
  const supabaseClient = await createServerComponentClient();
  const [{ data: categoryList }, { data: navigationList, count }] = await Promise.all([
    supabaseClient.from('navigation_category').select().eq('name', params.code),
    supabaseClient
      .from('web_navigation')
      .select('*', { count: 'exact' })
      .eq('category', params.code)
      .order('collection_time', { ascending: false })
      .range(0, 11),
  ]);

  if (!categoryList || !categoryList[0]) {
    notFound();
  }

  // Process category title to ensure it's in English
  const categoryTitle = containsChinese(categoryList[0].title)
    ? getEnglishCategory(params.code)
    : categoryList[0].title || getEnglishCategory(params.code);

  // Process navigation list to ensure all English content
  const processedNavigationList = navigationList?.map((item) => ({
    ...item,
    content: containsChinese(item.content) ? getEnglishContent(item.content) : item.content,
    title: containsChinese(item.title)
      ? item.name
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : item.title,
  }));

  return (
    <Content
      headerTitle={categoryTitle}
      navigationList={processedNavigationList!}
      currentPage={1}
      total={count!}
      pageSize={InfoPageSize}
      route={`/category/${params.code}`}
    />
  );
}
