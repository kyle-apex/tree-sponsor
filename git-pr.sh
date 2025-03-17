#!/bin/bash

# Script to commit changes, create a PR, and merge it to main
# Usage: ./git-pr.sh "commit message" "branch-name"

# Check if both arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: ./git-pr.sh \"commit message\" \"branch-name\""
    exit 1
fi

COMMIT_MESSAGE="$1"
BRANCH_NAME="$2"

# Check if branch name starts with a prefix
if [[ ! $BRANCH_NAME =~ ^(feature|bugfix|hotfix|refactor)/ ]]; then
    # Add feature/ prefix if not present
    BRANCH_NAME="feature/$BRANCH_NAME"
    echo "Adding 'feature/' prefix to branch name: $BRANCH_NAME"
fi

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit"
    exit 1
fi

# Create a new branch
echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Commit changes
echo "Committing changes with message: $COMMIT_MESSAGE"
git commit -am "$COMMIT_MESSAGE"

# Push branch to remote
echo "Pushing branch to remote"
git push -u origin "$BRANCH_NAME"

# Check if GitHub CLI is authenticated
if ! gh auth status &>/dev/null; then
    echo "GitHub CLI is not authenticated. Please run 'gh auth login' first."
    echo "You can manually create a PR by visiting:"
    echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:\/]\(.*\)\.git/\1/')/pull/new/$BRANCH_NAME"
    exit 1
fi

# Create PR
echo "Creating PR"
PR_URL=$(gh pr create --title "$COMMIT_MESSAGE" --body "This PR includes changes for: $COMMIT_MESSAGE" --fill)
PR_NUMBER=$(echo $PR_URL | sed 's/.*\/\([0-9]*\)$/\1/')

echo "PR created: $PR_URL"

# Ask for confirmation before merging
read -p "Do you want to merge this PR now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Merging PR #$PR_NUMBER"
    gh pr merge "$PR_NUMBER" --merge --admin --delete-branch
    
    # Checkout main and pull latest changes
    git checkout main
    git pull origin main
    
    echo "PR merged successfully"
else
    echo "PR was not merged. You can merge it later with:"
    echo "gh pr merge $PR_NUMBER --merge --admin --delete-branch"
fi
