//
using System;
//
namespace NSG.Identity.Incidents
{
    // Minimum implementation of the class
    public interface IServer
    {
        int ServerId { get; set; }       // The type of the key.
        string ServerShortName { get; set; } // The unique name of the server.
    }
}
