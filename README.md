# Azure DevOps Daily Task Reminder

An automated workflow that checks your Azure DevOps tasks every morning at 8 AM and sends you an email reminder using Inngest.

## 🌟 Features

- **Automated Daily Reminders**: Runs every day at 8 AM via CRON
- **Azure DevOps Integration**: Fetches tasks assigned to you using Azure DevOps REST API
- **Smart Filtering**: Only shows tasks due today
- **Email Notifications**: Sends formatted task summaries via Resend
- **Automatic Retries**: Built-in retry logic for API failures
- **Detailed Logging**: Complete execution logs in Inngest dashboard

## 🏗️ Architecture

```
Daily CRON (8 AM)
    ↓
Step 1: Fetch Assigned Tasks from Azure DevOps
    ↓
Step 2: Filter Tasks Due Today
    ↓
Step 3: Format Email Message
    ↓
Step 4: Send Email via Resend
    ↓
Step 5: Log Completion
```

## 📋 Prerequisites

- Node.js 20+ installed
- Azure DevOps account with Personal Access Token (PAT)
- Resend account with API key

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Azure DevOps
ADO_ORG=your_organization
ADO_PROJECT=your_project
ADO_PAT=your_personal_access_token

# Resend (Email)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=onboarding@resend.dev
EMAIL_TO=your_email@example.com
```

### 3. Get Azure DevOps Personal Access Token

1. Go to Azure DevOps → User Settings → Personal Access Tokens
2. Create a new token with **Work Items (Read)** permission
3. Copy the token and add it to `.env.local` as `ADO_PAT`

### 4. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the key and add it to `.env.local` as `RESEND_API_KEY`

### 5. Run the Application

Start the Next.js development server:

```bash
npm run dev
```

In a separate terminal, start the Inngest development server:

```bash
npm run inngest
```

## 🧪 Testing

### Manual Test

1. Open the Inngest dashboard: http://localhost:8288
2. Click on **Functions** tab
3. Find `daily-devops-reminder` and click **Invoke**
4. View the execution results in the **Runs** tab

### Expected Behavior

- If you have tasks due today, you'll receive an email with the task list
- If no tasks are due, you'll receive an email saying "No tasks due today! 🎉"

## 📁 Project Structure

```
azure-devops-reminder/
├── app/
│   └── api/
│       └── inngest/
│           └── route.ts          # Inngest API endpoint
├── inngest/
│   ├── client.ts                 # Inngest client configuration
│   └── functions/
│       └── daily-reminder.ts     # Main workflow function
├── lib/
│   ├── azure-devops.ts          # Azure DevOps API integration
│   └── notifications.ts         # Email notification helper
├── .env.local                   # Environment variables (create this)
├── env-example.txt              # Environment variables template
└── package.json
```

## 🔧 Configuration

### Change Schedule Time

Edit `inngest/functions/daily-reminder.ts`:

```typescript
{ cron: "0 8 * * *" }, // Change to your preferred time
```

CRON format: `minute hour day month dayOfWeek`

Examples:
- `0 9 * * *` - 9 AM daily
- `0 8 * * 1-5` - 8 AM on weekdays only
- `0 8,14 * * *` - 8 AM and 2 PM daily

### Customize Email Template

Edit the `format-message` step in `inngest/functions/daily-reminder.ts` to customize the email format.

## 📊 Monitoring

### Inngest Dashboard

Access the dashboard at http://localhost:8288 to:
- View all function runs
- Check execution logs
- Debug failures
- Manually trigger functions

### Logs

All execution steps are logged in the Inngest dashboard with:
- Step name
- Execution time
- Input/output data
- Error messages (if any)

## 🐛 Troubleshooting

### Function not appearing in Inngest

1. Ensure Next.js dev server is running
2. Check that Inngest dev server is running
3. Verify the API route is accessible at `http://localhost:3000/api/inngest`

### Email not sending

1. Verify Resend API key is correct
2. Check that `EMAIL_TO` is a valid email address
3. Review logs in Inngest dashboard for error messages

### Azure DevOps tasks not fetching

1. Verify PAT has **Work Items (Read)** permission
2. Check that `ADO_ORG` and `ADO_PROJECT` are correct
3. Ensure PAT belongs to the user whose tasks you want to fetch

### Mock Data

If Azure DevOps credentials are not configured, the system will use mock data for testing:
- Task 101: "Fix bug in checkout flow" (Web App)
- Task 102: "Update API documentation" (Core Services)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

This Next.js app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

**Important**: After deployment, update the Inngest app URL in your Inngest Cloud dashboard.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with**: Next.js, Inngest, Azure DevOps API, Resend
