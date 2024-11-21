# timetracker-test - Timetracker Test Application

A web-based time-tracking test application designed to help users manage tasks, projects, tags, and logs efficiently. The application leverages a clean UI and centralized shared state management, while also providing database functionalities using IndexedDB.

---

## Features

- **Time Logs:** View, Add, edit and delete time logs (tasks).
- **Projects, Tags, and Users:** Associate time logs with projects, tags, and users for better organization.
- **Filters:** Dynamic filtering of tasks by title, description, single date or range, projects, tags, and users.
- **Charts:** Visualize time spent on tasks, projects, tags, and users using charts.

- **Views:** 
  - Daily (Timetracker) View: Allows users to log their daily tasks and navigate seamlessly between previous and next days.
  - Reports View: Provides advanced filtering options to view and analyze tasks based on specific criteria like date, project, user, and tags.

- **Development Tools:**
  - Populate the database with sample data for testing.
  - Clear the database to reset the application state.

---

## Missing or Incomplete Features

Due to limited development time, the following features are incomplete or missing:

1. **Custom Confirmation Modal:**  
   The confirmation modal for single and bulk task deletions uses the default browser prompt instead of a custom UI.

2. **Inline Form Validation:**  
   Only ensures all fields are filled. No additional form validation checks (e.g., input constraints).

3. **Time Log Status:**  
   The ability to set and manage task statuses (e.g., "Active", "Completed") is not implemented.

4. **User Handling:**  
   The option to add time logs as a dedicated user is missing. You can use the Users dropdown to select a user.

5. **Responsive Design:**  
   While the app adapts to some screen sizes, it does not meet high responsiveness standards.

6. **Adding New Entities:**  
   Tags, projects, and users can only be added via the respective dropdowns in the form. There is no dedicated UI for managing these entities.

7. **Time Calculation Hotfix:**  
   A temporary fix is applied to handle tasks spanning multiple days (e.g., start on Day 1, end on Day 2). This might result in unintended behavior in specific cases.

8. **User Handling of Daily (Timetracker) View:**
   The Daily View was initially designed for each user to have a personalized space to manage and view their own logs, while the Reports View would allow filtering and analyzing tasks from a broader perspective, including those assigned to other users.

---

## Database Management

### Populate Sample Data
To aid in testing, the application provides a **"Pre-Populate Database with Sample Data"** button. This populates the database with:

- Example projects
- Tags
- Users
- Time logs

You must refresh the page once the function has finished successfully.

### Clear Database
If the database already contains data, you must clear it before populating with sample data. Use the **"Clear Database"** button to reset the database. This ensures a fresh start for testing or data entry.

You must refresh the page once the function has finished successfully.

---

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/almasigergo/timetracker-test
   ```
   
2. Open the project folder:
   ```sh
   cd timetracker-test
   ```

3. Install dependencies
   ```sh
   npm install
   ```

4. Run the development server
   ```sh
   npm run dev
   ```

5. Open the app in your browser
   http://localhost:5173 (it might be different for you)
