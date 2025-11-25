import axios from 'axios';

const ADO_ORG = process.env.ADO_ORG;
const ADO_PROJECT = process.env.ADO_PROJECT;
const ADO_PAT = process.env.ADO_PAT;

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  project: string;
  assignedTo: string;
}

export async function getAssignedTasks(): Promise<Task[]> {
  if (!ADO_ORG || !ADO_PROJECT || !ADO_PAT) {
    console.warn("Azure DevOps credentials not set. Returning mock data.");
    return getMockTasks();
  }

  const token = Buffer.from(`:${ADO_PAT}`).toString('base64');
  
  // WIQL query to get tasks assigned to me
  // Note: @Me works if the PAT is for the user.
  const query = `
    SELECT [System.Id], [System.Title], [System.State], [Microsoft.VSTS.Scheduling.DueDate], [System.TeamProject], [System.AssignedTo]
    FROM WorkItems
    WHERE [System.AssignedTo] = @Me
    AND [System.State] <> 'Closed'
    AND [System.State] <> 'Completed'
    AND [System.State] <> 'Removed'
  `;

  try {
    const wiqlResponse = await axios.post(
      `https://dev.azure.com/${ADO_ORG}/${ADO_PROJECT}/_apis/wit/wiql?api-version=6.0`,
      { query },
      {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const workItems = wiqlResponse.data.workItems;
    if (!workItems || workItems.length === 0) return [];

    const ids = workItems.map((wi: any) => wi.id).join(',');
    
    const detailsResponse = await axios.get(
      `https://dev.azure.com/${ADO_ORG}/${ADO_PROJECT}/_apis/wit/workitems?ids=${ids}&fields=System.Id,System.Title,System.State,Microsoft.VSTS.Scheduling.DueDate,System.TeamProject,System.AssignedTo&api-version=6.0`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return detailsResponse.data.value.map((item: any) => ({
      id: item.id,
      title: item.fields['System.Title'],
      status: item.fields['System.State'],
      dueDate: item.fields['Microsoft.VSTS.Scheduling.DueDate'],
      project: item.fields['System.TeamProject'],
      assignedTo: item.fields['System.AssignedTo']?.displayName || 'Unknown',
    }));

  } catch (error) {
    console.error("Error fetching Azure DevOps tasks:", error);
    throw error;
  }
}

function getMockTasks(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 101,
      title: "Fix bug in checkout flow",
      status: "Active",
      dueDate: today + "T00:00:00Z", // Due today
      project: "Web App",
      assignedTo: "User",
    },
    {
      id: 102,
      title: "Update API documentation",
      status: "New",
      dueDate: today + "T00:00:00Z", // Due today
      project: "Core Services",
      assignedTo: "User",
    },
    {
      id: 103,
      title: "Future Task",
      status: "New",
      dueDate: "2099-01-01T00:00:00Z",
      project: "Core Services",
      assignedTo: "User",
    }
  ];
}
