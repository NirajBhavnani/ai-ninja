import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

// Targeting HTML elements manually by using selector
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// function for loader before messages are typed
function loader(element) {
  element.textContent = "";

  // for dot loader implementation
  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

// implement typing functionality
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    // if we are typing
    if (index < text.length) {
      // This is going to return the character at the specific index (from response)
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      // if we reached the end of the response text
      clearInterval(interval);
    }
  }, 20);
}

// create unique id for every single message
function generateUniqueId() {
  // simplest way to create unique id in any programming language is through timestamp
  const timestamp = Date.now();

  // Make it more random
  const randomNumber = Math.random();

  // Achieve more randomness by using hexadecimal string
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// implement chatStripe i.e: Different/alternate color pattern and ai/user icon
function chatStripe(isAi, value, uniqueId) {
  return `
      <div class="wrapper ${isAi && "ai"}>
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? "bot" : "user"}"
            />
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `;
}

// create handleSubmit function to get the response from AI
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // Keep scrolling down to see the message
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  // turn on the loader
  loader(messageDiv);
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  // enter key
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
