import { Uuid } from 'curvature/base/Uuid';
import { Mixin } from 'curvature/base/Mixin';
import { EventTargetMixin } from 'curvature/mixin/EventTargetMixin';

export class Matrix extends Mixin.with(EventTargetMixin)
{
	ssoUuid    = String(new Uuid);
	isLoggedIn = false;
	loggingIn  = null;

	constructor(baseUrl, options = {})
	{
		super();

		this.baseUrl   = baseUrl || 'https://matrix.org/_matrix';
		this.clientUrl = `${this.baseUrl}/client/v3`;
		this.mediaUrl  = `${this.baseUrl}/media/v3`;

		this.profileCache = new Map();
		this.mediaCache   = new Map();
		this.storage      = options.storage  ?? globalThis.sessionStorage;
		this.interval     = options.interval ?? false;
	}

	get isLoggedIn()
	{
		if(this.isLoggedIn)
		{
			this.dispatchEvent(new CustomEvent('logged-in'));
		}

		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		return this.storage.getItem('matrix:access-token');
	}

	initSso(redirectUri, windowRef = window)
	{
		if(this.storage.getItem('matrix:access-token'))
		{
			this.isLoggedIn = true;
			this.dispatchEvent(new CustomEvent('logged-in'));
			return;
		}

		const query = new URLSearchParams({redirectUrl: redirectUri});

		const path = `login/sso/redirect?${query}`;

		const width  = 400;
		const height = 600;

		const left = window.screenX + (window.outerWidth / 2)  + (width / 2);
		const top  = window.screenY + (window.outerHeight / 2) - (height / 2);

		const options = `width=${width},height=${height},screenX=${left},screenY=${top}`;

		const ssoPopup = windowRef.open(
			`${this.clientUrl}/${path}`
			, `matrix-login-${this.ssoUuid}`
			, options
		);

		const ssoListener = event => {
			if(event.origin !== location.origin)
			{
				return;
			}

			if(event.source === window)
			{
				return;
			}

			if(typeof event.data !== 'string')
			{
				return;
			}

			const request = JSON.parse(event.data);

			if(request.type !== 's.sso.complete')
			{
				return;
			}

			this.storage.setItem('matrix:access-token', JSON.stringify(request.data));

			this.isLoggedIn = true;

			this.dispatchEvent(new CustomEvent('logged-in'));

			windowRef.removeEventListener('message', ssoListener);
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

	logIn(redirectUri, windowRef = window)
	{
		if(!this.loggingIn)
		{
			this.loggingIn = new Promise(accept => {
				this.loggingIn  = null;
				this.addEventListener('logged-in', event => {
					accept(event)
				}, {once: true});
			});
		}

		this.initSso(redirectUri, windowRef);

		return this.loggingIn;
	}

	logOut()
	{
		this.storage.removeItem('matrix:access-token');

		this.isLoggedIn = false;
		this.loggingIn  = null;

		this.dispatchEvent(new CustomEvent('logged-out'));
	}

	getGuestToken()
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(token && token.isGuest)
		{
			return Promise.resolve(token);
		}

		const query = new URLSearchParams({kind: 'guest'});

		const getToken = fetch(`${this.clientUrl}/register?${query}`, {method:'POST', body: '{}'})
		.then(response=>response.json());

		getToken.then(token => {
			token.isGuest = true;
			this.isLoggedIn = true;
			this.storage.setItem('matrix:access-token', JSON.stringify(token))
		});

		return getToken;
	}

	getToken()
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(token)
		{
			return Promise.resolve(token);
		}

		return matrix.getGuestToken();
	}

	listenForServerEvents()
	{
		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const listener = `${this.clientUrl}/events?${query}`;

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

		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({
			access_token: token.access_token
			, room_id
			, from
		});

		const listener = `${this.clientUrl}/events?${query}`;

		controller = controller || {cancelled: false};

		fetch(listener)
		.then(response => response.json())
		.then(response => this.streamServerEvents(response, room_id, controller));

		return controller;
	}

	streamServerEvents(chunkList, room_id, controller)
	{
		if(controller && controller.cancelled)
		{
			return;
		}

		if(!this.interval)
		{
			if(room_id)
			{
				this.listenForRoomEvents(room_id, controller, chunkList.end);
			}
			else
			{
				this.listenForServerEvents();
			}
		}
		else
		{
			setTimeout(() => {
				if(room_id)
				{
					this.listenForRoomEvents(room_id, controller, chunkList.end);
				}
				else
				{
					this.listenForServerEvents();
				}
			}, this.interval);
		}

		chunkList.chunk && chunkList.chunk.forEach(event => {

			const detail = {};

			if(!event.event_id)
			{
				event.event_id = `local:${new Uuid}`
			}

			Object.assign(detail, event);

			this.dispatchEvent(new CustomEvent('matrix-event', {detail}));
			this.dispatchEvent(new CustomEvent(detail.type, {detail}));
		});
	}

	getUserProfile(userId)
	{
		if(this.profileCache.has(userId))
		{
			return this.profileCache.get(userId);
		}

		const getProfile = fetch(`${this.clientUrl}/profile/${userId}`).then(response=>response.json());

		this.profileCache.set(userId, getProfile);

		return getProfile;
	}

	getUserData(type)
	{
		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({access_token: token.access_token});

		return fetch(`${this.clientUrl}/user/${token.user_id}/account_data/${type}?${query}`).then(response => response.json());
	}

	putUserData(type, body)
	{
		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return;
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const endpoint = `${this.clientUrl}/user/${token.user_id}/account_data/${type}?${query}`;

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
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const url = `${this.mediaUrl}/upload?${query}`;

		const headers = new Headers({
			'Content-Type': body.type
		});

		const method = 'POST';

		const options = {method, headers, body};

		return fetch(url, options).then(response => response.json());
	}

	putEvent(roomId, type, body)
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const url = `${this.clientUrl}/rooms/${roomId}/send/${type}/${Math.random().toString(36)}?${query}`;

		const headers = new Headers({
			'Content-Type': 'application/json'
		});

		const method = 'PUT';
		const keepalive = true

		const options = {method, headers, keepalive, body: JSON.stringify(body), keepalive};

		return fetch(url, options).then(response => response.json());
	}

	getEvent(roomId, eventId)
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return;
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const url = `${this.clientUrl}/rooms/${roomId}/event/${eventId}?${query}`;

		const headers = new Headers({
			'Content-Type': 'application/json'
		});

		const method = 'GET';

		const options = {method, headers};

		return fetch(url, options).then(response => response.json());
	}

	sync()
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return Promise.resolve();
		}

		const query = new URLSearchParams({full_state: true, access_token: token.access_token});

		const syncer = `${this.clientUrl}/sync?${query}`;

		return fetch(syncer).then(response => response.json());
	}

	getRoomState(room_id)
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

		const token = JSON.parse(tokenJson);

		if(!token)
		{
			return Promise.resolve();
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const syncer = `${this.clientUrl}/rooms/${room_id}/state?${query}`;

		return fetch(syncer).then(response => response.json());
	}

	syncRoom(room_id, from = null, filter = null)
	{
		if(!this.isLoggedIn)
		{
			return Promise.reject('Logged out.');
		}

		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({
			access_token: token.access_token
			, room_id
			, dir: 'b'
			, from: from ? from : ''
			, filter: filter ? JSON.stringify(filter) : ''
		});

		const syncer = `${this.clientUrl}/rooms/${room_id}/messages?${query}`;

		const controller = new AbortController();
		const signal = controller.signal;
		const abort = () => controller.abort();

		this.addEventListener('logged-out', abort, {once:true});

		const fetchFrame = fetch(syncer, {signal}).then(response => response.json());

		fetchFrame.finally(this.removeEventListener('logged-out', abort));

		return fetchFrame;
	}

	syncRoomHistory(room, callback = null, to = false, from = null, filter = null)
	{
		return this.syncRoom(room, from, filter).then(frame => {
			if(!this.isLoggedIn)
			{
				return Promise.reject('Logged out.');
			}

			const cancelable = true;
			const detail     = {frame};

			const event = new CustomEvent('roomSyncFrame', {detail, cancelable});

			if(!this.dispatchEvent(event))
			{
				return;
			}

			if(callback && frame.chunk)
			{
				for(const message of frame.chunk)
				{
					if(!this.isLoggedIn)
					{
						return Promise.reject('Logged out.');
					}

					if(to && message.origin_server_ts <= to)
					{
						return Promise.resolve();
					}

					if(callback(message) === false)
					{
						return Promise.resolve();
					}
				}
			}

			return new Promise(accept => setTimeout(
				() => accept(frame.chunk.length && this.syncRoomHistory(room, callback, to, frame.end, filter))
				, this.interval ?? 0
			));
		});
	}

	getCurrentUserId()
	{
		const tokenJson = this.storage.getItem('matrix:access-token') || 'false';

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

		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.resolve();
		}

		const query = new URLSearchParams({access_token: token.access_token});

		const url = `${this.clientUrl}/createRoom?${query}`;

		const method = 'POST';

		return fetch(url, {body, method}).then(response => response.json());
	}

	joinRoom(room_id)
	{
		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({access_token: token.access_token});

		fetch(`${this.clientUrl}/rooms/${room_id}/join?${query}`, {method:'POST'})
		.then(response => response.json());
	}

	leaveRoom(room_id)
	{
		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({access_token: token.access_token});

		fetch(`${this.clientUrl}/rooms/${room_id}/leave?${query}`, {method:'POST'})
		.then(response => response.json());
	}

	whoAmI()
	{
		const token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

		if(!token)
		{
			return Promise.reject('No access token found.');
		}

		const query = new URLSearchParams({access_token: token.access_token});

		return fetch(`${this.clientUrl}/account/whoami?${query}`).then(response => response.json());
	}
}
