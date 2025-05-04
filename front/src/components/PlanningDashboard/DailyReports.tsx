import { usePlanning } from "../../context/PlanningContext";
import { Table, Form } from "react-bootstrap";

export const DailyReports = () => {
  const { dailyReports, toggleProfessorPresence } = usePlanning();

  return (
    <div className="daily-reports p-4">
      <h3 className="mb-4">Suivi quotidien des présences</h3>

      {dailyReports.map((report) => (
        <div key={report.id} className="mb-5">
          <h5 className="text-primary mb-3">{report.date}</h5>
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Heure</th>
                <th>Groupe</th>
                <th>Module</th>
                <th>Professeur</th>
                <th>Présence</th>
              </tr>
            </thead>
            <tbody>
              {report.sessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    {session.startTime} - {session.endTime}
                  </td>
                  <td>{session.group.name}</td>
                  <td>{session.module?.name || session.subModule?.name}</td>
                  <td>{session.professor.name}</td>
                  <td className="text-center">
                    // Ajouter une valeur par défaut pour professorPresent
                    <Form.Check
                      type="checkbox"
                      checked={session.professorPresent ?? false}
                      onChange={() => toggleProfessorPresence(session.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );
};
