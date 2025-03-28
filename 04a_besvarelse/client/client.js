const eventSource = new EventSource("/timesync"); // parameter matcher navnet på endpoint

eventSource.addEventListener("message", (event) => {
    console.log(event.data);
});