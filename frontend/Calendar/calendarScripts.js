document.addEventListener("DOMContentLoaded", () => {
    const currentMonth = document.querySelector("#current-month");
    const currentYear = document.querySelector("#current-year");
  
    //Get new date
    let date = new Date();
    curYear = date.getFullYear();
    curMonth = date.getMonth();
    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];

    const renderCalendar = () =>{
        currentMonth.innerHTML = `<tr id="current-month">
                                    <td colspan="7">
                                        <div id="triangle-left"></div>
                                        `+ `${Months[curMonth]}`+
                                        `<div id="triangle-right"></div>
                                    </td>
                                  </tr>`;
        currentYear.innerHTML = `<tr id="current-year">
                                    <td colspan="7">` + `${curYear}`+ `</td>
                                 </tr>`;
    }
  
    renderCalendar();
  });
  