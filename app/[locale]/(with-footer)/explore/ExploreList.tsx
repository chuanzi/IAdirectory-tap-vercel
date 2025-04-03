import { createServerComponentClient } from '@/db/supabase/client';

import SearchForm from '@/components/home/SearchForm';
import BasePagination from '@/components/page/BasePagination';
import WebNavCardList from '@/components/webNav/WebNavCardList';

import { TagList } from '../(home)/Tag';

const WEB_PAGE_SIZE = 12;

// Utility function to check if text contains Chinese characters
const containsChinese = (text?: string): boolean => {
  if (!text) return false;
  return /[\u4e00-\u9fa5]/.test(text);
};

// Get English fallback for content
const getEnglishContent = (content?: string): string => {
  if (!content) return 'Information analysis tool for efficient data processing and research';
  if (!containsChinese(content)) return content;

  return 'Advanced information analysis tool for data processing and research';
};

// Get English fallback for tool name/title
const getEnglishTitle = (title?: string, name?: string): string => {
  if (!title) return name || 'Analysis Tool';
  if (!containsChinese(title)) return title;

  // Return capitalized tool name if available
  if (name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return 'Information Analysis Tool';
};

export default async function ExploreList({ pageNum }: { pageNum?: string }) {
  const supabase = await createServerComponentClient();
  const currentPage = pageNum ? Number(pageNum) : 1;

  // start and end
  const start = (currentPage - 1) * WEB_PAGE_SIZE;
  const end = start + WEB_PAGE_SIZE - 1;

  const [{ data: categoryList }, { data: navigationList, count }] = await Promise.all([
    supabase.from('navigation_category').select(),
    supabase
      .from('web_navigation')
      .select('*', { count: 'exact' })
      .order('collection_time', { ascending: false })
      .range(start, end),
  ]);

  // Process navigation list to ensure all content is in English
  const processedNavigationList = navigationList?.map((item) => ({
    ...item,
    content: containsChinese(item.content) ? getEnglishContent(item.content) : item.content,
    title: containsChinese(item.title) ? getEnglishTitle(item.title, item.name) : item.title,
  }));

  // Process category list to ensure all titles are in English
  const processedCategoryList = categoryList?.map((item) => ({
    ...item,
    title: containsChinese(item.title)
      ? item.name
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : item.title,
  }));

  return (
    <>
      <div className='flex w-full items-center justify-center'>
        <SearchForm />
      </div>
      <div className='mb-10 mt-5'>
        <TagList
          data={processedCategoryList!.map((item) => ({
            id: String(item.id),
            name: item.name,
            href: `/category/${item.name}`,
          }))}
        />
      </div>
      <WebNavCardList dataList={processedNavigationList!} />
      <BasePagination
        currentPage={currentPage}
        pageSize={WEB_PAGE_SIZE}
        total={count!}
        route='/explore'
        subRoute='/page'
        className='my-5 lg:my-10'
      />
    </>
  );
}
