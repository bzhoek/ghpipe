# GitHub Actions CLI

```sh
./ghpipe.js
Usage: ghpipe [options] [command]

Options:
  -o, --owner <owner>
  -r, --repo <repo>

Commands:
  list <workflow>                 List runs for <workflow>
  run <number> <list> <workflow>  Run <workflow> with sha from <number> in <list>>
  clean <workflow>                Removed failed runs for <workflow>

./ghpipe.js -o zilverline -r zilverline.com run last rspec.yml acceptance.yml
./ghpipe.js -o zilverline -r zilverline.com run 183 rspec.yml production.yml
```

Expects a [credentials](./creds.json) with a GitHub token

```json
{
  "auth": "..."
}
```

https://github.com/octokit/rest.js and https://octokit.github.io/rest.js/v20