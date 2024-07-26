import {expect} from 'chai';
import {listWorkflowRuns, listWorkflows} from "../lib.js";

let owner = "zilverline";
let repo = "zilverline.com";

describe('ghpipe', () => {
  it('workflows', async () => {
    let data = (await listWorkflows(owner, repo)).data
    expect(data.total_count).to.equal(4);
  });

  it('workflow runs', async () => {
    let data = (await listWorkflowRuns(owner, repo, 'rspec.yml')).data
    expect(data.total_count).to.equal(93);
  });
});
