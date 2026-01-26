### Setup
- Run `npm i` in the frontend dir
- Run `npm start`
- Open the browser at `http://localhost:4200` and install the PWA
- Copy the path to the PWA shortcut and set it as the DAYBOARD_APP_PATH environment variable
- Run `mvn clean package` in the backend dir
- Run the backend jar with `java -jar target/DayboardAPI-0.0.1-SNAPSHOT.jar`

### Info

That will start the backend, which opens the frontend PWA, letting it load all data and make API requests, and then the server will close after 1 minute to preserve memory. This can be adjusted with the AUTOKILL_DELAY_MS environment variable. Set it to 0 to disable autokill.

The frontend PWA has offline mode, which will store all events locally and queue API requests until the backend is started again. This lets you use the app without the overhead of the backend running all the time.

To use this as a daily dashboard, set the server to start with a daily job like cron or Windows Task Scheduler.