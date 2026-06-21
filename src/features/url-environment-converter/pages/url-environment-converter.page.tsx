import Repeat from '@/features/shared/components/repeat/repeat';
import { UrlConverterCard } from '../containers/UrlConverterCard';

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-center bg-background px-4 py-10 sm:px-6">
      <UrlConverterCard />
    </div>
  );
}
