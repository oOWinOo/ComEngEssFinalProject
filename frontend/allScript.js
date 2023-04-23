const date = new Date();
let prevChose = null;
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


const todayid = date.getDate()+months[date.getMonth()]+date.getFullYear();

const renderCalendar = () => {
  prevChose = null;
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div id="${prevLastDay - x + 1}${months[date.getMonth()-1]}${date.getFullYear()}" class="prev-date" onclick= "choseDate(this.id)" >${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div id="${i}${months[date.getMonth()]}${date.getFullYear()}" class="today" onclick= "choseDate(this.id)">${i}</div>`;
    } else {
      days += `<div id="${i}${months[date.getMonth()]}${date.getFullYear()}" onclick= "choseDate(this.id)">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div id="${j}${months[date.getMonth()+1]}${date.getFullYear()}" class="next-date" onclick= "choseDate(this.id)">${j}</div>`;
    monthDays.innerHTML = days;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();



function choseDate(id){
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
document.getElementById('add').addEventListener('click',add);


