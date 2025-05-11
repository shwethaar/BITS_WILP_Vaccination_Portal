import * as React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Head from './Head';
import { Bar } from 'react-chartjs-2';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';


export default function Dashboard() {

  interface StudentVaccInfo {
    STUDENT_ID: number;
    STUDENT_NAME: string;
    ROLL_NO: string;
    GRADE: string;
    DRIVE_NAME: string,
    DRIVE_DATE: string,
    VACCINE_NAME: string,
    COMPLETED: boolean
  }
  interface VaccinationDrive {
    DRIVE_ID: number;
    DRIVE_NAME: string;
    DRIVE_START_DATE: string;
    DRIVE_END_DATE: string;
  }

  interface GradeStats {
    GRADE: number;
    VACCINE_NAME: string;
    vaccinated: number;
    not_vaccinated: number;
  }

  interface VaccinationDriveStats {
    VACCINE_NAME: string;
    count: number;
  }

  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const [rows, setRows] = React.useState<StudentVaccInfo[]>([]);
  const [gradeStats, setGradeStats] = React.useState<GradeStats[]>([]);
  const [upcomingDrives, setUpcomingDrives] = React.useState<VaccinationDrive[]>([]);
  const [ongoingDrives, setOngoingDrives] = React.useState<VaccinationDrive[]>([]);
  const [vaccinationDriveStats, setVaccinationDriveStats] = React.useState<VaccinationDriveStats[]>([]);

  useEffect(() => {
    fetchDrives();
    fetchGradeStats();
    fetchOngoingDrives();
    fetchUpcomingDrives();
    fetchVaccines();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/student-vacc-info"); // Replace with your API endpoint
      const data = Array.isArray(response.data) ? response.data : [];
      setRows(data);
    } catch (error) {
      console.error("Error fetching vaccination drives:", error);
      setRows([]);
    }
  };

  const fetchGradeStats = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/grade-counts"); // Replace with your API endpoint
      const data = Array.isArray(response.data) ? response.data : [];
      setGradeStats(data);
    } catch (error) {
      console.error("Error fetching grade stats:", error);
      setGradeStats([]);
    }
  };

  const fetchOngoingDrives = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/ongoing-drives"); // Replace with your API endpoint
      const data = Array.isArray(response.data) ? response.data : [];
      setOngoingDrives(data);
    } catch (error) {
      console.error("Error fetching ongoing drives:", error);
      setOngoingDrives([]);
    }
  };

  const fetchUpcomingDrives = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/upcoming-drives"); // Replace with your API endpoint
      const data = Array.isArray(response.data) ? response.data : [];
      setUpcomingDrives(data);
    } catch (error) {
      console.error("Error fetching upcoming drives:", error);
      setUpcomingDrives([]);
    }
  };

  const fetchVaccines = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/available-vaccines"); // Replace with your API endpoint
      const data = Array.isArray(response.data) ? response.data : [];
      setVaccinationDriveStats(data);
    } catch (error) {
      console.error("Error fetching available vaccines:", error);
      setVaccinationDriveStats([]);
    }
  };


  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

  const gradeChartData = {
    labels: gradeStats.map((g) => `Grade ${g.GRADE}`),
    datasets: [
      {
        label: 'Vaccinated',
        data: gradeStats.map((g) => g.vaccinated),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Not Vaccinated',
        data: gradeStats.map((g) => g.not_vaccinated),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  const gradeChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Vaccination Status by Grade ' },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div >
      <Head />
      <div style={{ display: 'flex', paddingLeft: '1.5rem', paddingRight: '1.5rem', flexDirection: 'column' }} >
        Dashboard
        <div style={{ display: 'flex', height: 400, marginRight: '1.5rem', flexDirection: 'row', paddingLeft: '1.5rem', paddingRight: '1.5rem', justifyContent: 'space-between' }} >
          <Bar data={gradeChartData} options={gradeChartOptions} />
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1.5rem', paddingRight: '1.5rem' }} >
            <div style={{ paddingRight: '1.5rem' }}>
              <h3>Ongoing Drives</h3>
              <table border={1} style={{ minWidth: "18rem", textAlign: "left" }}>
                <thead>
                  <tr>
                    <th>Drive Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ongoingDrives.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No ongoing drives</td>
                    </tr>
                  ) : (
                    ongoingDrives.map((drive) => (
                      <tr key={drive.DRIVE_ID}>
                        <td>{drive.DRIVE_NAME}</td>
                        <td>{drive.DRIVE_START_DATE}</td>
                        <td>{drive.DRIVE_END_DATE}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <h3>Upcoming Drives</h3>
              <table border={1} style={{ minWidth: "18rem", textAlign: "left" }}>
                <thead>
                  <tr>
                    <th>Drive Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingDrives.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No upcoming drives</td>
                    </tr>
                  ) : (
                    upcomingDrives.map((drive) => (
                      <tr key={drive.DRIVE_ID}>
                        <td>{drive.DRIVE_NAME}</td>
                        <td>{drive.DRIVE_START_DATE}</td>
                        <td>{drive.DRIVE_END_DATE}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <h3>Available Vaccines</h3>
              <table border={1} style={{ minWidth: "18rem", textAlign: "left" }}>
                <thead>
                  <tr>
                    <th>Vaccine Name</th>
                    <th>Drives Count</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinationDriveStats.length === 0 ? (
                    <tr>
                      <td colSpan={2}>No available vaccines</td>
                    </tr>
                  ) : (
                    vaccinationDriveStats.map((vaccine) => (
                      <tr key={vaccine.VACCINE_NAME}>
                        <td>{vaccine.VACCINE_NAME}</td>
                        <td>{vaccine.count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <table border={1} style={{ width: "50rem", height: "25rem", textAlign: "left", paddingRight: '1.5rem', paddingTop: '20rem' }} >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Roll No.</th>
              <th>Drive Name</th>
              <th>Drive Date</th>
              <th>Vaccine Name</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rec) => (
              <tr key={rec.STUDENT_ID}>
                <td>{rec.STUDENT_ID}</td>
                <td>{rec.STUDENT_NAME}</td>
                <td>{rec.GRADE}</td>
                <td>{rec.ROLL_NO}</td>
                <td>{rec.DRIVE_NAME}</td>
                <td>{rec.DRIVE_DATE}</td>
                <td>{rec.VACCINE_NAME}</td>
                <td>{rec.COMPLETED ? <CheckCircleOutlineIcon /> : <ClearIcon />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
