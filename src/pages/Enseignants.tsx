import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from '../components/DataTable';
import { Enseignant, Disponibilite } from '../types';
import { useStore } from '../store';
import { Dialog } from '@headlessui/react';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const creneaux = ['8h-10h', '10h-12h', '14h-16h', '16h-18h', '18h-20h'];

export default function Enseignants() {
  const { enseignants, addEnseignant } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDispoOpen, setIsDispoOpen] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState<Enseignant | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
  const [disponibilites, setDisponibilites] = useState<boolean[][]>(
    Array(6).fill(Array(5).fill(true))
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Enseignant>();

  const columns = [
    { header: 'Nom', accessor: 'nom' as keyof Enseignant, sortable: true },
    { header: 'Email', accessor: 'email' as keyof Enseignant, sortable: true },
    {
      header: 'Actions',
      accessor: (enseignant: Enseignant): string => '',
      render: (enseignant: Enseignant) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDisponibilites(enseignant)}
            className="text-primary-600 hover:text-primary-900"
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const onSubmit = (data: Enseignant) => {
    if (editingEnseignant) {
      // Update existing enseignant
      // TODO: Implement update logic
    } else {
      addEnseignant({ ...data, id: enseignants.length + 1 });
    }
    setIsOpen(false);
    reset();
  };

  const handleEdit = (enseignant: Enseignant) => {
    setEditingEnseignant(enseignant);
    setIsOpen(true);
  };

  const handleDelete = (enseignant: Enseignant) => {
    // TODO: Implement delete logic
    console.log('Delete:', enseignant);
  };

  const handleDisponibilites = (enseignant: Enseignant) => {
    setSelectedEnseignant(enseignant);
    setIsDispoOpen(true);
    // TODO: Load actual disponibilites
  };

  const toggleDisponibilite = (jour: number, creneau: number) => {
    const newDisponibilites = disponibilites.map((j, jIndex) =>
      jIndex === jour
        ? j.map((c, cIndex) => (cIndex === creneau ? !c : c))
        : j
    );
    setDisponibilites(newDisponibilites);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Enseignants</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste des enseignants de SupNum
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingEnseignant(null);
              setIsOpen(true);
            }}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-2" />
            Ajouter un enseignant
          </button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          data={enseignants}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Ajout/Modification Enseignant */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingEnseignant ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom
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
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    Un email valide est requis
                  </p>
                )}
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
                  {editingEnseignant ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Disponibilités */}
      <Dialog open={isDispoOpen} onClose={() => setIsDispoOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Disponibilités de {selectedEnseignant?.nom}
            </Dialog.Title>
            
            <div className="grid grid-cols-7 gap-4">
              <div className="col-span-1"></div>
              {creneaux.map((creneau, index) => (
                <div key={index} className="text-sm font-medium text-gray-700 text-center">
                  {creneau}
                </div>
              ))}

              {jours.map((jour, jourIndex) => (
                <>
                  <div key={jour} className="text-sm font-medium text-gray-700">
                    {jour}
                  </div>
                  {creneaux.map((_, creneauIndex) => (
                    <button
                      key={`${jourIndex}-${creneauIndex}`}
                      onClick={() => toggleDisponibilite(jourIndex, creneauIndex)}
                      className={`p-2 rounded ${
                        disponibilites[jourIndex][creneauIndex]
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-red-100 hover:bg-red-200'
                      }`}
                    >
                      {disponibilites[jourIndex][creneauIndex] ? 'Disponible' : 'Indisponible'}
                    </button>
                  ))}
                </>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDispoOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: Save disponibilites
                  setIsDispoOpen(false);
                }}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500"
              >
                Enregistrer
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 