function pausePrevAudio() {
  if (ringtoneAudio !== undefined) {
    ringtoneAudio.pause();
  }
}

// Add Alarm Operation
let addBtn = document.querySelector(".addAlarm");
let alarmEventContainer = document.querySelector(".alarmEventContainer");
let timeInput = document.querySelector("#time");
addBtn.addEventListener("click", () => {
  let hour = new Date().getHours();
  let mins = new Date().getMinutes();
  timeInput.value = `${hour}:${mins}`;
  alarmEventContainer.classList.add("showAlarmEventContainer");
});

// Close Add Alarm Popup
let cancelBtn = document.querySelector(".eventCancel");
cancelBtn.addEventListener("click", () => {
  pausePrevAudio();
  alarmEventContainer.classList.remove("showAlarmEventContainer");
});

// Alarm Note Operation
let alarmNoteInput = document.querySelector("#alarmNote");
let resetBtn = document.querySelector(".fa-close");
alarmNoteInput.addEventListener("input", (e) => {
  if (e.target.value.trim() !== "") {
    resetBtn.classList.add("resetShow");
  } else {
    resetBtn.classList.remove("resetShow");
  }
});
resetBtn.addEventListener("click", () => {
  alarmNoteInput.value = "";
  resetBtn.classList.remove("resetShow");
});

// Show/Hide Ringtones
let ringtoneContainer = document.querySelector(".ringtone");
let alarmSoundToggleBtn = document.querySelector(".fa-chevron-down");
let ringtoneListContainer = document.querySelector(".ringtoneLists");

ringtoneContainer.addEventListener("click", () => {
  pausePrevAudio();
  ringtoneListContainer.classList.toggle("showSongs");
  alarmSoundToggleBtn.classList.toggle("hide");
});

// Play Ringtones On Select
let selectedSong = document.querySelector(".selectedSong");
var ringtoneAudio = undefined;
let ringtones = document.querySelectorAll(".songRadio");
ringtones.forEach((song) => {
  song.addEventListener("click", () => {
    selectedSong.textContent = song.getAttribute("data-song-name");
    if (ringtoneAudio == undefined) {
      ringtoneAudio = new Audio(song.value);
      ringtoneAudio.loop = true;
      ringtoneAudio.play();
    } else {
      ringtoneAudio.pause();
      ringtoneAudio = new Audio(song.value);
      ringtoneAudio.loop = true;
      ringtoneAudio.play();
    }
  });
});

// Main Alarm Operation

// Display Alarms
let alarmContainer = document.querySelector(".alarmContainer");
document.addEventListener("DOMContentLoaded", () => {
  let json = [
    {
      alarmId: 1,
      alarmTime: "10:02",
      alarmExt: "PM",
      alarmNote: "",
      alarmStatus: false,
      ringtoneName: "Casimiro",
      ringtonePath: "./Assets/Ringtones/casimiro.mp3",
    },
    {
      alarmId: 2,
      alarmTime: "10:25",
      alarmExt: "AM",
      alarmNote: "Hello",
      alarmStatus: true,
      ringtoneName: "Odacity",
      ringtonePath: "./Assets/Ringtones/odacity.mp3",
    },
  ];

  localStorage.setItem("alarms", JSON.stringify(json));
  let alarmsData = localStorage.getItem("alarms");

  if (alarmsData === null) {
    let noAlarmContainer = document.querySelector(".noAlarm");
    noAlarmContainer.classList.add("noAlarmShow");
  } else {
    let alarms = JSON.parse(alarmsData);
    alarms.forEach(
      ({ alarmId, alarmTime, alarmExt, alarmStatus, alarmNote }) => {
        let alarmHTML = `<div class="alarm" data-alarm-id=${alarmId}>
          <div class="leftContent">
            <div class="leftTop">
              <h1>${alarmTime}</h1>
              <h5>${alarmExt}</h5>
            </div>
            <div class="leftBottom">
              <p>Ring once</p>
              ${alarmNote !== "" ? `<p>| ${alarmNote}</p>` : ""}
            </div>
          </div>
          <input type="checkbox" name="onOffData" id="onOffData${alarmId}" ${
          alarmStatus ? "checked" : ""
        } />
          <label for="onOffData${alarmId}"
            ><div class="rightContent">
              <div class="button ${alarmStatus ? "buttonActive" : ""}">
                <div class="buttonDot ${alarmStatus ? "dotActive" : ""}"></div>
              </div>
            </div>
          </label>
        </div>`;
        alarmContainer.insertAdjacentHTML("beforeend", alarmHTML);
      }
    );

    // Alarm On/Off Operation
    let buttons = document.querySelectorAll(".button");
    let buttonDots = document.querySelectorAll(".buttonDot");
    let checkBoxes = document.querySelectorAll("input[type='checkbox']");

    buttons.forEach((val, ind) => {
      val.addEventListener("click", () => {
        alarmEventContainer.classList.remove("showAlarmEventContainer");
        buttons[ind].classList.toggle("buttonActive");
        buttonDots[ind].classList.toggle("dotActive");
        let buttonStatus = !checkBoxes[ind].checked;
        console.log(buttonStatus);
      });
    });

    // Update Alarm Info
    let allAlarms = document.querySelectorAll(".alarm");
    allAlarms.forEach((alarm, ind) => {
      alarm.addEventListener("click", (e) => {
        if (e.target.classList.contains("buttonDot")) {
          console.log(e.target.classList);
        } else {
          timeInput.value = alarms[ind].alarmTime;
          alarmNoteInput.value = alarms[ind].alarmNote;
          selectedSong.textContent = alarms[ind].ringtoneName;
          alarms[ind].alarmNote !== ""
            ? resetBtn.classList.add("resetShow")
            : resetBtn.classList.remove("resetShow");
          ringtones.forEach((ringtone) => {
            if (
              ringtone.getAttribute("data-song-name").toLowerCase() ===
              alarms[ind].ringtoneName.toLowerCase()
            ) {
              ringtone.checked = true;
            }
          });
          alarmEventContainer.classList.add("showAlarmEventContainer");
        }
      });
    });
  }
});
