# Mỹ Nguyên Cafe Invitation ☕

Interactive React invitation website with:

- Area selection in Ho Chi Minh City
- Cafe list filtered by selected area
- Custom location flow via Google Maps
- User-selected date and time
- Confirmation screen
- Spring Boot backend that sends the final selection to `ndao9983@gmail.com`
- Framer Motion animations

## 1. Frontend

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

## 2. Backend

Requirements: Java 21 and Maven.

Create a Gmail App Password for the Gmail account that will send the email. Do not put your normal Gmail password in the project.

Windows PowerShell:

```powershell
$env:GMAIL_USERNAME="your-sender@gmail.com"
$env:GMAIL_APP_PASSWORD="your-16-character-app-password"
$env:INVITATION_RECIPIENT="ndao9983@gmail.com"
```

Then:

```bash
cd backend
mvn spring-boot:run
```

Backend: http://localhost:8080

The frontend Vite proxy forwards `/api/*` to the backend.

## Flow

Hello → Choose area → Suggested cafes OR Google Maps custom place → Choose date/time → Confirm → Email

The custom Google Maps option opens a search for coffee shops in the selected area. The recipient then enters the cafe name and can optionally provide its address and Google Maps URL.
