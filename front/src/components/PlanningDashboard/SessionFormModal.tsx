import React, { useState, useEffect } from 'react';
import { Session, Group, Module, Professor, Room } from '../../types/planning';
import styles from '../../styles/PedagogicalDashboard-components/CrudModal.module.css';

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Session) => void;
  groups: Group[];
  modules: Module[];
  professors: Professor[];
  rooms: Room[];
  initialSession?: Session;
}

const defaultSession = (groups: Group[], modules: Module[], professors: Professor[], rooms: Room[]): Session => ({
  id: Date.now(),
  groupId: groups[0]?.id || 0,
  moduleId: modules[0]?.id || 0,
  professorId: professors[0]?.id || 0,
  roomId: rooms[0]?.id || 0,
  date: new Date().toISOString().split('T')[0],
  startTime: '08:00',
  endTime: '10:00',
  type: 'CM',
});

const SessionFormModal: React.FC<SessionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groups,
  modules,
  professors,
  rooms,
  initialSession,
}) => {
  const [form, setForm] = useState<Session>(initialSession || defaultSession(groups, modules, professors, rooms));

  useEffect(() => {
    setForm(initialSession || defaultSession(groups, modules, professors, rooms));
  }, [isOpen, initialSession, groups, modules, professors, rooms]);

  const handleChange = (field: keyof Session, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{initialSession ? 'Modifier une séance' : 'Ajouter une séance'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Groupe</label>
            <select value={form.groupId} onChange={e => handleChange('groupId', Number(e.target.value))} required>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Module</label>
            <select value={form.moduleId} onChange={e => handleChange('moduleId', Number(e.target.value))} required>
              {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Professeur</label>
            <select value={form.professorId} onChange={e => handleChange('professorId', Number(e.target.value))} required>
              {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Salle</label>
            <select value={form.roomId} onChange={e => handleChange('roomId', Number(e.target.value))} required>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Début</label>
            <input type="time" value={form.startTime} onChange={e => handleChange('startTime', e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Fin</label>
            <input type="time" value={form.endTime} onChange={e => handleChange('endTime', e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select value={form.type} onChange={e => handleChange('type', e.target.value)} required>
              <option value='CM'>CM</option>
              <option value='TD'>TD</option>
              <option value='TP'>TP</option>
              <option value='RATTRAPAGE'>Rattrapage</option>
              <option value='EXAMEN'>Examen</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.button} onClick={onClose}>Annuler</button>
            <button type="submit" className={styles.button + ' ' + styles.primary}>{initialSession ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionFormModal; 