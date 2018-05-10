// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// port # 9111 or 63074
export const environment = {
  production: false,
  envName: 'dev',
  base_Url: 'http://localhost:9111/api/',
  defaultUserAccount: 'Phil',
  logLevel: 3,
  BadAbuseEmailAddresses: [ 'hostmaster@nic.ad.jp', 'abuse@ripe.net' ],
  NetSolutionsNIC: [ 'amanah.com', 'cogentco.com', 'corp.tn.contina.com', 'gin.ntt.net',
		'hostwinds.com', 'krypt.com', 'micfo.com', 'quadranet.com', 'securedservers.com',
		'shawcable.net', 'singlehop.net', 'telus.net', 'thegcloud.com', 'trouble-free.net',
		'twtelecom.net', 'unlimitednet.us' ]
};
