# Docker tag action

This Action generates a valid Docker tag from a GitHub ref

## Inputs

### `latest_branches`

List of branches that should be tagged as `latest` (comma-separated). Default value: `master`

## Outputs

### `tag`

The generated Docker tag

## Example usage

```yaml
uses: paqato/docker-tag-action@v1
with:
  latest_branches: master,main
```
