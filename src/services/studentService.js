import students from "../data/students";

export const getStudents = () => {
  return students;
};

export const getStudentById = (id) => {
  return students.find(student => student.id === Number(id));
};