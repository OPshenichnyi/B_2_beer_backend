// This file contains the email templates that are sent to users when they sign up or request a password reset.
const translation = {
  en: {
    emailTitle: "Email verification - B2BEER",
    emailHeading: "Welcome to B2BEER!",
    registrationSubject:
      "Hello, your email was provided during registration on the B2BEER website!",
    message:
      "Thank you for registering on our website B2BEER. Please verify your email by clicking the button below.",
    button: "Verify email",
    messageDoNotRegister:
      "If you did not register on our website, simply ignore this letter.",
    footer: "&copy; 2024 B2BEER. All rights reserved.",
  },
  ua: {
    emailTitle: "Верифікація електронної пошти - B2BEER",
    emailHeading: "Ласкаво просимо до B2BEER!",
    registrationSubject: `Привіт, твою електронну адрессу було вказанно при реєстрації на сайті B2BEER!`,
    message:
      "Дякуємо за реєстрацію на нашому сайті B2BEER. Будь ласка, підтвердьте вашу електронну пошту, натиснувши на кнопку нижче.",
    button: "Підтвердити електронну пошту",
    messageDoNotRegister:
      "Якщо ви не реєструвались на нашому сайті, просто ігноруйте цей лист.",
    footer: "&copy; 2024 B2BEER. Всі права захищені.",
  },
};
const styles = `body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            width: 100px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        .content {
            text-align: center;
            padding: 20px 0;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #777;
        }`;

export const verificationEmailTemplate = (email, verificationLink, lang) => `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${
      lang === "en" ? translation.en.emailTitle : translation.ua.emailTitle
    }</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${
              lang === "en"
                ? translation.en.emailHeading
                : translation.ua.emailHeading
            }</h1>
        </div>
        <div class="content">
            <p>${
              lang === "en"
                ? translation.en.registrationSubject
                : translation.ua.registrationSubject
            }</p>
            <p>${email}</p>
            <p>${
              lang === "en" ? translation.en.message : translation.ua.message
            }</p>
            <a href="${verificationLink}" class="button">${
  lang === "en" ? translation.en.button : translation.ua.button
}</a>
            <p>${
              lang === "en"
                ? translation.en.messageDoNotRegister
                : translation.ua.messageDoNotRegister
            }</p>
        </div>
        <div class="footer">
            <p>${
              lang === "en" ? translation.en.footer : translation.ua.footer
            }</p>
        </div>
    </div>
</body>
</html>
`;
