SMTP configuration for password reset emails

Required env vars in backend/.env:

- SMTP_HOST (e.g. smtp.gmail.com)
- SMTP_PORT (587 for STARTTLS, 465 for SSL)
- SMTP_USER (your SMTP username/email)
- SMTP_PASS (your SMTP password or app password)
- Optional SMTP_FROM (display From address)

Gmail example:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.address@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="ToDoX <your.address@gmail.com>"

Notes
- Port 587 uses STARTTLS (secure=false then upgraded), port 465 uses SSL (secure=true).
- After setting env vars, run `npm install` in backend to install nodemailer, then start the server.
- The reset link will point to `${FRONTEND_URL}/reset?token=...`. Ensure FRONTEND_URL is set.
