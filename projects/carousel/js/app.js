var main = function () {
  "use strict";

  const CAROUSEL = document.querySelector(".carousel-wrap");
  let tranZ = 277;
  let rotY = 0;

  function handleClickNext() {
    rotY -= 60;

    CAROUSEL.style["-webkit-transform"] =
      "translateZ(-" + tranZ + "px) rotateY(" + rotY + "deg)";

    let selectedCard = document.querySelector(".selected");
    selectedCard.classList.remove("selected");

    const nextCard = selectedCard.nextElementSibling;

    if (nextCard) {
      nextCard.classList.add("selected");
    } else {
      document
        .querySelector(".card-wrap:first-child")
        .classList.add("selected");
    }
  }

  function handleClickPrevious() {
    rotY += 60;

    CAROUSEL.style["-webkit-transform"] =
      "translateZ(-" + tranZ + "px) rotateY(" + rotY + "deg)";

    let selectedCard = document.querySelector(".selected");
    selectedCard.classList.remove("selected");

    const previousCard = selectedCard.previousElementSibling;

    if (previousCard) {
      previousCard.classList.add("selected");
    } else {
      document.querySelector(".card-wrap:last-child").classList.add("selected");
    }
  }

  document.querySelector("#next").addEventListener("click", handleClickNext);

  document
    .querySelector("#previous")
    .addEventListener("click", handleClickPrevious);

  document.querySelector("#flip").addEventListener("mouseenter", () => {
    document.querySelector("#flip i").classList.add("fa-spin");
  });

  document.querySelector("#flip").addEventListener("mouseleave", () => {
    document.querySelector("#flip i").classList.remove("fa-spin");
  });

  document.querySelector("#flip").addEventListener("click", function () {
    const selectedCard = document.querySelector(".selected > .inner-card-wrap");

    if (selectedCard.classList.contains("flipped")) {
      selectedCard.style["-webkit-transform"] = "rotateY(0)";
    } else {
      selectedCard.style["-webkit-transform"] = "rotateY(180deg)";
    }

    selectedCard.classList.toggle("flipped");
  });
};

main();
