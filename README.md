# Java Mastery

A Java learning website with a React frontend and Spring Boot backend. Student accounts, sign-ins, quiz results, bookmarks, and completed topics are stored in MySQL. The website uses the backend API; it does not save these records in browser storage.

## Install once

1. Install **MySQL Server 8.4 LTS** from the [official MySQL Server downloads](https://dev.mysql.com/downloads/mysql/). During setup, use the MySQL Configurator, keep port `3306`, set a root password you can remember, and install MySQL as a Windows service.
2. Install **MySQL Workbench** from the [official Workbench downloads](https://dev.mysql.com/downloads/workbench/).
3. Install **Apache Maven 3.9.16** from the [official Maven download page](https://maven.apache.org/download.cgi). Extract the binary ZIP (for example, to `C:\tools\apache-maven-3.9.16`), then add its `bin` folder to your Windows user `Path`. Open a new Command Prompt and check `mvn -version`.
4. Confirm `java -version` shows Java 17 or newer and `node -v` / `npm -v` work. Java and Node are needed to run the backend and frontend.

## Create the MySQL database

1. Open MySQL Workbench and connect to the local MySQL server (`localhost`, port `3306`, user `root`, and the root password you chose during setup).
2. Open a SQL tab and run:

   ```sql
   CREATE DATABASE java_mastery CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   ```

3. The Spring Boot app creates the four app tables the first time it starts: `app_user`, `login_event`, `quiz_result`, and `learning_record`.

## Start the backend

Open Command Prompt in the project's `backend` folder and enter:

```bat
set DB_URL=jdbc:mysql://localhost:3306/java_mastery?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
set DB_USERNAME=root
set /p DB_PASSWORD=Enter your MySQL root password:
set JAVA_MASTERY_ADMIN_ID=Charan
set /p JAVA_MASTERY_ADMIN_PASSWORD=Enter your admin password:
mvn spring-boot:run
```

Leave this window open. If your MySQL username is not `root`, change `DB_USERNAME` to the account you created. Both passwords are entered in this Command Prompt and are not saved in the project files.

## Start the website

Open a second Command Prompt in the project's `frontend` folder:

```bat
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`. Register or sign in and complete a quiz to create records in MySQL.

## View the website data in MySQL Workbench

In Workbench, open the `java_mastery` schema, expand **Tables**, then right-click a table and choose **Select Rows**. Or run these queries in a SQL tab:

```sql
USE java_mastery;
SELECT id, full_name, email, created_at FROM app_user;
SELECT id, user_id, email, logged_at FROM login_event ORDER BY logged_at DESC;
SELECT user_email, topic_title, score, total_questions, attempted_at
FROM quiz_result ORDER BY attempted_at DESC;
SELECT user_id, completed_topic_ids, bookmarked_topic_ids FROM learning_record;
```

Passwords are stored as salted hashes, not plain text. Older accounts and scores from the browser-only version are not automatically copied into MySQL; create the account once in this version. Deleting a user from the admin page removes their associated sign-ins, quiz scores, and learning progress.

This is a local learning project. The admin/session setup is not designed for a public internet deployment.
