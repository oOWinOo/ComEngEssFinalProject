const date = new Date();
let prevChose = null;
let toDoDate = document.getElementById("Day")

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
toDoDate.innerHTML = date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
const backendIPAddress = "127.0.0.1:3000";

const todayid = date.getDate()+months[date.getMonth()]+date.getFullYear();

//Render the calendar
const renderCalendar = () => {
  prevChose = null;
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date( // last day of this month
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date( // last day of prevMonth
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();  //first day of this month

  const lastDayIndex = new Date(  // last day of this month
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";
  // console.log(prevLastDay);
  // console.log(firstDayIndex);
  for (let x = firstDayIndex; x > 0; x--) {
    if(date.getMonth()-1 < 0){
      days += `<div id="${prevLastDay - x + 1} ${months[11]} ${date.getFullYear()-1}" class="prev-date" onclick= "choseDate(this.id)" >${prevLastDay - x + 1}</div>`;
    }
    else{
      days += `<div id="${prevLastDay - x + 1} ${months[date.getMonth()-1]} ${date.getFullYear()}" class="prev-date" onclick= "choseDate(this.id)" >${prevLastDay - x + 1}</div>`;
    }
    
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    ) {
      days += `<div id="${i} ${months[date.getMonth()]} ${date.getFullYear()}" class="today" onclick= "choseDate(this.id)">${i}</div>`;
    } else {
      days += `<div id="${i} ${months[date.getMonth()]} ${date.getFullYear()}" onclick= "choseDate(this.id)">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {

    if(date.getMonth() >=11){
      days += `<div id="${j} ${months[0]} ${date.getFullYear()+1}" class="next-date" onclick= "choseDate(this.id)">${j}</div>`;
    }
    else{
      days += `<div id="${j} ${months[date.getMonth()+1]} ${date.getFullYear()}" class="next-date" onclick= "choseDate(this.id)">${j}</div>`;
    }
    
    // monthDays.innerHTML = days;
  }
  // console.log(days);
  monthDays.innerHTML = days;
};

document.querySelector(".prev").addEventListener("click", () => {
  
  date.setMonth(date.getMonth() - 1);
  // console.log(date)
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  // console.log(date)
  renderCalendar();

});

renderCalendar();



function choseDate(id){
  toDoDate.innerHTML = id;
  let dateArray = id.split(" "); // date month year
  // console.log(dateArray);
  document.querySelector(".date p").innerHTML = new Date(dateArray[2],months.findIndex(x => x===dateArray[1]),dateArray[0]).toDateString();
  if(prevChose != null){
    if(prevChose == todayid){
      document.getElementById(prevChose).style.backgroundColor = "#B1C2FF";
      
    }
    else{
      document.getElementById(prevChose).style.backgroundColor = "#EBF0FF";
    }
    
    
  }
  prevChose = id;
  // alert(id);
  document.getElementById(id).style.backgroundColor = "#7A97FF";
  
  
  
}
/*-------------------------------------------------------------------------------------*/

// Add div
function add(){
  // Do something with the form data, such as adding it to a list or sending it to a server
  // ... 
  const date = document.querySelector('.ans[type="date"]').value;
  const subject = document.querySelector('#cars').value;
  const start =  document.querySelector('.time[name="start"]').value;
  const finish =  document.querySelector('.time[name="finish"]').value
  const color = document.querySelector('input[name="color"]:checked').value;
  const detail = document.querySelector('.detail').value;
  var alert = "";
    if(date == ''){
        alert += "please enter the date\n";
    }
    if(subject == "0"){
        alert += "please enter the subject\n";
    }
    if(alert == ""){
        document.querySelector('form').reset();
        document.querySelector('.time[name="start"]').value = '';
        document.querySelector('.time[name="finish"]').value = '';
        alert = "success \n";
        
    }
    if(alert == "success \n" && start != "" && finish == ""){
        alert += date + " " + subject + " \n Start at " + start +"\n"+detail;
    }
    if(alert == "success \n" && finish != ""){
        alert += date + " " + subject + " \n Start at " + start +" until " + finish+"\n"+detail;
    }
        if(alert == "success \n"){
        alert += date + " " + subject+"\n"+detail;
    }
    
  // Do something with the form data, such as adding it to a list or sending it to a server
  // ...  
    window.alert(alert);
  // Reset the form

};


//MyCourseVille Scripts
const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

const getCourses = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_courses`, options).then((response) => response.json())

  return data;
};

const getEachCourseAssignments = async (cv_cid) => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`, options).then((response) => response.json());
  return data.data;
};

const getCourseName = async (cv_cid) =>{
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_course_info/${cv_cid}`, options).then((response) => response.json());

  return data;
};
const getAssignTime = async (item_id) =>{
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_assignment_detail/${item_id}`, options).then((response) => response.json());

  return data;
};

const getAllCourseAssignments  = async () => {
  const cv_cids = [];
  const courses = await getCourses();
  courses.forEach(e => {
    cv_cids.push(e.cv_cid);
  });
  let dict = {
    
  }
  for(let i=0;i < cv_cids.length; i++){
    const courseAssignment = await getEachCourseAssignments(cv_cids[i]);
    const courseName = (await getCourseName(cv_cids[i])).title;
    if (!( courseName in dict)){
      dict[courseName] = [];
    }
    if (courseAssignment.length > 0){
      
      for (const e of courseAssignment){
        const itemInfo = await getAssignTime(e.itemid);
        dict[courseName].push({cv_cid: cv_cids[i],
          title:e.title,
          itemid:e.itemid,
          duedate:itemInfo.duedate,});
      }
    }
  }
  console.log(dict);
  return dict;
};

async function test(){
  console.log("press");
  //getCourses();

  await getAllCourseAssignments();

  //getCourseName(24587);
  // getCourses();
  //getAssignTime(892965);
  
}

