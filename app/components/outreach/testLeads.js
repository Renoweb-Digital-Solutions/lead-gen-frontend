// # TEMPORARY outreach fixture: this opt-in flag bypasses lead generation only.
// # Next.js inlines NEXT_PUBLIC_* variables; restart dev/rebuild after switching.
// # The real mailbox and send endpoints remain connected for integration checks.
export const TEST_LEADS_ENABLED = process.env.NEXT_PUBLIC_OUTREACH_TEST_LEADS === "true";

export function createTestLeads() {
  // # These recipient addresses were supplied for testing. All company, title
  // # and location fields below are synthetic and explicitly labelled as such.
  // # Return fresh row objects so each Run opens a fresh preview without storage.
  return [
    ["badshroud679@gmail.com", "Bad", "Shroud", "Demo Creative Studio", "Creative Director", "Demo City A"],
    ["teamsrenoweb@gmail.com", "Renoweb", "Teams", "Demo Product Team", "Operations Manager", "Demo City B"],
    ["samaresh.renoweb.webdevintern@gmail.com", "Sam", "Das", "Demo Web Studio", "Frontend Developer", "Demo City C"],
    ["debarun.renoweb.engineer@gmail.com", "Debarun", "", "Demo Engineering Team", "Software Engineer", "Demo City D"],
  ].map(([email, first_name, last_name, company, position, city]) => ({
    email, first_name, last_name, name: `${first_name} ${last_name}`.trim(),
    company, position, city, data_source: "Synthetic outreach test lead",
  }));
}
