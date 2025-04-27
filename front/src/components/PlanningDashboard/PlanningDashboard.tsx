import React, { useState } from 'react';
import { PlanningProvider } from './PlanningContext';
import GroupPlanning from './GroupPlanning';
import SemesterPlanning from './SemesterPlanning';
import ProfessorPlanning from './ProfessorPlanning';
import RoomReport from './RoomReport';
import RattrapagePlanning from './RattrapagePlanning';
import ExamPlanning from './ExamPlanning';
import styles from '../../styles/PlanningDashboard/PlanningDashboard.module.css';

const tabs = [
  { id: 'group', label: 'Planning des groupes' },
  { id: 'semester', label: 'Planning des semestres' },
  { id: 'professor', label: 'Planning des professeurs' },
  { id: 'room', label: 'Rapport des salles' },
  { id: 'rattrapage', label: 'Séances de rattrapage' },
  { id: 'exam', label: 'Examens' },
];

type TabId = typeof tabs[number]['id'];

const PlanningDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('group');

  return (
    <PlanningProvider>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Générateur de planning</h1>
        </header>
        <nav className={styles.tabNav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab(tab.id as TabId)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className={styles.content}>
          {activeTab === 'group' && <GroupPlanning />}
          {activeTab === 'semester' && <SemesterPlanning />}
          {activeTab === 'professor' && <ProfessorPlanning />}
          {activeTab === 'room' && <RoomReport />}
          {activeTab === 'rattrapage' && <RattrapagePlanning />}
          {activeTab === 'exam' && <ExamPlanning />}
        </div>
      </div>
    </PlanningProvider>
  );
};

export default PlanningDashboard; 