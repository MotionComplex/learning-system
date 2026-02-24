# Multi-Machine Sync Guide

Synchronize your learning data across multiple computers using git.

## Overview

The sync feature uses git to keep `~/LEARNING.json` synchronized across machines. Changes are tracked in a separate repository at `~/learning-data/`.

## Setup

### Initial Setup (First Machine)

1. Initialize sync with a remote repository:

```bash
learning sync init --remote git@github.com:username/learning-data.git
```

Or initialize locally first:

```bash
learning sync init
```

2. Push your data:

```bash
learning sync push
```

### Setup (Additional Machines)

1. Initialize with the same remote:

```bash
learning sync init --remote git@github.com:username/learning-data.git
```

2. Pull existing data:

```bash
learning sync pull
```

## Daily Workflow

### Start of Day

Pull latest changes before working:

```bash
learning sync pull
```

### During Work

Add learnings as usual:

```bash
learning add
# or let Cursor/VS Code add them
```

### End of Day

Push your changes:

```bash
learning sync push
```

Or with a custom message:

```bash
learning sync push --message "Added React and TypeScript learnings"
```

## Commands

### `learning sync init`

Initialize git repository for sync.

```bash
# Local only
learning sync init

# With remote
learning sync init --remote git@github.com:username/learning-data.git
```

Creates:
- `~/learning-data/.git/` - Git repository
- `~/learning-data/LEARNING.json` - Copy of your data
- `~/learning-data/README.md` - Repository readme

### `learning sync status`

Check sync status.

```bash
learning sync status
```

Shows:
- Current branch (usually `main`)
- Remote URL
- Last commit info
- Pending changes

### `learning sync push`

Push changes to remote.

```bash
# With auto-generated message
learning sync push

# With custom message
learning sync push --message "Your message here"
```

### `learning sync pull`

Pull changes from remote.

```bash
learning sync pull
```

Updates `~/LEARNING.json` with latest from remote.

### `learning sync remote`

Manage remote repository.

```bash
# View current remote
learning sync remote

# Set or update remote
learning sync remote git@github.com:username/learning-data.git
```

## Setting Up the Remote Repository

### GitHub

1. Create a new repository on GitHub
2. Make it private (recommended)
3. Copy the SSH URL: `git@github.com:username/learning-data.git`
4. Use in sync init:

```bash
learning sync init --remote git@github.com:username/learning-data.git
```

### GitLab

Same process, use GitLab URL:

```bash
learning sync init --remote git@gitlab.com:username/learning-data.git
```

### Self-Hosted Git

Any git server works:

```bash
learning sync init --remote user@server.com:/path/to/repo.git
```

## Conflict Resolution

### If Pull Fails

```bash
cd ~/learning-data
git status
# Resolve conflicts manually
git add LEARNING.json
git commit -m "Resolved conflicts"
cd -
learning sync push
```

### Merge Strategy

The sync uses simple merge. If you edit on multiple machines simultaneously:

1. Pull first: `learning sync pull`
2. Resolve conflicts in `~/learning-data/LEARNING.json`
3. Copy resolved file to `~/LEARNING.json`
4. Push: `learning sync push`

## Best Practices

### 1. Pull Before Work

Always pull before starting:

```bash
learning sync pull
```

Add to your shell startup:

```bash
# In ~/.bashrc or ~/.zshrc
alias work-start="learning sync pull && echo 'Learning data synced'"
```

### 2. Push After Adding

Push after adding entries:

```bash
learning add
learning sync push
```

Or create an alias:

```bash
alias la="learning add && learning sync push"
```

### 3. Regular Syncs

Even if you don't add entries, sync regularly:

```bash
# Cron job: Sync every hour
0 * * * * /usr/local/bin/learning sync pull > /dev/null 2>&1
```

### 4. Check Status

Check for pending changes:

```bash
learning sync status
```

### 5. Use Branches (Advanced)

For experimental entries:

```bash
cd ~/learning-data
git checkout -b experiment
cd -
learning add  # Add experimental entries
learning sync push
# Later: Merge or delete branch
```

## Automation

### Shell Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias lsp="learning sync pull"
alias lsP="learning sync push"
alias lss="learning sync status"
alias la="learning add && learning sync push"
```

### Git Hooks

Auto-push after adding:

Create `~/learning-data/.git/hooks/post-commit`:

```bash
#!/bin/bash
git push origin main
```

Make it executable:

```bash
chmod +x ~/learning-data/.git/hooks/post-commit
```

### Systemd Timer (Linux)

Auto-sync every hour:

Create `~/.config/systemd/user/learning-sync.service`:

```ini
[Unit]
Description=Sync learning data

[Service]
Type=oneshot
ExecStart=/usr/local/bin/learning sync pull
ExecStart=/usr/local/bin/learning sync push
```

Create `~/.config/systemd/user/learning-sync.timer`:

```ini
[Unit]
Description=Sync learning data hourly

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

Enable:

```bash
systemctl --user enable --now learning-sync.timer
```

## Troubleshooting

### Push Rejected

Remote has changes you don't have:

```bash
learning sync pull
# Resolve any conflicts
learning sync push
```

### Authentication Failed

Set up SSH keys:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub/GitLab SSH keys
```

### Sync Directory Missing

Reinitialize:

```bash
rm -rf ~/learning-data
learning sync init --remote <your-remote-url>
learning sync push
```

### Data Out of Sync

Copy from LEARNING.json to sync directory:

```bash
cp ~/LEARNING.json ~/learning-data/LEARNING.json
cd ~/learning-data
git add LEARNING.json
git commit -m "Manual sync"
git push
```

### Force Push (Careful!)

If you need to overwrite remote:

```bash
cd ~/learning-data
git push -f origin main
```

⚠️ This will lose remote changes!

## Security

### Private Repository

Always use a private repository for your learning data.

### SSH vs HTTPS

SSH is more secure:

```bash
# Good
git@github.com:username/learning-data.git

# Less secure (uses password)
https://github.com/username/learning-data.git
```

### Backup

Keep backups outside git:

```bash
# Weekly backup
cp ~/LEARNING.json ~/Dropbox/learning-backups/LEARNING-$(date +%Y%m%d).json
```

## Advanced Usage

### Multiple Remotes

```bash
cd ~/learning-data
git remote add backup git@backup-server.com:learning.git
git push backup main
```

### Encrypted Remote

Use git-crypt for encryption:

```bash
cd ~/learning-data
git-crypt init
git-crypt add-gpg-user your@email.com
echo "LEARNING.json filter=git-crypt diff=git-crypt" > .gitattributes
git add .gitattributes
git commit -m "Enable encryption"
```

### Team Sharing

Share with teammates (careful with privacy):

```bash
# Set up shared remote
learning sync init --remote git@github.com:team/shared-learnings.git

# Each team member pulls
learning sync pull

# Add entries
learning add

# Push to share
learning sync push
```

## FAQ

**Q: Can I use Dropbox/iCloud instead?**

A: Not recommended. Git handles conflicts better. But you could symlink:

```bash
ln -s ~/Dropbox/LEARNING.json ~/LEARNING.json
```

**Q: How often should I sync?**

A: Pull at start of day, push after adding entries. Or automate hourly.

**Q: What if I forget to sync?**

A: Pull before pushing, resolve any conflicts, then push.

**Q: Can I sync to multiple machines?**

A: Yes! Set up the same remote on each machine.

**Q: Is my data private?**

A: Use a private repository and SSH keys. Consider encryption for extra security.

## Support

- Sync issues: GitHub Issues
- Advanced setups: GitHub Discussions
