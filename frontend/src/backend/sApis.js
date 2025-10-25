import api from "./axios";
/**
 * Submit an assignment (file only)
 * @param {string} assignmentId - ID of the assignment
 * @param {File} file - File to upload
 */
export const submitAssignment = async (assignmentId, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
            `/student/assignments/submit/${assignmentId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error submitting assignment:", error);
        throw error.response?.data || { message: "Submission failed" };
    }
};

export const getStudentDetails = async (userId) => {
  try {
    const response = await api.get(`/student/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student details:", error.response?.data || error.message);
    throw error;
  }
};