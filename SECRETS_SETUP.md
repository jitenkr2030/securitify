# 🔐 GitHub Secrets Setup Guide

## ✅ **Vercel Project ID Received**
**Project ID**: `prj_wUUFAGFHqF9DuVMkm6ivv3gnmGf3`

## 🚀 **Complete Setup Steps**

### **Step 1: Go to GitHub Repository Settings**
Navigate to: 
```
https://github.com/jitenkr2030/securitify/settings/secrets/actions
```

### **Step 2: Add Required Secrets**

#### **1. VERCEL_PROJECT_ID** ✅ (You have this)
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: `prj_wUUFAGFHqF9DuVMkm6ivv3gnmGf3`
- **Click**: "Add secret"

#### **2. VERCEL_TOKEN** (Need to get this)
- **Name**: `VERCEL_TOKEN`
- **Value**: Get from Vercel Account Settings
- **How to get**:
  1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
  2. Click "Create Token"
  3. Give it a name (e.g., "GitHub Actions Deploy")
  4. Copy the token value
  5. Paste it in the GitHub secrets form
  6. Click "Add secret"

#### **3. VERCEL_ORG_ID** (Need to get this)
- **Name**: `VERCEL_ORG_ID`
- **Value**: Get from Vercel Account
- **How to get**:
  1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Look at the URL when you're in your organization
  3. OR use Vercel CLI: `vercel orgs ls`
  4. Copy the organization ID
  5. Paste it in the GitHub secrets form
  6. Click "Add secret"

### **Step 3: Verify Secrets Are Added**
After adding all secrets, you should see them listed on the page:
- ✅ VERCEL_PROJECT_ID
- ✅ VERCEL_TOKEN  
- ✅ VERCEL_ORG_ID

### **Step 4: Trigger Deployment**
Once secrets are configured, the workflows will automatically run, or you can:

1. Go to: `https://github.com/jitenkr2030/securitify/actions`
2. Click on either workflow:
   - "Deploy to Production"
   - "Deploy to Vercel"
3. Click "Run workflow" → "Run workflow"

### **Step 5: Monitor Deployment**
- **GitHub Actions**: Watch for workflow completion
- **Vercel Dashboard**: Check deployment status
- **Demo Accounts**: Test after deployment

## 🛠️ **Alternative: Using Vercel CLI**

### **Install Vercel CLI**
```bash
npm i -g vercel
```

### **Login to Vercel**
```bash
vercel login
```

### **Get Required Values**
```bash
# Get organization ID
vercel orgs ls

# Get project ID (you already have this)
vercel projects ls

# Create token (or get from account settings)
vercel tokens create
```

## 📋 **Quick Reference**

### **Required Secrets Summary**
| Secret Name | Value | Status |
|-------------|-------|--------|
| `VERCEL_PROJECT_ID` | `prj_wUUFAGFHqF9DuVMkm6ivv3gnmGf3` | ✅ Provided |
| `VERCEL_TOKEN` | Get from Vercel Account Settings | ❌ Needed |
| `VERCEL_ORG_ID` | Get from Vercel Organization | ❌ Needed |

### **Vercel URLs**
- **Account Tokens**: https://vercel.com/account/tokens
- **Dashboard**: https://vercel.com/dashboard
- **Project Settings**: https://vercel.com/dashboard → Your Project → Settings

### **GitHub URLs**
- **Secrets Settings**: https://github.com/jitenkr2030/securitify/settings/secrets/actions
- **Actions Dashboard**: https://github.com/jitenkr2030/securitify/actions

## 🎯 **What Happens After Setup**

### **Successful Deployment**
1. ✅ GitHub Actions will run successfully
2. ✅ Vercel will deploy your latest code
3. ✅ Demo accounts will work in production
4. ✅ All authentication issues will be resolved

### **Demo Accounts to Test**
- **Admin**: `admin@security.com` / `password123`
- **Guard**: `guard@security.com` / `password123`
- **Field Officer**: `officer@security.com` / `password123`

## 🔧 **Troubleshooting**

### **If Workflows Fail**
1. Check GitHub Actions logs for error messages
2. Verify all secrets are correctly configured
3. Ensure Vercel project is properly connected

### **If Secrets Don't Work**
1. Double-check secret names (case-sensitive)
2. Verify secret values are correct
3. Try removing and re-adding secrets

---

## 🚀 **Ready to Deploy!**

**You have the Project ID!** Now you just need to:

1. **Get VERCEL_TOKEN** from Vercel Account Settings
2. **Get VERCEL_ORG_ID** from Vercel Organization
3. **Add all three secrets** to GitHub repository settings
4. **Trigger deployment** and monitor progress

**Your repository is ready for production deployment!** 🎉