#!/usr/bin/env node
import {Command} from 'commander';
import {deleteWorkflowRuns, deployWorkflow, listWorkflowRunsAsTable} from "./lib.js";

let cli = new Command()
cli.name('ghpipe')
  .option('-o, --owner <owner>')
  .option('-r, --repo <repo>')
  .description(`GitHub Actions pipeline commands`)

let options = cli.opts()

cli.command('runs')
  .argument('<workflow>', 'workflow id or name')
  .description('List runs for workflow')
  .action((workflow) => listWorkflowRunsAsTable(options.owner, options.repo, workflow))

cli.command('deploy')
  .argument('<number>', 'use sha from run number')
  .argument('<workflow>', 'workflow with run number')
  .argument('<deploy>', 'deploy workflow')
  .description('List runs for workflow')
  .action((number, workflow, deploy) => deployWorkflow(options.owner, options.repo, number, workflow, deploy))

cli.command('clean')
  .argument('<workflow>', 'workflow id or name')
  .description('Removed failed runs for workflow')
  .action((workflow) => deleteWorkflowRuns(options.owner, options.repo, workflow))

cli.parse()
