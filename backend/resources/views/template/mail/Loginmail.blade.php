<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    /* Webfont for modern look */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

    /* Apple Mail/iOS Animation */
    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }

        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animated {
        animation: slideIn 0.6s ease-out;
    }

    @media screen and (max-width: 600px) {
        .full-width {
            width: 100% !important;
        }

        .mobile-text {
            font-size: 32px !important;
        }
    }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #020617; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617;">
        <tr>
            <td align="center" style="padding: 40px 0;">

                <table class="full-width animated" width="600" border="0" cellspacing="0" cellpadding="0"
                    style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">

                    <tr>
                        <td height="6"
                            style="background: linear-gradient(90deg, #166534 0%, #22c55e 50%, #166534 100%);"></td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 40px 0 20px 0;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding-right: 15px;">
                                        <img src="https://res.cloudinary.com/dspcbwb5s/image/upload/v1777030064/svgviewer-png-output_jhzyiz.png"
                                            width="48" height="48"
                                            style="display: block; filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.4));">
                                    </td>
                                    <td style="border-left: 2px solid #166534; padding-left: 15px;">
                                        <div style="color: #ffffff; font-style: italic;">
                                            <div
                                                style="font-weight: 800; font-size: 26px; line-height: 1; letter-spacing: -1px; text-transform: uppercase;">
                                                LOGISTIC</div>
                                            <div
                                                style="font-size: 10px; font-weight: 600; letter-spacing: 4px; color: #4ade80; text-transform: uppercase; font-style: normal; margin-top: 4px;">
                                                Training Camp</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <div
                                style="display: inline-block; padding: 6px 16px; background-color: rgba(22, 101, 52, 0.2); border: 1px solid #166534; border-radius: 99px; color: #4ade80; font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 24px; text-transform: uppercase;">
                                System Update: Success
                            </div>

                            <h1 class="mobile-text"
                                style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 800; letter-spacing: -2px; line-height: 1;">
                                ACCESS <br><span style="color: #22c55e;">GRANTED.</span>
                            </h1>

                            <p
                                style="margin: 25px auto; max-width: 400px; color: #94a3b8; font-size: 16px; line-height: 1.6;">
                                Welcome to the next generation of logistics training. Your account is fully synchronized
                                and ready for deployment.
                            </p>

                            <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-top: 35px;">
                                <tr>
                                    <td align="center"
                                        style="background-color: #22c55e; border-radius: 8px; box-shadow: 0 10px 20px -10px rgba(34, 197, 94, 0.5);">
                                        <a href="{{ $link }}"
                                            style="display: inline-block; padding: 18px 40px; color: #020617; font-weight: 800; font-size: 16px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                                            Enter the Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="10">
                                <tr>
                                    <td width="50%"
                                        style="background-color: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 12px; padding: 20px;">
                                        <div style="color: #22c55e; font-size: 20px; margin-bottom: 5px;">⚡</div>
                                        <div style="color: #ffffff; font-weight: 600; font-size: 14px;">Fast Track</div>
                                        <div style="color: #64748b; font-size: 12px;">Immediate access to core modules.
                                        </div>
                                    </td>
                                    <td width="50%"
                                        style="background-color: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 12px; padding: 20px;">
                                        <div style="color: #22c55e; font-size: 20px; margin-bottom: 5px;">🛡️</div>
                                        <div style="color: #ffffff; font-weight: 600; font-size: 14px;">Secure Portal
                                        </div>
                                        <div style="color: #64748b; font-size: 12px;">Encrypted end-to-end training.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table width="600" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center"
                            style="color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                            Sent by Logistic Training Camp &bull; 2026 Technology
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>

</html>