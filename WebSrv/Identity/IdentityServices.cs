using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
//
using NSG.Library.Logger;
using NSG.Library.EMail;
//
namespace NSG.Identity
{
    //
    // add the following to ApplicationUserManager in ApplicationUserModel.cs:
    //  manager.EmailService = new EmailService();
    //
    /// <summary>
    /// Email service handler
    /// </summary>
    public class EmailService : IIdentityMessageService
    {
        //
        /// <summary>
        /// Email service handler send async method ...
        /// </summary>
        /// <param name="message">
        /// Email message is as follows:
        ///  <list type="bullet">
        ///   <item><description>Destination, i.e. To email, or SMS phone number,</description></item>
        ///   <item><description>Subject,</description></item>
        ///   <item><description>Message contents.</description></item>
        ///  </list>
        /// </param>
        /// <returns></returns>
        public Task SendAsync(IdentityMessage message)
        {
            // Email service here to send an email.
            //    <add key="Email:Enabled" value="true" />
            if( NSG.Library.Helpers.Config.GetBoolAppSettingConfigValue("Email:Enabled", false) )
            {
                string _from = NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Email:FromEmailName", "");
                IEMail _email =
                    new EMail(Log.Logger, _from, message.Destination, message.Subject, message.Body)
                        .Html(true).SendAsync();
                return Task.FromResult( 0 );
            }
            return Task.FromResult( 100 );
        }
    }
    //
    // add the following to ApplicationUserManager in ApplicationUserModel.cs:
    //  manager.SmsService = new SmsService();
    //
    /// <summary>
    /// SMS service handler
    /// </summary>
    public class SmsService : IIdentityMessageService
    {
        //
        /// <summary>
        /// SMS service handler send async method ...
        /// </summary>
        /// <param name="message">
        /// Message to be sent via SMS is as follows:
        ///  <list type="bullet">
        ///   <item><description>Destination, i.e. To email, or SMS phone number,</description></item>
        ///   <item><description>Subject,</description></item>
        ///   <item><description>Message contents.</description></item>
        ///  </list>
        /// </param>
        /// <returns>void task</returns>
        public Task SendAsync(IdentityMessage message)
        {
            // Plug in your sms service here to send a text message.
            return Task.FromResult(0);
        }
    }
}
//
