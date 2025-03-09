import { useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '../store';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Planning as PlanningType, 
  Matiere, 
  Enseignant, 
  Groupe, 
  TypeCours, 
  Salle, 
  TypeSalle
} from '../types';
import { salles, creneauxArray } from '../data/mockData';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  id: number;
  title: string;
  resource?: {
    matiere: Matiere;
    enseignant: Enseignant;
    groupe: Groupe;
    typeCours: TypeCours;
    salle: Salle;
  };
}

export default function Planning() {
  const { plannings, matieres, enseignants, groupes } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<TypeCours | ''>('');

  // Filter salles based on selected course type
  const filteredSalles = selectedType ? salles.filter(salle => {
    switch (selectedType) {
      case 'CM':
        return salle.type === 'Amphi';
      case 'TD':
        return salle.type === 'Salle TD';
      case 'TP':
        return salle.type === 'Salle TP';
      default:
        return true;
    }
  }) : salles;

  const events = plannings.map(planning => {
    const matiere = matieres.find(m => m.id === planning.matiere.id);
    const enseignant = enseignants.find(e => e.id === planning.enseignant.id);
    const groupe = groupes.find(g => g.id === planning.groupe.id);
    const creneau = creneauxArray.find(c => c.id === planning.creneau);
    
    if (!creneau || !matiere || !enseignant || !groupe) return null;

    const [heureDebut, minuteDebut] = creneau.debut.split(':');
    const [heureFin, minuteFin] = creneau.fin.split(':');
    
    const start = new Date(selectedDate);
    start.setHours(parseInt(heureDebut), parseInt(minuteDebut));
    
    const end = new Date(selectedDate);
    end.setHours(parseInt(heureFin), parseInt(minuteFin));

    return {
      id: planning.id,
      title: `${matiere.nom} - ${groupe.nom} (${planning.salle.nom})`,
      start,
      end,
      resource: {
        matiere,
        enseignant,
        groupe,
        typeCours: planning.typeCours,
        salle: planning.salle
      },
    } as CalendarEvent;
  }).filter(Boolean) as CalendarEvent[];

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Planning</h1>
          <p className="mt-2 text-sm text-gray-700">
            Emploi du temps hebdomadaire
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedEvent(null);
              setIsOpen(true);
            }}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-2" />
            Ajouter un cours
          </button>
        </div>
      </div>

      <div className="h-[600px] bg-white rounded-lg shadow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          step={120}
          timeslots={1}
          defaultView="week"
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
          }}
          messages={{
            week: 'Semaine',
            work_week: 'Semaine de travail',
            day: 'Jour',
            month: 'Mois',
            previous: 'Précédent',
            next: 'Suivant',
            today: "Aujourd'hui",
            agenda: 'Agenda',
          }}
        />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {selectedEvent ? 'Modifier le cours' : 'Ajouter un cours'}
            </Dialog.Title>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Matière
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Sélectionner une matière</option>
                  {matieres.map((matiere) => (
                    <option key={matiere.id} value={matiere.id}>
                      {matiere.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enseignant
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {enseignants.map((enseignant) => (
                    <option key={enseignant.id} value={enseignant.id}>
                      {enseignant.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Groupe
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Sélectionner un groupe</option>
                  {groupes.map((groupe) => (
                    <option key={groupe.id} value={groupe.id}>
                      {groupe.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de cours
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TypeCours | '')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="CM">CM</option>
                  <option value="TD">TD</option>
                  <option value="TP">TP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Créneau
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Sélectionner un créneau</option>
                  {creneauxArray.map((creneau) => (
                    <option key={creneau.id} value={creneau.id}>
                      {creneau.debut} - {creneau.fin}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salle
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={!selectedType}
                >
                  <option value="">Sélectionner une salle</option>
                  {filteredSalles.map((salle) => (
                    <option key={salle.id} value={salle.id}>
                      {salle.nom} ({salle.type} - {salle.capacite} places)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500"
                >
                  {selectedEvent ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 