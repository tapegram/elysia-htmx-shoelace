import { OAuthUser } from "./auth";

export async function getGithubUser(code: string): Promise<OAuthUser> {
  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  // Get user data with access token
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const userData = await userResponse.json();

  // Get user email
  const emailsResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const emails = await emailsResponse.json();
  const primaryEmail = emails.find((email: any) => email.primary)?.email;

  return {
    provider: 'github',
    providerId: userData.id.toString(),
    email: primaryEmail,
    name: userData.name,
    avatarUrl: userData.avatar_url,
    accessToken: tokenData.access_token,
  };
} 