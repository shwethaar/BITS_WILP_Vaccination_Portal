import React, { useEffect, useState } from "react";
import axios from "axios";
// import './Student.css'
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Head from "./Head";

interface Vaccine {
    VACC_ID: number;
    VACCINE_NAME: string;
    ACTIVE_SINCE: string;
    EXPIRY_DATE: string;
    STATUS: string;
    VACC_DTLS_ID: number;
    BATCH_NO: string;
    SERIAL_NUMBER: string;
    DOSES_AVAILABLE: number;
}

const Vaccine: React.FC = () => {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedVaccine, setEditedVaccine] = useState<Partial<Vaccine>>({});

    useEffect(() => {
        fetchVaccines();
    }, []);

    const fetchVaccines = async () => {
        try {
            const response = await axios.get("http://localhost:8080/vaccines"); // Replace with your API endpoint
            const data = Array.isArray(response.data) ? response.data : [];
            setVaccines(data);
        } catch (error) {
            console.error("Error fetching vaccines:", error);
            setVaccines([]);
        }
    };

    const handleEdit = (vaccine: Vaccine) => {
        setIsEditing(vaccine.VACC_ID);
        setEditedVaccine(vaccine);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/vaccines/`, editedVaccine); // Replace with your API endpoint
            setIsEditing(null);
            fetchVaccines();
        } catch (error) {
            console.error("Error updating vaccine:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this vaccine?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/vaccines/${id}`); // Replace with your API endpoint
            fetchVaccines();
        } catch (error) {
            console.error("Error deleting vaccine:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Vaccine) => {
        setEditedVaccine({ ...editedVaccine, [field]: e.target.value });
    };

    return (
        <div>
            <Head />
            <div style={{ flexDirection: "column", paddingLeft: '1.5rem', paddingRight: '1.5rem', }}>
                <h2>Vaccine Management</h2>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        const newVaccine: Vaccine = {
                            VACC_ID: -1,
                            VACCINE_NAME: "",
                            ACTIVE_SINCE: "",
                            EXPIRY_DATE: "",
                            STATUS: 'Active',
                            VACC_DTLS_ID: 0,
                            BATCH_NO: "",
                            SERIAL_NUMBER: "",
                            DOSES_AVAILABLE: 0,
                        };
                        setVaccines([{ ...newVaccine }, ...vaccines]);
                        setIsEditing(-1);
                        setEditedVaccine(newVaccine);
                    }}>
                    Add Vaccine
                </Button>
                <table border={1} style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Active Since</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Batch No</th>
                            <th>Serial Number</th>
                            <th>Available Doses</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(vaccines) && vaccines.map((vaccine) => (
                            <tr key={vaccine.VACC_ID}>
                                {isEditing === vaccine.VACC_ID ? (
                                    <>
                                        <td>{vaccine.VACC_ID}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedVaccine.VACCINE_NAME || ""}
                                                onChange={(e) => handleInputChange(e, "VACCINE_NAME")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editedVaccine.ACTIVE_SINCE || ""}
                                                onChange={(e) => handleInputChange(e, "ACTIVE_SINCE")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editedVaccine.EXPIRY_DATE || ""}
                                                onChange={(e) => handleInputChange(e, "EXPIRY_DATE")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedVaccine.STATUS || ""}
                                                onChange={(e) => handleInputChange(e, "STATUS")}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={editedVaccine.BATCH_NO || ""}
                                                onChange={(e) => handleInputChange(e, "BATCH_NO")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedVaccine.SERIAL_NUMBER || ""}
                                                onChange={(e) => handleInputChange(e, "SERIAL_NUMBER")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={editedVaccine.DOSES_AVAILABLE || ""}
                                                onChange={(e) => handleInputChange(e, "DOSES_AVAILABLE")}
                                            />
                                        </td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleSave()}>Save</button>
                                            <button className="cancel-button" onClick={() => {
                                                if (editedVaccine.VACC_ID === -1) {
                                                    setVaccines(vaccines.filter(s => s.VACC_ID !== -1));
                                                }
                                                setIsEditing(null);
                                            }}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{vaccine.VACC_ID}</td>
                                        <td>{vaccine.VACCINE_NAME}</td>
                                        <td>{vaccine.ACTIVE_SINCE}</td>
                                        <td>{vaccine.EXPIRY_DATE}</td>
                                        <td>{vaccine.STATUS}</td>
                                        <td>{vaccine.BATCH_NO}</td>
                                        <td>{vaccine.SERIAL_NUMBER}</td>
                                        <td>{vaccine.DOSES_AVAILABLE}</td>

                                        <td>
                                            <button className="edit-button" onClick={() => handleEdit(vaccine)}>Edit</button>
                                            <button className="cancel-button" onClick={() => handleDelete(vaccine.VACC_ID)}>Delete</button>
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

export default Vaccine;