/* global process */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(450).json({ error: 'Only POST requests are allowed' });
  }

  const { code, redirectUri } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  let apiKey = process.env.KAKAO_REST_API_KEY || process.env.VITE_KAKAO_REST_API_KEY;
  if (!apiKey) {
    console.error('Server configuration error: Kakao REST API key is missing.');
    return res.status(500).json({ error: 'Server configuration error: Kakao REST API key is missing.' });
  }
  apiKey = apiKey.trim().replace(/[\r\n]/g, '');

  try {
    // 1. Exchange authorization code for access token
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: apiKey,
      redirect_uri: redirectUri,
      code: code
    });

    console.log(`Exchanging Kakao auth code for access token...`);
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: params.toString()
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error(`Kakao Token API returned error: ${tokenResponse.status} - ${errText}`);
      return res.status(tokenResponse.status).json({ error: `Kakao Token exchange failed: ${tokenResponse.statusText}` });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return res.status(500).json({ error: 'Access token not found in Kakao response' });
    }

    // 2. Fetch user profile using access token
    const profileUrl = 'https://kapi.kakao.com/v2/user/me';
    console.log(`Fetching Kakao user profile...`);
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });

    if (!profileResponse.ok) {
      const errText = await profileResponse.text();
      console.error(`Kakao Profile API returned error: ${profileResponse.status} - ${errText}`);
      return res.status(profileResponse.status).json({ error: `Kakao Profile fetch failed: ${profileResponse.statusText}` });
    }

    const profileData = await profileResponse.json();
    
    // Extract profile info safely
    const kakaoId = profileData.id;
    const nickname = profileData.properties?.nickname || profileData.kakao_account?.profile?.nickname || '카카오 사용자';
    const profileImage = profileData.properties?.profile_image || profileData.kakao_account?.profile?.profile_image_url || '';

    console.log(`Successfully authenticated Kakao User ID: ${kakaoId}, Nickname: ${nickname}`);
    return res.status(200).json({
      id: kakaoId,
      nickname,
      profileImage
    });

  } catch (error) {
    console.error('Kakao Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error during Kakao login' });
  }
}
