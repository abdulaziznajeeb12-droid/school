import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
updateStudentClass,
getStudentClassById
}
from "../../services/StudentClassService";

import { getUsers } from "../../services/userService";

import { getClasses } from "../../services/classService";

import { getSections } from "../../services/sectionService";

function EditStudentClass(){

const {id}=useParams();

const navigate=useNavigate();

const [students,setStudents]=useState([]);

const [classes,setClasses]=useState([]);

const [sections,setSections]=useState([]);

const [form,setForm]=useState({

studentId:"",

classId:"",

sectionId:""

});

useEffect(()=>{

load();

},[]);

const load=async()=>{

setStudents(await getUsers());

setClasses(await getClasses());

setSections(await getSections());

const data=await getStudentClassById(id);

setForm(data);

}

const change=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

}

const save=async(e)=>{

e.preventDefault();

await updateStudentClass(form);

alert("Updated");

navigate("/studentclass");

}

return(

<DashboardLayout>

<h2>Edit Assignment</h2>

<form onSubmit={save}>

<select
name="studentId"
value={form.studentId}
onChange={change}
>

{
students.map(x=>

<option
key={x.id}
value={x.id}
>

{x.firstName}

</option>

)

}

</select>

<br/><br/>

<select

name="classId"

value={form.classId}

onChange={change}

>

{

classes.map(x=>

<option

key={x.id}

value={x.id}

>

{x.className}

</option>

)

}

</select>

<br/><br/>

<select

name="sectionId"

value={form.sectionId}

onChange={change}

>

{

sections.map(x=>

<option

key={x.sectionId}

value={x.sectionId}

>

{x.sectionName}

</option>

)

}

</select>

<br/><br/>

<button>

Update

</button>

</form>

</DashboardLayout>

)

}

export default EditStudentClass;