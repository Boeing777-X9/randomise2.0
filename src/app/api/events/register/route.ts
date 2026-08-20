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
      event_slug,
      event_id,
      name,
      personal_email,
      outlook_email,
      registration_number,
      phone_number,
      course_name,
      graduation_year,
    } = body;

    if (!event_slug || !personal_email || !registration_number || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanPersonalEmail = personal_email.toLowerCase().trim();
    const cleanRegNo = registration_number.toUpperCase().trim();
    const cleanOutlookEmail = (
      outlook_email || `${cleanRegNo.toLowerCase()}@muj.manipal.edu`
    ).toLowerCase().trim();

    // 1. Check directory for existing member
    let { data: existingUser } = await supabase
      .from('randomize_directory')
      .select('*')
      .or(`email.ilike.${cleanPersonalEmail},outlook_email.ilike.${cleanOutlookEmail},registration_number.eq.${cleanRegNo}`)
      .maybeSingle();

    let assignedId = existingUser?.randomize_id;
    const gradYearNum = parseInt(graduation_year) || 29;

    if (!assignedId) {
      // 2a. New member: generate ID and insert into directory
      const yearPrefix = String(gradYearNum).padStart(2, '0').slice(-2);
      const randomSuffix = String(Math.floor(100 + Math.random() * 900));
      assignedId = `RA${yearPrefix}-${randomSuffix}`;

      const { error: dirInsertErr } = await supabase.from('randomize_directory').insert({
        randomize_id: assignedId,
        name: name.trim(),
        email: cleanPersonalEmail,
        outlook_email: cleanOutlookEmail,
        registration_number: cleanRegNo,
        phone_number: phone_number?.trim() || null,
        course: course_name || 'B.Tech (All Branches)',
        pass_year: 2000 + gradYearNum,
      });

      if (dirInsertErr) {
        return NextResponse.json({ error: dirInsertErr.message }, { status: 500 });
      }
    } else {
      // 2b. Existing member: update directory profile with any edited fields
      await supabase
        .from('randomize_directory')
        .update({
          name: name.trim(),
          phone_number: phone_number?.trim() || existingUser.phone_number,
          course: course_name || existingUser.course,
          pass_year: 2000 + gradYearNum,
          outlook_email: cleanOutlookEmail,
          registration_number: cleanRegNo,
        })
        .eq('randomize_id', assignedId);
    }

    // 3. Insert into decoupled event_registrations table
    const { error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        event_id: event_id || null,
        event_slug,
        randomize_id: assignedId,
        full_name: name.trim(),
        personal_email: cleanPersonalEmail,
        outlook_email: cleanOutlookEmail,
        registration_number: cleanRegNo,
        whatsapp_number: phone_number?.trim() || null,
        course_name: course_name || 'B.Tech (All Branches)',
        graduation_year: gradYearNum,
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'You are already registered for this event!' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      randomize_id: assignedId,
      is_new_member: !existingUser,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}