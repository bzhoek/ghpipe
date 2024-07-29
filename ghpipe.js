import {table} from 'table';
import {Command} from 'commander';
import {listWorkflowRuns} from "./lib.js";

let cli = new Command()
cli.name('ghpipe')
  .option('-o, --owner <owner>')
  .option('-r, --repo <repo>')
  .description(`GitHub Actions pipeline commands`)

let options = cli.opts()
cli.command('runs')
  .argument('<workflow>', 'workflow id or name')
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

cli.parse()
