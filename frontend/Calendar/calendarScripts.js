document.addEventListener("DOMContentLoaded", () => {
    const currentMonth = document.querySelector("#current-month");
    const currentYear = document.querySelector("#current-year");

    const PrevIcon = document.querySelectorAll(".triangle-left");
    const NextIcon = document.querySelector(".triangle-right");

    const old_table = document.querySelector(".calendar");
    const cale = document.querySelector(".calendar-container");



    
    const Hello = document.querySelector(".Hello");
    //Get new date
    let date = new Date();
    curYear = date.getFullYear();
    curMonth = date.getMonth();
    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];

    PrevIcon.forEach(e =>{
      e.addEventListener("click", () => {
        curMonth = curMonth - 1 ;
        console.log("onclick");
      renderCalendar2();
      });
    });

    NextIcon.addEventListener("click", () => {
      curMonth = curMonth + 1 ;

      renderCalendar2();
      //table.innerHTML = old_table;
    })


    let initialTable = old_table.cloneNode(true);
    //console.log(initialTable);
    
    const renderCalendar = () =>{
        var lastDateofMonth = new Date(curYear,curMonth+1,0).getDate(); 
        var table = document.getElementsByClassName("calendar")[0];
        //let table = initialTable.cloneNode(true);
        //console.log(table);
        let count = 0;
        
        for(let i = 1; i <= lastDateofMonth; i++){
          let row = table.insertRow(-1);
          while (count !=6 && i < lastDateofMonth){
            
            row.classList.add("days");
            let c1 = row.insertCell(count);
            c1.innerHTML = `<td><p class = "date" onclick="choseDate()">`+`${i}`+`</p></td>`
            i++;
            count++;
          }
          let c1 = row.insertCell(count);
          c1.innerHTML = `<td><p class = "date">`+`${i}`+`</p></td>`
          count = 0;
        }
        if(curMonth <0){
          curYear -= -curMonth/12;
        }
        if(curMonth >12){
          curYear += curMonth/12;
        }
        
        curMonth = curMonth%12;
        
        currentMonth.innerHTML = `<tr id="current-month">
                                    <td colspan="7">
                                        <span id="triangle-left"></span>
                                        `+ `${Months[curMonth]}`+
                                        `<span id="triangle-right"></span>
                                    </td>
                                  </tr>`;
        currentYear.innerHTML = `<tr id="current-year">
                                    <td colspan="7">` + `${curYear}`+ `</td>
                                 </tr>`;
        /*console.log(table);
        old_table.removeChild(old_table.lastChild);
        //old_table = table.cloneNode(true);
        old_table.appendChild(table)
        // old_table.appendChild(table);*/
       
    }   

    const renderCalendar2 = () =>{
      var lastDateofMonth = new Date(curYear,curMonth+1,0).getDate(); 
      //var table = document.getElementsByClassName("calendar")[0];
      let table = initialTable.cloneNode(true);
      //console.log(table);
      let count = 0;
      
      for(let i = 1; i <= lastDateofMonth; i++){
        let row = table.insertRow(-1);
        row.classList.add("days");
        while (count !=6 && i < lastDateofMonth){
          
          
          let c1 = row.insertCell(count);
          c1.innerHTML = `<td><p class = "date">`+`${i}`+`</p></td>`
          i++;
          count++;
        }
        let c1 = row.insertCell(count);
        c1.innerHTML = `<td><p class = "date">`+`${i}`+`</p></td>`
        count = 0;
      }
      if(curMonth <0){
        curYear -= 1;
        curMonth = 11
      }
      else if(curMonth >=12){
        curYear +=1;
        curMonth = 0
      }
      
      currentMonth.innerHTML = `<tr id="current-month">
                                  <td colspan="7">
                                      <span id="triangle-left"></span>
                                      `+ `${Months[curMonth]}`+
                                      `<span id="triangle-right"></span>
                                  </td>
                                </tr>`;
      currentYear.innerHTML = `<tr id="current-year">
                                  <td colspan="7">` + `${curYear}`+ `</td>
                               </tr>`;  
      var header = document.getElementById("calendar-header");
      // var newHead = document.createElement("thead");
      // newHead.classList.add("calendar-header");
      // newHead.appendChild(header);
      // console.log(newHead.innerHTML);


      old_table.removeChild(old_table.lastChild);
      old_table.removeChild(old_table.lastChild);

      old_table.appendChild(header);

      table.removeChild(table.firstChild);
      table.removeChild(table.firstChild);
      

      old_table.appendChild(table);


     
  }   

    renderCalendar();
    
  });
  