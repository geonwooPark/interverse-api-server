export const getEmailTemplete = (code: number) => {
  return `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>이메일 인증</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #4caf50;
              font-size: 32px;
            }
            .content {
              font-size: 16px;
              line-height: 1.5;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 24px;
              font-weight: bold;
              color: black;
              background-color: #f2f2f2;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>이메일 인증</h1>
            </div>
            <div class="content">
              <p>
                안녕하세요! 아래의 인증번호를 입력하여 이메일 인증을 완료해주세요.
              </p>
              <div class="code">${code}</div>
              <p>
                이 인증번호는 3분 이내에 입력해야 하며, 만약 이 메일을 본 적이 없다면
                무시하셔도 됩니다.
              </p>
            </div>
            <div class="footer">
              <p>이 메일은 자동으로 발송된 메일입니다. 답변하지 마세요.</p>
              <p>
                문의 사항은
                <a href="mailto:white0581@naver.com">white0581@naver.com</a>으로
                보내주세요.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
};
