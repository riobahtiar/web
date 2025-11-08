# CI/CD Setup Guide

This document explains how to configure GitHub Actions for automatic deployment to Cloudflare Workers.

## Overview

The project uses GitHub Actions workflows for:
1. **Automatic deployment** to Cloudflare Workers when code is merged to `main`
2. **PR previews** that build and validate pull requests
3. **Quality checks** that run type checking, formatting, and security audits

## Required GitHub Secrets

To enable automatic deployment, you need to add the following secrets to your GitHub repository:

### 1. CLOUDFLARE_API_TOKEN

Your Cloudflare API token with permissions to deploy Workers.

**How to get it:**

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template or create a custom token with these permissions:
   - Account > Workers Scripts > Edit
   - Account > Account Settings > Read
   - Zone > Workers Routes > Edit (if using custom domains)
4. Copy the token

**Add to GitHub:**
1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: Paste your token
6. Click "Add secret"

### 2. CLOUDFLARE_ACCOUNT_ID

Your Cloudflare Account ID.

**How to get it:**

1. Go to https://dash.cloudflare.com/
2. Select your account
3. Look at the URL - it will be like: `https://dash.cloudflare.com/{ACCOUNT_ID}/...`
4. Or find it in the right sidebar under "Account ID"

**Add to GitHub:**
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `CLOUDFLARE_ACCOUNT_ID`
4. Value: Paste your Account ID
5. Click "Add secret"

## Workflows Explained

### 1. deploy.yml
- **Triggers:** Push to `main` branch or manual workflow dispatch
- **Purpose:** Build and deploy to production (Cloudflare Workers)
- **Steps:**
  - Checkout code
  - Install Node.js dependencies
  - Build Astro project
  - Deploy to Cloudflare Workers using Wrangler

### 2. preview.yml
- **Triggers:** Pull request opened, updated, or reopened
- **Purpose:** Build validation and preview
- **Steps:**
  - Checkout code
  - Install dependencies
  - Run type checks
  - Build project
  - Comment on PR with build status

### 3. quality-check.yml
- **Triggers:** Pull requests and pushes to `main`
- **Purpose:** Code quality validation
- **Steps:**
  - Format checking
  - TypeScript type checking
  - Security audit
  - Build verification

## Workflow Status Badges

Add these badges to your README.md to show build status:

```markdown
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)
![Quality Check](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/quality-check.yml/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

## Testing the Setup

### 1. Test Manual Deployment

1. Go to Actions tab in your GitHub repository
2. Select "Deploy to Cloudflare Workers" workflow
3. Click "Run workflow" → "Run workflow"
4. Watch the deployment process

### 2. Test Automatic Deployment

1. Make a small change (e.g., update README.md)
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. Check Actions tab to see deployment running
4. Verify at https://web.riomyid.workers.dev

### 3. Test PR Preview

1. Create a new branch
2. Make changes and create a PR
3. Watch the quality check and preview workflows run
4. Check for automated comments on the PR

## Troubleshooting

### Deployment fails with "Invalid API token"
- Check that `CLOUDFLARE_API_TOKEN` is set correctly
- Verify the token has the required permissions
- Make sure the token hasn't expired

### Deployment fails with "Account ID not found"
- Verify `CLOUDFLARE_ACCOUNT_ID` is correct
- Check that the account ID matches your Cloudflare account

### Build fails in CI but works locally
- Ensure all dependencies are in `package.json`
- Check Node.js version matches (workflow uses Node 20)
- Run `npm ci` locally to test clean install

### Type check errors
- Run `npx astro check` locally
- Fix any TypeScript errors before pushing

## Deployment URL

After successful deployment, your site will be available at:
- **Production:** https://web.riomyid.workers.dev

## Custom Domain (Optional)

To deploy to a custom domain:

1. Add your domain to Cloudflare
2. Update `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
   ```
3. Update the `CLOUDFLARE_API_TOKEN` permissions to include Zone editing

## Support

For issues with:
- **GitHub Actions:** Check the Actions tab logs
- **Cloudflare Workers:** Check Cloudflare dashboard logs
- **Wrangler CLI:** See https://developers.cloudflare.com/workers/wrangler/

---

**Last Updated:** November 2025
