"use client"
import Link from 'next/link'

export default function VolunteerPage() {
  return (
    <>
    {/* Style this page just move the buttons to a place that makes since */}
      Sign up as a Volunteer
      <Link href={'/volunteer/sign-up'}>Sign up</Link>
      <br />
      Update a Volunteer
      <Link href={'/volunteer/update'}>Sign up</Link>
    </>
  );
}