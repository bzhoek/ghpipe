import fsp from "fs/promises";
import {Octokit} from "@octokit/rest";

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
      owner: owner,
      repo: repo,
    })
}

export function listWorkflowRuns(owner, repo, workflow) {
  return octokit.rest.actions
    .listWorkflowRuns({
      owner: owner,
      repo: repo,
      workflow_id: workflow,
    })
}