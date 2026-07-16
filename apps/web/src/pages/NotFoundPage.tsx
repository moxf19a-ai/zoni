import type { JSX } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage(): JSX.Element {
  return (
    <div className="text-center">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        الصفحة غير موجودة
      </h1>
      <Link to="/" className="mt-4 inline-block text-sm text-gray-500 underline dark:text-gray-400">
        الرجوع للرئيسية
      </Link>
    </div>
  );
}
