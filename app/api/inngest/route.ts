import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { dailyDevOpsReminder } from "@/inngest/functions/daily-reminder";

// Create an API that serves the functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    dailyDevOpsReminder,
  ],
});
