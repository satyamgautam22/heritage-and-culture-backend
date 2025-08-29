# Heritage and Culture Backend

This project is a Node.js/Express backend for user authentication, file uploads (images/videos), project management, and geolocation services.

## Features

- **Register**: Create a new user account with OTP email verification.
- **Login**: Authenticate users with JWT and OTP.
- **Upload**: Upload images and videos to ImageKit cloud storage.
- **Project Management**: Create, update, delete, and fetch projects.
- **Geolocation**: (Planned) Enable location services for users.

## API Endpoints

### 1. Register

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Registers a new user and sends OTP to email.
- **Body Parameters:**
  - `name`: string
  - `email`: string
  - `password`: string

### 2. Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and verifies OTP.
- **Body Parameters:**
  - `email`: string
  - `password`: string
  - `otp`: string

### 3. Upload Image

- **URL:** `/api/data/uploadimage`
- **Method:** `POST`
- **Description:** Uploads an image file.
- **Body Parameters:**
  - `image`: multipart/form-data

### 4. Upload Video

- **URL:** `/api/data/uploadvideo`
- **Method:** `POST`
- **Description:** Uploads a video file.
- **Body Parameters:**
  - `video`: multipart/form-data

### 5. Fetch Cloud Media

- **URL:** `/api/data/fetch`
- **Method:** `GET`
- **Description:** Fetches uploaded media files.
- **Query Parameters:**
  - `type`: `image` | `video` | `all` (default: `image`)
  - `limit`: number (default: 10)

### 6. Upload project title and description 
 - **URL:** `/api/project/create-project`
- **Method:** `POST`
- **Description:** Upload project title and description


## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/satyamgautam22/heritageandculture
    cd heritage-and-culture-backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file with your environment variables (MongoDB URI, JWT secret, SMTP, ImageKit keys,Map key ,Happyface ai).
4. Start the server:
    ```bash
    npm run dev
    ```

## License

This project is licensed under the MIT License."heritageandculture" 
"# Heritage-and-culture" 
