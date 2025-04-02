/* eslint-disable react/jsx-no-target-blank */

import Link from 'next/link';
import Image from 'next/image';
import { WebNavigation } from '@/db/supabase/types';
import { CircleArrowRight, SquareArrowOutUpRight, FileSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function WebNavCard({ name, thumbnail_url, title, url, content }: WebNavigation) {
  const t = useTranslations('Home');

  return (
    <div className='flex h-[210px] flex-col gap-3 rounded-xl bg-[#2C2D36] p-1 lg:h-[343px]'>
      <Link href={`/tool/${name}`} title={title} className='group relative'>
        <div className='relative aspect-[310/174] w-full rounded-xl bg-[#3C3D46] overflow-hidden'>
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={title}
              title={title}
              width={310}
              height={174}
              className='w-full h-full object-cover hover:opacity-70'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                (e.currentTarget.parentElement!.querySelector('.fallback-icon') as HTMLElement).style.display = 'flex';
              }}
            />
          ) : (
            <div className='fallback-icon absolute inset-0 flex items-center justify-center text-white/50'>
              <FileSearch size={48} />
            </div>
          )}
          <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-xl bg-black bg-opacity-50 text-xl text-white transition-all duration-200 group-hover:flex'>
            {t('checkDetail')} <CircleArrowRight className='size-4' />
          </div>
          <div className='fallback-icon absolute inset-0 hidden items-center justify-center text-white/50'>
            <FileSearch size={48} />
          </div>
        </div>
      </Link>
      <div className='flex items-center justify-between px-[6px]'>
        <a href={url} title={title} target='_blank' rel='nofollow' className='hover:opacity-70'>
          <h3 className='line-clamp-1 flex-1 text-sm font-bold lg:text-base'>{title}</h3>
        </a>
        <a href={url} title={title} target='_blank' rel='nofollow' className='hover:opacity-70'>
          <SquareArrowOutUpRight className='size-5' />
          <span className='sr-only'>{title}</span>
        </a>
      </div>
      <p className='line-clamp-3 px-[6px] text-xs text-white/70 lg:line-clamp-5 lg:text-sm'>{content}</p>
    </div>
  );
}
