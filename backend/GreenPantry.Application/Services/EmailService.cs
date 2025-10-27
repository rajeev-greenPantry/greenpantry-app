using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;

namespace GreenPantry.Application.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpEmail;
    private readonly string _smtpPassword;
    private readonly bool _enableSsl;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        
        _smtpHost = _configuration["SMTP:Host"] ?? "smtp.gmail.com";
        _smtpPort = int.Parse(_configuration["SMTP:Port"] ?? "587");
        _smtpEmail = _configuration["SMTP:Email"] ?? "";
        _smtpPassword = _configuration["SMTP:Password"] ?? "";
        _enableSsl = bool.Parse(_configuration["SMTP:EnableSSL"] ?? "true");
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            _logger.LogInformation("Attempting to send email to {ToEmail} from {FromEmail}", toEmail, _smtpEmail);
            
            if (string.IsNullOrEmpty(_smtpEmail))
            {
                _logger.LogError("SMTP email is not configured");
                throw new InvalidOperationException("SMTP email is not configured");
            }

            using (var client = new SmtpClient(_smtpHost, _smtpPort))
            {
                client.Credentials = new NetworkCredential(_smtpEmail, _smtpPassword);
                client.EnableSsl = _enableSsl;

                var message = new MailMessage(_smtpEmail, toEmail)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                await client.SendMailAsync(message);
                _logger.LogInformation("Email sent successfully to {Email}", toEmail);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            throw;
        }
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken, string userId)
    {
        var subject = "Reset Your GreenPantry Password";
        var resetLink = $"https://azure.greenpantry.in/reset-password?token={resetToken}&userId={userId}";
        
        var body = $@"
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background-color: #f9fafb; padding: 30px; }}
        .button {{ display: inline-block; background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; color: #6b7280; padding: 20px; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🛒 GreenPantry</h1>
        </div>
        <div class='content'>
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your GreenPantry account.</p>
            <p>Click the button below to reset your password:</p>
            <a href='{resetLink}' class='button'>Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style='word-break: break-all;'>{resetLink}</p>
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>Best regards,<br>GreenPantry Team</p>
        </div>
        <div class='footer'>
            <p>© 2025 GreenPantry. All rights reserved.</p>
            <p>This is an automated message. Please do not reply.</p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(toEmail, subject, body);
    }
}

