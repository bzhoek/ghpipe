import {table} from 'table';
import {Command} from 'commander';
import {listWorkflowRuns, runWorkflow} from "./lib.js";

let cli = new Command()
cli.name('ghpipe')
  .option('-o, --owner <owner>')
  .option('-r, --repo <repo>')
  .description(`GitHub Actions pipeline commands`)

let options = cli.opts()
cli.command('runs')
  .argument('<workflow>', 'workflow')
  .description('List runs for workflow')
  .action((workflow) => {
      listWorkflowRuns(options.owner, options.repo, workflow)
        .then(({data}) => {
          let mapped = data.workflow_runs.map(
            run => [run.run_number, run.conclusion, run.display_title, run.head_sha, run.created_at]);
          console.log(table(mapped));
        }).catch(console.error);
    }
  )

cli.command('deploy')
  .argument('<workflow>', 'last workflow to deploy')
  .argument('<deploy>', 'deploy workflow')
  .description('List runs for workflow')
  .action((workflow, deploy) => {
      listWorkflowRuns(options.owner, options.repo, workflow)
        .then(({data}) => {
          let last = data.workflow_runs.find(run => run.conclusion === "success");
          if (last === undefined) {
            throw new Error("No successful runs found");
          }
          return runWorkflow(options.owner, options.repo, deploy, "master", {
            refspec: last.head_sha
          })
        })
        .then((run) => {
          console.log(run);
        })
        .catch(console.error);
    }
  )

cli.parse()
