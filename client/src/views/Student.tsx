import React, { useEffect, useState } from "react";
import axios from "axios";
import './Student.css'
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Head from "./Head";

interface Student {
    STUDENT_ID: number;
    STUDENT_NAME: string;
    DOB: string;
    ADDRESS: string;
    PHONE: number;
    FATHER_NAME: string;
    MOTHER_NAME: string;
    DTL_ID: number;
    YEAR: number;
    GRADE: number;
    SECTION: string;
    ROLL_NO: string;
}

const Student: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/student"); // Replace with your API endpoint
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleEdit = (student: Student) => {
        setIsEditing(student.STUDENT_ID);
        setEditedStudent(student);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/student/`, editedStudent); // Replace with your API endpoint
            setIsEditing(null);
            fetchStudents();
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/student/${id}`); // Replace with your API endpoint
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Student) => {
        setEditedStudent({ ...editedStudent, [field]: e.target.value });
    };

    return (
        <div>
            <Head />
            <div style={{ flexDirection: "column",  paddingLeft:'1.5rem', paddingRight:'1.5rem' }}>
                <h2>Student Management</h2>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    fullWidth={false}
                    onClick={() => {
                        const newStudent: Student = {
                            STUDENT_ID: -1,
                            STUDENT_NAME: "",
                            DOB: "",
                            ADDRESS: "",
                            PHONE: 0,
                            FATHER_NAME: "",
                            MOTHER_NAME: "",
                            DTL_ID: 0,
                            YEAR: 2025,
                            GRADE: 1,
                            SECTION: "",
                            ROLL_NO: ""
                        };
                        setStudents([{ ...newStudent }, ...students]);
                        setIsEditing(-1);
                        setEditedStudent(newStudent);
                    }}>
                    Add Student
                </Button>
                <table border={1} style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>DOB</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Father Name</th>
                            <th>Mother Name</th>
                            <th>Year</th>
                            <th>Grade</th>
                            <th>Section</th>
                            <th>Roll No</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.STUDENT_ID}>
                                {isEditing === student.STUDENT_ID ? (
                                    <>
                                        <td>{student.STUDENT_ID}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedStudent.STUDENT_NAME || ""}
                                                onChange={(e) => handleInputChange(e, "STUDENT_NAME")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editedStudent.DOB || ""}
                                                onChange={(e) => handleInputChange(e, "DOB")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedStudent.ADDRESS || ""}
                                                onChange={(e) => handleInputChange(e, "ADDRESS")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number" maxLength={10}
                                                value={editedStudent.PHONE || ""}
                                                onChange={(e) => handleInputChange(e, "PHONE")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedStudent.FATHER_NAME || ""}
                                                onChange={(e) => handleInputChange(e, "FATHER_NAME")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedStudent.MOTHER_NAME || ""}
                                                onChange={(e) => handleInputChange(e, "MOTHER_NAME")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                max={2025}
                                                min={2013}
                                                value={editedStudent.YEAR || ""}
                                                onChange={(e) => handleInputChange(e, "YEAR")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                max={12}
                                                min={1}
                                                value={editedStudent.GRADE || ""}
                                                onChange={(e) => handleInputChange(e, "GRADE")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedStudent.SECTION || ""}
                                                onChange={(e) => handleInputChange(e, "SECTION")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editedStudent.ROLL_NO || ""}
                                                onChange={(e) => handleInputChange(e, "ROLL_NO")}
                                            />
                                        </td>
                                        {/* <td>
                                            <input
                                                type="hidden"
                                                value={editedStudent.DTL_ID || ""}
                                            />
                                        </td> */}
                                        <td>
                                            <button className="edit-button" onClick={() => handleSave()}>Save</button>
                                            <button className="cancel-button" onClick={() => {
                                                if (editedStudent.STUDENT_ID === -1) {
                                                    setStudents(students.filter(s => s.STUDENT_ID !== -1));
                                                }
                                                setIsEditing(null);
                                            }}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{student.STUDENT_ID}</td>
                                        <td>{student.STUDENT_NAME}</td>
                                        <td>{student.DOB}</td>
                                        <td>{student.ADDRESS}</td>
                                        <td>{student.PHONE}</td>
                                        <td>{student.FATHER_NAME}</td>
                                        <td>{student.MOTHER_NAME}</td>
                                        <td>{student.YEAR}</td>
                                        <td>{student.GRADE}</td>
                                        <td>{student.SECTION}</td>
                                        <td>{student.ROLL_NO}</td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleEdit(student)}>Edit</button>
                                            <button className="cancel-button" onClick={() => handleDelete(student.STUDENT_ID)}>Delete</button>
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

export default Student;