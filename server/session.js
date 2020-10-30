import session      from 'express-session';

let sessionStore = new session.MemoryStore()
	;

export default sessionStore;
