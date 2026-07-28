import React from 'react';
import ProfileHeader from '../../../components/member/ProfileHeader';
import ProfileCard from '../../../components/member/ProfileCard';
import Timeline from '../../../components/member/Timeline';
import { getSupabaseServerClient, Member, TimelineEntry } from '../../../lib/supabaseServer';

type Props = { searchParams?: { email?: string } };

export default async function MemberProfilePage({ searchParams }: Props) {
  // Expect that after OAuth the user is redirected here with an email query param
  // For production, implement cookies/session handling. This is a server-side lookup scaffold.
  const email = searchParams?.email;
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/4 border border-white/6 backdrop-blur shadow-2xl text-center text-white/80">
          <h2 className="text-lg font-semibold">No email provided</h2>
          <p className="mt-2">Please sign in via the member login.</p>
        </div>
      </div>
    );
  }

  const supabase = getSupabaseServerClient();

  // look up member by personal_gmail OR muj_email
  const { data: members, error } = await supabase
    .from<Member>('members')
    .select('*')
    .or(`personal_gmail.eq.${email},muj_email.eq.${email}`)
    .limit(1);

  if (error) {
    console.error('Supabase error:', error.message);
    return <div className="p-8 text-white">Error loading member.</div>;
  }

  if (!members || members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/4 border border-white/6 backdrop-blur shadow-2xl text-center text-white/80">
          <h2 className="text-lg font-semibold">You are not registered as a Randomize member.</h2>
          <p className="mt-2">If you believe this is an error, contact the admin.</p>
        </div>
      </div>
    );
  }

  const member = members[0] as Member;

  // fetch timeline
  const { data: timelineData } = await supabase
    .from<TimelineEntry>('member_timeline')
    .select('*')
    .eq('member_id', member.member_id)
    .order('year', { ascending: true })
    .order('month', { ascending: true });

  // Basic transform: ensure chronological order (attempt by created_at if provided)
  const timeline = (timelineData || []).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const joinedYear = member.member_since ? new Date(member.member_since).getFullYear().toString() : undefined;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <ProfileHeader
            fullName={member.full_name}
            memberId={member.member_id}
            position={member.current_position}
            domain={member.current_domain}
            profileImage={member.profile_image_url || 'https://placehold.co/400x400'}
            joinedYear={joinedYear}
          />
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <ProfileCard member={member} />
          <Timeline items={timeline} />
        </div>
      </div>
    </main>
  );
}
