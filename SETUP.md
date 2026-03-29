# LAP — Setup Guide
## LinkedIn Article Poster on lap.8dlp.org

---

## Step 1 — Create a Netlify Account
1. Go to https://app.netlify.com/signup
2. Sign up with your email (free)
3. Note your team name (shown top-left after signup)

---

## Step 2 — Deploy the Project
1. In Netlify dashboard → "Add new site" → "Import an existing project"
2. Connect to GitHub (push this folder to a private GitHub repo first)
   OR use "Deploy manually" → drag and drop this folder
3. Site name: set it to `linkedin-article-poster`
4. Click Deploy

---

## Step 3 — Enable Netlify Identity
1. Go to your site in Netlify dashboard
2. Click "Integrations" → "Identity" → "Enable Identity"
3. Under "Registration" → set to "Invite only" (important — no public signups)
4. Under "External providers" → disable all (email only)
5. Click "Settings & Usage" → scroll to "JWT Secret" → click "Show"
6. Copy the JWT Secret — you'll need it in Step 5

---

## Step 4 — Point lap.8dlp.org to Netlify
1. In Netlify: Site → "Domain management" → "Add custom domain"
2. Type: lap.8dlp.org → click Verify
3. Go to Vercel dashboard → your 8dlp.org domain → DNS settings
4. Add a new DNS record:
   Type:  CNAME
   Name:  lap
   Value: [your-site-name].netlify.app
5. Wait 5–10 minutes for DNS to propagate
6. Back in Netlify domain settings → click "Verify DNS" → enable HTTPS

---

## Step 5 — Set Environment Variables
In Netlify dashboard → Site → "Environment variables" → Add:

  GOTRUE_JWT_SECRET     →  (paste the JWT Secret from Step 3)

Click Save. Then go to Deploys → "Trigger deploy" to redeploy with the new vars.

---

## Step 6 — Create Your Admin Account
1. Go to Netlify Identity → "Invite users"
2. Enter your email → Send invite
3. Check your email → click the invite link → set your password
4. You are now registered — but NOT admin yet

## Step 7 — Grant Yourself Admin Role
1. In Netlify Identity → click your user → "Edit"
2. Under "App metadata" → paste:
   {"roles": ["admin"]}
3. Save

Now when you log in at lap.8dlp.org you will see the Admin Panel.

---

## Step 8 — Done!
- Visit https://lap.8dlp.org
- Log in with your admin credentials
- Use the Admin Panel to create other users
- Each user gets their own isolated workspace

---

## Changing a User's Role (admin → user or vice versa)
1. Netlify Identity → click the user → Edit
2. App metadata → {"roles": ["admin"]}  or  {"roles": ["user"]}
3. Save
