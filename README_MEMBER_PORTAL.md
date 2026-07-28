Member Profile Portal (scaffold)

What was added
- Server Supabase helper: lib/supabaseServer.ts
- Login page: app/login/page.tsx (Google-only button -> /api/auth/google)
- OAuth redirect route: app/api/auth/google/route.ts
- OAuth callback scaffold: app/api/auth/callback/route.ts
- Protected profile page (server): app/member/profile/page.tsx
- Reusable components under components/member: ProfileHeader, ProfileCard, Timeline, TimelineItem

Notes / Next steps to make fully functional
1. Env vars (required):
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY (server only)
   - NEXT_PUBLIC_SITE_URL (e.g. https://your-site.com)
2. Configure Supabase OAuth for Google with redirect URL: `${NEXT_PUBLIC_SITE_URL}/api/auth/callback`.
3. The callback route currently expects an `email` query param for easy testing (e.g. /api/auth/callback?email=you@gmail.com).
   For production, implement the client-side fragment capture recommended by Supabase, set a secure cookie, then let the server verify tokens and set a session.
4. Install runtime deps: @supabase/supabase-js, framer-motion, next, react, tailwindcss, shadcn/ui packages as needed.
5. Replace placeholder profile images with Cloudinary URLs later; components accept profile_image_url.
6. Member ID generation rules and DB migrations should be applied via Supabase SQL/migration tooling (scaffolded helper formatMemberId provided).

Special exception note
- RA25777 must be reserved for Mohammed Faisal. Ensure server-side generation logic (or manual assign) enforces this.

UI notes
- Components use Tailwind and Framer Motion for premium glassmorphism, dark-mode ready.
- Keep login-related UI in app/login; member pages live under app/member.

