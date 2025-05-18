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
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
            font-family: 'Apple SD Gothic Neo', Arial, sans-serif;
          }

          .container {
            max-width: 520px;
            margin: 50px auto;
            padding: 32px 24px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          }

          .header {
            text-align: center;
            margin-bottom: 24px;
          }

          .header h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
          }

          .content {
            font-size: 15px;
            color: #555;
            line-height: 1.6;
            text-align: center;
          }

          .code-box {
            display: inline-block;
            margin: 24px 0;
            padding: 14px 24px;
            background-color: #f0f0f5;
            color: #111;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 2px;
            border-radius: 8px;
          }

          .footer {
            margin-top: 32px;
            font-size: 12px;
            text-align: center;
            color: #999;
          }

          .footer a {
            color: #007acc;
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
            <h1>이메일 인증 코드</h1>
          </div>
          <div class="content">
            <p>아래 인증 코드를 입력하여 이메일 인증을 완료해 주세요.</p>
            <div class="code-box">${code}</div>
            <p>이 코드는 발급 후 <strong>3분간 유효</strong>합니다.<br />
            만약 본인이 요청한 것이 아니라면, 이 메일은 무시하셔도 됩니다.</p>
          </div>
          <div class="footer">
            <p>이 메일은 자동으로 발송되었습니다. 회신하지 마세요.</p>
            <p>
              문의: <a href="mailto:white0581@naver.com">white0581@naver.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};
