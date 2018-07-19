import { NetIncidentPage } from './app.po';

describe('net-incident App', () => {
	let page: NetIncidentPage;

	beforeEach(() => {
		page = new NetIncidentPage();
	});

	it('should display welcome message', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('Welcome to app!');
	});
});
