let buttons = document.querySelectorAll(".button");
let buttonDots = document.querySelectorAll(".buttonDot");
let checkBoxes = document.querySelectorAll("input[type='checkbox']");

buttons.forEach((val, ind) => {
  val.addEventListener("click", () => {
    buttons[ind].classList.toggle("buttonActive");
    buttonDots[ind].classList.toggle("dotActive");
    let buttonStatus = !checkBoxes[ind].checked;
    // console.log(buttonStatus);
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

let alarmNoteInput = document.querySelector("#alarmNote");
let resetBtn = document.querySelector(".fa-close");
alarmNoteInput.addEventListener("input", (e) => {
  if (e.target.value.trim() !== "") {
    resetBtn.classList.add("resetShow");
  } else {
    resetBtn.classList.remove("resetShow");
  }
});

let ringtoneContainer = document.querySelector(".ringtone");
let alarmSoundToggleBtn = document.querySelector(".fa-chevron-down");
let ringtoneListContainer = document.querySelector(".ringtoneLists");

ringtoneContainer.addEventListener("click", () => {
  ringtoneListContainer.classList.toggle("showSongs");
  alarmSoundToggleBtn.classList.toggle("hide");
});
