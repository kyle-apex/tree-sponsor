# Git PR Script

This script automates the process of committing changes, creating a PR, and merging it to main. It helps save API requests by combining these operations into a single command.

## Prerequisites

- Git installed and configured
- GitHub CLI (`gh`) installed and authenticated
  - If not authenticated, run `gh auth login` first

## Installation

1. Place the `git-pr.sh` script in your project directory
2. Make it executable: `chmod +x git-pr.sh`

## Usage

```bash
./git-pr.sh "commit message" "branch-name"
```

### Parameters

1. `commit message`: The message for the commit and PR title
2. `branch-name`: The name for the new branch
   - If you don't include a prefix (feature/, bugfix/, hotfix/, refactor/), "feature/" will be added automatically

### Example

```bash
./git-pr.sh "Add new login page" "login-page"
```

This will:

1. Create a new branch called `feature/login-page`
2. Commit all changes with the message "Add new login page"
3. Push the branch to the remote repository
4. Create a PR with the title "Add new login page"
5. Prompt you to merge the PR immediately or later

## Features

- Automatically adds appropriate prefix to branch names
- Checks if there are changes to commit
- Verifies GitHub CLI authentication
- Provides manual PR creation URL if GitHub CLI is not authenticated
- Asks for confirmation before merging
- Provides command to merge later if you choose not to merge immediately
