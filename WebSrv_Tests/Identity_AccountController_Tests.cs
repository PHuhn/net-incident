using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Principal;
using System.Net.Http;
using System.Web.Http.Hosting;
using System.Web.Http.Routing;
using System.Web;
using System.Web.Http.Controllers;
//
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.DataProtection;
//
using NSG.Identity.Api;
using NSG.Identity;
using NSG.Identity.Models;
using NSG.Identity.Incidents;
using Microsoft.AspNet.Identity.Owin;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class Identity_AccountController_Tests
    {
        //public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        //public UserInfoViewModel GetUserInfo()
        //public IHttpActionResult Logout()
        //public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        //public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        //public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        //public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        //public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        //public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        //public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        //public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        //public async Task<IHttpActionResult> AddToServers(string userId, string serverShortName)
        //public async Task<IHttpActionResult> DeleteFromServers(string userId, string serverShortName)
        //
        private ApplicationDbContext _context = null;
        private ApplicationUserStore _userStore = null;
        private ApplicationUserManager _userManager = null;
        ApplicationServerManager _serverManager = null;
        AccountController _sut = null;
        HttpRequestMessage _request = null;
        HttpConfiguration _config = null;
        string _userName = "pnh";
        //
        // Use TestInitialize to run code before running each test 
        [TestInitialize()]
        public void MyTestInitialize()
        {
            //var _owin = HttpContext.GetOwinContext();
            var _provider = new DpapiDataProtectionProvider("WebSrv Identity");
            _context = ApplicationDbContext.Create();
            _userStore = new ApplicationUserStore(_context);
            _userManager = new ApplicationUserManager(_userStore);
            _userManager.UserTokenProvider =
                new DataProtectorTokenProvider<ApplicationUser>(_provider.Create("EmailConfirmation"));
            _userManager.EmailService = new EmailService();
            _serverManager = new ApplicationServerManager(new ServerStore(_context));

            // https://stackoverflow.com/questions/11779311/testing-webapi-controller-url-link
            _config = new HttpConfiguration();
            _config.Routes.MapHttpRoute(
                name: "ConfirmEmailRoute",
                routeTemplate: "api/Account/ConfirmEmail/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            _config.Routes.MapHttpRoute(
                name: "Default",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });
            // Request
            _request = new HttpRequestMessage(HttpMethod.Get, "http://localhost/api/Account");
            _request.Properties[HttpPropertyKeys.HttpConfigurationKey] = _config;
            _request.Properties[HttpPropertyKeys.HttpRouteDataKey] =
                new HttpRouteData(new HttpRoute());
            //
            _sut = new AccountController(_userManager, _serverManager, null)
            {
                Request = _request
            };
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void MyTestCleanup()
        {
            //_userManager.Dispose();
            _serverManager.Dispose();
            _sut.Dispose();
        }
        //
        /// <summary>
        /// _sut.Register(_registerModel);
        /// _sut.ChangePassword(_passModel);
        /// </summary>
        [TestMethod]
        public void Identity_AccountController_Test()
        {
            //
            string _password = "p@ssW0rd";
            RegisterBindingModel _registerModel = new RegisterBindingModel()
            {
                UserName = _userName,
                Email = _userName + "@any.net",
                FirstName = "Phil",
                LastName = "H",
                UserNicName = "Phil",
                Password = _password,
                ConfirmPassword = _password,
                ServerShortName = "nsg memb"
            };
            //
            var _ok = (IHttpActionResult)new System.Web.Http.Results.OkResult(_sut);
            Task.Run(async () =>
            {
                var _result = await _sut.Register(_registerModel);
                Console.WriteLine(_result.ToString());
                Assert.AreEqual(_ok.ToString(), _result.ToString());
            }).GetAwaiter().GetResult();
            // Console.WriteLine(_result.ToString());
            ApplicationUser _user = _userManager.FindByName(_registerModel.UserName);
            Assert.IsNotNull(_user);
            //
            //  Pseudo authenticate
            //
            ClaimsIdentity _claimIdentity = new ClaimsIdentity(
                new GenericIdentity(_user.UserName),
                new[] { new Claim(ClaimTypes.NameIdentifier, _user.Id) });
            _sut.User = new GenericPrincipal(_claimIdentity, new string[] { "User" });
            System.Threading.Thread.CurrentPrincipal = _sut.User;
            Console.WriteLine("Id: " + _sut.User.Identity.GetUserId());
            Console.WriteLine("Nm: " + _sut.User.Identity.GetUserName());
            //
            //  Change the current users password
            //
            Task.Run(async () =>
            {
                ChangePasswordBindingModel _passModel = new ChangePasswordBindingModel()
                {
                    OldPassword = _password,
                    NewPassword = _password + "-1",
                    ConfirmPassword = _password + "-1"
                };
                var _result = await _sut.ChangePassword(_passModel);
                Console.WriteLine("ChangePassword: " + _result.ToString());
                Assert.AreEqual(_ok.ToString(), _result.ToString());
            }).GetAwaiter().GetResult();
            ApplicationUser _userPass = _userManager.FindByName(_registerModel.UserName);
            Console.WriteLine("U-: " + _user.PasswordHash);
            Console.WriteLine("UP: " + _userPass.PasswordHash);
            Console.WriteLine("U-: " + _user.SecurityStamp);
            Console.WriteLine("UP: " + _userPass.SecurityStamp);
            Task.Run(async () =>
            {
                ClaimsIdentity oAuthIdentity =
                    await _userPass.GenerateUserIdentityAsync(_userManager,
                        OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity =
                    await _userPass.GenerateUserIdentityAsync(_userManager,
                        CookieAuthenticationDefaults.AuthenticationType);
                Console.WriteLine(cookieIdentity.ToString());
            }).GetAwaiter().GetResult();
            // SetPassword is for user w/o a password
            // cleanup
            var _access = new WebSrv.Models.UserAccess(_context);
            _access.Delete(_userPass.Id);
        }
        //
        [TestMethod]
        public void Identity_AccountController_SetIdentity_Test()
        {
            string _id = "feb7ef96-d119-4f61-bdea-0a2949be270f";
            string _name = "pnh";
            var _identity = new GenericIdentity(_id);
            Console.WriteLine(
                String.Format("Id: {0}, Nm: {1}", 
                _identity.GetUserId(), _identity.GetUserName()));
            Console.WriteLine(" ");
            ClaimsIdentity _claimIdentity = new ClaimsIdentity(
                new GenericIdentity(_name),
                new[] { new Claim(ClaimTypes.NameIdentifier, _id) });
            var _gp = new GenericPrincipal(_claimIdentity, new string[] { "User" });
            Console.WriteLine(
                String.Format("Id: {0}, Nm: {1}",
                _claimIdentity.GetUserId(), _claimIdentity.GetUserName()));
            Assert.AreNotEqual("", _claimIdentity.GetUserId());
            Assert.AreNotEqual("", _claimIdentity.GetUserName());
        }
        //
        [TestMethod]
        public void Identity_AccountController_SendEmail_Test()
        {
            string _userName = "Phil";
            Task.Run(async () =>
            {
                ApplicationUser _user = await _userManager.FindByNameAsync( _userName );
                int _ret = await _sut.SendEmailConfirmation( _user );
                Console.WriteLine(_ret);
                Assert.AreEqual( 0, _ret );
            }).GetAwaiter().GetResult();
        }
        //
        // [TestMethod]
        public void Identity_AccountController_UrlHelper_Test()
        {
            var obj = new { userId = "111-11111", code = "A12B==", httproute = true };
            var _config = _sut.Request.GetConfiguration();
            var _url = new System.Web.Mvc.UrlHelper();
            var _out = _url.RouteUrl("ConfirmEmailRoute", obj);
            string _rUrlPart = "api/Account/ConfirmEmail" + _out;
            Assert.AreNotEqual("", _rUrlPart);
        }
        //
        //[TestMethod]
        public void Identity_AccountController_Confirm_Email_Test()
        {
            Task.Run(async () =>
            {
                // these are the html un-encoded values, the e-mail message
                // will have encode values.
                string _userId = "111e33a7-22c1-4099-9393-38fa830a2cf6";
                string _code = "AQAAANCMnd8BFdERjHoAwE/Cl+sBAAAApJ/EIaYFr0+V37/f5R2qCAAAAAACAAAAAAAQZgAAAAEAACAAAAB6EqucSHGBHZ4uLkqugdABQlcSESbuK7QBqSizS4fzlAAAAAAOgAAAAAIAACAAAAAJLHw6qDMUG9FOywz4AUYVTez1OChG30jSXKafcFmWLmAAAACHVYZRWb5u+aPKgeco6JYz8EDtg2eq2x7Of4G5D6ySDmRm8VklnSDsb7nc41gK9KfU8npde5QKmGGRXtNv9q5gtNvp8gvOXIscwB3cFsM+xmzqdfhsBO0cJvMDr+aVdntAAAAALgExr/ku/v0I6lPg5IkSTuh1/9l7JWfaXK8yTsCsl+q3kiN7qeCTRdq2ayb9b64UGOHyP7zJS54XzLX2g1RRKg==";
                IHttpActionResult _res = await _sut.ConfirmEmail(_userId, _code);
            }).GetAwaiter().GetResult();
        }
        //
        // [TestMethod]
        public void Identity_AccountController_Startup_Test()
        {
            using (var _controller = new AccountController())
            {
                // The request context property on the request must be null or match ApiController.RequestContext.
                //HttpRequestContext _cont = new HttpRequestContext();
                //_cont.RouteData = (IHttpRouteData)_config.Routes;
                //_cont.Url.Link("Default",;
                //_request.SetRequestContext( _cont );
                //_controller.Request = _request;
                //ApplicationUser _u = _controller.UserManager.FindByName("pnh");
                //Console.WriteLine(_u.ToString());
            }
        }
        //
    }
}
