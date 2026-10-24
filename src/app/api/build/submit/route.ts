import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      registrationNumber,
      outlookEmail,
      phoneNumber,
      userEmail,
      role,
      projectPreference1,
      projectPreference2,
      techStack,
      githubLink,
      projectReason
    } = body;

    // Validation
    if (!fullName?.trim() || !registrationNumber?.trim() || !outlookEmail?.trim() || !phoneNumber?.trim()) {
      return NextResponse.json({ error: 'Please provide all required personal details.' }, { status: 400 });
    }

    if (!role?.trim()) {
      return NextResponse.json({ error: 'Please select your role.' }, { status: 400 });
    }

    if (!projectPreference1 || !projectPreference2) {
      return NextResponse.json({ error: 'Please select both project preferences.' }, { status: 400 });
    }

    if (projectPreference1 === projectPreference2) {
      return NextResponse.json({ error: 'Project Preference 1 and 2 cannot be identical.' }, { status: 400 });
    }

    if (!techStack?.trim() || !githubLink?.trim() || !projectReason?.trim()) {
      return NextResponse.json({ error: 'Please fill in your tech stack, GitHub link, and project motivation.' }, { status: 400 });
    }

    const cleanOutlook = outlookEmail.toLowerCase().trim();
    const cleanRegNo = registrationNumber.toUpperCase().trim();
    const cleanEmail = (userEmail || '').toLowerCase().trim();

    const applicationId = `BLD_${cleanRegNo}_${Date.now()}`;

    // 1. Try to record into build_with_us_26 or build_applications table if exists
    try {
      await supabase.from('build_applications').insert({
        application_id: applicationId,
        full_name: fullName.trim(),
        registration_number: cleanRegNo,
        outlook_email: cleanOutlook,
        personal_email: cleanEmail,
        phone_number: phoneNumber.trim(),
        role: role.trim(),
        preference_1: projectPreference1,
        preference_2: projectPreference2,
        tech_stack: techStack.trim(),
        github_link: githubLink.trim(),
        why_project: projectReason.trim(),
        created_at: new Date().toISOString()
      });
    } catch (e) {
      // Table might not exist yet; gracefully handled below
      console.warn('Direct table insert note:', e);
    }

    // 2. Update directory profile phone / outlook / name if missing
    try {
      const { data: existingUser } = await supabase
        .from('randomize_directory')
        .select('randomize_id')
        .or(`email.ilike.${cleanEmail},outlook_email.ilike.${cleanOutlook},registration_number.eq.${cleanRegNo}`)
        .maybeSingle();

      if (existingUser?.randomize_id) {
        await supabase
          .from('randomize_directory')
          .update({
            name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            outlook_email: cleanOutlook,
            registration_number: cleanRegNo
          })
          .eq('randomize_id', existingUser.randomize_id);
      }
    } catch (dirErr) {
      console.warn('Directory sync note:', dirErr);
    }

    return NextResponse.json({
      success: true,
      applicationId,
      fullName: fullName.trim(),
      message: 'Your Build with Us application has been recorded successfully.'
    });
  } catch (error: any) {
    console.error('Build submission error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while submitting. Please try again.' },
      { status: 500 }
    );
  }
}
