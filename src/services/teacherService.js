import teachers from "../data/teachers";

export const getTeachers = () => {

    return teachers;

};

export const getTeacherById = (id) => {

    return teachers.find(
        teacher => teacher.id === Number(id)
    );

};