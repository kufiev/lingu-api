# LingU: Mastering Mandarin Hanzi with Machine Learning

## Endpoints

### 1. Register User

**Endpoint**: `POST /register`

**Request:**

- **Method**: POST
- **Path**: /register
- **Body**:

```json
{
  "fullName": "string"
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```
**Response:**

- **Success**:
  - `status` (string): `"success"`
  - `message` (string): `"User registered successfully"`
  - `data` (object):
    - `uid` (string): `"generated-uid"`
    - `email` (string): `"x@example.com"`
    - `fullName` (string): `"x"`

- **Failure**:
  - `status` (string): `"fail"`
  - `message` (string): `"Error message"`

### 2. Login User

**Endpoint**: `POST /login`

**Request:**

- **Method**: POST
- **Path**: /login
- **Body**:

```json
{
  "email": "string",
  "password": "string",
}
```
**Response:**

- **Success**:
  - `status` (string): `"success"`
  - `message` (string): `"User logged in successfully"`
  - `data` (object):
    - `uid` (string): `"generated-uid"`
    - `email` (string): `"x@example.com"`
    - `fullName` (string): `"x"`
    - `token` (string): `x`

- **Failure**:
  - `status` (string): `"fail"`
  - `message` (string): `"Error message"`
 
### 3. Store Prediction

**Endpoint**: `POST /predict`

**Request:**

- **Method**: POST
- **Path**: /predict
- **Headers**:

```json
{ 
  "Authorization": "Bearer <JWT_TOKEN>", 
}
```

- **Body**:

```json
{
  "category": "string",
  "character": "string",
  "confidenceScore": "number",
}
```

**Response:**

- **Success**:
  - `status` (string): `"success"`
  - `message` (string): `"Data is stored successfully."`
  - `data` (object):
    - `category` (string): `"location"`
    - `character` (string): `"上"`
    - `confidenceScore` (number): `"0.93"`
      
- **Success (Update)**:
  - `status` (string): `"success"`
  - `message` (string): `"Data is updated successfully."`
  - `data` (object):
    - `category` (string): `"location"`
    - `character` (string): `"上"`
    - `confidenceScore` (number): `"0.94"`

- **Failure**:
  - `status` (string): `"fail"`
  - `message` (string): `"Error message"`

### 4. Progress

**Endpoint**: `GET /progress`

**Request:**

- **Method**: GET
- **Path**: /progress
- **Headers**:

```json
{ 
  "Authorization": "Bearer <JWT_TOKEN>", 
}
```

- **Body**: -

**Response:**

- **Success**:
  - `status` (string): `"success"`
  - `data` (object):
    - `category` (string): `"location"`
    - `completedCharacters` (number): `"6"`
    - `totalCharacters` (number): `"23"`
    - `characters` (object):
      - `character` (string): `"上"`
      - `confidenceScore` (number): `"0.93"`
    - `"percentCompleted"` (number): `"26.09"`
    - `"isComplete"` (boolean): `"false"`

- **Failure**:
  - `status` (string): `"fail"`
  - `message` (string): `"Error message"`
