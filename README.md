# seanmorris/matrix-api

![avatar](https://avatars3.githubusercontent.com/u/640101?s=80&v=4)

## npm install matrix-api

`v0.0.0 - early αlphα`

Matrix API. 100% frontend.

## Issue Tracker

Please report any and all bugs to [the GitHub issue tracker](https://github.com/seanmorris/matrix-api/issues).

## Install:

Only one install method is required. (npm, cdn, or download).

### npm

Install `matrix-api` with the npm package manager.

**This is the recommended install method.**

#### 1) First, Install with NPM:

```bash
$ npm install matrix-api
```

#### 2) Then, `import` or `require` the module in your javascript:

```javascript
import { Matrix } from 'matrix-api/Matrix';
```
or

```javascript
const Matrix = require('matrix-api/Matrix').Matrix;
```

### CDN

If npm isn't an option, `matrix-api` can be included from a CDN.

You can include both the `matrix-api` and its dependency, the `curvature` library with the following script tags:

```html
<script src = "https://unpkg.com/curvature/dist/curvature.js"></script>
<script src = "https://unpkg.com/matrix-api/dist/matrix-api.js"></script>
```

You can also include only the parts of `curvature` needed to run `matrix api` with `matrix-api.standalone.js`:

```html
<script src = "https://unpkg.com/matrix-api/dist/matrix-api.standalone.js"></script>
```

Then `require` the module in your javascript:
```javascript
const Matrix = require('matrix-api/Matrix').Matrix;
```

**curvature is not required if the standalone build is used.**

### Download

If you'd prefer to host the files yourself, `matrix-api` can be included from your own server, or your own CDN.

Both [matrix-api.js](https://unpkg.com/matrix-api/dist/matrix-api.js) and
[matrix-api.standalone.js](https://unpkg.com/matrix-api/dist/matrix-api.standalone.js) can be downloaded from the following page:

https://unpkg.com/browse/matrix-api/dist/

Either one of the files can be served by any static HTTP server and used in the browser.

[Curvature](https://unpkg.com/curvature/dist/curvature.js) is available from:
https://unpkg.com/browse/curvature/dist/

**curvature is not required if the standalone build is used.**

Import the scripts from your own server:

```html
<script src = "https://YOUR-SERVER/js/curvature.js"></script>
<script src = "https://YOUR-SERVER/js/matrix-api.js"></script>
```
or

```html
<script src = "https://YOUR-SERVER/js/matrix-api.standalone.js"></script>
```

Then `require` the module in your javascript:
```javascript
const Matrix = require('matrix-api/Matrix').Matrix;
```

## Usage:

### Step 1: Set up a Redirect Target

Set up a page that can serve as your redirect target. When the login flow completes, this is the last page that will load in the popup window.

It will post a message back to its opener when the login flow completes, and then it will close.

```javascript
// On a page served from /accept-sso

const baseUrl = 'https://matrix.org/_matrix';
const matrix  = new Matrix(baseUrl);

// Get the loginToken from the query string.
const query = new URLSearchParams(location.search);
const token = query.get('loginToken');

// Complete the SSO and close the window.
matrix.completeSso(token);
```

### Step 2: Open the Login Popup

In your main application, initialize a Matrix object.

You can then start the login flow and listen for events:

```javascript
// In your main application

// Connect to your Matrix endpoint:
const baseUrl = 'https://matrix.org/_matrix';
const matrix  = new Matrix(baseUrl);

// Open the login popup, targetting the url from the first step:
const redirectUrl = location.origin + '/accept-sso';
matrix.initSso(redirectUrl);

// ... and wait for the user to log in:
matrix.addEventListener('logged-in', event => {

	console.log('Logged in!', event);
	
	// Start polling the server
	matrix.listenForServerEvents();

	// Act on events of only one type:
	matrix.addEventListener('m.room.message', event => console.log('Message:', event));

	// Act on events of another type:
	matrix.addEventListener('m.reaction', event => console.log('Reaction:', event));

	// Act on ALL events from the server:
	matrix.addEventListener('matrix-event', event => console.log('Event:', event));

});

```

### Step 3: Join a Room

Once you're logged in, you can then join a room. A room is a shared event stream that multiple users can read and contribute to.

You'll receive a promise that will complete when the server responds.

```javascript
const roomId  = 'ROOM_ID_HERE';

matrix.joinRoom(roomId)
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Step 4: Listen for Events

The matrix object is an event target, meaning you can listen for events. Listen for the matrix-event type to get all messages:

matrix.addEventListener('matrix-event', event => console.log(event.detail.type, event));

You can also provide an event type to only grab messages of a certain type:

```javascript

matrix.addEventListener('m.room.message', event => console.log(event.detail.type, event));
matrix.addEventListener('app.custom.type', event => console.log(event.detail.type, event));
```

### Step 4a: Sync the room history:

You can also look for events in the past, optionally within a window of time.

* roomId - The id of the room in question
* callback - Callback to run on each message.
* to - Stop the sync if a message older than this date is found.
* from - Chunk id to resume the sync from.
* filter - Matrix filter. JSON format.

Example:

```javascript
const sync = matrix.syncRoomHistory(
	this.args.roomId
	, message => console.log(message)
	, Date.now() - (7 * 24 * 60 * 60 * 1000)
	, null
	, { types: ['message.type.one', 'message.type.two', 'message.type.three'] }
);
```

### Step 5: Send a Message

Once you've joined one or more rooms, you can send messages to them:

This will also a return promise. It will resolve when the HTTP request completes.

```javascript
const roomId  = 'ROOM_ID_HERE';
const evttype = 'm.room.message';

const msgtype = 'm.text';
const body    = 'message body...';
const message = {msgtype, body};

matrix.putEvent(roomId, evttype, message)
.then(response => console.log(response))
.catch(error => console.error(error));
```

## Methods

### `new Matrix(baseUrl, options)`

Create a new connection to a Matrix server.

* baseUrl - The endpoint of the Matrix server.
* options - An object with the following keys to set options for the session
    * interval - Length of pause time between sync requests. Defaults to `false`, equivalent to `0`.
    * storage - Object that implements the StorageApi. Defaults to `globalThis.sessionStorage`

```javascript
const matrix = new Matrix(baseUrl, {interval, storage});
```

### matrix.initSso(redirectUri, windowRef = window)

Starts the 'Single Sign On' login flow with the matrix server. The login flow will open in a popup, allow the user to sign in, and finally. redirect to `redirectUri` with the token in the `loginToken` field of the URL's search parameters when complete.

* redirectUri - The redirect target URI
* windowRef   - The window reference

```javascript
// Connect to your Matrix endpoint:
const baseUrl = 'https://matrix.org/_matrix';
const matrix  = new Matrix(baseUrl);

// Open the login popup, targetting the url from the first step:
const redirectUrl = location.origin + '/accept-sso';
matrix.initSso(redirectUrl);
```

### matrix.completeSso(loginToken)

Meant to be called in the popup, on the last page of the SSO login flow, after the matrix server has redirected the user back to the `redirectUri` passed into `matrix.initSso()`.

Will post a message event back to its own `window.opener`, targetting the current origin, and automatically close the popup.

* loginToken - The loginToken from the URL search params.

```javascript
const baseUrl = 'https://matrix.org/_matrix';
const matrix  = new Matrix(baseUrl);

// Get the loginToken from the query string.
const query = new URLSearchParams(location.search);
const token = query.get('loginToken');

// Complete the SSO and close the window.
matrix.completeSso(token);
```

### matrix.getGuestToken() *async*

Get a login token suitable for guest-level access.

Returns a promise.

```javascript
matrix.getGuestToken().then(token => console.log(token));
```

### matrix.getToken() *async*

Get the login token associated with the current user's session.

Returns a promise.

```javascript
matrix.getToken().then(token => console.log(token));
```

### matrix.getUserProfile(userId) *async*

Get the profile for a user, given a userId.

* userId - The matrix-id of the user in question.

Returns a promise.

```javascript
matrix.getUserProfile(userId).then(profile => console.log(profile));
```

### matrix.getUserData(key) *async*

Get a chunk of privately accessible data assciated with the current user.

* key - The key associated with the chunk of data.

Returns a promise.

```javascript
const key  = 'foobar';
matrix.getUserData(key).then(data => console.log(data));
```

### matrix.putUserData(key, body) *async*

Store a chunk of privately accessible data assciated with the current user on the server.

* key  - The key associated with the chunk of data.
* body - The data to store at the given key.

Returns a promise.

```javascript
const key  = 'foobar';
const body = 'Hello, World!'

matrix.putUserData(key, body).then(response => console.log(response));
```

### matrix.getMediaUrl(mxcUrl) *string*

Translate an MXCURL to an HTTP-accessible URL for a given media resource.

* mxcUrl - The MXCURL associated with the given media resource.

Returns a string.

```javascript
const mediaUrl = matrix.getMediaUrl(mxcUrl);
```

### matrix.getMedia(mxcUrl) *async*

Download a given media resource and return an ObjectUrl that can be used in HTML.

* mxcUrl - The MXCURL associated with the given media resource.

Returns a promise.

```javascript
matrix.getMedia(mxcUrl).then(objectUrl => {

	const img = document.createElement('img');

	img.src = objectUrl;

	document.body.appendChild(img);

});
```

### matrix.postMedia(file, name)

Upload a given media resource to the server.

* file - HTML File object, like from a `file input` or a drag-n-drop event.
* name - The name of the file to use in downloads.

https://developer.mozilla.org/en-US/docs/Web/API/File

Returns a promise.

```javascript
matrix.postMedia(mxcUrl).then(response => console.log(response));
```

### matrix.putEvent(roomId, type, body) *async*

Send a message to a room.

* roomId - The id of the room in question.
* type - The event type of the message.
* body - The body of the message.

Returns a promise.

```javascript
matrix.putEvent(roomId, type, body).then(response => console.log(response));
```

### matrix.getEvent(roomId, eventId) *async*

Request message from a channel.

* roomId - The id of the room in question.
* eventId -The id of the event in question.

Returns a promise.

```javascript
matrix.getEvent(roomId, eventId).then(response => console.log(response));
```

### matrix.getRoomState(roomId) *async*

Get the current state configuration of a room.

* roomId - The id of the room in question.

Returns a promise.

```javascript
matrix.getRoomState(roomId).then(response => console.log(response));
```

### matrix.getCurrentUserId() *string|bool*

Get the id of the current user.

Returns a string or boolean `false`.

```javascript
const userId = matrix.getUserId();
```

### matrix.createRoom(name, topic, visibility, initialState = {}) *async*

Create a new room on the server.

* name - The name of the room.
* topic - The topic line of the room.
* visibility - The visibility of the room.
* initialState - The initial state values of the room.

Returns a promise.

```javascript
matrix.createRoom(name,topic,visibility,initialState)
.then(response => console.log(response));
```

### matrix.joinRoom(roomId) *async*

Join a room on the server.

* roomId - The id of the room in question.

Returns a promise.

```javascript
matrix.joinRoom(roomId).then(response => console.log(response));
```

### matrix.leaveRoom(roomId) *async*

Leave a room on the server.

* roomId - The id of the room in question

Returns a promise.

```javascript
matrix.leaveRoom(roomId).then(response => console.log(response));
```

### matrix.whoAmI()

Gets the user id for the current logged in user.

Returns a promise.

```javascript
matrix.whoAmI(roomId).then(response => console.log(response));
```

### matrix.listenForServerEvents()

Poll the server for new events. Does not return a value. Use `addEventListener` to capture events.

```javacript
matrix.listenForServerEvents();
matrix.addEventListener('matrix-event', event => console.log('Event:', event));
```

### matrix.syncRoomHistory(room, callback = null, to = false, from = null, filter = null)

Sync the event history of a given room, starting from a given chunk id and moving backward.

* roomId - The id of the room in question
* callback - Callback to run on each chunk.
* to - Stop the sync if a message older than this date is found.
* from - Chunk id to resume the sync from
* filter - Matrix filter. JSON format. Example: `{"types": ["m.room.message"]}` or for custom types: `{"types": ["message.type.one", "message.type.two"]}`

### matrix.syncRoom(room_id, from = '')

**Internal Method**

### matrix.streamServerEvents(chunkList, roomId, controller)

**Internal Method**

## Formatting and Sending Messages

### Chats: m.room-message

Normal chat messages must be formatted as such when sending to the server:

```javascript
const roomId  = 'ROOM_ID_HERE';
const body    = {
  msgtype: 'm.text'
  , body:  'THIS IS A NORMAL CHAT MESSAGE.'
};

matrix.putEvent(roomId, 'm.room.message', body);
```

### Reactions: m.reaction

Reactions to messages is a little more complicated than sending them:

```javascript
const roomId  = 'ROOM_ID_HERE';
const eventId = 'EVENT_ID_HERE';
const body    = {
	'm.relates_to':   {
		key:        '🍁'
		, rel_type: 'm.annotation'
		, event_id: eventId
	}
};

matrix.putEvent(roomId, 'm.reaction', body);
```

## Under the Hood

### Polling for Server Events

Matrix transmits events over standard HTTP requests. Meaning polling the server does just that, it opens an HTTP GET to the server and waits for an event to come in. When it does, its transmitted and the connection is closed.

The next connection is then immediately opened and the process repeated. If the connection is timed out and no events are received, the cycle is again immediately repeated.

This may look strange in your network inspector, but rest assured, it is expected behavior.

Perhaps Matrix would do well to implement a simple EventSouce endpoint:

https://developer.mozilla.org/en-US/docs/Web/API/EventSource

https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events


### Notes on Syncing

Matrix.org serves 10 events per chunk. For large sync operations, this can take some time. I see no way as of yet to optimize this.

Recommened behavior is to cache the events in an IndexedDB and store a highwater and lowwater mark. Highwater is the latest cached chunk, lowwater is the earliest.

Interupted syncs should resume from the lowwater mark since Matrix provides event records in reverse chronological order, and continue to the room's creation date.

A parallel sync can be started from the present momemnt and move backward, ending at the highwater mark.

Once each sync reaches its mark, the current store should have the 100% of the available event history of the given room.

## Contributing

### Building

You'll need a copy of NodeJS and NPM.

Files in `dist/` are built with [brunch](https://brunch.io/).

### Licensing

Changes must be licensed under the Apache-2.0 or more permissive license to be accepted.

### Philosophy

Do one thing, do it well.

### Common Decency

Tabs, not spaces.

## License

seanmorris/matrix-api

Copyright 2021 Sean Morris

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

