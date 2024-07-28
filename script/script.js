// Main Function

document.addEventListener("DOMContentLoaded", () => {
  let enterBtn = document.querySelector(".startBtn");
  enterBtn.addEventListener("click", () => {
    document
      .querySelector(".startUpAnimation")
      .classList.add("closeStartUpAnimation");
    document.querySelector(".heading").style.opacity = "1";
    document.querySelector(".container").style.opacity = "1";
    main();
  });
});

async function main() {
  // Add Alarm Operation
  let addBtn = document.querySelector(".addAlarm");
  let alarmEventContainer = document.querySelector(".alarmEventContainer");
  let timeInput = document.querySelector("#time");
  addBtn.addEventListener("click", () => {
    let hour = new Date().getHours();
    let mins = new Date().getMinutes();
    timeInput.value = `${hour < 10 ? "0" + hour : hour}:${
      mins < 10 ? "0" + mins : mins
    }`;
    alarmEventContainer.classList.add("showAlarmEventContainer");
  });

  // Close Add Alarm Popup
  let cancelBtn = document.querySelector(".eventCancel");
  cancelBtn.addEventListener("click", () => {
    pausePrevAudio();
    alarmEventContainer.setAttribute("data-edit-alarm-id", "");
    alarmNoteInput.value = "";
    ringtones[0].checked = true;
    selectedSong.textContent = ringtones[0].getAttribute("data-song-name");
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
      if (ringtoneAudio === undefined) {
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
  // window.addEventListener("DOMContentLoaded", () => {
  let alarmsData = localStorage.getItem("alarms");

  // Remove Expired Alarm
  let currentUTCmilliseconds = Date.now();
  let updatedAlarms = [];
  if (alarmsData) {
    JSON.parse(alarmsData).forEach((alarm) => {
      let alarmYear = new Date(alarm.alarmSetTime).getFullYear();
      let alarmMonth = new Date(alarm.alarmSetTime).getMonth();
      let alarmDate = new Date(alarm.alarmSetTime).getDate();
      let alarmHour = alarm.alarmTime.split(":")[0];
      let alarmMins = alarm.alarmTime.split(":")[1];

      let requiredMS = new Date(
        alarmYear,
        alarmMonth,
        alarmDate,
        alarmHour,
        alarmMins
      ).getTime();

      if (requiredMS > currentUTCmilliseconds) {
        updatedAlarms.push(alarm);
      }
    });
  }

  activeAlarm();

  if (updatedAlarms.length !== 0) {
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
  } else {
    localStorage.removeItem("alarms");
  }

  alarmsData = localStorage.getItem("alarms");
  if (alarmsData == null) {
    let noAlarmContainer = document.querySelector(".noAlarm");
    noAlarmContainer.classList.add("noAlarmShow");
  } else {
    displayAlarms(alarmContainer, alarmsData);
  }
  // });

  // Add Alarm
  let doneBtn = document.querySelector(".eventDone");
  doneBtn.addEventListener("click", () => {
    pausePrevAudio();
    ringtoneListContainer.classList.remove("showSongs");
    let existingAlarms = JSON.parse(localStorage.getItem("alarms"));

    if (existingAlarms === null || existingAlarms.length == 0) {
      // Selected Ringtone
      let ringtoneName;
      let ringtonePath;
      ringtones.forEach((ringtone) => {
        if (ringtone.checked) {
          ringtoneName = ringtone.getAttribute("data-song-name");
          ringtonePath = ringtone.value;
        }
      });
      let alarmTime = timeInput.value;
      if (alarmTime.trim() !== "") {
        let hour = alarmTime.split(":")[0];
        let mins = alarmTime.split(":")[1];
        let alarmExt = hour < 12 ? "AM" : "PM";
        let curTime = Date.now();
        let alarmYear = new Date().getFullYear();
        let alarmMonth = new Date().getMonth();
        let alarmDate = new Date().getDate();
        let reqTime = new Date(
          alarmYear,
          alarmMonth,
          alarmDate,
          hour,
          mins
        ).getTime();
        let alarmSetTime;
        if (reqTime > curTime) {
          alarmSetTime = reqTime;
        } else {
          alarmSetTime = reqTime + 1000 * 60 * 60 * 24;
        }
        let alarmNote = alarmNoteInput.value.trim();
        let alarmStatus = true;

        // Add New Alarm To Local Storage
        let finalAlarmData = {
          alarmId: 1,
          alarmTime,
          alarmExt,
          alarmSetTime,
          alarmNote,
          alarmStatus,
          ringtoneName,
          ringtonePath,
        };
        localStorage.setItem("alarms", JSON.stringify([finalAlarmData]));
        alarmEventContainer.setAttribute("data-edit-alarm-id", "");
        alarmEventContainer.classList.remove("showAlarmEventContainer");
        alarmNoteInput.value = "";
        ringtones[0].checked = true;
        activeAlarm();
        displayAlarms(alarmContainer, localStorage.getItem("alarms"));
      } else {
        alert("Enter A Valid Time");
      }
    } else {
      let editAlarmId = document
        .querySelector(".alarmEventContainer")
        .getAttribute("data-edit-alarm-id")
        .trim();

      let alarmExistance = existingAlarms.filter((alarm) => {
        return alarm.alarmId == editAlarmId;
      });

      if (alarmExistance.length !== 0) {
        let ringtoneName;
        let ringtonePath;
        ringtones.forEach((ringtone) => {
          if (ringtone.checked) {
            ringtoneName = ringtone.getAttribute("data-song-name");
            ringtonePath = ringtone.value;
          }
        });

        let alarmTime = timeInput.value;

        if (alarmTime.trim() !== "") {
          let hour = alarmTime.split(":")[0];
          let mins = alarmTime.split(":")[1];
          let alarmExt = hour < 12 ? "AM" : "PM";
          let curTime = Date.now();
          let alarmYear = new Date().getFullYear();
          let alarmMonth = new Date().getMonth();
          let alarmDate = new Date().getDate();
          let reqTime = new Date(
            alarmYear,
            alarmMonth,
            alarmDate,
            hour,
            mins
          ).getTime();
          let alarmSetTime;
          if (reqTime > curTime) {
            alarmSetTime = reqTime;
          } else {
            alarmSetTime = reqTime + 1000 * 60 * 60 * 24;
          }
          let alarmNote = alarmNoteInput.value.trim();
          let alarmStatus = existingAlarms.find((alarm) => {
            return alarm.alarmId == editAlarmId;
          }).alarmStatus;

          let sameAlarmExistance = existingAlarms.filter((alarm) => {
            return alarm.alarmSetTime == alarmSetTime;
          });
          let isTheAlarm = sameAlarmExistance.filter((alarm) => {
            return alarm.alarmId == Number(editAlarmId);
          });

          if (sameAlarmExistance.length === 0 || isTheAlarm.length !== 0) {
            // Add New Alarm To Local Storage
            let finalAlarmData = {
              alarmId: Number(editAlarmId),
              alarmTime,
              alarmExt,
              alarmSetTime,
              alarmNote,
              alarmStatus,
              ringtoneName,
              ringtonePath,
            };
            let updatedAlarmData = [];
            existingAlarms.forEach((alarm) => {
              if (alarm.alarmId != editAlarmId) {
                updatedAlarmData.push(alarm);
              } else {
                updatedAlarmData.push(finalAlarmData);
              }
            });

            localStorage.setItem("alarms", JSON.stringify(updatedAlarmData));
            alarmEventContainer.setAttribute("data-edit-alarm-id", "");
            alarmEventContainer.classList.remove("showAlarmEventContainer");
            alarmNoteInput.value = "";
            ringtones[0].checked = true;
            activeAlarm();
            displayAlarms(alarmContainer, localStorage.getItem("alarms"));
          } else {
            alert("Same Alarm Exists");
            alarmEventContainer.setAttribute("data-edit-alarm-id", "");
            alarmEventContainer.classList.remove("showAlarmEventContainer");
            alarmNoteInput.value = "";
            ringtones[0].checked = true;
            activeAlarm();
            displayAlarms(alarmContainer, localStorage.getItem("alarms"));
          }
        } else {
          alert("Enter A Valid Time");
        }
      } else {
        let ringtoneName;
        let ringtonePath;
        ringtones.forEach((ringtone) => {
          if (ringtone.checked) {
            ringtoneName = ringtone.getAttribute("data-song-name");
            ringtonePath = ringtone.value;
          }
        });
        let alarmTime = timeInput.value;

        if (alarmTime.trim() !== "") {
          let hour = alarmTime.split(":")[0];
          let mins = alarmTime.split(":")[1];
          let alarmExt = hour < 12 ? "AM" : "PM";
          let curTime = Date.now();
          let alarmYear = new Date().getFullYear();
          let alarmMonth = new Date().getMonth();
          let alarmDate = new Date().getDate();
          let reqTime = new Date(
            alarmYear,
            alarmMonth,
            alarmDate,
            hour,
            mins
          ).getTime();
          let alarmSetTime;
          if (reqTime > curTime) {
            alarmSetTime = reqTime;
          } else {
            alarmSetTime = reqTime + 1000 * 60 * 60 * 24;
          }
          let alarmNote = alarmNoteInput.value.trim();

          let sameAlarmExistance = existingAlarms.filter((alarm) => {
            return alarm.alarmSetTime == alarmSetTime;
          });

          if (sameAlarmExistance.length == 0) {
            let finalAlarmData = {
              alarmId: existingAlarms[existingAlarms.length - 1].alarmId + 1,
              alarmTime,
              alarmExt,
              alarmSetTime,
              alarmNote,
              alarmStatus: true,
              ringtoneName,
              ringtonePath,
            };
            let allAlarms = [...existingAlarms, finalAlarmData];
            localStorage.setItem("alarms", JSON.stringify(allAlarms));
            alarmEventContainer.setAttribute("data-edit-alarm-id", "");
            alarmEventContainer.classList.remove("showAlarmEventContainer");
            alarmNoteInput.value = "";
            ringtones[0].checked = true;
            activeAlarm();
            displayAlarms(alarmContainer, localStorage.getItem("alarms"));
          } else {
            alert("Same Alarm Exist");
            alarmEventContainer.setAttribute("data-edit-alarm-id", "");
            alarmEventContainer.classList.remove("showAlarmEventContainer");
            alarmNoteInput.value = "";
            ringtones[0].checked = true;
            activeAlarm();
            displayAlarms(alarmContainer, localStorage.getItem("alarms"));
          }
        } else {
          alert("Enter A Valid Time");
        }
      }
    }
  });

  // Display Alarms Function
  function displayAlarms(alarmContainer, alarmsData) {
    let alarms = JSON.parse(alarmsData);
    let uniqueAlarms = [];
    let seenIds = [];
    if (alarms) {
      alarms.forEach((alarm) => {
        if (!seenIds.includes(alarm.alarmId)) {
          uniqueAlarms.push(alarm);
          seenIds.push(alarm.alarmId);
        }
      });
    }

    if (uniqueAlarms.length == 0) {
      localStorage.removeItem("alarms");
    } else {
      localStorage.setItem("alarms", JSON.stringify(uniqueAlarms));
    }

    let alarmHTML = "";

    uniqueAlarms.forEach(
      ({ alarmId, alarmTime, alarmExt, alarmStatus, alarmNote }) => {
        alarmHTML += `<div class="alarm" data-alarm-id=${alarmId}>
          <div class="leftContent">
            <div class="leftTop">
              <h1>${
                alarmTime.split(":")[0] > 12
                  ? alarmTime.split(":")[0] - 12
                  : alarmTime.split(":")[0]
              }:${alarmTime.split(":")[1]}</h1>
              <h5>${alarmExt}</h5>
            </div>
            <div class="leftBottom">
              <p>Ring once</p>
              ${alarmNote !== "" ? `<p>| ${alarmNote}</p>` : ""}
            </div>
          </div>
          <input class="checkbox" type="checkbox" name="onOffData" id="onOffData${alarmId}" ${
          alarmStatus ? "checked" : ""
        } />
          <label for="onOffData${alarmId}"
            ><div class="rightContent">
              <div class="button ${
                alarmStatus ? "buttonActive" : ""
              }" data-alarm-id=${alarmId}>
                <div class="buttonDot ${alarmStatus ? "dotActive" : ""}"></div>
              </div>
            </div>
          </label>
        </div>`;
      }
    );
    alarmContainer.innerHTML =
      alarmHTML +
      `<div class="noAlarm">
          <img src="./Assets/NoAlarm.svg" alt="No alarm" />
          <span>No alarms</span>
        </div>`;

    // Update Alarm Info
    let allAlarms = document.querySelectorAll(".alarm");

    allAlarms.forEach((alarm, ind) => {
      alarm.addEventListener("click", (e) => {
        let targetClassList = Array.from(e.target.classList);

        let isButton =
          targetClassList.includes("buttonDot") ||
          targetClassList.includes("button") ||
          targetClassList.includes("checkbox");

        if (!isButton) {
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
          alarmEventContainer.setAttribute(
            "data-edit-alarm-id",
            alarms[ind].alarmId
          );

          alarmEventContainer.classList.add("showAlarmEventContainer");
        }
      });
    });

    // Alarm On/Off Updation
    let buttons = document.querySelectorAll(".button");
    let buttonDots = document.querySelectorAll(".buttonDot");
    let checkBoxes = document.querySelectorAll("input[type='checkbox']");

    buttons.forEach((val, ind) => {
      val.addEventListener("click", () => {
        alarmEventContainer.classList.remove("showAlarmEventContainer");
        buttons[ind].classList.toggle("buttonActive");
        buttonDots[ind].classList.toggle("dotActive");
        let buttonStatus = !checkBoxes[ind].checked;
        let alarmId = val.getAttribute("data-alarm-id");
        let updatedAlarms = [];
        let alarms = JSON.parse(localStorage.getItem("alarms"));
        if (alarms) {
          alarms.forEach((alarm) => {
            if (alarm.alarmId == alarmId) {
              alarm.alarmStatus = buttonStatus;
            }
            updatedAlarms.push(alarm);
          });
          localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
        }
      });
    });
  }

  // Alarm Handler
  var alarmInterval;
  const popUp = document.querySelector(".alarmPopUp");
  let audio = new Audio();
  audio.loop = true;

  function alarmHandler() {
    let alarmsData = localStorage.getItem("alarms");
    if (alarmsData) {
      let activeAlarms = JSON.parse(alarmsData).filter((alarm) => {
        return alarm.alarmSetTime + 1000 * 60 > Date.now();
      });

      let onAlarms = activeAlarms.filter((alarm) => {
        return alarm.alarmStatus === true;
      });

      if (onAlarms) {
        onAlarms.forEach(async (alarm) => {
          let curHour = new Date().getHours();
          let curMins = new Date().getMinutes();
          let curYear = new Date().getFullYear();
          let curMonth = new Date().getMonth();
          let curDate = new Date().getDate();
          let alarmHour = new Date(alarm.alarmSetTime).getHours();
          let alarmMins = new Date(alarm.alarmSetTime).getMinutes();
          let alarmYear = new Date(alarm.alarmSetTime).getFullYear();
          let alarmMonth = new Date(alarm.alarmSetTime).getMonth();
          let alarmDate = new Date(alarm.alarmSetTime).getDate();
          let months = [
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
          let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          let alarmDay = new Date(alarm.alarmSetTime).getDay();

          if (
            curYear == alarmYear &&
            curMonth == alarmMonth &&
            curDate == alarmDate &&
            curHour == alarmHour &&
            curMins == alarmMins
          ) {
            clearInterval(alarmInterval);
            audio.src = alarm.ringtonePath;
            audio.play();
            popUp.classList.add("alarmPopUpShow");

            // Updating PopUp Values
            let popUpHourMins = document.querySelector(".popUpHourMins");
            let popUpDayInfo = document.querySelector(".popUpDayInfo");
            let popUpAlarmNote = document.querySelector(".popUpAlarmNote");

            popUpHourMins.textContent = `${
              alarmHour > 12 ? alarmHour - 12 : alarmHour
            }:${alarmMins < 10 ? "0" + alarmMins : alarmMins}`;
            popUpDayInfo.textContent = `${days[alarmDay]}, ${alarmDate} ${months[alarmMonth]}`;
            popUpAlarmNote.textContent = alarm.alarmNote;

            setTimeout(() => {
              audio.pause();
              popUp.classList.remove("alarmPopUpShow");
              let activeAlarms = JSON.parse(alarmsData).filter((alarm) => {
                return alarm.alarmSetTime + 1000 * 60 > Date.now();
              });

              if (activeAlarms.length === 0) {
                localStorage.removeItem("alarms");
              } else {
                localStorage.setItem("alarms", JSON.stringify(activeAlarms));
              }
              alarmsData = localStorage.getItem("alarms");
              if (alarmsData == null) {
                alarmContainer.innerHTML = `<div class="noAlarm noAlarmShow">
                                            <img src="./Assets/NoAlarm.svg" alt="No alarm" />
                                            <span>No alarms</span>
                                          </div>`;
              } else {
                displayAlarms(alarmContainer, localStorage.getItem("alarms"));
              }
              alarmInterval = setInterval(alarmHandler, 1000);
            }, 60000);
          }
        });
      }
    }
  }

  // Alarm Active
  function activeAlarm() {
    clearInterval(alarmInterval);
    alarmInterval = setInterval(alarmHandler, 1000);
  }

  // Stop Alarm
  const alarmStopBtn = document.querySelector(".alarmStop");
  alarmStopBtn.addEventListener("click", () => {
    audio.pause();
    popUp.classList.remove("alarmPopUpShow");

    // Updating PopUp Values

    document.querySelector(".popUpHourMins").value = "";
    document.querySelector(".popUpDayInfo").value = "";
    document.querySelector(".popUpAlarmNote").value = "";

    let alarmsData = localStorage.getItem("alarms");
    let activeAlarms = JSON.parse(alarmsData).filter((alarm) => {
      return alarm.alarmSetTime > Date.now();
    });

    if (activeAlarms.length === 0) {
      localStorage.removeItem("alarms");
    } else {
      localStorage.setItem("alarms", JSON.stringify(activeAlarms));
    }
    alarmsData = localStorage.getItem("alarms");

    if (alarmsData == null) {
      alarmContainer.innerHTML = `<div class="noAlarm noAlarmShow">
                                            <img src="./Assets/NoAlarm.svg" alt="No alarm" />
                                            <span>No alarms</span>
                                          </div>`;
    } else {
      displayAlarms(alarmContainer, localStorage.getItem("alarms"));
    }
  });

  // Pause Remaining Audios
  function pausePrevAudio() {
    if (ringtoneAudio !== undefined) {
      ringtoneAudio.pause();
    }
  }
}
