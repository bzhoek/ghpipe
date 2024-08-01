#!/usr/bin/env node
import {Command} from 'commander';
import {deleteWorkflowRuns, dispatchWorkflow, listWorkflowRunsAsTable} from "./lib.js";

let cli = new Command()
cli.name('ghpipe')
  .option('-o, --owner <owner>')
  .option('-r, --repo <repo>')
  .description(`GitHub Actions pipeline commands`)

let options = cli.opts()

cli.command('list')
  .argument('<workflow>', 'workflow id or name')
  .description('List runs for <workflow>')
  .action((workflow) => listWorkflowRunsAsTable(options.owner, options.repo, workflow))

cli.command('run')
  .argument('<number>', 'use sha from run number')
  .argument('<list>', 'workflow with run number')
  .argument('<workflow>', 'deploy workflow')
  .description('Run <workflow> with sha from <number> in <list>>')
  .action((number, list, workflow) => dispatchWorkflow(options.owner, options.repo, number, list, workflow))

cli.command('clean')
  .argument('<workflow>', 'workflow id or name')
  .description('Removed failed runs for <workflow>')
  .action((workflow) => deleteWorkflowRuns(options.owner, options.repo, workflow))

cli.parse()
