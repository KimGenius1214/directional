/**
 * 차트 카드
 */

"use client";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function ChartCard({
  title,
  description,
  children,
  isLoading,
}: ChartCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
