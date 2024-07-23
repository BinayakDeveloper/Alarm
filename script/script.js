let buttons = document.querySelectorAll(".button");
let buttonDots = document.querySelectorAll(".buttonDot");
let checkBoxes = document.querySelectorAll("input[type='checkbox']");

buttons.forEach((val, ind) => {
  val.addEventListener("click", () => {
    buttons[ind].classList.toggle("buttonActive");
    buttonDots[ind].classList.toggle("dotActive");
    let buttonStatus = !checkBoxes[ind].checked;
    console.log(buttonStatus);
  });
});

let addBtn = document.querySelector(".addAlarm");
let alarmEventContainer = document.querySelector(".alarmEventContainer");
addBtn.addEventListener("click", () => {
  alarmEventContainer.classList.add("showAlarmEventContainer");
});

let cancelBtn = document.querySelector(".eventCancel");
cancelBtn.addEventListener("click", () => {
  alarmEventContainer.classList.remove("showAlarmEventContainer");
});

let hourContainer = document.querySelector(".hour");
let prevHour = document.querySelector(".prevHour");
let curHour = document.querySelector(".curHour");
let nextHour = document.querySelector(".nextHour");

hourContainer.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    let hour = Number(curHour.textContent);
    if (hour < 12) {
      prevHour.textContent = hour;
      curHour.textContent = hour + 1;
      nextHour.textContent = hour + 2 == 13 ? "-" : hour + 2;
    }
  } else {
    if (Number(curHour.textContent) > 1) {
      prevHour.textContent =
        Number(prevHour.textContent) - 1 == 0
          ? "-"
          : Number(prevHour.textContent) - 1;
      curHour.textContent = Number(curHour.textContent) - 1;
      nextHour.textContent = Number(curHour.textContent) + 1;
    }
  }
});
