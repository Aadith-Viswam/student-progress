import api from "./axios";


/**
 * Create a new class (Teacher only)
 * @param {Object} classData - { classname }
 */
export const createClass = async (classData) => {
    try {
        const res = await api.post("/teacher/classes", classData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Error creating class" };
    }
};
export const getClass = async () => {
    try {
        const res = await api.get("/teacher/classes");
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching class" };
    }
};

/**
 * Create a new assignment for a class
 * @param {string} classId
 * @param {Object} assignmentData - { title, subject, description }
 */
export const createAssignment = async (classId, assignmentData) => {
    try {
        const res = await api.post(`/teacher/assignments/${classId}`, assignmentData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Error creating assignment" };
    }
};

/**
 * Submit marks for an assignment
 * @param {string} assignmentId
 * @param {Object} markData - { studentId, marks, feedback }
 */
export const submitMarks = async (assignmentId, markData) => {
    try {
        const res = await api.post(`/teacher/marks/${assignmentId}`, markData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Error submitting marks" };
    }
};

/**
 * View all students in a class
 * @param {string} classId
 */
export const viewStudentsByClass = async (classId) => {
    try {
        const res = await api.get(`/teacher/students/class/${classId}`);
        return res.data.students;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching students" };
    }
};

/**
 * View submissions by assignment
 * @param {string} assignmentId
 */
export const viewSubmissionsByAssignment = async (assignmentId) => {
    try {
        const res = await api.get(`/teacher/assignments/${assignmentId}/submissions`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Error fetching submissions" };
    }
};

export const getClassById = async (id) => {
  try {
    const res = await api.get(`/teacher/class/${id}`);
    return res.data.class; // returns { _id, classname, createdAt, ... }
  } catch (error) {
    throw error.response?.data || { message: "Error fetching class" };
  }
};
