// ===========================================================================
// File: User.service.spec.ts
// Tests of service for: User
//
import { TestBed, getTestBed } from '@angular/core/testing';
import { IWhoIsAbuse, WhoIsAbuse } from './whois-abuse';
//
fdescribe('WhoIsAbuse', () => {
	//
	let sut: WhoIsAbuse;
	//
	const whois_ripe94_41_54_105: string = `[Querying whois.ripe.net]\r\n[whois.ripe.net]\r\n% This is the RIPE Database query service.\r\n% The objects are in RPSL format.\r\n%\r\n% The RIPE Database is subject to Terms and Conditions.\r\n% See http://www.ripe.net/db/support/db-terms-conditions.pdf\r\n\r\n% Note: this output has been filtered.\r\n%	     To receive output for a database update, use the \"-B\" flag.\r\n\r\n% Information related to '145.255.0.0 - 145.255.15.255'\r\n\r\n% Abuse contact for '145.255.0.0 - 145.255.15.255' is 'abuse@ufanet.ru'\r\n\r\ninetnum:        145.255.0.0 - 145.255.15.255\r\nnetname:        UBN\r\ndescr:          JSC \"Ufanet\"\r\ndescr:          Ufa, Russia\r\ncountry:        RU\r\nadmin-c:        USA13-RIPE\r\ntech-c:         VDN30-RIPE\r\nstatus:         ASSIGNED PA\r\nremarks:        INFRA-AW\r\nmnt-by:         UBN-MNT\r\ncreated:        2012-08-22T07:52:35Z\r\nlast-modified:  2015-10-08T06:10:19Z\r\nsource:         RIPE\r\n\r\nperson:         Sergey A. Judin\r\naddress:        OJSC Ufanet\r\naddress:        prospekt Oktyabrya str. 4/3\r\naddress:        450001, Russia, Ufa\r\nmnt-by:         UBN-MNT\r\nphone:          +7-347-29-00-405\r\nfax-no:         +7-347-29-00-400\r\nnic-hdl:        USA13-RIPE\r\ncreated:        2012-08-21T09:46:20Z\r\nlast-modified:  2013-08-01T03:35:25Z\r\nsource:         RIPE\r\n\r\nperson:         Dmitriy Vladimirov\r\naddress:        OJSC Ufanet\r\naddress:        prospekt Oktyabrya str. 4/3\r\naddress:        450001, Russia, Ufa\r\nphone:          +7-347-29-00-405\r\nfax-no:         +7-347-29-00-400\r\nnic-hdl:        VDN30-RIPE\r\nmnt-by:         UBN-MNT\r\ncreated:        2012-08-28T07:47:55Z\r\nlast-modified:  2012-08-28T07:47:55Z\r\nsource:         RIPE # Filtered\r\n\r\n% Information related to '145.255.0.0/23AS24955'\r\n\r\nroute:          145.255.0.0/23\r\ndescr:          JSC \"Ufanet\", Ufa, Russia\r\norigin:         AS24955\r\nmnt-by:         UBN-MNT\r\ncreated:        2013-07-03T11:53:05Z\r\nlast-modified:  2013-07-03T11:53:05Z\r\nsource:         RIPE\r\n\r\n% This query was served by the RIPE Database Query Service version 1.90 (HEREFORD)\r\n\r\n\r\n`;
	const whois_ripe46_161_62_245: string = `[Querying whois.arin.net]\r\n[Redirected to whois.ripe.net]\r\n[Querying whois.ripe.net]\r\n[whois.ripe.net]\r\n% This is the RIPE Database query service.\r\n% The objects are in RPSL format.\r\n%\r\n% The RIPE Database is subject to Terms and Conditions.\r\n% See http://www.ripe.net/db/support/db-terms-conditions.pdf\r\n\r\n% Note: this output has been filtered.\r\n%       To receive output for a database update, use the \"-B\" flag.\r\n\r\n% Information related to '46.161.62.128 - 46.161.62.255'\r\n\r\n% Abuse contact for '46.161.62.128 - 46.161.62.255' is 'abuse@pinspb.ru'\r\n\r\ninetnum:        46.161.62.128 - 46.161.62.255\r\nnetname:        QUALITYNETWORK\r\ndescr:          QUALITYNETWORK\r\ncountry:        RU\r\nadmin-c:        GS19550-RIPE\r\ntech-c:         GS19550-RIPE\r\nstatus:         ASSIGNED PA\r\nmnt-by:         QNSC\r\ncreated:        2015-03-22T18:27:54Z\r\nlast-modified:  2017-08-10T21:09:05Z\r\nsource:         RIPE\r\n\r\nperson:         QUALITY NETWORK NOC\r\naddress:        Office 14, Trinity House, Victoria, Mahe, Seychelles. SC-12\r\nphone:          +35722007451\r\nnic-hdl:        GS19550-RIPE\r\nmnt-by:         QNSC\r\ncreated:        2017-07-31T17:49:28Z\r\nlast-modified:  2017-10-30T23:58:31Z\r\nsource:         RIPE\r\n\r\n% Information related to '46.161.62.0/24AS50896'\r\n\r\nroute:          46.161.62.0/24\r\ndescr:          QUALITYNETWORK\r\norigin:         AS50896\r\nmnt-by:         QNSC\r\ncreated:        2015-03-04T22:46:26Z\r\nlast-modified:  2017-08-10T21:09:50Z\r\nsource:         RIPE\r\n\r\n% This query was served by the RIPE Database Query Service version 1.90 (HEREFORD)\r\n\r\n\r\n`;
	const whois_arin246_161_212_245: string = `[Querying whois.arin.net]\r\n[whois.arin.net]\r\n\r\n#\r\n# ARIN WHOIS data and services are subject to the Terms of Use\r\n# available at: https://www.arin.net/whois_tou.html\r\n#\r\n# If you see inaccuracies in the results, please report at\r\n# https://www.arin.net/public/whoisinaccuracy/index.xhtml\r\n#\r\n\r\n\r\n#\r\n# Query terms are ambiguous.  The query is assumed to be:\r\n#     \"n 246.161.212.245\"\r\n#\r\n# Use \"?\" to get help.\r\n#\r\n\r\n#\r\n# The following results may also be obtained via:\r\n# https://whois.arin.net/rest/nets;q=246.161.212.245?showDetails=true&showARIN=false&showNonArinTopLevelNet=false&ext=netref2\r\n#\r\n\r\nNetRange:       240.0.0.0 - 255.255.255.255\r\nCIDR:           240.0.0.0/4\r\nNetName:        SPECIAL-IPV4-FUTURE-USE-IANA-RESERVED\r\nNetHandle:      NET-240-0-0-0-0\r\nParent:          ()\r\nNetType:        IANA Special Use\r\nOriginAS:       \r\nOrganization:   Internet Assigned Numbers Authority (IANA)\r\nRegDate:        \r\nUpdated:        2013-08-30\r\nComment:        Addresses starting with 240 or a higher number have not been allocated and should not be used, apart from 255.255.255.255, which is used for \"limited broadcast\" on a local network.\r\r\nComment:        \r\r\nComment:        This block was reserved by the IETF, the organization that develops Internet protocols, in the Standard document and in RFC 1112.  The documents can be found at:\r\r\nComment:        http://datatracker.ietf.org/doc/rfc1112\r\nRef:            https://whois.arin.net/rest/net/NET-240-0-0-0-0\r\n\r\n\r\nOrgName:        Internet Assigned Numbers Authority\r\nOrgId:          IANA\r\nAddress:        12025 Waterfront Drive\r\r\nAddress:        Suite 300\r\nCity:           Los Angeles\r\nStateProv:      CA\r\nPostalCode:     90292\r\nCountry:        US\r\nRegDate:        \r\nUpdated:        2012-08-31\r\nRef:            https://whois.arin.net/rest/org/IANA\r\n\r\n\r\nOrgAbuseHandle: IANA-IP-ARIN\r\nOrgAbuseName:   ICANN\r\nOrgAbusePhone:  +1-310-301-5820 \r\nOrgAbuseEmail:  abuse@iana.org\r\nOrgAbuseRef:    https://whois.arin.net/rest/poc/IANA-IP-ARIN\r\n\r\nOrgTechHandle: IANA-IP-ARIN\r\nOrgTechName:   ICANN\r\nOrgTechPhone:  +1-310-301-5820 \r\nOrgTechEmail:  abuse@iana.org\r\nOrgTechRef:    https://whois.arin.net/rest/poc/IANA-IP-ARIN\r\n\r\n\r\n#\r\n# ARIN WHOIS data and services are subject to the Terms of Use\r\n# available at: https://www.arin.net/whois_tou.html\r\n#\r\n# If you see inaccuracies in the results, please report at\r\n# https://www.arin.net/public/whoisinaccuracy/index.xhtml\r\n#\r\n\r\n`;
	const whois_arin104_199_208_27: string = `[Querying whois.arin.net]\r\n[whois.arin.net]\r\n\r\n#\r\n# ARIN WHOIS data and services are subject to the Terms of Use\r\n# available at: https://www.arin.net/whois_tou.html\r\n#\r\n# If you see inaccuracies in the results, please report at\r\n# https://www.arin.net/public/whoisinaccuracy/index.xhtml\r\n#\r\n\r\n\r\n#\r\n# Query terms are ambiguous.  The query is assumed to be:\r\n#     \"n 104.199.208.27\"\r\n#\r\n# Use \"?\" to get help.\r\n#\r\n\r\n#\r\n# The following results may also be obtained via:\r\n# https://whois.arin.net/rest/nets;q=104.199.208.27?showDetails=true&showARIN=false&showNonArinTopLevelNet=false&ext=netref2\r\n#\r\n\r\nNetRange:       104.196.0.0 - 104.199.255.255\r\nCIDR:           104.196.0.0/14\r\nNetName:        GOOGLE-CLOUD\r\nNetHandle:      NET-104-196-0-0-1\r\nParent:         NET104 (NET-104-0-0-0-0)\r\nNetType:        Direct Allocation\r\nOriginAS:       AS15169\r\nOrganization:   Google LLC (GOOGL-2)\r\nRegDate:        2014-08-27\r\nUpdated:        2015-09-21\r\nComment:        ** The IP addresses under this netblock are in use by Google Cloud customers ** \r\r\nComment:        \r\r\nComment:        Direct all copyright and legal complaints to \r\r\nComment:        https://support.google.com/legal/go/report\r\r\nComment:        \r\r\nComment:        Direct all spam and abuse complaints to \r\r\nComment:        https://support.google.com/code/go/gce_abuse_report\r\r\nComment:        \r\r\nComment:        For fastest response, use the relevant forms above.\r\r\nComment:        \r\r\nComment:        Complaints can also be sent to the GC Abuse desk \r\r\nComment:        (google-cloud-compliance@google.com) \r\r\nComment:        but may have longer turnaround times.\r\r\nComment:        \r\r\nComment:        Complaints sent to any other POC will be ignored.\r\nRef:            https://whois.arin.net/rest/net/NET-104-196-0-0-1\r\n\r\n\r\nOrgName:        Google LLC\r\nOrgId:          GOOGL-2\r\nAddress:        1600 Amphitheatre Parkway\r\nCity:           Mountain View\r\nStateProv:      CA\r\nPostalCode:     94043\r\nCountry:        US\r\nRegDate:        2006-09-29\r\nUpdated:        2017-10-16\r\nComment:        *** The IP addresses under this Org-ID are in use by Google Cloud customers *** \r\r\nComment:        \r\r\nComment:        Direct all copyright and legal complaints to \r\r\nComment:        https://support.google.com/legal/go/report\r\r\nComment:        \r\r\nComment:        Direct all spam and abuse complaints to \r\r\nComment:        https://support.google.com/code/go/gce_abuse_report\r\r\nComment:        \r\r\nComment:        For fastest response, use the relevant forms above.\r\r\nComment:        \r\r\nComment:        Complaints can also be sent to the GC Abuse desk \r\r\nComment:        (google-cloud-compliance@google.com) \r\r\nComment:        but may have longer turnaround times.\r\r\nComment:        \r\r\nComment:        Complaints sent to any other POC will be ignored.\r\nRef:            https://whois.arin.net/rest/org/GOOGL-2\r\n\r\n\r\nOrgTechHandle: ZG39-ARIN\r\nOrgTechName:   Google LLC\r\nOrgTechPhone:  +1-650-253-0000 \r\nOrgTechEmail:  arin-contact@google.com\r\nOrgTechRef:    https://whois.arin.net/rest/poc/ZG39-ARIN\r\n\r\nOrgAbuseHandle: GCABU-ARIN\r\nOrgAbuseName:   GC Abuse\r\nOrgAbusePhone:  +1-650-253-0000 \r\nOrgAbuseEmail:  google-cloud-compliance@google.com\r\nOrgAbuseRef:    https://whois.arin.net/rest/poc/GCABU-ARIN\r\n\r\nOrgNOCHandle: GCABU-ARIN\r\nOrgNOCName:   GC Abuse\r\nOrgNOCPhone:  +1-650-253-0000 \r\nOrgNOCEmail:  google-cloud-compliance@google.com\r\nOrgNOCRef:    https://whois.arin.net/rest/poc/GCABU-ARIN\r\n\r\n\r\n#\r\n# ARIN WHOIS data and services are subject to the Terms of Use\r\n# available at: https://www.arin.net/whois_tou.html\r\n#\r\n# If you see inaccuracies in the results, please report at\r\n# https://www.arin.net/public/whoisinaccuracy/index.xhtml\r\n#\r\n\r\n`;
	const whois_afr197_48_169_77: string = `[Querying whois.arin.net]\r\n[Redirected to whois.afrinic.net]\r\n[Querying whois.afrinic.net]\r\n[whois.afrinic.net]\r\n% This is the AfriNIC Whois server.\r\n\r\n% Note: this output has been filtered.\r\n%       To receive output for a database update, use the \"-B\" flag.\r\n\r\n% Information related to '197.48.0.0 - 197.55.255.255'\r\n\r\n% No abuse contact registered for 197.48.0.0 - 197.55.255.255\r\n\r\ninetnum:        197.48.0.0 - 197.55.255.255\r\nnetname:        All-22\r\ndescr:          TE Data\r\ncountry:        EG\r\nadmin-c:        TDCR1-AFRINIC\r\ntech-c:         TDCR2-AFRINIC\r\nstatus:         ASSIGNED PA\r\nremarks:        ====================================================\r\nremarks:        For Internet Abuse & Spam reports : admins@tedata.net\r\nremarks:        ====================================================\r\nmnt-by:         TE-Data-MNT\r\nsource:         AFRINIC # Filtered\r\nparent:         197.32.0.0 - 197.63.255.255\r\n\r\nrole:           TE Data Contact Role\r\naddress:        94 Tahrir Street, Dokki, 12311, Giza, Egypt\r\nphone:          +202 33320700\r\nfax-no:         +202 33320800\r\nadmin-c:        TDCR2-AFRINIC\r\ntech-c:         MH7-AFRINIC\r\nabuse-mailbox:  abuse@tedata.net\r\nnic-hdl:        TDCR1-AFRINIC\r\nmnt-by:         TE-Data-MNT\r\nsource:         AFRINIC # Filtered\r\n\r\nrole:           TE Data Contact Role-2\r\naddress:        94 Tahrir Street, Dokki, 12311, Giza, Egypt\r\nphone:          +202 33320700\r\nfax-no:         +202 33320800\r\nadmin-c:        TDCR2-AFRINIC\r\ntech-c:         MH7-AFRINIC\r\nabuse-mailbox:  abuse@tedata.net\r\nnic-hdl:        TDCR2-AFRINIC\r\nmnt-by:         TE-Data-MNT\r\nsource:         AFRINIC # Filtered\r\n\r\n\r\n\r\n`;
	const whois_ap1_52_34_175: string = `[Querying whois.arin.net]\r\n[Redirected to whois.apnic.net]\r\n[Querying whois.apnic.net]\r\n[whois.apnic.net]\r\n% [whois.apnic.net]\r\n% Whois data copyright terms    http://www.apnic.net/db/dbcopyright.html\r\n\r\n% Information related to '1.52.32.0 - 1.52.47.255'\r\n\r\n% Abuse contact for '1.52.32.0 - 1.52.47.255' is 'hm-changed@vnnic.vn'\r\n\r\ninetnum:        1.52.32.0 - 1.52.47.255\r\nnetname:        FPTDYNAMICIP-NET\r\ncountry:        VN\r\ndescr:          FPT Telecom\r\nadmin-c:        TTH19-AP\r\ntech-c:         NOC21-AP\r\nstatus:         ASSIGNED NON-PORTABLE\r\nmnt-by:         MAINT-VN-FPT\r\nmnt-irt:        IRT-VNNIC-AP\r\nlast-modified:  2017-11-13T04:18:13Z\r\nsource:         APNIC\r\n\r\nirt:            IRT-VNNIC-AP\r\naddress:        Ha Noi, VietNam\r\nphone:          +84-24-35564944\r\nfax-no:         +84-24-37821462\r\ne-mail:         hm-changed@vnnic.vn\r\nabuse-mailbox:  hm-changed@vnnic.vn\r\nadmin-c:        NTTT1-AP\r\ntech-c:         NTTT1-AP\r\nauth:           # Filtered\r\nmnt-by:         MAINT-VN-VNNIC\r\nlast-modified:  2017-11-08T09:40:06Z\r\nsource:         APNIC\r\n\r\nperson:         Network Operation Center\r\nnic-hdl:        NOC21-AP\r\ne-mail:         ftel.noc.net@fpt.com.vn\r\naddress:        FPT Telecom\r\nphone:          +84-28-73093388\r\nfax-no:         +84-28-73008889\r\ncountry:        VN\r\nmnt-by:         MAINT-VN-VNNIC\r\nlast-modified:  2017-11-13T06:48:10Z\r\nsource:         APNIC\r\n\r\nperson:         Tran Thanh Hai\r\nnic-hdl:        TTH19-AP\r\ne-mail:         haitt3@fpt.com.vn\r\naddress:        FPT Telecom\r\nphone:          +84-90-4211450\r\nfax-no:         +84-24-37262163\r\ncountry:        VN\r\nmnt-by:         MAINT-VN-VNNIC\r\nlast-modified:  2017-11-13T04:26:47Z\r\nsource:         APNIC\r\n\r\n% This query was served by the APNIC Whois Service version 1.88.15-43 (WHOIS-US4)\r\n\r\n\r\n`;
	const whois_ap103_18_33_107: string = `[Querying whois.arin.net]\r\n[Redirected to whois.apnic.net]\r\n[Querying whois.apnic.net]\r\n[whois.apnic.net]\r\n% [whois.apnic.net]\r\n% Whois data copyright terms    http://www.apnic.net/db/dbcopyright.html\r\n\r\n% Information related to '103.18.32.0 - 103.18.33.255'\r\n\r\n% Abuse contact for '103.18.32.0 - 103.18.33.255' is 'abuse@medialintas.com'\r\n\r\ninetnum:        103.18.32.0 - 103.18.33.255\r\nnetname:        MLD-ID\r\ndescr:          PT MEDIA LINTAS DATA\r\ndescr:          Internet Service Provider\r\ndescr:          Menara Jamsostek, Gedung Selatan Lt. 6\r\ndescr:          Jl. Jend. Gatot Subroto Kav. 38\r\ndescr:          Jakarta 12710\r\nadmin-c:        JI117-AP\r\ntech-c:         JI117-AP\r\nremarks:        Send Spam & Abuse Reports to abuse@medialintas.com\r\ncountry:        ID\r\nmnt-by:         MNT-APJII-ID\r\nmnt-lower:      MAINT-ID-MLD\r\nmnt-irt:        IRT-MLD-ID\r\nstatus:         ALLOCATED PORTABLE\r\nmnt-routes:     MAINT-ID-MLD\r\nlast-modified:  2014-04-01T03:17:52Z\r\nsource:         APNIC\r\n\r\nirt:            IRT-MLD-ID\r\naddress:        PT. MEDIA LINTAS DATA\r\naddress:        Menara Jamsostek, Gedung Selatan Lt. 6\r\naddress:        Jl. Jend. Gatot Subroto Kav. 38\r\naddress:        Jakarta 12710\r\ne-mail:         abuse@medialintas.com\r\nabuse-mailbox:  abuse@medialintas.com\r\nadmin-c:        JI117-AP\r\ntech-c:         JI117-AP\r\nauth:           # Filtered\r\nmnt-by:         MAINT-ID-MLD\r\nlast-modified:  2012-06-12T04:16:00Z\r\nsource:         APNIC\r\n\r\nperson:         Jamalul Izza\r\naddress:        Menara Jamsostek, Gedung Selatan Lt. 6\r\naddress:        Jl. Jend. Gatot Subroto Kav. 38\r\naddress:        Jakarta 12710\r\ncountry:        ID\r\nphone:          +62-21-27275588\r\nfax-no:         +62-21-52963887\r\ne-mail:         jamal@medialintas.com\r\nnic-hdl:        JI117-AP\r\nmnt-by:         MAINT-ID-MLD\r\nlast-modified:  2012-06-12T04:24:15Z\r\nsource:         APNIC\r\n\r\n% Information related to '103.18.32.0 - 103.18.33.255'\r\n\r\ninetnum:        103.18.32.0 - 103.18.33.255\r\nnetname:        MLD-ID\r\ndescr:          PT MEDIA LINTAS DATA\r\ndescr:          Internet Service Provider\r\ndescr:          Menara Jamsostek, Gedung Selatan Lt. 6\r\ndescr:          Jl. Jend. Gatot Subroto Kav. 38\r\ndescr:          Jakarta 12710\r\nadmin-c:        JI117-AP\r\ntech-c:         JI117-AP\r\nremarks:        Send Spam & Abuse Reports to abuse@medialintas.com\r\ncountry:        ID\r\nmnt-by:         MNT-APJII-ID\r\nmnt-lower:      MAINT-ID-MLD\r\nmnt-irt:        IRT-MLD-ID\r\nstatus:         ALLOCATED PORTABLE\r\nmnt-routes:     MAINT-ID-MLD\r\nlast-modified:  2014-04-01T03:17:52Z\r\nsource:         IDNIC\r\n\r\nirt:            IRT-MLD-ID\r\naddress:        PT. MEDIA LINTAS DATA\r\naddress:        Menara Jamsostek, Gedung Selatan Lt. 6\r\naddress:        Jl. Jend. Gatot Subroto Kav. 38\r\naddress:        Jakarta 12710\r\ne-mail:         abuse@medialintas.com\r\nabuse-mailbox:  abuse@medialintas.com\r\nadmin-c:        JI117-AP\r\ntech-c:         JI117-AP\r\nauth:           # Filtered\r\nmnt-by:         MAINT-ID-MLD\r\nlast-modified:  2012-06-12T04:16:00Z\r\nsource:         IDNIC\r\n\r\nperson:         Jamalul Izza\r\naddress:        Menara Jamsostek, Gedung Selatan Lt. 6\r\naddress:        Jl. Jend. Gatot Subroto Kav. 38\r\naddress:        Jakarta 12710\r\ncountry:        ID\r\nphone:          +62-21-27275588\r\nfax-no:         +62-21-52963887\r\ne-mail:         jamal@medialintas.com\r\nnic-hdl:        JI117-AP\r\nmnt-by:         MAINT-ID-MLD\r\nlast-modified:  2012-06-12T04:24:15Z\r\nsource:         IDNIC\r\n\r\n% This query was served by the APNIC Whois Service version 1.88.15-43 (WHOIS-US4)\r\n\r\n\r\n`;
	const whois_lac138_36_27_5: string = `[Querying whois.arin.net]\r\n[Redirected to whois.lacnic.net]\r\n[Querying whois.lacnic.net]\r\n[whois.lacnic.net]\r\n\r\r\n% Joint Whois - whois.lacnic.net\r\r\n%  This server accepts single ASN, IPv4 or IPv6 queries\r\r\n \r\r\n% LACNIC resource: whois.lacnic.net\r\r\n\r\r\n\r\r\n% Copyright LACNIC lacnic.net\r\r\n%  The data below is provided for information purposes\r\r\n%  and to assist persons in obtaining information about or\r\r\n%  related to AS and IP numbers registrations\r\r\n%  By submitting a whois query, you agree to use this data\r\r\n%  only for lawful purposes.\r\r\n%  2017-12-04 20:40:41 (BRST -02:00)\r\r\n\r\r\ninetnum:     138.36.24/22\r\r\nstatus:      allocated\r\r\naut-num:     N/A\r\r\nowner:       CABLEMAX C.X.A\r\r\nownerid:     DO-CACX-LACNIC\r\r\nresponsible: Marcial Pichardo\r\r\naddress:     C/ MAGNOLIA ESQ. 38, LAS FLORES, CRISTO REY 1, DISTRITO NACIONAL, , \r\r\naddress:     10501 - SANTO DOMINGO - SA\r\r\ncountry:     DO\r\r\nphone:       +1809 3 318080 []\r\r\nowner-c:     MAP193\r\r\ntech-c:      MAP193\r\r\nabuse-c:     MAP193\r\r\ncreated:     20150121\r\r\nchanged:     20150121\r\r\n\r\r\nnic-hdl:     MAP193\r\r\nperson:      Marcial Pichardo\r\r\ne-mail:      andresacosta@CABLEMAX.COM.DO\r\r\naddress:     C/ 3ra, 2, \r\r\naddress:     11103 - Distrito Nacional - \r\r\ncountry:     DO\r\r\nphone:       +1809  8775672 []\r\r\ncreated:     20141203\r\r\nchanged:     20150616\r\r\n\r\r\n% whois.lacnic.net accepts only direct match queries.\r\r\n% Types of queries are: POCs, ownerid, CIDR blocks, IP\r\r\n% and AS numbers.\r\r\n\r\r\n`;
	const whois_lac177_228_94_39: string = `[Querying whois.arin.net]\r\n[Redirected to whois.lacnic.net]\r\n[Querying whois.lacnic.net]\r\n[whois.lacnic.net]\r\n\r\r\n% Joint Whois - whois.lacnic.net\r\r\n%  This server accepts single ASN, IPv4 or IPv6 queries\r\r\n \r\r\n% LACNIC resource: whois.lacnic.net\r\r\n\r\r\n\r\r\n% Copyright LACNIC lacnic.net\r\r\n%  The data below is provided for information purposes\r\r\n%  and to assist persons in obtaining information about or\r\r\n%  related to AS and IP numbers registrations\r\r\n%  By submitting a whois query, you agree to use this data\r\r\n%  only for lawful purposes.\r\r\n%  2017-12-04 21:41:40 (BRST -02:00)\r\r\n\r\r\ninetnum:     177.224/13\r\r\nstatus:      allocated\r\r\naut-num:     N/A\r\r\nowner:       Mega Cable, S.A. de C.V.\r\r\nownerid:     MX-MSCV17-LACNIC\r\r\nresponsible: Hector Javier Villa Montañez\r\r\naddress:     Av. Lazaro Cardenas, 1694, Del Fresno\r\r\naddress:     44900 - Guadalajara - JA\r\r\ncountry:     MX\r\r\nphone:       +52  3337500020 []\r\r\nowner-c:     NIT\r\r\ntech-c:      NIT\r\r\nabuse-c:     NIT\r\r\ninetrev:     177.224/13\r\r\nnserver:     NS1.MEGARED.NET.MX  \r\r\nnsstat:      20171202 AA\r\r\nnslastaa:    20171202\r\r\nnserver:     NS2.MEGARED.NET.MX  \r\r\nnsstat:      20171202 AA\r\r\nnslastaa:    20171202\r\r\ncreated:     20130220\r\r\nchanged:     20130220\r\r\n\r\r\nnic-hdl:     NIT\r\r\nperson:      NIC TECH\r\r\ne-mail:      nic_tech@MEGACABLE.COM.MX\r\r\naddress:     Lazaro Cardenas, 1694, Del Fresno\r\r\naddress:     44900 - Guadalajara - Ja\r\r\ncountry:     MX\r\r\nphone:       +52 33 37500029 []\r\r\ncreated:     20030303\r\r\nchanged:     20120105\r\r\n\r\r\n% whois.lacnic.net accepts only direct match queries.\r\r\n% Types of queries are: POCs, ownerid, CIDR blocks, IP\r\r\n% and AS numbers.\r\r\n\r\r\n`;
	const whois_br177_37_164_71: string = `[Querying whois.arin.net]\r\n[Redirected to whois.lacnic.net]\r\n[Querying whois.lacnic.net]\r\n[Redirected to whois.registro.br]\r\n[Querying whois.registro.br]\r\n[whois.registro.br]\r\n\r\n% Copyright (c) Nic.br\r\n%  The use of the data below is only permitted as described in\r\n%  full by the terms of use at https://registro.br/termo/en.html ,\r\n%  being prohibited its distribution, commercialization or\r\n%  reproduction, in particular, to use it for advertising or\r\n%  any similar purpose.\r\n%  2017-12-04 21:49:22 (-02 -02:00)\r\n\r\ninetnum:     177.37.128.0/17\r\naut-num:     AS28126\r\nabuse-c:     FRR37\r\nowner:       BRISANET SERVICOS DE TELECOMUNICACOES LTDA\r\nownerid:     04.601.397/0001-28\r\nresponsible: JOÃO PAULO ESTEVAM\r\nowner-c:     FRR37\r\ntech-c:      FRR37\r\ninetrev:     177.37.164.0/22\r\nnserver:     ns.brisanet.net.br\r\nnsstat:      20171204 AA\r\nnslastaa:    20171204\r\nnserver:     ns2.brisanet.net.br\r\nnsstat:      20171204 TIMEOUT\r\nnslastaa:    20171129\r\ncreated:     20110302\r\nchanged:     20110302\r\n\r\nnic-hdl-br:  FRR37\r\nperson:      França Reis\r\ncreated:     19991227\r\nchanged:     20140701\r\n\r\n% Security and mail abuse issues should also be addressed to\r\n% cert.br, http://www.cert.br/ , respectivelly to cert@cert.br\r\n% and mail-abuse@cert.br\r\n%\r\n% whois.registro.br accepts only direct match queries. Types\r\n% of queries are: domain (.br), registrant (tax ID), ticket,\r\n% provider, contact handle (ID), CIDR block, IP and ASN.\r\r\n`;
	const whois_tw114_45_70_76: string = `[Querying whois.arin.net]\r\n[Redirected to whois.apnic.net]\r\n[Querying whois.apnic.net]\r\n[Redirected to whois.twnic.net]\r\n[Querying whois.twnic.net]\r\n[whois.twnic.net]\r\n\r\n   Netname: HINET-NET\r\n   Netblock: 114.45.0.0/16\r\n\r\n   Administrator contact:\r\n      network-adm@hinet.net\r\n\r\n   Technical contact:\r\n      network-adm@hinet.net\r\n`;
	const whois_kr112_220_69_50: string = `[Querying whois.arin.net]\r\n[Redirected to whois.apnic.net]\r\n[Querying whois.apnic.net]\r\n[Redirected to whois.krnic.net]\r\n[Querying whois.krnic.net]\r\n[whois.krnic.net]\r\nquery : 112.220.69.50\r\n\r\n\r\n# KOREAN(UTF8)\r\n\r\nì¡°íšŒí•˜ì‹  IPv4ì£¼ì†ŒëŠ” í•œêµ­ì¸í„°ë„·ì§„í¥ì›ìœ¼ë¡œë¶€í„° ì•„ëž˜ì˜ ê´€ë¦¬ëŒ€í–‰ìžì—ê²Œ í• ë‹¹ë˜ì—ˆìœ¼ë©°, í• ë‹¹ ì •ë³´ëŠ” ë‹¤ìŒê³¼ ê°™ìŠµë‹ˆë‹¤.\r\n\r\n[ ë„¤íŠ¸ì›Œí¬ í• ë‹¹ ì •ë³´ ]\r\nIPv4ì£¼ì†Œ           : 112.216.0.0 - 112.223.255.255 (/13)\r\nê¸°ê´€ëª…             : (ì£¼)ì—˜ì§€ìœ í”ŒëŸ¬ìŠ¤\r\nì„œë¹„ìŠ¤ëª…           : BORANET\r\nì£¼ì†Œ               : ì„œìš¸íŠ¹ë³„ì‹œ ìš©ì‚°êµ¬ í•œê°•ëŒ€ë¡œ 32\r\nìš°íŽ¸ë²ˆí˜¸           : 04389\r\ní• ë‹¹ì¼ìž           : 20090216\r\n\r\nì´ë¦„               : IPì£¼ì†Œ ë‹´ë‹¹ìž\r\nì „í™”ë²ˆí˜¸           : +82-2-10-1\r\nì „ìžìš°íŽ¸           : ipadm@lguplus.co.kr\r\n\r\nì¡°íšŒí•˜ì‹  IPv4ì£¼ì†ŒëŠ” ìœ„ì˜ ê´€ë¦¬ëŒ€í–‰ìžë¡œë¶€í„° ì•„ëž˜ì˜ ì‚¬ìš©ìžì—ê²Œ í• ë‹¹ë˜ì—ˆìœ¼ë©°, í• ë‹¹ ì •ë³´ëŠ” ë‹¤ìŒê³¼ ê°™ìŠµë‹ˆë‹¤.\r\n--------------------------------------------------------------------------------\r\n\r\n\r\n[ ë„¤íŠ¸ì›Œí¬ í• ë‹¹ ì •ë³´ ]\r\nIPv4ì£¼ì†Œ           : 112.220.69.48 - 112.220.69.55 (/29)\r\nê¸°ê´€ëª…             : LGìœ í”ŒëŸ¬ìŠ¤\r\në„¤íŠ¸ì›Œí¬ êµ¬ë¶„      : CUSTOMER\r\nì£¼ì†Œ               : ê²½ê¸°ë„ ì•ˆì–‘ì‹œ ë§Œì•ˆêµ¬ ë•ì²œë¡œ 37\r\nìš°íŽ¸ë²ˆí˜¸           : 14088\r\ní• ë‹¹ë‚´ì—­ ë“±ë¡ì¼    : 20120905\r\n\r\nì´ë¦„               : IPì£¼ì†Œ ë‹´ë‹¹ìž\r\nì „í™”ë²ˆí˜¸           : +82-2-2089-7750\r\nì „ìžìš°íŽ¸           : b8273338@user.bora.net\r\n\r\n\r\n# ENGLISH\r\n\r\nKRNIC is not an ISP but a National Internet Registry similar to APNIC.\r\n\r\n[ Network Information ]\r\nIPv4 Address       : 112.216.0.0 - 112.223.255.255 (/13)\r\nOrganization Name  : LG DACOM Corporation\r\nService Name       : BORANET\r\nAddress            : Seoul Yongsan-gu Hangang-daero 32\r\nZip Code           : 04389\r\nRegistration Date  : 20090216\r\n\r\nName               : IP Manager\r\nPhone              : +82-2-10-1\r\nE-Mail             : ipadm@lguplus.co.kr\r\n\r\n--------------------------------------------------------------------------------\r\n\r\nMore specific assignment information is as follows.\r\n\r\n[ Network Information ]\r\nIPv4 Address       : 112.220.69.48 - 112.220.69.55 (/29)\r\nOrganization Name  : LG Uplus\r\nNetwork Type       : CUSTOMER\r\nAddress            : Gyeonggi-do Manan-gu, Anyang-si Deokcheon-ro 37\r\nZip Code           : 14088\r\nRegistration Date  : 20120905\r\n\r\nName               : IP Manager\r\nPhone              : +82-2-2089-7750\r\nE-Mail             : b8273338@user.bora.net\r\n\r\n\r\n\r\n- KISA/KRNIC WHOIS Service -\r\n\r\n`;
	const whois_ns67_229_101_42: string = `[Querying whois.arin.net]\r\n[Redirected to vault.krypt.com:4321]\r\n[Querying vault.krypt.com]\r\n[vault.krypt.com]\r\n%rwhois V-1.0,V-1.5:00090h:00 vault.krypt.com (Ubersmith RWhois Server V-3.1.5)\r\nautharea=67.229.101.0/24\r\nxautharea=67.229.101.0/24\r\nnetwork:Class-Name:network\r\nnetwork:Auth-Area:67.229.101.0/24\r\nnetwork:ID:NET-94915.67.229.101.40/29\r\nnetwork:Network-Name:Standard Network Master IP Assignment\r\nnetwork:IP-Network:67.229.101.40/29\r\nnetwork:IP-Network-Block:67.229.101.40 - 67.229.101.47\r\nnetwork:Org-Name:VPLS Inc.\r\nnetwork:Street-Address:\r\nnetwork:City:\r\nnetwork:State:\r\nnetwork:Postal-Code:\r\nnetwork:Country-Code:US\r\nnetwork:Tech-Contact:MAINT-94915.67.229.101.40/29\r\nnetwork:Created:20160509022308000\r\nnetwork:Updated:20160509022308000\r\nnetwork:Updated-By:support@vpls.net\r\ncontact:POC-Name:VPLS Technical Assistance Center\r\ncontact:POC-Email:support@vpls.net\r\ncontact:POC-Phone:2134069000\r\ncontact:Tech-Name:VPLS Technical Assistance Center\r\ncontact:Tech-Email:support@vpls.net\r\ncontact:Tech-Phone:2134069000\r\ncontact:Abuse-Name:VPLS Abuse Department\r\ncontact:Abuse-Email:abuse@vpls.net\r\ncontact:Abuse-Phone:213-406-9018\r\n%ok\r\n`;
	const whois_ns69_10_58_155: string = `[Querying whois.arin.net]\r\n[Redirected to rwhois.trouble-free.net:4321]\r\n[Querying rwhois.trouble-free.net]\r\n[rwhois.trouble-free.net]\r\n%rwhois V-1.5:003fff:00 city.trouble-free.net (by Network Solutions, Inc. V-1.5.9.5)\r\nnetwork:Class-Name:network\r\nnetwork:ID:NETBLK-INTSRV.69.10.32.0/19\r\nnetwork:Auth-Area:69.10.32.0/19\r\nnetwork:Network-Name:INTSRV-69.10.32.0\r\nnetwork:IP-Network:69.10.32.0/29\r\nnetwork:Org-Name:VPMANAGE\r\nnetwork:Street-Address:110b meadowlands pkwy\r\nnetwork:City:Toronto\r\nnetwork:State:ON\r\nnetwork:Postal-Code:07094\r\nnetwork:Country-Code:US\r\nnetwork:Created:20100720\r\nnetwork:Updated:20150922\r\nnetwork:Updated-By:abuse@interserver.net\r\n\r\n%referral rwhois://root.rwhois.net:4321/auth-area=.\r\n%ok\r\n`;
	const whois_ns104_168_144_18: string = `[Querying whois.arin.net]\r\n[Redirected to rwhois.hostwinds.com:4321]\r\n[Querying rwhois.hostwinds.com]\r\n[rwhois.hostwinds.com]\r\n%rwhois V-1.5:003fff:00 rwhois.hostwinds.com (by Network Solutions, Inc. V-1.5.9.5)\r\nnetwork:Class-Name:network\r\nnetwork:ID:Hostwinds Block-104.168.144.18/32\r\nnetwork:Auth-Area:104.168.144.18/32\r\nnetwork:Network-Name:Network\r\nnetwork:IP-Network:104.168.144.18/32\r\nnetwork:IP-Network-Block:104.168.144.18 - 104.168.144.18\r\nnetwork:Customer Organization:Riko\r\nnetwork:Customer Address;I:872 Terrace Lane West\r\nnetwork:Customer City;I:Diamond Bar\r\nnetwork:Customer State/Province;I:California\r\nnetwork:Customer Postal Code;I:91765\r\nnetwork:Customer Country Code;I:US\r\nnetwork:Organization;I:Hostwinds LLC\r\nnetwork:Tech-Contact;I:Abuse@hostwinds.com\r\nnetwork:Admin-Contact;I:Abuse@hostwinds.com\r\nnetwork:Abuse-Contact;I:Abuse@hostwinds.com\r\n\r\n%referral rwhois://root.rwhois.net:4321/auth-area=.\r\n%ok\r\n`;
	const whois_SingleHopNet184_154: string = `[Querying whois.arin.net]
[Redirected to rwhois.singlehop.net:4321]
[Querying rwhois.singlehop.net]
[rwhois.singlehop.net]
%rwhois V-1.5:003eff:00 rwhois.singlehop.com (by Network Solutions, Inc. V-1.5.9.5)
network:Class-Name:network
network:ID:ORG-SINGL-8.184-154-139-0/26
network:Auth-Area:184.154.0.0/16
network:IP-Network:184.154.139.0/26
network:Organization:Innovative Business Services (dba SiteLock)
network:Street-Address:8125 N 86th Place
network:City:Scottsdale
network:State:AZ
network:Postal-Code:85258
network:Country-Code:US
network:Tech-Contact;I:NETWO1546-ARIN
network:Admin-Contact;I:NETWO1546-ARIN
network:Abuse-Contact;I:ABUSE2492-ARIN
network:Created:20150331
network:Updated:20150331

%referral rwhois://root.rwhois.net:4321/auth-area=.
%ok

`;
	const whois_arin17_142_171_7: string =
		`[Querying whois.arin.net]\r\n[whois.arin.net]\r\n\r\n#\r\nNetRange:       17.0.0.0 - 17.255.255.255\r\nCIDR:           17.0.0.0/8\r\nNetName:        APPLE-WWNET\r\nOrganization:   Apple Inc. (APPLEC-1-Z)\r\n \r\nOrgName:        Apple Inc.\r\nOrgId:          APPLEC-1-Z\r\nOrgAbuseHandle: APPLE11-ARIN\r\nOrgAbuseName:   Apple Abuse\r\nOrgAbusePhone:  +1-408-974-7777 \r\nOrgAbuseEmail:  abuse@apple.com\r\n#`;
	//
	beforeEach(() => {
		sut = new WhoIsAbuse( );
	});
	//
	it('should be created', ( ) => {
		console.log( '=================================\n' +
									'WhoIsAbuse: should create ...' );
		expect( sut ).toBeTruthy();
	});
	//
	// ripe: Réseaux IP Européens Network Coordination Centre (Europe)
	//
	it('should get abuse data for be ripe 94 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ripe94_41_54_105 );
		// console.log( `94.41.54.105: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'ripe.net' );
		expect( sut.net ).toEqual( 'UBN' );
		expect( sut.abuse ).toEqual( 'abuse@ufanet.ru' );
	});
	//
	it('should get abuse data for be ripe 46 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ripe46_161_62_245 );
		// console.log( `46.161.62.245: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'ripe.net' );
		expect( sut.net ).toEqual( 'QUALITYNETWORK' );
		expect( sut.abuse ).toEqual( 'abuse@pinspb.ru' );
	});
	//
	// arin: Americian (North) Registry of Internet Numbers
	//
	it('should get abuse data for be arin 246 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_arin246_161_212_245 );
		// console.log( `246.161.212.245: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'arin.net' );
		expect( sut.net ).toEqual( 'SPECIAL-IPV4-FUTURE-USE-IANA-RESERVED' );
		expect( sut.abuse ).toEqual( 'abuse@iana.org' );
	});
	//
	it('should get abuse data for be arin 104 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_arin104_199_208_27 );
		// console.log( `104.199.208.27: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'arin.net' );
		expect( sut.net ).toEqual( 'GOOGLE-CLOUD' );
		expect( sut.abuse ).toEqual( 'google-cloud-compliance@google.com' );
	});
	//
	// afrinic: Africian Network Information Centre
	//
	it('should get abuse data for be afrinic 197 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_afr197_48_169_77 );
		// console.log( `197.48.169.77: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'afrinic.net' );
		expect( sut.net ).toEqual( 'All-22' );
		expect( sut.abuse ).toEqual( 'abuse@tedata.net' );
	});
	//
	// apnic: Asian-Pacfic Network Information Centre
	//
	it('should get abuse data for be apnic 1 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ap1_52_34_175 );
		// console.log( `1.52.34.175: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'apnic.net' );
		expect( sut.net ).toEqual( 'FPTDYNAMICIP-NET' );
		expect( sut.abuse ).toEqual( 'hm-changed@vnnic.vn' );
	});
	//
	it('should get abuse data for be apnic 103 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ap103_18_33_107 );
		// console.log( `103.18.33.107: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'apnic.net' );
		expect( sut.net ).toEqual( 'MLD-ID' );
		expect( sut.abuse ).toEqual( 'abuse@medialintas.com' );
	});
	//
	// lacnic: Latin America and Caribbean Network Information Centre
	//
	it('should get abuse data for be lacnic 138 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_lac138_36_27_5 );
		// console.log( `138.36.27.5: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'lacnic.net' );
		expect( sut.net ).toEqual( 'CABLEMAX C.X.A' );
		expect( sut.abuse ).toEqual( 'andresacosta@CABLEMAX.COM.DO' );
	});
	//
	it('should get abuse data for be lacnic 177 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_lac177_228_94_39 );
		// console.log( `177.228.94.39: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'lacnic.net' );
		expect( sut.net ).toEqual( 'Mega Cable, S.A. de C.V.' );
		expect( sut.abuse ).toEqual( 'nic_tech@MEGACABLE.COM.MX' );
	});
	//
	// nic.br, Brazilian Network Information Center
	//
	it('should get abuse data for be nic.br 177 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_br177_37_164_71 );
		// console.log( `177.37.164.71: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'nic.br' );
		expect( sut.net ).toEqual( 'BRISANET SERVICOS DE TELECOMUNICACOES LTDA' );
		expect( sut.abuse ).toEqual( 'cert@cert.br' );
	});
	//
	// twnic: Taiwan NIC
	//
	it('should get abuse data for be twnic 114 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_tw114_45_70_76 );
		// console.log( `114.45.70.76: ${sut.nic} ${sut.net} ${sut.abuse}` );
		// let net = sut.net.split ('').map (function (c) { return c.charCodeAt (0); });
		expect( sut.nic ).toEqual( 'twnic.net' );
		expect( sut.net ).toEqual( 'HINET-NET' );
		expect( sut.abuse ).toEqual( 'network-adm@hinet.net' );
	});
	//
	// krnic: Korea NIC
	//
	it('should get abuse data for be krnic 112 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_kr112_220_69_50 );
		// console.log( `112.220.69.50: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'krnic.net' );
		expect( sut.net ).toEqual( 'LG DACOM Corporation' );
		expect( sut.abuse ).toEqual( 'ipadm@lguplus.co.kr' );
	});
	//
	// network solutions: privately managed
	//
	// hostwinds
	it('should get abuse data for be network solutions 67 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ns67_229_101_42 );
		// console.log( `67.229.101.42: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'krypt.com' );
		expect( sut.net ).toEqual( 'VPLS Inc.' );
		expect( sut.abuse ).toEqual( 'abuse@vpls.net' );
	});
	// trouble-free
	it('should get abuse data for be network solutions 69 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ns69_10_58_155 );
		// console.log( `69.10.58.155: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'trouble-free.net' );
		expect( sut.net ).toEqual( 'VPMANAGE' );
		expect( sut.abuse ).toEqual( '' );
	});
	// hostwinds
	it('should get abuse data for be network solutions 104 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_ns104_168_144_18 );
		// console.log( `104.168.144.18: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'hostwinds.com' );
		expect( sut.net ).toEqual( 'Riko' );
		expect( sut.abuse.toLocaleLowerCase() ).toEqual( 'abuse@hostwinds.com' );
	});
	// singlehop
	it('should get abuse data for be network solutions single-hop 184.154 nic ...', ( ) => {
		sut.GetWhoIsAbuse( whois_SingleHopNet184_154 );
		// console.log( `184.154.10.18: ${sut.nic} ${sut.net} ${sut.abuse}` );
		expect( sut.nic ).toEqual( 'singlehop.net' );
		expect( sut.net ).toEqual( '' );
		expect( sut.abuse.toLocaleLowerCase() ).toEqual( '' );
	});
	// jpnic: Japan
	//
	// Ubersmith RWhois Server:
	// amanah, cogentco, vault.krypt, quadranet, securedservers
	// Network Solutions, Inc.:
	// corp.tn.contina.com, gin.ntt.net, hostwinds, micfo, shawcable, singlehop, telus, thegcloud, trouble-free, twtelecom, unlimitednet
	//
	// GoodAbuseEmail(): boolean
	// 'hostmaster@nic.ad.jp', 'abuse@ripe.net'
	//
	it('should know abuse e-mail is good ...', ( ) => {
		sut.abuse = 'abuse@microsoft.com';
		// console.log( `Abuse e-mail: ${sut.abuse}` );
		expect( sut.BadAbuseEmail( ) ).toEqual( false );
	});
	//
	it('should know abuse e-mail is bad ...', ( ) => {
		sut.abuse = 'hostmaster@nic.ad.jp';
		// console.log( `Abuse e-mail: ${sut.abuse}` );
		expect( sut.BadAbuseEmail( ) ).toEqual( true );
	});
	//
	it('should know no abuse e-mail is bad ...', ( ) => {
		sut.abuse = '';
		// console.log( `Abuse e-mail: ${sut.abuse}` );
		expect( sut.BadAbuseEmail( ) ).toEqual( true );
	});
	//
	it('should know poorly formed abuse e-mail is bad ...', ( ) => {
		sut.abuse = 'abuse2492-arin';
		// console.log( `Abuse e-mail: ${sut.abuse}` );
		expect( sut.BadAbuseEmail( ) ).toEqual( true );
		console.log(
			'End of whois-abuse.spec\n' +
			'=================================' );
	});
	//
	// GetNIC( raw: string ): string
	//
	it('should get NIC data for be arin 17 nic ...', ( ) => {
		sut.GetNIC( whois_arin17_142_171_7 );
		// console.log( `17.142.171.7: ${sut.nic}` );
		expect( sut.nic ).toEqual( 'arin.net' );
	});
	//
});
// ===========================================================================
