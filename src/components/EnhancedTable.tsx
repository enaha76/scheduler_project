import { motion } from 'framer-motion';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

interface Column<T> {
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
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-supnum-blue-light">
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-4 text-left text-sm font-semibold text-supnum-blue ${
                    column.width || ''
                  }`}
                >
                  <div className="group inline-flex items-center">
                    {column.header}
                    {column.sortable && (
                      <ChevronUpDownIcon className="ml-2 h-4 w-4 text-supnum-blue opacity-50 group-hover:opacity-100" />
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
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, rowIndex) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className="hover:bg-supnum-gray-light transition-colors duration-200"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
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
                          className="text-supnum-blue hover:text-primary-700 transition-colors"
                        >
                          Modifier
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Supprimer
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