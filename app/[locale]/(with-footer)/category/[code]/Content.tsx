'use client';

import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/app/navigation';
import { cn } from '@/lib/utils';
import Empty from '@/components/Empty';
import WebNavGrid from '@/components/webNav/WebNavGrid';

import type { WebNavigation } from '@/db/supabase/types';

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

export default function Content({
  headerTitle,
  navigationList,
  currentPage,
  total,
  pageSize,
  route,
}: {
  headerTitle: string;
  navigationList: WebNavigation[];
  currentPage: number;
  total: number;
  pageSize: number;
  route: string;
}) {
  const t = useTranslations('Category');
  const [dataList] = useState<WebNavigation[]>(
    navigationList?.map(item => ({
      ...item,
      content: containsChinese(item.content) ? getEnglishContent(item.content) : item.content
    })) || []
  );

  const totalPage = Math.ceil(total / pageSize);

  const renderPage = useCallback(
    (page: number) => {
      return (
        <Link
          href={`${route}${page > 1 ? `?page=${page}` : ''}`}
          key={page}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:opacity-70',
            page === currentPage && 'bg-white font-bold text-black',
          )}
        >
          {page}
        </Link>
      );
    },
    [currentPage, route],
  );

  const renderPagination = useCallback(() => {
    const pages = [];
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i += 1) {
        pages.push(renderPage(i));
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i += 1) {
        pages.push(renderPage(i));
      }
    } else if (currentPage >= totalPage - 2) {
      for (let i = totalPage - 4; i <= totalPage; i += 1) {
        pages.push(renderPage(i));
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
        pages.push(renderPage(i));
      }
    }
    return pages;
  }, [currentPage, totalPage, renderPage]);

  return (
    <div className='min-h-content w-full'>
      <div className='mx-auto mt-1 max-w-pc lg:mx-0'>
        <div className='ml-2 flex items-center gap-x-2 lg:ml-0'>
          <Link href='/' className='hover:opacity-80'>
            {t('home')}
          </Link>{' '}
          /{' '}
          <h1 className='text-lg lg:text-xl'>
            {headerTitle}
          </h1>
        </div>
        {dataList.length > 0 ? (
          <div className='flex flex-col gap-y-4'>
            <div className='mt-5'>
              <WebNavGrid dataList={dataList} />
            </div>
            {totalPage > 1 && (
              <div className='mx-auto my-5 flex items-center gap-x-3'>
                <Link
                  href={`${route}${currentPage > 2 ? `?page=${currentPage - 1}` : ''}`}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : undefined}
                  className={cn('cursor-pointer', currentPage === 1 && 'cursor-not-allowed opacity-50')}
                >
                  <ChevronLeft className='size-6 text-white' />
                </Link>
                {renderPagination()}
                <Link
                  href={`${route}?page=${currentPage + 1}`}
                  aria-disabled={currentPage === totalPage}
                  tabIndex={currentPage === totalPage ? -1 : undefined}
                  className={cn('cursor-pointer', currentPage === totalPage && 'cursor-not-allowed opacity-50')}
                >
                  <ChevronRight className='size-6 text-white' />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Empty title="没有找到相关内容" className='mx-auto my-5 max-w-2xl' />
        )}
      </div>
    </div>
  );
}
