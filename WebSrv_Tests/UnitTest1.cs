using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Script.Serialization;
using System.Net.Mail;
using SendGrid.Helpers.Mail;
using NSG.Library.EMail;
using NSG.Library.Helpers;
//
namespace WebSrv_Tests
{
    /// <summary>
    /// Summary description for UnitTest1
    /// </summary>
    [TestClass]
    public class UnitTest1
    {
        public UnitTest1()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void TimeSpan_Test()
        {
            Console.WriteLine(4 * 60 * 60);
            Console.WriteLine(TimeSpan.FromHours(4));
            Console.WriteLine(TimeSpan.FromSeconds(4*60*60));
        }

        [TestMethod]
        public void Deser_Test()
        {
            string sgEmail = "{\"contents\":[{\"value\":\"Hi\",\"type\":\"text/plain\"}],\"personalizations\":[{\"tos\":[{\"email\":\"abuse@internap.com\"}],\"ccs\":[],\"bccs\":[],\"subject\":\"Denial-of-service attack from 63.251.98.12\"}],\"from\":{\"email\":\"PhilHuhn@yahoo.com\",\"name\":\"Phil Huhn\"},\"subject\":\"Denial-of-service attack from 63.251.98.12\",\"plainTextContent\":\"\"}";
            JavaScriptSerializer j = new JavaScriptSerializer();
            SendGridMessage _sgm = (SendGridMessage)j.Deserialize(sgEmail, typeof(SendGridMessage));
            IEMail _email = new EMail().NewMailMessage(_sgm);
            Assert.AreEqual("Hi", ((MailMessage)_email.GetMailMessage()).Body);
        }

        public enum LogLevel
        {
            Audit = 0,
            Error = 1,
            Warning = 2,
            [System.ComponentModel.Description("Information")]Info = 3,
            Debug = 4,
            Verbose = 5
        };
        [TestMethod]
        public void Enum_GetName_Test()
        {
            string _actual = LogLevel.Warning.GetName();
            Console.WriteLine(_actual);
            Assert.AreEqual("Warning", _actual);
        }
        [TestMethod]
        public void Enum_GetDescription_Test()
        {
            string _actual = LogLevel.Info.GetDescription();
            Console.WriteLine(_actual);
            Assert.AreEqual("Information", _actual);
        }
    }
}
