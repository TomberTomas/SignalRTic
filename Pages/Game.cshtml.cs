using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace SignalRChat.Pages
{
    public class GameModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        [BindProperty(SupportsGet=true)]
        public int circlePlayer { get; set; }
        
        [BindProperty(SupportsGet=true)]
        public string roomName { get; set; }
        
        [BindProperty(SupportsGet=true)]
        public string userName { get; set; }


        public GameModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}
