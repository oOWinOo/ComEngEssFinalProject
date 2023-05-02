const backendIPAddress = "127.0.0.1:3000"//"3.212.76.154:3000" //"127.0.0.1:3000";
//MCV to Database
//MyCourseVille Scripts
//================================================================================================================================================================================================


const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};
const authorizeApplication = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

async function reMakeData (){
  console.log("start remake");
  let everyOne = await getFromDatabase();
  let userData = [];
  const userid = await getUserID();
  
  for(const user of everyOne){
    if (user.userid == userid){
      userData = user.assignments;
    }
  }
  dataToDoList = userData;
  console.log(dataToDoList);  
}

//Get user's courses
const getCourses = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_courses`,
    options
  ).then((response) => response.json());

  return data;
};

//Get assignment each course
const getEachCourseAssignments = async (cv_cid) => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`,
    options
  ).then((response) => response.json());
  return data.data;
};

//Get course's name
const getCourseName = async (cv_cid) => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_course_info/${cv_cid}`,
    options
  ).then((response) => response.json());

  return data;
};

//Get assignment time
const getAssignTime = async (item_id) => {

  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_assignment_detail/${item_id}`,
    options
  ).then((response) => response.json());
  return data;
};

//Get user's id
const getUserID = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const data = await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  ).then((response) => response.json());
  return data.data.student.id;
};

//Get all assignments
const getAllCourseAssignments = async () => {
  const cv_cids = [];
  const courses = await getCourses();
  courses.forEach((e) => {
    cv_cids.push(e.cv_cid);
  });
  let to_update = [];
  let to_add = [];
  const useridPromise =  await getUserID();
  const from_database = (await getFromDatabase()).map(
    (data) => data.userid
  );
  if (!from_database.includes(useridPromise)){
    const newUser = {
        userid : useridPromise,
        assignments : []
    };
    addNewToDatabase(newUser);
  }
  for (let i = 0; i < cv_cids.length; i++) {
    const BigcourseAssignment = await getEachCourseAssignments(cv_cids[i]);
    const now = Math.floor(Date.now() / 1000); // get current Unix timestamp in seconds
    const courseAssignment = BigcourseAssignment.filter((item) => item.duetime > now);
    const courseName = (await getCourseName(cv_cids[i])).title;
    const database = (await getFromDatabase()).map(
      (data) => data.user
    );
    if (courseAssignment.length > 0) {
      const res = []
      for (const e of courseAssignment) {
        res.push((async (e) => {

          const itemInfoPromise =  await getAssignTime(e.itemid);
          if (!database.includes(e.userid)) {
            return {
              data: {
                userid : useridPromise,
                assignments : [ {
                  courseName: courseName,
                  title: e.title,
                  assignment_id: e.itemid,
                  duedate: itemInfoPromise.duedate,
                  color: "#018ADA",
                  status: 0}
                ]
              },
              status: "create",
            };
          } else {
            return { data: {
              userid : useridPromise,
              assignments :  {
                courseName: courseName,
                title: e.title,
                assignment_id: e.itemid,
                duedate: itemInfoPromise.duedate,
                color: "#018ADA",
                status: 0}
              
            }, status: "update" };
          }
          
        })(e));
      }
      const result = await Promise.all(res)
      //console.log(result);
      result.forEach((e) => e.status == "create" ? to_add.push(e.data) : to_update.push(e.data) );
      //addNewToDatabase(to_add);
      // updateUserID(to_update,useridPromise);upDateDatabase
    }
  }
  let finish = Date.now() / 1000;
  // console.log("getAssignTime" + " = " + (finish - start));
  return to_update;
};

//Add all to database
const addAll = async () => {
  console.log("Loading MCV!!");
  const data = await getAllCourseAssignments();
  const to_update = data;
  console.log("Begining Add MCV to db!!");
  for (const assignment of to_update) {
    await upDateDatabase(assignment.userid,assignment);
    //console.log(assignment);
  }
  //upDateDatabase();
  console.log("Already Add MCV to db!!");
};

//Update database/*
const upDateDatabase = async (userid,assignment) => {
  // const userid = getUserID();
  const from_database = await getFromDatabase();
  let dataToUpdate = {};
  for(let i = 0; i < from_database.length; i++){
    if (from_database[i].userid == userid){
      dataToUpdate = from_database[i];
      //console.log(dataToUpdate);
      //console.log(from_database[i]);
      break;
    }
  }
  //console.log(dataToUpdate);
  const checkItemid = (data,itemid) =>{
    //console.log(data,itemid);
    for(let i=0;i<data.assignments.length;i++){
      if (data.assignments[i].assignment_id === itemid){
        return true;
      }
    }

    return false;
  }
  console.log(assignment);
  if (dataToUpdate && !checkItemid(dataToUpdate,assignment.assignments.assignment_id)) {
    dataToUpdate.assignments.push(assignment.assignments);
    //console.log(dataToUpdate);
    console.log("WantToUpdate")
    console.log('--------------------------------');
    await updateUserID(dataToUpdate);
  } else {
    // Handle case when userid is not found
  }


}

//Add one to database

const addNewToDatabase = async (data) => {
  console.log("Beginning Add");
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  console.log("Pass Here");
  await fetch(`http://${backendIPAddress}/todolists/add`, options);
  console.log("Done Add");
};



const updateUserID = async (data) => {
  const options = {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  console.log("Start update");
  console.log(data);
  await fetch(`http://${backendIPAddress}/todolists/update`, options);
  console.log("Done");
};

//Get data from database
const getFromDatabase = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/todolists/lists`, options)
    .then((response) => response.json())
    .then((data) => {
      items = data;
    });
  //console.log(items);
  return items;
};

//Get data on that month
const getOnMonth = async (month, year) => {
  const database = await getFromDatabase();
  const userid = await getUserID();
  let data=null;
  for(const user of database){
    if(user.userid == userid){
      data = user;
    }
  }
  //console.log(data.assignments);
  const OnMonth = [];
  for(const assign of data.assignments){
    const duedate = assign.duedate.split("-");
    //console.log(duedate,year,month);
    const y = duedate[0];
    const m = duedate[1];
    
    if (y == year && m == month){
      //console.log(assign);
      OnMonth.push(assign);
    }
  }
  
  //console.log(OnMonth);
  return OnMonth;
};

//Get data from  that day
const getOnDate = async (day) => {
  //const OnMonth = await getOnMonth(date.getMonth() + 1, date.getFullYear());
  const OnMonth = await getOnMonth(date.getMonth() + 1, date.getFullYear());
  //console.log(OnMonth);
  
  const OnDay = [];
  const today = day.split("-")[2];
  const thisMonth = day.split("-")[1];
  //console.log(OnMonth);
  for (let i = 0; i < OnMonth.length; i++) {
    const duedate = OnMonth[i].duedate.split("-");
    const duemonth = months[parseInt(duedate[1]) - 1];
    const dueday = duedate[2];
    
    //console.log(OnMonth[i].duedate);
    console.log(today,dueday)
    if (parseInt(dueday)  == today && duemonth == thisMonth) {
      OnDay.push(OnMonth[i]);
    }
  }
  console.log(OnDay);
  return OnDay;
};

//Render the subject selector
const renderOptions = async () => {
  const cv_cids = [];
  const courses = await getCourses();
  courses.forEach((e) => {
    cv_cids.push(e.cv_cid);
  });

  var select = document.getElementById("cars");
  for (let i = 0; i < cv_cids.length; i++) {
    const courseName = (await getCourseName(cv_cids[i])).title;
    var opt = document.createElement("option");
    opt.value = courseName;
    opt.innerHTML = courseName;
    select.appendChild(opt);
  }
  await reMakeData();
  
};

//renderOptions();
//reMakeData();








//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]



const date = new Date();
let prevChose = null;
let toDoDate = document.getElementById("Day");
let toDoList = [];
let dataToDoList = [];
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
toDoDate.innerHTML = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

const dataOfMonth = [];
const todayid = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
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

  const firstDayIndex = date.getDay(); //first day of this month

  const lastDayIndex = new Date( // last day of this month
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
    if (date.getMonth() - 1 < 0) {
      days += `<div id="${prevLastDay - x + 1} ${months[11]} ${
        date.getFullYear() - 1
      }" class="prev-date" onclick= "choseDate(this.id)" ><p>${
        prevLastDay - x + 1
      }</p><p></p></div>`;
    } else {
      days += `<div id="${prevLastDay - x + 1} ${
        months[date.getMonth() - 1]
      } ${date.getFullYear()}" class="prev-date" onclick= "choseDate(this.id)" ><p>${
        prevLastDay - x + 1
      }</p><p></p></div>`;
    }
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    ) {
      days += `<div id="${i} ${
        months[date.getMonth()]
      } ${date.getFullYear()}" class="today" onclick= "choseDate(this.id)"><p>${i}</p><p></p></div>`;
    } else if (!(date.getMonth() === todayMonth) && i === 1) {
      days += `<div id="${i} ${
        months[date.getMonth()]
      } ${date.getFullYear()}" onclick= "choseDate(this.id)" style="background-color:#7A97FF;"><p>${i}</p><p></p></div>`;
      prevChose = `${i} ${months[date.getMonth()]} ${date.getFullYear()}`;
      toDoDate.innerHTML = `${i} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    } else {
      days += `<div id="${i} ${
        months[date.getMonth()]
      } ${date.getFullYear()}" onclick= "choseDate(this.id)"><p>${i}</p><p></p></div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    if (date.getMonth() >= 11) {
      days += `<div id="${j} ${months[0]} ${
        date.getFullYear() + 1
      }" class="next-date" onclick= "choseDate(this.id)"><p>${j}</p><p></p></div>`;
    } else {
      days += `<div id="${j} ${
        months[date.getMonth() + 1]
      } ${date.getFullYear()}" class="next-date" onclick= "choseDate(this.id)"><p>${j}</p><p></p></div>`;
    }

    // monthDays.innerHTML = days;
  }
  document.querySelector(".year").innerHTML = date.getFullYear();

  if (date.getMonth() === todayMonth) {
    let x = new Date().toDateString().split(" ");
    let y = x.pop();
    document.querySelector(".date2").innerHTML = x.join(" ");
  } else {
    let x = date.toDateString().split(" ");
    let y = x.pop();
    document.querySelector(".date2").innerHTML = x.join(" ");
  }
  // console.log(days);

  monthDays.innerHTML = days;
  console.log("in render " ,dataToDoList);
  addColorPoint(dataToDoList, monthDays);
  console.log("done");
  document.getElementById("all").hidden = false;
  document.getElementById("loading").hidden = true;

};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  getOnMonth(date.getMonth() + 1, date.getFullYear());
  // console.log(date)
  //  thisMonthData =  await getOnMonth(date.getMonth(),date.getFullYear());
  renderCalendar();
  choseDate(`1 ${months[date.getMonth()]} ${date.getFullYear()}`);
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  getOnMonth(date.getMonth() + 1, date.getFullYear());
  // console.log(date)

  renderCalendar();
  
  choseDate(`1 ${months[date.getMonth()]} ${date.getFullYear()}`);
});

// renderCalendar();

async function choseDate(id) {
  toDoDate.innerHTML = id;
  let dateArray = id.split(" "); // date month year date month year
  // year month date
  let shuffleDate = [dateArray[2], dateArray[1], dateArray[0]];
  let checkDate = shuffleDate.join("-");
  //console.log(dateArray);
  let x = new Date(
    dateArray[2],
    months.findIndex((x) => x === dateArray[1]),
    dateArray[0]
  )
    .toDateString()
    .split(" ");
  let y = x.pop();
  document.querySelector(".date2").innerHTML = x.join(" ");
  if (prevChose != null) {
    if (prevChose == todayid) {
      document.getElementById(prevChose).style.backgroundColor = "#B1C2FF";
    } else {
      console.log(prevChose);
      document.getElementById(prevChose).style.backgroundColor = "#EBF0FF";
    }
  }

  document.querySelector(".year").innerHTML = dateArray[2];
  prevChose = id;
  // alert(id);
  document.getElementById(id).style.backgroundColor = "#7A97FF";
  //List();

  //clear and add data part
  document.getElementById("dayList").innerHTML = "";
  console.log("dataToDoList" , dataToDoList);
  for (let i = 0; i < dataToDoList.length; i++) {
    let targetList = dataToDoList[i];
    console.log(formatStringDate(targetList["duedate"]),id)
    if (formatStringDate(targetList["duedate"]) === id) {
      let listbox = document.createElement("div");
      listbox.className = "listBox";
      listbox.id = targetList["assignment_id"];
      listbox.style.backgroundColor = targetList.color;
      // listbox.style.opacity = "50%";
      console.log(targetList.color);
      let head = document.createElement("div");
      head.className = "head";
      let subject = document.createElement("div");
      subject.className = "subject";
      subject.textContent = targetList["courseName"];
      if(targetList["courseName"].length > 27){
        subject.style.fontSize = "20px";
      }
      if(targetList["courseName"].length > 30){
        subject.style.fontSize = "14px";
      }
      let timmy = document.createElement("div");
      timmy.className = "timmy";
      if (targetList.start != undefined && targetList.finish != undefined) {
        timmy.innerText = targetList.start + "-" + targetList.finish;
      } else if (targetList.start != undefined) {
        timmy.innerText = targetList.start;
      } else if (targetList.finish != undefined) {
        timmy.innerText = targetList.finish;
      }

      //timmy.textContent = targetList[""]

      //delete button
      let deletecontainder = document.createElement("div");
      deletecontainder.className = "button-container";
      let deletebutton = document.createElement("button");
      deletebutton.className = "delete";
      deletebutton.addEventListener("click", remove); //      <----------------------------
      deletebutton.textContent = "delete";
      deletecontainder.appendChild(deletebutton);
      //listdetail
      let listDetail = document.createElement("div");
      listDetail.className = "listDetail";
      if(targetList["title"].length >= 20){

      }
      listDetail.textContent = targetList["title"];
      

      head.appendChild(subject);
      head.appendChild(timmy);
      head.appendChild(deletecontainder);
      listbox.appendChild(head);
      listbox.appendChild(listDetail);

      document.getElementById("dayList").appendChild(listbox);
    }
  }

  let todayData = await getOnDate(checkDate);

  // ShowList(todayData);
}



/*-------------------------------------------------------------------------------------*/

// Add div
const add = async () => {
  document.getElementById("all").hidden = true;
  document.getElementById("loading").hidden = false;
  // {courseName: courseName,
  //   title:e.title,
  //   assignment_id:e.itemid,
  //   start:0,
  //   finish:0,
  //   duedate:itemInfo.duedate,
  //   color:"#018ADA",
  //   status:0}

  const date = document.querySelector('.ans[type="date"]').value;
  const subject = document.querySelector("#cars").value;
  const start = document.querySelector('.time[name="start"]').value;
  const finish = document.querySelector('.time[name="finish"]').value;
  const color = document.querySelector('input[name="color"]:checked').value;
  const detail = document.querySelector(".detail").value;
  var alert = "";
  if (date == "") {
    alert += "Please enter the date\n";
  }
  if (subject == "0") {
    alert += "Please choose the subject\n";
  }
  if (alert == "") {
    document.querySelector("form").reset();
    document.querySelector('.time[name="start"]').value = "";
    document.querySelector('.time[name="finish"]').value = "";
    alert = "success \n";
    addToDoList(date, subject, start, finish, color, detail);
    const userID = await getUserID();
    const itemid =    parseInt(Date.now());
    const data = {userid : userID,
                   assignments:  {
                    assignment_id: itemid,
                    color: color,
                    courseName: subject,
                    duedate: date,
                    status: 0,
                    title: detail,
                    start : start,
                    finish : finish
                  }};
    
    upDateDatabase(userID,data);
    document.getElementById("all").hidden = false;
    document.getElementById("loading").hidden = true;
    renderCalendar();
  }
  else{
    window.alert(alert);
  }
  
  // {
  //   assignment_id: 948056,
  //   color: "#018ADA",
  //   courseName: "Computer Engineering Essentials [Section 33-35]",
  //   duedate: "2023-05-03",
  //   status: 0,
  //   title: "Final Project: Presentation Slide Submission"
  // }
  
  if (alert == "success \n" && start != "" && finish == "") {
    alert += date + " " + subject + " \n Start at " + start + "\n" + detail;
  }
  if (alert == "success \n" && finish != "") {
    alert +=
      date +
      " " +
      subject +
      " \n Start at " +
      start +
      " until " +
      finish +
      "\n" +
      detail;
  }
  if (alert == "success \n") {
    alert += date + " " + subject + "\n" + detail;
  }

  // Do something with the form data, such as adding it to a list or sending it to a server
  // ...

  // window.alert(alert);
  // window.alert(toDoList);
  //window.alert(toDoList[0][0][0].toString());

  // Reset the form
};

function addToDoList(date, subject, start, finish, color, detail) {
  // toDoList = [];
  dataToDoList.push({
    assignment_id: 0,
    color: color,
    courseName: subject,
    duedate: date,
    status: 0,
    title: detail,
    finish:finish,
    start:start,

  });
}

function List() {
  for (let i = 0; i < document.getElementById("list").rows.lenth; i++) {
    //window.alert("del");
    document.getElementById("list").deleteRow(i);
  }
  dayList = [];
  if (toDoList != []) {
    for (let i = 0; i < toDoList.length; i++) {
      if (sameDate(toDoList[i])) {
        dayList.push(toDoList[i]);
      }
    }
  }
  ShowList(dayList);
}


function ShowList(dList) {
  // dList.sort();
  //window.alert("dd");
  var table = document.getElementById("list");
  table.innerHTML = "";
  //console.log(dList);
  for (var i of dList) {
    //window.alert(i);

    // [[date],[start,finish,subject,color,detail]]
    var row = table.insertRow(table.rows.length - 1);
    row.insertCell(0).innerHTML = i.courseName + i.title;
  }
}

function formatStringDate(date) {
  let arr = date.split("-");
  d = parseInt(arr[2]).toString() ;
  m = months[parseInt(arr[1] - 1)];
  y = arr[0];
  return `${d} ${m} ${y}`;
}

function addColorPoint(dataToDoList, monthDays) {
  let allDate = monthDays.children;
  // console.log(allDate);
  for (let i = 0; i < dataToDoList.length; i++) {
    console.log( dataToDoList[i],dataToDoList[i].duedate)
    let targetDate = dataToDoList[i].duedate.split("-");


    var day = targetDate[0];
    
    targetDate[0] = parseInt(targetDate[2]).toString();
    targetDate[2] = day;
    targetDate[1] = months[parseInt(targetDate[1] - 1)];
    // set img //
    let addImg = document.createElement("img");
    addImg.src = colorCodeToPath(dataToDoList[i].color);
    addImg.width = 10;
    addImg.height = 10;
    for (let j = 0; j < allDate.length; j++) {
      
     // console.log(allDate[j].id.split(" "),"===with===",targetDate, " ==> ",targetDate === allDate[j].id.split(" "))
      if (targetDate.join(" ") === allDate[j].id) {
        
        allDate[j].children[1].appendChild(addImg);
      }
    }
  }

  function colorCodeToPath(colorCode) {
    if (colorCode === "#FF7D7D") {
      return "red.png";
    } else if (colorCode === "#FFB665") {
      return "orange.png";
    } else if (colorCode === "#FFFF61") {
      return "yellow.png";
    } else if (colorCode === "#5DFF70") {
      return "green.png";
    } else if (colorCode === "#53FBFF") {
      return "cyan.png";
    } else if (colorCode === "#9B9DFF") {
      return "blue.png";
    } else if (colorCode === "#E197FF") {
      return "pink.png";
    } else if (colorCode === "#BFBFBF") {
      return "gray.png";
    } else if (colorCode === "#018ADA") {
      return "MCV_color.png";
    }
  }
}

async function remove(event) {
  console.log(event.target.closest(".listBox").style.backgroundColor)
  if (event.target.closest(".listBox").style.backgroundColor == "rgb(1, 138, 218)"){
    window.alert("You can't delete Mycourseville assignments");
    return;
  }
  document.getElementById("all").hidden = true;
  document.getElementById("loading").hidden = false;
  const userid = await getUserID();
  let assignmentRemoveId = event.target.closest(".listBox").id;
  const from_database = await getFromDatabase();
  let dataToUpdate = {};
  for(let i = 0; i < from_database.length; i++){
    if (from_database[i].userid == userid){
      dataToUpdate = from_database[i];
      break;
    }
  }
  for(let i = 0; i < dataToUpdate.assignments.length; i++) {
    if(dataToUpdate.assignments[i].assignment_id == assignmentRemoveId) {
      console.log(dataToUpdate.assignments[i],'here');
      dataToUpdate.assignments.splice(i, 1); // Remove the element at index i
      break;
    }
  }
  event.target.closest(".listBox").remove();

  for (let i = 0; i < dataToDoList.length; i++) { 
    if (dataToDoList[i].assignment_id == assignmentRemoveId) {
      console.log(dataToDoList[i]);
      dataToDoList.splice(i, 1);
      break;
    }
  }
  console.log(dataToUpdate);

  await updateUserID(dataToUpdate);
  document.getElementById("all").hidden = false;
  document.getElementById("loading").hidden = true;
  reMakeData();
  // console.log(dataToDoList);
  renderCalendar();
}
/*-------------------------------------------------------------------------------------*/





//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]




//addAll();
async function test() {
  console.log("press");
  addAll();
  //getAllCourseAssignments();
}

async function main() {
  await addAll();
  let database = getFromDatabase();
  await reMakeData();
  console.log(dataToDoList)
  await renderOptions();
  renderCalendar();
  
}

window.onload = async function getAllTask() {
  let me = false;

  try {
    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    }
    me = await fetch(`http://${backendIPAddress}/courseville/get_profile_info`, options).then(res => res.status).catch(err => console.log("is not login"));
  
  } catch (error) {
    
    console.log("is not login")
    // document.body.innerHTML = `<h1>Please Login First</h1>`
  }
  console.log(me);
  if (me === 200) {
    main();
    console.log("pass")
    
  } else {
    document.body.innerHTML = `<!DOCTYPE html>
    <html>
    
        <head>
            <meta charset="UTF-8">
            <title>MyCourseville API Login Page</title>
            <link rel="stylesheet" href="style.css"></link>
            <script src="script_cv.js" defer></script>
        </head>
        <body>
            <section>
                <header>
                    <h1 id="app-name"><div style="color: #0166da;">My</div><div style="color: #ea9d01; border-color: #FFFF;">Calendar</div><span id="group-id"></span></h1>
                </header>
            </section>
            <section>
                <header>
                    <h2 class="section-title description">We need your data.</h2>
                    <p class="section-subtitle description">Please login with Mycoursevile Platform account</p>
                </header>
            </section>
            <section class="section-center">
                <button class="login-button" onclick="authorizeApplication()">Login</button>
            </section>
        </body>
    </html>`
  }
}

// main()