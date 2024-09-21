import Image from 'next/image';
import Link from 'next/link';
import  JobOffers  from '@/components/job-offers';
import KanbanJobBoard from '@/components/kaban/kaban-board';

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <KanbanJobBoard />
    </div>
  );
}



