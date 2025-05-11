import React, { useEffect, useState } from "react";
import axios from "axios";
// import './Student.css'
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Head from "./Head";

interface VaccineDrive {
    DRIVE_ID: number;
    DRIVE_NAME: string;
    DRIVE_START_DATE: string;
    DRIVE_END_DATE: string;
    GRADES: string;
    DRIVE_DTLS_ID: number;
    DRIVE_DATE: string;
    VACC_ID: number;
    COMPLETED: boolean
}

const VaccinationDrives: React.FC = () => {
    const [drives, setDrives] = useState<VaccineDrive[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedDrive, setEditedDrive] = useState<Partial<VaccineDrive>>({});

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await axios.get("http://localhost:8080/vaccDrive"); // Replace with your API endpoint
            const data = Array.isArray(response.data) ? response.data : [];
            setDrives(data);
        } catch (error) {
            console.error("Error fetching vaccination drives:", error);
            setDrives([]);
        }
    };

    const handleEdit = (drive: VaccineDrive) => {
        setIsEditing(drive.DRIVE_ID);
        setEditedDrive(drive);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/vaccDrive/`, editedDrive); // Replace with your API endpoint
            setIsEditing(null);
            fetchDrives();
        } catch (error) {
            console.error("Error updating vaccination drive:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this drive?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/vaccDrive/${id}`); // Replace with your API endpoint
            fetchDrives();
        } catch (error) {
            console.error("Error deleting vaccination drive:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof VaccineDrive) => {
        setEditedDrive({ ...editedDrive, [field]: e.target.value });
    };

    function handleAddStudent(DRIVE_ID: number): void {
        const studentId = window.prompt("Enter Student ID to add to the drive:");
        if (studentId) {
            // Add the student to the drive
            try {
                 axios.post(`http://localhost:8080/vaccDrive/${DRIVE_ID}/${studentId}`, { studentId });
                 window.alert("Student added successfully!");
            } catch (error) {
                console.error("Error adding student to drive:", error);
            }
        }
    }

    return (
        <div>
            <Head />
            <div style={{ flexDirection: "column",  paddingLeft:'1.5rem', paddingRight:'1.5rem',}}>
                <h2>Vaccination Drive Management</h2>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        const newDrive: VaccineDrive = {
                            DRIVE_ID: -1,
                            DRIVE_NAME: "",
                            DRIVE_START_DATE: "",
                            DRIVE_END_DATE: "",
                            GRADES: "",
                            DRIVE_DTLS_ID: -1,
                            DRIVE_DATE: "",
                            VACC_ID: -1,
                            COMPLETED: false,
                        };
                        setDrives([{ ...newDrive }, ...(drives || [])]);
                        setIsEditing(-1);
                        setEditedDrive(newDrive);
                    }}>
                    Add Drive
                </Button>
                <table border={1} style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Grades</th>
                            <th>Drive Date</th>
                            <th>Vaccine ID</th>
                            <th>Completed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(drives) && drives.map((drive) => (
                            <tr key={drive.DRIVE_ID}>
                                {isEditing === drive.DRIVE_ID ? (
                                    <>
                                        <td>{drive.DRIVE_ID}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedDrive.DRIVE_NAME || ""}
                                                onChange={(e) => handleInputChange(e, "DRIVE_NAME")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={
                                                    editedDrive.DRIVE_START_DATE
                                                        ? typeof editedDrive.DRIVE_START_DATE === "string"
                                                            ? editedDrive.DRIVE_START_DATE
                                                            : (editedDrive.DRIVE_START_DATE as Date).toISOString().slice(0, 10)
                                                        : ""}
                                                onChange={(e) => handleInputChange(e, "DRIVE_START_DATE")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editedDrive.DRIVE_END_DATE || ""}
                                                onChange={(e) => handleInputChange(e, "DRIVE_END_DATE")}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="string"
                                                value={editedDrive.GRADES || ""}
                                                onChange={(e) => handleInputChange(e, "GRADES")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={
                                                    editedDrive.DRIVE_DATE
                                                        ? typeof editedDrive.DRIVE_DATE === "string"
                                                            ? editedDrive.DRIVE_DATE
                                                            : (editedDrive.DRIVE_DATE as Date).toISOString().slice(0, 10)
                                                        : ""
                                                }
                                                onChange={(e) => handleInputChange(e, "DRIVE_DATE")}
                                            />
                                        </td>
                                        
                                        <td>
                                            <input
                                                type="number"
                                                value={editedDrive.VACC_ID || ""}
                                                onChange={(e) => handleInputChange(e, "VACC_ID")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={!!editedDrive.COMPLETED}
                                                onChange={(e) => handleInputChange(e, "COMPLETED")}
                                            />
                                        </td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleSave()}>Save</button>
                                            <button className="cancel-button" onClick={() => {
                                                if (editedDrive.DRIVE_ID === -1) {
                                                    setDrives(drives.filter(s => s.DRIVE_ID !== -1));
                                                }
                                                setIsEditing(null);
                                            }}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{drive.DRIVE_ID}</td>
                                        <td>{drive.DRIVE_NAME}</td>
                                        <td>{drive.DRIVE_START_DATE}</td>
                                        <td>{drive.DRIVE_END_DATE}</td>
                                        <td>{drive.GRADES}</td>
                                        <td>{drive.DRIVE_DATE}</td>
                                        <td>{drive.VACC_ID}</td>
                                        <td>{drive.COMPLETED ? "Yes" : "No"}</td>

                                        <td>
                                            <button className="edit-button" onClick={() => handleEdit(drive)}>Edit</button>
                                            <button className="cancel-button" onClick={() => handleDelete(drive.DRIVE_ID)}>Delete</button>
                                            <button className="add-student-button" onClick={() => handleAddStudent(drive.DRIVE_ID)}>Add Student</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VaccinationDrives;