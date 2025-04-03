import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createServerComponentClient } from '@/db/supabase/client';
import { CircleChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import Faq from '@/components/Faq';
import SearchForm from '@/components/home/SearchForm';
import WebNavCardList from '@/components/webNav/WebNavCardList';

import { TagList } from './Tag';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

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
    信息获取: 'Information Retrieval',
    信息整理: 'Information Organization',
    信息加工: 'Information Processing',
    信息可视化: 'Information Visualization',
    学术分析: 'Academic Research',
    社交分析: 'Social Analysis',
    商业分析: 'Business Analysis',
    AI知识管理: 'Knowledge Management',
    金融分析: 'Financial Analysis',
  };

  return categoryMap[name] || name;
};

// Get English fallback for content
const getEnglishContent = (content?: string): string => {
  if (!content) return 'Information analysis tool for efficient data processing and research';
  if (!containsChinese(content)) return content;

  return 'Advanced information analysis tool for data processing and research';
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: './',
    },
  };
}

export const revalidate = RevalidateOneHour;

export default async function Page() {
  const supabase = createServerComponentClient();
  const t = await getTranslations('Home');
  const [{ data: categoryList }, { data: navigationList }] = await Promise.all([
    supabase.from('navigation_category').select(),
    supabase.from('web_navigation').select().order('collection_time', { ascending: false }).limit(12),
  ]);

  // Process category list to ensure all English titles
  const processedCategoryList = categoryList?.map((item) => ({
    ...item,
    title: containsChinese(item.title) ? getEnglishCategory(item.name) : item.title || getEnglishCategory(item.name),
  }));

  // Process navigation list to ensure all English content
  const processedNavigationList = navigationList?.map((item) => ({
    ...item,
    content: containsChinese(item.content) ? getEnglishContent(item.content) : item.content,
  }));

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-pc flex-1 px-3 lg:px-0'>
        <div className='my-5 flex flex-col text-center lg:mx-auto lg:my-10 lg:gap-1'>
          <h1 className='text-2xl font-bold text-white lg:text-5xl'>{t('title')}</h1>
          <h2 className='text-balance text-xs font-bold text-white lg:text-sm'>{t('subTitle')}</h2>
        </div>
        <div className='flex w-full items-center justify-center'>
          <SearchForm />
        </div>
        <div className='mb-10 mt-5'>
          <TagList
            data={processedCategoryList!.map((item) => ({
              id: String(item.id),
              name: item.name,
              href: `/category/${item.name}`,
              title: item.title || getEnglishCategory(item.name),
            }))}
          />
        </div>
        <div className='flex flex-col gap-5'>
          <h2 className='text-center text-[18px] lg:text-[32px]'>{t('ai-navigate')}</h2>
          <WebNavCardList dataList={processedNavigationList!} />
          <Link
            href='/explore'
            className='mx-auto mb-5 flex w-fit items-center justify-center gap-5 rounded-[9px] border border-white p-[10px] text-sm leading-4 hover:opacity-70'
          >
            {t('exploreMore')}
            <CircleChevronRight className='mt-[0.5] h-[20px] w-[20px]' />
          </Link>
        </div>
        <Faq />
        <ScrollToTop />
      </div>
    </div>
  );
}
