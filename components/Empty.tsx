import { cn } from '@/lib/utils';

export default function Empty({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <img src='/images/search-empty.png' alt='empty' className='max-w-[100px]' />
      <span className='whitespace-pre-wrap text-center text-sm text-white/40'>{title}</span>
    </div>
  );
}
