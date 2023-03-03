using Microsoft.AspNetCore.Mvc;

namespace ChatGPT.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ChatController : ControllerBase
{
    private ChatService _chatService;

    public ChatController(ChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    public async Task<string> Send()
    {
        var msg = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        return await _chatService.Chat(msg);
    }
}