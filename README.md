### Requirements
- Java 21+
- Node.js 20+
- npm
- Maven

### Setup
- Run `cd frontend`
- Run `npm i`
- Run `npm run start:pwa`
- Open the browser at `http://localhost:1291` and install the PWA (install button should pop up in browser, or press the 3 dots and select install)
- Copy the path to the PWA shortcut and set it as the DAYBOARD_APP_PATH environment variable
- Run `cd ../backend`
- Run `mvn clean package`
- Run the backend jar with `java -jar target/DayboardAPI-0.0.1-SNAPSHOT.jar`

Optionally, set GMAIL_USER and GMAIL_PASS environment variables to enable fetching emails. If you want to filter the emails displayed, look at the file `backend\src\main\resources\gmailFlags.example.txt` for setup.

You can also set DAYBOARD_OPEN_URL to open a specific URL along with the PWA. This can be used to open up your email inbox if you prefer that.

### Info

Running the backend jar will start the backend, which opens the frontend PWA, letting it load all data and make API requests, and then the server will close after 1 minute to preserve memory. This can be adjusted with the AUTOKILL_DELAY_MS environment variable. Set it to 0 to disable autokill.

The frontend PWA has offline mode, which will store all events locally and queue API requests until the backend is started again. This lets you use the app without the overhead of the backend running all the time.

To use this as a daily dashboard, set the server to start with a daily job like cron or Windows Task Scheduler.