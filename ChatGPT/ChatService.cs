using System.Net.Http.Headers;
using System.Text.Json;

namespace ChatGPT;

public class ChatService
{
    private string apiKey;

    public ChatService(IConfiguration config)
    {
        this.apiKey = config["ApiKey"]!;
        if (string.IsNullOrWhiteSpace(this.apiKey))
        {
            throw new ArgumentNullException("ApkKey");
        }
    }
    
    public record Usage(int prompt_tokens, int completion_tokens, int total_tokens);
    public record Choice(int index, string finish_reason,  Message message);
    public record Message(string role, string content);
    public record Resp(string id, string Object, long created, Choice[] choices, Usage usage);
    
    public async Task<string> Chat(string message)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            client.Timeout = TimeSpan.FromSeconds(30);
            var resp = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", new
            {
                model = "gpt-3.5-turbo",
                messages = new Object[]
                {
                    new
                    {
                        role = "user",
                        content = message,
                    }
                },
            });
            resp.EnsureSuccessStatusCode();
            var content = await resp.Content.ReadFromJsonAsync<Resp>();
            return content.choices[0].message.content;
        }
    }
}