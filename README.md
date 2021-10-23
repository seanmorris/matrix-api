# Matrix API

Matrix API. 100% frontend.

https://curvature.seanmorr.is/matrix-api

## Install:

```html
<script src = "https://unpkg.com/curvature@0.0.66-q/dist/curvature.js"></script>
<script src = "https://unpkg.com/matrix-api@0.0.0-d/dist/matrix-api.js"></script>
```

```html
<script src = "https://unpkg.com/matrix-api@0.0.0-d/dist/matrix-api.standalone.js"></script>
```

## Usage:

### Step 1:

Set up a page that can serve as your redirect target.
This page will post a message back to its opener when the login flow completes, and then it will close.

```javascript
// Under /accept-sso

const baseUrl = 'https://matrix.org/_matrix';
const matrix  = new Matrix(baseUrl);

const loginToken = '...'; // Get the loginToken from the query string.

matrix.completeSso(loginToken);
```

### Step 2:

In your main application, initialize a Matrix object with the same baseUrl. Log in and listen for events:

```javascript
// In your main application

// Connect to your Matrix endpoint:
const baseUrl = 'https://matrix.org/_matrix';
const matrix  = new Matrix(baseUrl);

// Open the login popup, targetting the url from the first step:
const redirectUrl = location.origin + '/accept-sso';
matrix.initSso(redirectUrl);

// ... and wait or the user to log in:
matrix.addEventListener('logged-in', event => console.log('Logged in!', event));

// Listen for events of only one type:
matrix.addEventListener('m.room.message', event => console.log('Message:', event));

// Listen for ALL events from the server:
matrix.addEventListener('matrix-event', event => console.log('Event:', event));
```

### Step 3:

Join a room:

```javascript
// Send a message:

const roomId  = 'ROOM_ID_HERE';

// You'll receive a promise that will complete
// when the server responds:

matrix.joinRoom(roomId)
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Step 4:

Send messages to a room:

```javascript
// Send a message:

const roomId  = 'ROOM_ID_HERE';
const msgtype = 'm.text';
const body    = 'message body...';
const message = {msgtype, body};

// You'll receive a promise that will complete
// when the server responds:

matrix.putEvent(roomId, 'm.room.message', message)
.then(response => console.log(response))
.catch(error => console.error(error));
```
