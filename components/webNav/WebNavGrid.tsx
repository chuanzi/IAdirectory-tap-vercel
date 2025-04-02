'use client';

import React from 'react';
import WebNavCard from './WebNavCard';
import type { WebNavigation } from '@/db/supabase/types';

interface WebNavGridProps {
  dataList: WebNavigation[];
}

export default function WebNavGrid({ dataList }: WebNavGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {dataList.map((item) => (
        <WebNavCard key={item.id} {...item} />
      ))}
    </div>
  );
} 