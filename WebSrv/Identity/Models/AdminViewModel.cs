//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
//
namespace NSG.Identity.Models
{
    public class RoleViewModel
    {
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Id")]
        public string Id { get; set; }
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Role Name")]
        public string Name { get; set; }
    }

    public class EditUserViewModel
    {
        public string Id { get; set; }
        //
        [Required(AllowEmptyStrings = false)]
        [MaxLength(256)]
        [Display(Name = "User Name")]
        public string UserName { get; set; }
        //
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }
        //
        [Required]
        [MaxLength(100)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        //
        [Required]
        [MaxLength(100)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        //
        [Required]
        [MaxLength(100)]
        [Display(Name = "Full Name")]
        public string FullName { get; set; }
        //
        [Required]
        [MaxLength(16)]
        [Display(Name = "Nic Name")]
        public string UserNicName { get; set; }
        //
        [MaxLength(256)]
        [Display(Name = "Phone #")]
        public string PhoneNumber { get; set; }
        //
        public IEnumerable<SelectListItem> RolesList { get; set; }
        //
        public List<SelectListItem> ServersList { get; set; }
        //
    }
}