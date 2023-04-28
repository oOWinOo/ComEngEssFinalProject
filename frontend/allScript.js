
const date = new Date();
let prevChose = null;
let toDoDate = document.getElementById("Day")
let toDoList = [];
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
const dataOfMonth = [];
const todayid = date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
const todayMonth = date.getMonth();
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
  let tempday = "";
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
    ) 
    {
      days += `<div id="${i} ${months[date.getMonth()]} ${date.getFullYear()}" class="today" onclick= "choseDate(this.id)">${i}</div>`;
    } 
    else if(!(date.getMonth() === todayMonth) && i===1){
      days += `<div id="${i} ${months[date.getMonth()]} ${date.getFullYear()}" onclick= "choseDate(this.id)" style="background-color:#7A97FF;">${i}</div>`;
      prevChose = `${i} ${months[date.getMonth()]} ${date.getFullYear()}`
      toDoDate.innerHTML = `${i} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }else {
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
  document.querySelector(".year").innerHTML = date.getFullYear();

  if(date.getMonth() === todayMonth){
    let x = new Date().toDateString().split(" ");
    let y = x.pop();
    document.querySelector(".date2").innerHTML = x.join(" ");

  }
  else{
    let x = date.toDateString().split(" ");
    let y = x.pop();
    document.querySelector(".date2").innerHTML = x.join(" ");
    
    
  }
  // console.log(days);
  monthDays.innerHTML = days;
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  getOnMonth(date.getMonth()+1,date.getFullYear());
  // console.log(date)
  //  thisMonthData =  await getOnMonth(date.getMonth(),date.getFullYear());
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  getOnMonth(date.getMonth()+1,date.getFullYear());
  // console.log(date)

  renderCalendar();
});

renderCalendar();



async function choseDate(id){
  toDoDate.innerHTML = id;
  let dateArray = id.split(" "); // date month year date month year
                                 // year month date
  let shuffleDate = [dateArray[2],dateArray[1],dateArray[0]];
  let checkDate = shuffleDate.join("-");
  console.log(dateArray);
  

  
  let x = new Date(dateArray[2],months.findIndex(x => x===dateArray[1]),dateArray[0]).toDateString().split(" ");
  let y = x.pop();
  document.querySelector(".date2").innerHTML = x.join(" ");
  if(prevChose != null){
    if(prevChose == todayid){

      document.getElementById(prevChose).style.backgroundColor = "#B1C2FF";
      
    }
    else{
      document.getElementById(prevChose).style.backgroundColor = "#EBF0FF";
    }
    
    
  }
  document.querySelector(".year").innerHTML = dateArray[2];
  prevChose = id;
  // alert(id);
  document.getElementById(id).style.backgroundColor = "#7A97FF";
  List();
  let todayData = await getOnDate(checkDate);

  ShowList(todayData);
  
}

/*-------------------------------------------------------------------------------------*/

// Add div
const add = async () => {
  // Do something with the form data, such as adding it to a list or sending it to a server
  // ... 

  // {courseName: courseName,
  //   title:e.title,
  //   assignment_id:e.itemid,
  //   start:0,
  //   finish:0,
  //   duedate:itemInfo.duedate,
  //   color:"#018ADA",
  //   status:0}

  const date = document.querySelector('.ans[type="date"]').value;
  const subject = document.querySelector('#cars').value;
  const start =  document.querySelector('.time[name="start"]').value;
  const finish =  document.querySelector('.time[name="finish"]').value
  const color = document.querySelector('input[name="color"]:checked').value;
  const detail = document.querySelector('.detail').value;
  var alert = "";
    if(date == ''){
        alert += "Please enter the date\n";
    }
    if(subject == "0"){
        alert += "Please choose the subject\n";
    }
    if(alert == ""){
        document.querySelector('form').reset();
        document.querySelector('.time[name="start"]').value = '';
        document.querySelector('.time[name="finish"]').value = '';
        alert = "success \n";
        addToDoList(date,subject,start,finish,color,detail)
        renderCalendar();
        
    }
    const itemid = Date.now();
    const data = {courseName: subject,
                  title:detail,
                  assignment_id:itemid,
                  start:start,
                  finish:finish,
                  duedate:date,
                  color:color,
                  status:0};

    addOneToDatabase(data);
    
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

    // window.alert(alert);
    // window.alert(toDoList);
    //window.alert(toDoList[0][0][0].toString());

  // Reset the form

};

function addToDoList(date,subject,start,finish,color,detail){
  toDoList = [];
  toDoList.push([[date],[start,finish,subject,color,detail]]);
}

function List(){
  for(let i = 0;i < document.getElementById("list").rows.lenth;i++){
    //window.alert("del");
    document.getElementById("list").deleteRow(i);
  }
  dayList = [];
  if(toDoList != []){
  for(let i=0;i < toDoList.length; i++){
    if(sameDate(toDoList[i])){
      dayList.push(toDoList[i]);
    }
  }
  }
  ShowList(dayList);
}


// function sameDate(list){
//   a = toDoDate.innerHTML.split(" ");
//   d = parseInt(months.indexOf(a[1]))+1
//   if(d.length!=2){
//     d = '0'+d.toString();
//   }
//   b = a[2]+"-"+d+"-"+a[0];
//   if(list[0][0]==b){
//     return true;
//   }
//   return false;
// }

function ShowList(dList){
  // dList.sort();
  //window.alert("dd");
  var table = document.getElementById("list");
  table.innerHTML = "";
  console.log(dList);
  for(var i of dList){
    //window.alert(i);
    
    // [[date],[start,finish,subject,color,detail]]
    var row = table.insertRow(table.rows.length - 1);
    row.insertCell(0).innerHTML = i.courseName + i.title;
  }
}


function formatStringDate(date){
  let arr = date.split("-");
  d = arr[2]
  m = months[parseInt(arr[1]-1)];
  y = arr[0]
  return `${d} ${m} ${y}`;
}

/*-------------------------------------------------------------------------------------*/




//MCV to Database 
const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

//MyCourseVille Scripts


const getCourses = async () => {
  let start = Date.now() /1000;
  
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_courses`, options).then((response) => response.json())
  let finish = Date.now() /1000;
  console.log("getCourse" +" = "+(finish-start));
  return data;
};

const getEachCourseAssignments = async (cv_cid) => {
  let start = Date.now() /1000;
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`, options).then((response) => response.json());
  let finish = Date.now() /1000;
  console.log("getEachCourseAssign" +" = "+(finish-start));
  return data.data;
};

const getCourseName = async (cv_cid) =>{
  let start = Date.now() /1000;
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_course_info/${cv_cid}`, options).then((response) => response.json());
  let finish = Date.now() /1000;
  console.log("getCourseName" +" = "+(finish-start));
  return data;
};
const getAssignTime = async (item_id) =>{
  let start = Date.now() /1000;

  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_assignment_detail/${item_id}`, options).then((response) => response.json());
    let finish = Date.now() /1000;
    console.log("getAssignTime" +" = "+(finish-start));
  return data;
};

const getAllCourseAssignments  = async () => {
  const cv_cids = [];
  const courses = await getCourses();
  courses.forEach(e => {
    cv_cids.push(e.cv_cid);
  });
  let assignments = [];
  for(let i=0;i < cv_cids.length; i++){
    const courseAssignment = await getEachCourseAssignments(cv_cids[i]);
    const courseName = (await getCourseName(cv_cids[i])).title;
    //if (!( cv_cids[i] in assignments)){
    //  assignments[cv_cids[i]] = [];
    //}
    if (courseAssignment.length > 0){
      
      for (const e of courseAssignment){
        const itemInfo = await getAssignTime(e.itemid);
        assignments.push({courseName: courseName,
          title:e.title,
          assignment_id:e.itemid,
          duedate:itemInfo.duedate,
          color:"#018ADA",
          status:0});
          //#018ADA
      }
    }
  }
  console.log(assignments);
  return assignments;
};

const  addAll = async () =>{
  console.log("Loading MCV!!");
  const dt = await getAllCourseAssignments();
  console.log("Begining Add MCV to db!!");
  for (const assignment of dt){
    addOneToDatabase(assignment);
  }
  console.log("Already Add MCV to db!!");

}


const addOneToDatabase = async (data) =>{
  console.log("Beginning Add");
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
    
  };
  console.log("Pass Here");
  await fetch(
    `http://${backendIPAddress}/todolists/add`, options);
  console.log("Done Add");

}
// addAll();


const getFromDatabase = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/todolists/lists`, options)
    .then((response) => response.json())
    .then((data) => {
      items = data;
    })
    return items;
}

const getOnMonth = async (month,year) =>{
  const data = await getFromDatabase();
  const OnMonth = []
  for(let i = 0;i < data.length; i++){
    const duedate = data[i].duedate.split("-");
    const y = duedate[0];
    const m = duedate[1];

    if (y == year && m == month){
      OnMonth.push(data[i]);
    }
  }
  //console.log(OnMonth);
  return OnMonth;
}

const thisMonthData = getOnMonth(date.getMonth()+1,date.getFullYear());


const getOnDate = async (day) =>{
   const OnMonth = await getOnMonth(date.getMonth()+1,date.getFullYear());
   const OnDay = [];
   const today = day.split("-")[2];
   const thisMonth = day.split("-")[1];
   for(let i = 0;i< OnMonth.length;i++){
     const duedate = OnMonth[i].duedate.split("-");
     const duemonth = months[parseInt(duedate[1])-1];
     const dueday = duedate[2];
     console.log(duemonth,thisMonth);
     if (dueday == today && duemonth == thisMonth){
        OnDay.push(OnMonth[i]);
     }
   }
   console.log(OnDay);
   return OnDay;
  

}

const renderOptions = async() => {
  const cv_cids = [];
  const courses = await getCourses();
  courses.forEach(e => {
    cv_cids.push(e.cv_cid);
  });

  var select = document.getElementById("cars");
  for(let i=0; i < cv_cids.length; i++){
    const courseName = (await getCourseName(cv_cids[i])).title;
    var opt = document.createElement('option');
    opt.value = courseName;
    opt.innerHTML = courseName;
    select.appendChild(opt);

  }
}
renderOptions();

async function test(){
  console.log("press");
    
  // opt.value = "Hi";

  // var select = document.getElementById("cars");
  // var opt = document.createElement('option');
  // opt.value = 1;
  // opt.innerHTML = 2;
  // select.appendChild(opt);
  //getCourses();

  //getCourseName(24587);
  // getCourses();
  //getAssignTime(892965);
  
}
