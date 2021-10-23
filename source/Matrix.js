import { Mixin } from 'curvature/base/Mixin';
import { EventTargetMixin } from 'curvature/mixin/EventTargetMixin';

export class Matrix extends Mixin.with(EventTargetMixin)
{
	constructor(baseUrl)
	{
		super();

		this.baseUrl   = baseUrl || 'https://matrix.org/_matrix';
		this.clientUrl = `${this.baseUrl}/client/r0`;
		this.mediaUrl  = `${this.baseUrl}/media/r0`;

		this.profileCache = new Map();
		this.mediaCache   = new Map();
	}

	get isLoggedIn()
	{
		if(sessionStorage.getItem('matrix:access-token'))
		{
			this.dispatchEvent(new CustomEvent('logged-in'));
		}

		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		return sessionStorage.getItem('matrix:access-token');
	}

	initSso(redirectUri, windowRef = window)
	{
		const path = 'login/sso/redirect?redirectUrl=' + redirectUri;

		const width  = 400;
		const height = 600;

		const left = window.screenX + (window.outerWidth / 2)  + (width / 2);
		const top  = window.screenY + (window.outerHeight / 2) - (height / 2);

		const options = `width=${width},height=${height},screenX=${left},screenY=${top}`;

		const ssoPopup = windowRef.open(
			`${this.clientUrl}/${path}`
			, 'matrix-login'
			, options
		);

		const ssoListener = event => {
			if(event.origin !== location.origin)
			{
				return;
			}

			const request = JSON.parse(event.data);

			if(request.type !== 's.sso.complete')
			{
				return;
			}

			sessionStorage.setItem('matrix:access-token', JSON.stringify(request.data));

			this.dispatchEvent(new CustomEvent('logged-in'));
		};

		windowRef.addEventListener('message', ssoListener);
	}

	completeSso(loginToken)
	{
		const path = 'login';
		const body = {
			type:"m.login.token"
			, token: loginToken
			, txn_id: (1/Math.random()).toString(36)
		};

		fetch(`${this.clientUrl}/${path}`, {method: 'POST', body: JSON.stringify(body)})
		.then(response => response.json())
		.then(response => {

			window.opener.postMessage(JSON.stringify({
				type: 's.sso.complete'
				, data: response
			}), location.origin);

			window.close();
		});
	}

	getGuestToken()
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(token && token.isGuest)
		{
			return Promise.resolve(token);
		}

		const getToken = fetch(`${this.clientUrl}/register?kind=guest`, {method:'POST', body: '{}'}).then(response=>response.json());

		getToken.then(token => {
			token.isGuest = true;
			sessionStorage.setItem('matrix:access-token', JSON.stringify(token))
		});

		return getToken;
	}

	getToken()
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(token)
		{
			return Promise.resolve(token);
		}

		return matrix.getGuestToken();
	}

	listenForServerEvents()
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const listener = `${this.clientUrl}/events?access_token=${token.access_token}`;

		fetch(listener)
		.then(response => response.json())
		.then(response => this.streamServerEvents(response));
	}

	listenForRoomEvents(room_id, controller, from = '')
	{
		if(controller && controller.cancelled)
		{
			return;
		}

		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const listener = `${this.clientUrl}/events?room_id=${room_id}&access_token=${token.access_token}&from=${from}`;

		controller = controller || {cancelled: false};

		fetch(listener)
		.then(response => response.json())
		.then(response => this.streamServerEvents(response, room_id, controller));

		return controller;
	}

	getUserProfile(userId)
	{
		if(this.profileCache.has(userId, getProfile))
		{
			return this.profileCache.get(userId, getProfile);
		}

		const getProfile = fetch(`${this.clientUrl}/profile/${userId}`).then(response=>response.json());

		this.profileCache.set(userId, getProfile);

		return getProfile;
	}

	getUserData(type)
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		return fetch(`${this.clientUrl}/user/${token.user_id}/account_data/${type}?access_token=${token.access_token}`).then(response => response.json());
	}

	putUserData(type, body)
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return;
		}

		const endpoint = `${this.clientUrl}/user/${token.user_id}/account_data/${type}?access_token=${token.access_token}`;

		return fetch(endpoint, {method: 'PUT', body}).then(response => {
			if(!response.ok)
			{
				const error = new Error("HTTP status code: " + response.status)

				error.status = response.status
				error.response = response

				throw error
			}
			return response

		}).then(response => response.json());
	}

	getMediaUrl(mxcUrl)
	{
		const url = new URL(mxcUrl);
		return `${this.mediaUrl}/download/${url.pathname.substr(2)}`;
	}

	getMedia(mxcUrl)
	{
		if(this.mediaCache.has(mxcUrl))
		{
			return this.mediaCache.get(mxcUrl);
		}

		const getUrl = fetch(this.getMediaUrl(mxcUrl))
		.then(response => Promise.all([response.arrayBuffer(), response.headers.get('Content-type')]))
		.then(([buffer, type]) => URL.createObjectURL(new Blob([buffer], {type})));

		this.mediaCache.set(mxcUrl, getUrl);

		return getUrl;
	}

	postMedia(body, filename)
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		const url = `${this.mediaUrl}/upload?access_token=${token.access_token}`;

		const headers = new Headers({
			'Content-Type': body.type
		});

		const method = 'POST';

		const options = {method, headers, body};

		return fetch(url, options).then(response => response.json());
	}

	putEvent(roomId, type, body)
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		const url = `${this.clientUrl}/rooms/${roomId}/send/${type}/${Math.random().toString(36)}?access_token=${token.access_token}`;

		const headers = new Headers({
			'Content-Type': 'application/json'
		});

		const method = 'PUT';

		const options = {method, headers, body: JSON.stringify(body)};

		return fetch(url, options).then(response => response.json());
	}

	getEvent(roomId, eventId)
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		const url = `${this.clientUrl}/rooms/${roomId}/event/${eventId}?access_token=${token.access_token}`;

		const headers = new Headers({
			'Content-Type': 'application/json'
		});

		const method = 'GET';

		const options = {method, headers};

		return fetch(url, options).then(response => response.json());
	}

	sync()
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return Promise.resolve();
		}

		const syncer = `${this.clientUrl}/sync?full_state=true&access_token=${token.access_token}`;

		return fetch(syncer).then(response => response.json());
	}

	getRoomState(room_id)
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return Promise.resolve();
		}

		const syncer = `${this.clientUrl}/rooms/${room_id}/state?access_token=${token.access_token}`;

		return fetch(syncer).then(response => response.json());
	}

	syncRoom(room_id, from = '')
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const syncer = `${this.clientUrl}/rooms/${room_id}/messages?dir=b&room_id=${room_id}&access_token=${token.access_token}&from=${from}`;

		return fetch(syncer).then(response => response.json());
	}

	syncRoomHistory(room, from, callback = null)
	{
		this.syncRoom(room, from).then(chunk => {

			chunk.chunk && callback && chunk.chunk.forEach(callback);

			// localStorage.setItem('matrix-api::room-lowWater::' + room, chunk.end);

			return chunk.chunk.length && this.syncRoomHistory(room, chunk.end, callback);

		});
	}

	streamServerEvents(chunkList, room_id, controller)
	{
		if(controller && controller.cancelled)
		{
			return;
		}

		if(room_id)
		{
			this.listenForRoomEvents(room_id, controller, chunkList.end);
		}
		else
		{
			this.listenForServerEvents();
		}

		chunkList.chunk && chunkList.chunk.forEach(event => {

			const detail = new MatrixEvent;

			if(!event.event_id)
			{
				event.event_id = 'local:' + (1/Math.random()).toString(36)
			}

			detail.consume(event);

			this.dispatchEvent(new CustomEvent('matrix-event', {detail}));
			this.dispatchEvent(new CustomEvent(detail.type, {detail}));
		});
	}

	getCurrentUserId()
	{
		const tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		return token.user_id;
	}

	createRoom(name, topic, visibility, initial_state = {})
	{
		const body = JSON.stringify({name, topic, visibility, initial_state});

		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.resolve();
		}

		const url = `${this.clientUrl}/createRoom?access_token=${token.access_token}`;

		const method = 'POST';

		return fetch(url, {body, method}).then(response => response.json());
	}

	joinRoom(room_id)
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		fetch(`${this.clientUrl}/rooms/${room_id}/join?access_token=${token.access_token}`, {method:'POST'})
		.then(response => response.json());
	}

	leaveRoom(room_id)
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		fetch(`${this.clientUrl}/rooms/${room_id}/leave?access_token=${token.access_token}`, {method:'POST'})
		.then(response => response.json());
	}

	whoAmI()
	{
		const token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		return fetch(`${this.clientUrl}/account/whoami?access_token=${token.access_token}`).then(response => response.json());
	}
}
