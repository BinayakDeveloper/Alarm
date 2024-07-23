let buttons = document.querySelectorAll(".button");
let buttonDots = document.querySelectorAll(".buttonDot");
let checkBoxes = document.querySelectorAll("input[type='checkbox']");

buttons.forEach((val, ind) => {
  val.addEventListener("click", () => {
    buttons[ind].classList.toggle("buttonActive");
    buttonDots[ind].classList.toggle("dotActive");
  });
});
