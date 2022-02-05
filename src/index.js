const core = require('@actions/core')
const github = require('@actions/github')

const replacementPattern = /[^a-zA-Z0-9]/
const replacementCharacter = '-'

function generateTagFromRef (ref, latestBranches) {
    core.debug(`Trying to generate tag for ref "${ref}", latestBranches "${latestBranches}"`)

    // branch
    if (ref.match(/^refs\/heads\/.+/)) {
        const branch = ref.replace('refs/heads/', '')
        core.debug(`Extracted branch name ${branch}`)

        if (latestBranches.includes(branch)) {
            core.debug(`Branch name "${branch}" matches one of "${latestBranches}" - returning "latest"`)
            return 'latest'
        }

        return branch.replace(replacementPattern, replacementCharacter)
    }

    // tag
    if (ref.match(/^refs\/tags\/.+/)) {
        const tag = ref.replace('refs/tags/', '')
        core.debug(`Extracted tag name ${tag}`)

        return tag.replace(replacementPattern, replacementCharacter)
    }

    // PR
    if (ref.match(/^refs\/pull\/.+/)) {
        const pr = ref.replace('refs/pull/', '').replace('/merge', '')
        core.debug(`Extracted PR ${pr}`)

        return pr.replace(replacementPattern, replacementCharacter)
    }

    throw new Error(`Unable to generate Docker tag from ref ${ref}`)
}

try {
    const ref = github.context.ref
    const latestBranches = core.getInput('latest_branches').split(',')
    const tag = generateTagFromRef(ref, latestBranches)
    core.setOutput('tag', tag)
} catch (error) {
    core.setFailed(error.message)
}
