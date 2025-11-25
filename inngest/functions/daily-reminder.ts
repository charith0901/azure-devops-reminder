import { inngest } from "@/inngest/client";
import { getAssignedTasks, Task } from "@/lib/azure-devops";
import { sendEmail } from "@/lib/notifications";

export const dailyDevOpsReminder = inngest.createFunction(
  { id: "daily-devops-reminder" },
  { cron: "0 8 * * *" }, // Every day at 8 AM
  async ({ step }) => {
    
    // Step 1: Fetch assigned tasks (all remaining tasks)
    const remainingTasks = await step.run("fetch-tasks", async () => {
      return await getAssignedTasks();
    });

    if (remainingTasks.length === 0) {
      await step.run("send-no-tasks-message", async () => {
        await sendEmail("Daily DevOps Update", "<p>No remaining tasks! 🎉</p>");
      });
      return { message: "No remaining tasks" };
    }

    // Step 2: Format the message
    const { htmlMessage } = await step.run("format-message", async () => {
      let html = "<h2>Your Remaining Tasks (Azure DevOps)</h2><ul>";

      remainingTasks.forEach((task: Task, index: number) => {
        const dueDate = task.dueDate 
          ? new Date(task.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          : 'No due date';

        html += `<li><strong>${task.title}</strong> (Project: ${task.project})<br/>`;
        html += `Due: ${dueDate}<br/>`;
        html += `Status: ${task.status}</li>`;
      });

      html += "</ul>";
      return { htmlMessage: html };
    });

    // Step 3: Send the message
    await step.run("send-message", async () => {
      // Send Email
      const data = await sendEmail("Daily DevOps Tasks Reminder", htmlMessage);
      return data;
    });

    // Step 4: Log completion (Implicitly handled by Inngest, but we can return a summary)
    return { 
      totalRemainingTasks: remainingTasks.length, 
      sent: true 
    };
  }
);
