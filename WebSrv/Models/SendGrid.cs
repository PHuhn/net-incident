// ===========================================================================
// File: SendGrid.cs
// Author: Phil Huhn
// Created Date: 2017-12-23
//
// SendGrid’s v3 Web API
// https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//
namespace WebSrv.Models
{
    //
    public class EmailAddress
    {
        public string email;
        public string name;
        //
        public EmailAddress()
        {
            this.email = "";
            this.name = "";
        }
        public EmailAddress( string email )
        {
            this.email = email;
            this.name = "";
        }
        public EmailAddress(string name, string email)
        {
            this.email = email;
            this.name = name;
        }
    }
    //
    public class EmailContent
    {
        public string type;   // "text/plain"            
        public string value;
        public EmailContent( )
        {
            this.type = "text/plain";
            this.value = "";
        }
        public EmailContent(string body)
        {
            this.type = "text/plain";
            this.value = body;
        }
    }
    //
    public class EmailPersonalization
    {
        public EmailAddress[] to;
        public EmailAddress[] cc;
        public EmailAddress[] bcc;
        public string subject;
        //
        public EmailPersonalization( string to, string subject )
        {
            this.to = new EmailAddress[] { new EmailAddress(to) };
            this.cc = new EmailAddress[]{};
            this.bcc = new EmailAddress[]{};
            this.subject = subject;
        }
    }
    //
    public class EmailRequest
    {
        public EmailPersonalization[] personalizations;
        public EmailAddress from;
        public EmailContent[] content;
        public Object[] attachments;
        //
        public EmailRequest( string from, string to, string subject, string body )
        {
            this.personalizations =
                new EmailPersonalization[] { new EmailPersonalization(to, subject) };
            this.from = new EmailAddress(from);
            this.content = new EmailContent[] { new EmailContent(body) };
        }
    }
    //
}
// ===========================================================================
