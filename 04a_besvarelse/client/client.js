// kør npx serve .

const eventSource = new EventSource("http://localhost:8080/timesync");

const container = document.getElementById("timestamps");

eventSource.addEventListener("message", (event) => {
  const newTimestamp = document.createElement("div");
  newTimestamp.textContent = event.data;
  container.appendChild(newTimestamp);
});