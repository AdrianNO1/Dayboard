### Requirements
- Java 21+
- Node.js 20+
- npm

### Setup
- Run `cd frontend`
- Run `npm i`
- Run `npm run start:pwa`
- Open the browser at `http://localhost:1291` and install the PWA (install button should pop up in browser, or press the 3 dots and select install)
- Copy the path to the PWA shortcut and add it to the `.env` file in the `backend` directory as `DAYBOARD_APP_PATH`.
- Run `cd ../backend`
- Configure the `.env` file in the `backend` directory with your settings.
- Run `.\mvnw.cmd clean package`
- Run the backend jar with `java -jar target/DayboardAPI-0.0.1-SNAPSHOT.jar`

Configuration is handled via a `.env` file. A template is available in `backend/.env.example`.
Ensure this file is present in the working directory when running the application.

Variables:
- `DAYBOARD_APP_PATH`: Path to the PWA shortcut
- `DAYBOARD_OPEN_URLS`: (Optional) Comma-separated URLs to open on launch
- `GMAIL_USER`: (Optional) Gmail address
- `GMAIL_PASS`: (Optional) Gmail App Password
- `AUTOKILL_DELAY_MS`: (Optional) Time in ms before backend shuts down (default 60000). Set to 0 to disable.
- `STORAGE_ALERT_PATH`: (Optional) Drive path to monitor for low storage (e.g. D:\)
- `STORAGE_ALERT_THRESHOLD_GB`: (Optional) Threshold in GB for storage alert (default 20)

### Info

Running the backend jar will start the backend, which opens the frontend PWA. The backend automatically shuts down after a configured delay (default 1 minute) to preserve memory, controlled by `AUTOKILL_DELAY_MS`.

**Automation:**
Use **Windows Task Scheduler** or **cron** to run this as a daily dashboard.
*Note: If using Windows Task Scheduler, ensure the "Start in" directory points to the folder containing your `.env` file.*

**Offline Mode:**
The frontend PWA works offline, caching events locally and queuing API requests until the backend runs again.