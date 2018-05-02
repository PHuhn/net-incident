using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
namespace WebSrv.Models
{
    //
    /// <summary>
    /// POCO of a SelectItem.
    /// </summary>
    /// <remarks></remarks>
    public class SelectItem
    {
        public object value { get; set; }
        public string label { get; set; }
        public string styleClass { get; set; }
        //
        /// <summary>
        /// Create a SelectItem using parameter-less (default) constructor.
        /// </summary>
        /// <remarks></remarks>
        public SelectItem()
        {
            this.value = "";
            this.label = "";
            this.styleClass = "";
        }
        //
        /// <summary>
        /// Create a SelectItem object using 2 parameters constructor, default selected to false.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="label"></param>
        /// <remarks></remarks>
        public SelectItem(string value, string label)
        {
            this.value = value;
            this.label = label;
            this.styleClass = "";
        }
        //
        /// <summary>
        /// Create a new object using all columns constructor.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="label"></param>
        /// <param name="selected"></param>
        /// <remarks></remarks>
        public SelectItem(string value, string label, string styleClass)
        {
            this.value = value;
            this.label = label;
            this.styleClass = styleClass;
        }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            return String.Format("record:[value: {0}, label: {1}, styleClass: {2}]",
                this.value, this.label, this.styleClass);
        }
        //
    }
    //
    /// <summary>
    /// Collection of methods that are used by combo-box or SelectItems.
    /// </summary>
    public partial class SelectItemAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        ApplicationDbContext _niEntities = null;
        bool _external = false;
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public SelectItemAccess()
        {
            //
            _niEntities = ApplicationDbContext.Create();
            _external = false;
            //
        }
        //
        /// <summary>
        /// Create a one parameter constructor.
        /// </summary>
        public SelectItemAccess(ApplicationDbContext networkIncidentEntities)
        {
            //
            _niEntities = networkIncidentEntities;
            _external = true;
            //
        }
        //
        /// <summary>
        /// Cleanup resources.
        /// </summary>
        public void Dispose()
        {
            //
            if (_external == false)
            {
                _niEntities.Dispose();
            }
            //
        }
        //
        #endregion
        //
        //
        // ========================================================================
        //
        #region "programmatic"
        //
        //
        #endregion
        //
        // ========================================================================
        //  Private
        //
        #region "private methods"
        //
        //
        #endregion
        //
        // ========================================================================
        //
        #region "db source methods"
        //
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<SelectItem> NoteTypes()
        {
            return
                _niEntities.NoteTypes
                .Select(_nt => new SelectItem {
                    value = _nt.NoteTypeId.ToString(),
                    label = _nt.NoteTypeShortDesc
                }).ToList();
        }
        //
        public List<SelectItem> NICs()
        {
            return
                _niEntities.NICs
                .Select(_n => new SelectItem
                {
                    value = _n.NIC_Id,
                    label = _n.NIC_Id
                }).ToList();
        }
        //
        public List<SelectItem> IncidentTypes()
        {
            return
                _niEntities.IncidentTypes
                .Where(_it => _it.IncidentTypeId > 0)
                .Select(_it => new SelectItem
                {
                    value = _it.IncidentTypeId.ToString(),
                    label = _it.IncidentTypeShortDesc
                }).ToList();
        }
        //
        #endregion
        //
    }
}
