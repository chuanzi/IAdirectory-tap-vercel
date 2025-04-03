import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@/db/supabase/client';
import { CircleArrowRight, FileSearch } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Separator } from '@/components/ui/separator';
import BaseImage from '@/components/image/BaseImage';
import MarkdownProse from '@/components/MarkdownProse';

export async function generateMetadata({
  params: { locale, websiteName },
}: {
  params: { locale: string; websiteName: string };
}): Promise<Metadata> {
  const supabase = await createServerComponentClient();
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.ai',
  });
  const { data } = await supabase.from('web_navigation').select().eq('name', websiteName);

  if (!data || !data[0]) {
    notFound();
  }

  return {
    title: `${data[0].title} | ${t('titleSubfix')}`,
    description: data[0].content,
  };
}

// English fallback content if detail is empty or contains Chinese characters
const getFallbackDetail = (toolName: string, toolTitle: string) => `# ${toolTitle}

${toolTitle} is a powerful information analysis tool that helps users efficiently process and analyze data. 

## Key Features
- Advanced search capabilities
- Data organization and categorization
- Intuitive user interface
- Integration with other research tools
- Export and sharing options

This tool is particularly useful for researchers, data analysts, and knowledge workers who need to process large amounts of information quickly and effectively.

Visit their website to learn more about their specific capabilities and how they can enhance your information analysis workflow.`;

// Check if text contains Chinese characters
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

// Get English category name
const getEnglishCategoryName = (categoryName?: string): string => {
  if (!categoryName) return '';
  if (!containsChinese(categoryName)) return categoryName;

  // Map of common Chinese category names to English
  const categoryMap: Record<string, string> = {
    信息获取: 'Information Retrieval',
    信息整理: 'Information Organization',
    信息分析: 'Information Analysis',
    信息挖掘: 'Information Mining',
    知识管理: 'Knowledge Management',
    辅助决策: 'Decision Support',
    知识图谱: 'Knowledge Graph',
    数据可视化: 'Data Visualization',
  };

  // Check if we have a direct mapping
  let result = 'General Tools';

  Object.entries(categoryMap).forEach(([chinese, english]) => {
    if (categoryName.includes(chinese)) {
      result = english;
    }
  });

  return result;
};

export default async function Page({ params: { websiteName } }: { params: { websiteName: string } }) {
  const supabase = await createServerComponentClient();
  const t = await getTranslations('Startup.detail');
  const { data: dataList } = await supabase.from('web_navigation').select().eq('name', websiteName);
  if (!dataList) {
    notFound();
  }
  const data = dataList[0];

  // Process all text content to ensure it's in English
  const title = containsChinese(data.title) ? data.name : data.title;
  const content = getEnglishContent(data.content);
  const categoryName = getEnglishCategoryName(data.category_name);
  const tagName = containsChinese(data.tag_name) ? 'Information Tool' : data.tag_name;

  // Use fallback detail if the current detail is empty or contains Chinese
  const displayDetail =
    !data.detail || containsChinese(data.detail) ? getFallbackDetail(data.name, title) : data.detail;

  return (
    <div className='w-full'>
      <div className='mx-auto max-w-5xl px-6 lg:px-8'>
        <div className='flex flex-col py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-10'>
          <div className='flex flex-col items-center lg:max-w-[50%] lg:items-start'>
            <div className='space-y-1 text-balance lg:space-y-3'>
              <h1 className='text-2xl lg:text-5xl'>{title}</h1>
              <h2 className='text-xs lg:text-sm'>{content}</h2>
              {tagName && <span className='inline-block rounded-md bg-white/10 px-2 py-1 text-xs'>{tagName}</span>}
              {categoryName && (
                <span className='inline-block rounded-md bg-white/10 px-2 py-1 text-xs'>
                  Category: {categoryName.replace(/-/g, ' ')}
                </span>
              )}
            </div>
            <a
              href={data.url}
              target='_blank'
              rel='noreferrer'
              className='flex-center mt-5 min-h-5 w-full gap-1 rounded-[8px] bg-white p-[10px] text-sm capitalize text-black hover:opacity-80 lg:mt-8 lg:w-[288px]'
            >
              {t('visitWebsite')} <CircleArrowRight className='size-[14px]' />
            </a>
          </div>
          <a
            href={data.url}
            target='_blank'
            rel='noreferrer'
            className='flex-center group relative mt-6 h-[171px] w-full flex-shrink-0 sm:mx-auto sm:w-[80%] md:w-[70%] lg:mt-0 lg:h-[234px] lg:w-[400px] xl:w-[466px]'
          >
            <div className='absolute inset-0 flex items-center justify-center rounded-[16px] border border-[#424242] bg-[#424242] bg-cover'>
              {data.thumbnail_url ? (
                <BaseImage
                  title={title}
                  alt={title}
                  fill
                  src={data.thumbnail_url}
                  className='rounded-[16px] object-cover'
                  onError={() => {
                    const fallbackEl = document.querySelector('.detail-fallback-icon');
                    if (fallbackEl) {
                      fallbackEl.classList.remove('hidden');
                      fallbackEl.classList.add('flex');
                    }
                    return true;
                  }}
                />
              ) : (
                <div className='detail-fallback-icon flex h-full w-full items-center justify-center text-white/50'>
                  <FileSearch size={64} />
                </div>
              )}
            </div>
            <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-[16px] bg-black bg-opacity-50 text-2xl text-white transition-all duration-200 group-hover:flex'>
              {t('visitWebsite')} <CircleArrowRight className='size-5' />
            </div>
            <div className='detail-fallback-icon absolute inset-0 hidden items-center justify-center rounded-[16px] text-white/50'>
              <FileSearch size={64} />
            </div>
          </a>
        </div>
        <Separator className='bg-[#010101]' />
        <div className='mb-5 py-5'>
          <h2 className='mb-5 text-2xl text-white/40 lg:mb-10'>{t('introduction')}</h2>
          <MarkdownProse markdown={displayDetail} />
        </div>
      </div>
    </div>
  );
}
