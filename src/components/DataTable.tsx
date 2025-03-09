import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { isDark } = useThemeStore();

  const itemsPerPage = 10;

  const sortedData = [...data].sort((a: T, b: T) => {
    if (!sortColumn) return 0;
    const column = columns.find((col) => col.accessor === sortColumn);
    if (!column) return 0;

    const aValue = typeof column.accessor === 'function' 
      ? column.accessor(a) 
      : a[sortColumn as keyof T];
    const bValue = typeof column.accessor === 'function' 
      ? column.accessor(b) 
      : b[sortColumn as keyof T];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const accessor = column.accessor;
    if (typeof accessor === 'function') return;

    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`overflow-x-auto rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <table className={`min-w-full divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead>
          <tr className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <ChevronUpDownIcon className={`w-4 h-4 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {currentData.map((item, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${
                isDark
                  ? 'even:bg-gray-800 odd:bg-gray-700 hover:bg-gray-600'
                  : 'even:bg-white odd:bg-gray-50 hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  {column.render
                    ? column.render(item)
                    : typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`flex items-center justify-between px-6 py-3 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`disabled:opacity-50 ${
            isDark 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`disabled:opacity-50 ${
            isDark 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 