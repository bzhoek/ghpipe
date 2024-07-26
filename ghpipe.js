import {Octokit} from "@octokit/rest";
import {Command} from 'commander';
import fsp from 'fs/promises';

const octokit = await fsp.readFile("creds.json", "utf-8")
  .then((data) => {
    return JSON.parse(data);
  })
  .then((creds) => {
    return new Octokit(creds);
  });

octokit.rest.actions
  .listRepoWorkflows({
    owner: "zilverline",
    repo: "zilverline.com",
  })
  .then(({data}) => {
    console.log(data);
  }).catch(console.error);

// let cli = new Command()
// cli.name('ghpipe')
//   .description(`GitHub Actions pipeline commands`)
//
// cli.command('clean')
//   .argument('<query>', 'query')
//   .description('Remove &nbsp; from fields')
//   .action((query) => clean_notes(query + " &nbsp;"))
//
// cli.parse()
