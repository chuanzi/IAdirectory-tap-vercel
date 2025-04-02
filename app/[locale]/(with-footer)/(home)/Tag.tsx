import Link from 'next/link';

export function TagItem({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-[38px] items-center justify-center gap-[2px] whitespace-nowrap rounded-full bg-[#2C2D36] px-3 text-xs hover:bg-[#3C3D46] transition-colors'>
      {children}
    </div>
  );
}

export function TagLink({ name, href, title }: { name: string; href: string; title?: string }) {
  return (
    <Link href={href} title={title || name}>
      <TagItem>{title || name}</TagItem>
    </Link>
  );
}

export function TagList({ data }: { data: { name: string; href: string; id: string; title?: string }[] }) {
  return (
    <div className='w-full my-4'>
      <ul className='flex flex-wrap justify-center gap-2 px-2'>
        {data.map((item) => (
          <li key={item.href} className='mb-2'>
            <TagLink name={item.name} href={item.href} title={item.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
