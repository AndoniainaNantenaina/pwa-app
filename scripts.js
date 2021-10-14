const API_ROOT = "https://reqres.in/api/";
const nbMaxAttendees = 30;

document.addEventListener("DOMContentLoaded", () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
		  .register("sw.js")
		  .then(serviceWorker => {
			console.log("Service Worker registered: ", serviceWorker);
		  })
		  .catch(error => {
			console.error("Error registering the Service Worker: ", error);
		  });
	}
});

