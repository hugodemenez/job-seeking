import KanbanJobBoard from '@/components/kaban/kaban-board';
import Navbar from '@/components/navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-bold">Hi Hugo!</h1>
          <p className="text-sm text-gray-500">We found 3 new offers, which might interest you.</p>
        </div>
        <KanbanJobBoard />
      </div>
    </div>
  );
}



