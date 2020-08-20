using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace SignalRChat.Pages
{
    public class WatchModel : PageModel
    {
        private readonly ILogger<WatchModel> _logger;
        
        [BindProperty(SupportsGet=true)]
        public string roomName { get; set; }


        public WatchModel(ILogger<WatchModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}
