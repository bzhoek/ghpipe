import fsp from "fs/promises";
import {Octokit} from "@octokit/rest";
import {getBorderCharacters, table} from "table";

const octokit = await fsp.readFile("creds.json", "utf-8")
  .then((data) => {
    return JSON.parse(data);
  })
  .then((creds) => {
    return new Octokit(creds);
  });

export function listWorkflows(owner, repo) {
  return octokit.rest.actions
    .listRepoWorkflows({
      owner: owner, repo: repo,
    })
}

export function listWorkflowRuns(owner, repo, workflow) {
  return octokit.rest.actions
    .listWorkflowRuns({
      owner: owner, repo: repo, workflow_id: workflow,
    })
}

export function listWorkflowRunsAsTable(owner, repo, workflow) {
  let headers = ["Run", "Conclusion", "Title", "SHA", "Created"];
  const config = {
    border: getBorderCharacters('ramac'),
    drawHorizontalLine: (index, count) => {
      return index < 2 || index == count;
    }
  };
  listWorkflowRuns(owner, repo, workflow)
    .then(({data}) => {
      return data.workflow_runs.map(run => [run.run_number, run.conclusion, run.display_title, run.head_sha, run.created_at]);
    })
    .then((data) => {
      data.splice(0, 0, headers)
      console.log(table(data, config));
    })
    .catch(console.error)
}

export function deployWorkflow(owner, repo, number, workflow, deploy) {
  listWorkflowRuns(owner, repo, workflow)
    .then(({data}) => {
      let last = data.workflow_runs.find(run => (number === 'last' && run.conclusion === "success") || run.run_number === parseInt(number));
      if (last === undefined) {
        throw new Error("No successful runs found");
      }
      return octokit.rest.actions
        .createWorkflowDispatch({
          owner: owner, repo: repo, workflow_id: deploy, ref: "master", inputs: {
            refspec: last.head_sha
          }
        })
    })
    .then((run) => {
      console.log(run.status);
    })
    .catch(console.error);
}

export function deleteWorkflowRuns(owner, repo, workflow) {
  listWorkflowRuns(owner, repo, workflow)
    .then(({data}) => {
      return data.workflow_runs.filter(run => run.conclusion === "failure");
    })
    .then((runs) => {
      console.log(`Deleting ${runs.length} failed runs`);
      return runs.map((run) => octokit.rest.actions
        .deleteWorkflowRun({
          owner: owner, repo: repo, run_id: run.id
        }));
    })
    .catch(console.error);
}
