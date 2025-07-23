# Netlify Deployment Guide

This repository is configured for automatic deployment of the Angular AI Agent Dashboard to Netlify.

## Configuration

The deployment is configured via `netlify.toml` in the project root with the following settings:

### Build Settings
- **Base Directory**: `angular/` (where the Angular project is located)
- **Build Command**: `npm ci && npm run build -- --configuration=production`
- **Publish Directory**: `dist/ai-agent-dashboard-angular`
- **Node.js Version**: 18
- **NPM Version**: 9

### Features Included
- ✅ SPA routing support (redirects all routes to index.html)
- ✅ Security headers (XSS protection, content type options, etc.)
- ✅ Static asset caching (1 year cache for JS/CSS/assets)
- ✅ Build optimization and minification
- ✅ Production build configuration
- ✅ Branch-specific deployments

## Deployment Steps

### 1. Connect Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select this repository
5. Netlify will automatically detect the `netlify.toml` configuration

### 2. Build Settings (Auto-detected)

The following settings will be automatically applied from `netlify.toml`:

```
Base directory: angular/
Build command: npm ci && npm run build -- --configuration=production
Publish directory: dist/ai-agent-dashboard-angular
```

### 3. Environment Variables (Optional)

If needed, you can add environment variables in Netlify dashboard:
- Go to Site settings → Environment variables
- Add any Angular environment variables

### 4. Deploy

**Option A: Automatic Netlify Deployment (Recommended)**
- Push to your main branch to trigger automatic deployment
- Netlify will build and deploy your Angular application
- You'll get a unique URL like `https://your-site-name.netlify.app`

**Option B: GitHub Actions Deployment**
- Set up GitHub secrets: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- The workflow in `.github/workflows/netlify-deploy.yml` will deploy on push
- Production deploys on `main` branch, preview deploys on other branches

## Branch Deployments

- **Production**: Deploys from `main` branch with production optimization
- **Deploy Previews**: Generated for pull requests
- **Branch Deploys**: Available for other branches if enabled

## Build Optimization

The configuration includes:
- Production Angular build with AOT compilation
- CSS and JS minification
- Asset optimization
- Bundle analysis and tree shaking

## Security Headers

The following security headers are automatically applied:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Content Security Policy for enhanced security

## Caching Strategy

- Static assets (JS, CSS, images): 1 year cache
- HTML files: No cache (to ensure updates are visible)
- Immutable assets for optimal performance

## Troubleshooting

### Build Failures
1. Check the deploy log in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Angular build works locally: `npm run build -- --configuration=production`

### Routing Issues
- SPA redirects are configured to handle Angular routing
- All routes redirect to `/index.html` with 200 status

### Performance Issues
- Check bundle size warnings in build log
- Consider lazy loading for large components
- Use Angular performance optimization techniques

## Local Testing

To test the production build locally:

```bash
cd angular
npm ci

# Option 1: Use the convenient script
npm run serve:prod

# Option 2: Manual build and serve
npm run build:prod
npx http-server dist/ai-agent-dashboard-angular -p 4200 -o
```

Available npm scripts:
- `npm run build:prod` - Production build only
- `npm run serve:prod` - Build and serve production version locally

## Custom Domain

To use a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned

## Monitoring

- Netlify provides build logs and deploy status
- Analytics available in Netlify dashboard
- Performance monitoring can be enabled

---

For more advanced configurations, refer to the [Netlify documentation](https://docs.netlify.com/).