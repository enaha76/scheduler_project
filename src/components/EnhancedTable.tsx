import { motion } from 'framer-motion';
import { ChevronUpDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface EnhancedTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
}

export function EnhancedTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading = false,
}: EnhancedTableProps<T>) {
  const { isDark } = useThemeStore();

  return (
    <div className={`overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead>
            <tr className={isDark ? 'bg-gray-900/50' : 'bg-supnum-blue-light'}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-4 text-left text-sm font-semibold ${
                    isDark ? 'text-gray-200' : 'text-supnum-blue'
                  } ${column.width || ''}`}
                >
                  <div className="group inline-flex items-center">
                    {column.header}
                    {column.sortable && (
                      <ChevronUpDownIcon className={`ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 ${
                        isDark ? 'text-gray-400' : 'text-supnum-blue'
                      }`} />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'} ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {data.map((item, rowIndex) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className={`${
                  isDark 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-supnum-gray-light'
                } transition-colors duration-200`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`whitespace-nowrap px-6 py-4 text-sm ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}
                  >
                    {column.render
                      ? column.render(item)
                      : typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className={`${
                            isDark 
                              ? 'text-blue-400 hover:text-blue-300' 
                              : 'text-supnum-blue hover:text-primary-700'
                          } transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className={`${
                            isDark 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-red-600 hover:text-red-900'
                          } transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 