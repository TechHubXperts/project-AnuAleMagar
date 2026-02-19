# Phonebook backend only App

A backend only phonebook app for listing numbers using express and nodejs

## Project Structure

```
phonebook-app/
├── backend/          # Node.js backend API
│   ├── src/          # Backend source code
│   ├── tests/        # Backend tests
│   └── package.json  # Backend dependencies

```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`

## Milestone 1: BACKEND

Build a RESTful API backend for the phonebook application using Node.js. All data will be stored in-memory (no database).

### Tasks

#### Task 1: Get All Phone Numbers

**Objective:** Implement an API endpoint to retrieve all phonebook entries.

**Requirements:**

- Create GET endpoint `/api/phonebook`
- Return all phonebook entries as JSON array
- Each entry should have: id, name, phoneNumber, createdAt, updatedAt (email is optional)
- Handle empty state (return empty array)

**API Endpoint:** `GET /api/phonebook`

**Test File:** `backend/tests/task1-get-phonebook-list.test.js`

#### Task 2: Add Phone Number

**Objective:** Implement an API endpoint to add a phonebook entry.

**Requirements:**

- Create POST endpoint `/api/phonebook`
- Accept JSON body with: name (required), phoneNumber (required), email (optional)
- Generate unique ID and timestamps (createdAt, updatedAt)
- Return created phonebook entry object
- Validate required fields (name and phoneNumber are required)
- Return 400 status code when required fields are missing

**API Endpoint:** `POST /api/phonebook`

**Request Body:**

```json
{
  "name": "John Doe",
  "phoneNumber": "+1-555-1234",
  "email": "john@example.com"
}
```

**Test File:** `backend/tests/task2-add-phone-number.test.js`

#### Task 3: Update, Delete, and Get Individual Phone Number

**Objective:** Implement API endpoints to get, update, and delete individual phonebook entries.

**Requirements:**

- Create GET endpoint `/api/phonebook/:id` to retrieve a single phonebook entry
- Create PUT endpoint `/api/phonebook/:id` to update a phonebook entry
- Create DELETE endpoint `/api/phonebook/:id` to delete a phonebook entry
- Return 404 status code when entry is not found
- For PUT: Validate required fields (name and phoneNumber are required), return 400 if missing
- For PUT: Update the updatedAt timestamp
- For DELETE: Return success message and verify entry is deleted

**API Endpoints:**
- `GET /api/phonebook/:id` - Get individual phonebook entry
- `PUT /api/phonebook/:id` - Update phonebook entry
- `DELETE /api/phonebook/:id` - Delete phonebook entry

**PUT Request Body:**

```json
{
  "name": "Updated Name",
  "phoneNumber": "+1-555-9999",
  "email": "updated@example.com"
}
```

**Test File:** `backend/tests/task3-update-delete-phone-number.test.js`

### Testing Milestone 1

**Backend Unit Tests:**

```bash
cd backend
npm test
```

Run tests for specific task (single test file only):

```bash
# Work on Task 1 (GET /api/phonebook) → Run:
npm run test:single tests/task1-get-phonebook-list.test.js

# Work on Task 2 (POST /api/phonebook) → Run:
npm run test:single tests/task2-add-phone-number.test.js

# Work on Task 3 (GET/PUT/DELETE /api/phonebook/:id) → Run:
npm run test:single tests/task3-update-delete-phone-number.test.js
```

**Important:**

- Use `npm run test:single` for individual test files (runs only that file)
- Do NOT use `npm test --` as it runs ALL test files
- Each test file only tests its specific endpoint as indicated by the filename
- Make sure the backend server is running (`npm run dev`) before running the tests, as they make HTTP requests to `http://localhost:3000`

**Alternative:** You can also use the direct node command:

```bash
node --test tests/task1-get-phonebook-list.test.js
```
