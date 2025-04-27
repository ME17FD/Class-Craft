import React, { useState } from 'react';
import { usePlanning } from './PlanningContext';
import { Session } from '../../types/planning';
import styles from '../../styles/PlanningDashboard/Table.module.css';
import modalStyles from '../../styles/PedagogicalDashboard-components/CrudModal.module.css';
import SessionFormModal from './SessionFormModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExcelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#43a047"/>
    <text x="4" y="15" fontSize="10" fill="#fff" fontWeight="bold">XLS</text>
  </svg>
);
const PdfIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#1976d2"/>
    <text x="4" y="15" fontSize="10" fill="#fff" fontWeight="bold">PDF</text>
  </svg>
);
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3v10m0 0l-4-4m4 4l4-4" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="4" y="15" width="12" height="2" rx="1" fill="#1976d2"/>
  </svg>
);

const GroupPlanning: React.FC = () => {
  const { state, setState } = usePlanning();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | undefined>(undefined);
  const [showExport, setShowExport] = useState(false);
  const [filters, setFilters] = useState({
    groupId: '',
    moduleId: '',
    professorId: '',
    roomId: '',
    type: '',
    date: '',
  });
  const pageSize = 10;

  // Filtres avancés
  const filteredSessions = state.sessions.filter(s =>
    (!filters.groupId || s.groupId === Number(filters.groupId)) &&
    (!filters.moduleId || s.moduleId === Number(filters.moduleId)) &&
    (!filters.professorId || s.professorId === Number(filters.professorId)) &&
    (!filters.roomId || s.roomId === Number(filters.roomId)) &&
    (!filters.type || s.type === filters.type) &&
    (!filters.date || s.date === filters.date)
  );
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize));
  const paginatedSessions = filteredSessions.slice((page - 1) * pageSize, page * pageSize);

  // Ouvrir la modale pour ajout
  const handleAdd = () => {
    setEditingSession(undefined);
    setIsModalOpen(true);
  };
  // Ouvrir la modale pour édition
  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };
  // Sauvegarder (ajout ou modif)
  const handleSave = (session: Session) => {
    setState(prev => {
      const exists = prev.sessions.some(s => s.id === session.id);
      return exists
        ? { ...prev, sessions: prev.sessions.map(s => (s.id === session.id ? session : s)) }
        : { ...prev, sessions: [...prev.sessions, session] };
    });
    setIsModalOpen(false);
  };
  // Supprimer
  const handleDelete = (id: number) => {
    setState(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== id) }));
  };

  // Gestion des filtres
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [[
        'Groupe', 'Filière', 'Module', 'Professeur', 'Salle', 'Date', 'Début', 'Fin', 'Type'
      ]],
      body: filteredSessions.map(session => {
        const group = state.groups.find(g => g.id === session.groupId);
        const module = state.modules.find(m => m.id === session.moduleId);
        const prof = state.professors.find(p => p.id === session.professorId);
        const room = state.rooms.find(r => r.id === session.roomId);
        return [
          group?.name || '',
          group?.field || '',
          module?.name || '',
          prof?.name || '',
          room?.name || '',
          session.date || '',
          session.startTime || '',
          session.endTime || '',
          session.type || ''
        ];
      })
    });
    doc.save('planning-groupes.pdf');
    setShowExport(false);
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSessions.map(session => {
      const group = state.groups.find(g => g.id === session.groupId);
      const module = state.modules.find(m => m.id === session.moduleId);
      const prof = state.professors.find(p => p.id === session.professorId);
      const room = state.rooms.find(r => r.id === session.roomId);
      return {
        Groupe: group?.name,
        Filière: group?.field,
        Module: module?.name,
        Professeur: prof?.name,
        Salle: room?.name,
        Date: session.date,
        Début: session.startTime,
        Fin: session.endTime,
        Type: session.type
      };
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Planning');
    XLSX.writeFile(wb, 'planning-groupes.xlsx');
    setShowExport(false);
  };

  return (
    <div className={modalStyles.container}>
      <div className={modalStyles.header}>
        <h2>Tableau récapitulatif de toutes les séances</h2>
        <div className={modalStyles.actions}>
          <button className={modalStyles.button + ' ' + modalStyles.primary} onClick={handleAdd}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 6}}>
              <rect x="9" y="4" width="2" height="12" rx="1" fill="currentColor"/>
              <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor"/>
            </svg>
            Ajouter une séance
          </button>
          <button className={modalStyles.button + ' ' + modalStyles.secondary} style={{marginLeft: 8}} onClick={() => setShowExport(v => !v)}>
            <DownloadIcon /> Exporter
          </button>
          {showExport && (
            <div style={{
              position: 'absolute',
              right: 32,
              top: 70,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              borderRadius: 8,
              zIndex: 1001,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: 180
            }}>
              <button className={modalStyles.exportPdf} onClick={handleExportPDF}>
                <PdfIcon /> Exporter PDF
              </button>
              <button className={modalStyles.exportExcel} onClick={handleExportExcel}>
                <ExcelIcon /> Exporter Excel
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={'groupPlanningFilters'}>
        <div className={modalStyles.filterGroup}>
          <label>Groupe</label>
          <select className={modalStyles.input} value={filters.groupId} onChange={e => handleFilterChange('groupId', e.target.value)}>
            <option value=''>Tous</option>
            {state.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className={modalStyles.filterGroup}>
          <label>Module</label>
          <select className={modalStyles.input} value={filters.moduleId} onChange={e => handleFilterChange('moduleId', e.target.value)}>
            <option value=''>Tous</option>
            {state.modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className={modalStyles.filterGroup}>
          <label>Professeur</label>
          <select className={modalStyles.input} value={filters.professorId} onChange={e => handleFilterChange('professorId', e.target.value)}>
            <option value=''>Tous</option>
            {state.professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className={modalStyles.filterGroup}>
          <label>Salle</label>
          <select className={modalStyles.input} value={filters.roomId} onChange={e => handleFilterChange('roomId', e.target.value)}>
            <option value=''>Toutes</option>
            {state.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className={modalStyles.filterGroup}>
          <label>Type</label>
          <select className={modalStyles.input} value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
            <option value=''>Tous</option>
            <option value='CM'>CM</option>
            <option value='TD'>TD</option>
            <option value='TP'>TP</option>
            <option value='RATTRAPAGE'>Rattrapage</option>
            <option value='EXAMEN'>Examen</option>
          </select>
        </div>
        <div className={modalStyles.filterGroup}>
          <label>Date</label>
          <input className={modalStyles.input} type='date' value={filters.date} onChange={e => handleFilterChange('date', e.target.value)} />
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Groupe</th>
            <th>Filière</th>
            <th>Module</th>
            <th>Professeur</th>
            <th>Salle</th>
            <th>Date</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSessions.map(session => {
            const group = state.groups.find(g => g.id === session.groupId);
            const module = state.modules.find(m => m.id === session.moduleId);
            const prof = state.professors.find(p => p.id === session.professorId);
            const room = state.rooms.find(r => r.id === session.roomId);
            return (
              <tr key={session.id}>
                <td>{group?.name}</td>
                <td>{group?.field}</td>
                <td>{module?.name}</td>
                <td>{prof?.name}</td>
                <td>{room?.name}</td>
                <td>{session.date}</td>
                <td>{session.startTime}</td>
                <td>{session.endTime}</td>
                <td>{session.type}</td>
                <td>
                  <button className={modalStyles.button + ' ' + modalStyles.edit} onClick={() => handleEdit(session)}>Modifier</button>
                  <button className={modalStyles.button + ' ' + modalStyles.delete} onClick={() => handleDelete(session.id)}>Supprimer</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button className={modalStyles.button} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Précédent</button>
        <span>Page {page} / {totalPages}</span>
        <button className={modalStyles.button} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Suivant</button>
      </div>
      <SessionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        groups={state.groups}
        modules={state.modules}
        professors={state.professors}
        rooms={state.rooms}
        initialSession={editingSession}
      />
    </div>
  );
};

export default GroupPlanning; 