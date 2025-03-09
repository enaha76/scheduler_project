import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from '../components/DataTable';
import { Groupe } from '../types';
import { useStore } from '../store';
import { Dialog } from '@headlessui/react';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Groupes() {
  const { groupes, addGroupe } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingGroupe, setEditingGroupe] = useState<Groupe | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Groupe>();

  const columns = [
    { header: 'Nom', accessor: 'nom' as keyof Groupe, sortable: true },
    { header: 'Semestre', accessor: 'semestre' as keyof Groupe, sortable: true },
    {
      header: 'Groupe parent',
      accessor: (groupe: Groupe): string => {
        const parent = groupes.find(g => g.id === groupe.parentId);
        return parent ? parent.nom : '-';
      },
      sortable: true,
    },
  ];

  const onSubmit = (data: Groupe) => {
    if (editingGroupe) {
      // Update existing groupe
      // TODO: Implement update logic
    } else {
      addGroupe({ ...data, id: groupes.length + 1 });
    }
    setIsOpen(false);
    reset();
  };

  const handleEdit = (groupe: Groupe) => {
    setEditingGroupe(groupe);
    setIsOpen(true);
  };

  const handleDelete = (groupe: Groupe) => {
    // TODO: Implement delete logic
    console.log('Delete:', groupe);
  };

  const parentGroupes = groupes.filter(g => !g.parentId);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Groupes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste des groupes d'étudiants
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingGroupe(null);
              setIsOpen(true);
            }}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-2" />
            Ajouter un groupe
          </button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          data={groupes}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingGroupe ? 'Modifier le groupe' : 'Ajouter un groupe'}
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  {...register('nom', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-600">Le nom est requis</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Semestre
                </label>
                <select
                  {...register('semestre', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Sélectionner un semestre</option>
                  {[1, 2, 3, 4, 5, 6].map((semestre) => (
                    <option key={semestre} value={semestre}>
                      Semestre {semestre}
                    </option>
                  ))}
                </select>
                {errors.semestre && (
                  <p className="mt-1 text-sm text-red-600">
                    Le semestre est requis
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Groupe parent (optionnel)
                </label>
                <select
                  {...register('parentId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Aucun groupe parent</option>
                  {parentGroupes.map((groupe) => (
                    <option key={groupe.id} value={groupe.id}>
                      {groupe.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500"
                >
                  {editingGroupe ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 