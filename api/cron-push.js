/* global process */

const EVENING_MESSAGES = [
  { 
    title: "🌌 오늘 하루를 채우는 영롱한 서광", 
    body: "고요한 밤, 오늘 하루를 비추는 영롱한 말씀의 조각. 바이블그램에서 오늘의 성화를 봉헌해 보세요." 
  },
  { 
    title: "🕊️ 하루를 맑게 마무리하는 기도의 시간", 
    body: "오늘 성도님을 위해 예비된 은혜로운 말씀 카드가 기다립니다. 고요한 마음으로 주님과 함께 하루를 마감해 보세요." 
  },
  { 
    title: "📖 말씀의 등불로 평안한 밤을", 
    body: "매일 오후 9시 성경을 통해 빛의 말씀을 빚어보세요. 주님과 온전히 동행하는 평화로운 밤이 기다립니다." 
  },
  { 
    title: "✨ 은혜로운 생명의 말씀 배달", 
    body: "오늘 하루도 주님의 은혜 속에 수고 많으셨습니다. 밤하늘을 밝히는 은혜로운 오늘의 성서를 확인해 보세요." 
  },
  { 
    title: "🌌 지친 영혼을 위로하는 오늘의 지혜", 
    body: "지치고 바빴던 하루의 끝, 성경 속에 감춰진 천상의 지혜를 꺼내어 오늘 하루의 따뜻한 위로로 삼아보세요." 
  }
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Allow Vercel Cron (GET) or manual triggers (GET/POST)
  const isCron = req.headers['x-vercel-cron'] === '1';
  const isManual = req.query.secret === 'biblegram-test';
  
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isCron && !isManual && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Supabase configuration keys missing in API env' });
  }

  try {
    const webpush = (await import('web-push')).default;
    webpush.setVapidDetails(
      'mailto:wlstlfdl11@kakao.com',
      'BBKn6U7kjRk4ZTVaLdxtGJ0yVnG6OjGxwL1VFB0bhm0NTPl2CLfElNl00IUxhbPBuNkF3H28MHMNcW10QnHLGFQ',
      'V65_m9sYALojbT25wB1AdGkNIE4M7OBY1w7Wl1_6-t4'
    );

    // 1. Query all unique push subscriptions from Supabase
    const subUrl = `${supabaseUrl}/rest/v1/push_subscriptions?select=user_id,subscription`;
    const subResponse = await fetch(subUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!subResponse.ok) {
      console.error("Failed to query subscriptions:", await subResponse.text());
      return res.status(500).json({ error: 'Failed to query subscriptions from DB' });
    }

    const rows = await subResponse.json();
    if (!rows || rows.length === 0) {
      return res.status(200).json({ status: 'ignored', reason: 'no_subscriptions' });
    }

    // 2. Select a random message from the Evening copy catalog
    const randomIdx = Math.floor(Math.random() * EVENING_MESSAGES.length);
    const chosenMsg = EVENING_MESSAGES[randomIdx];

    // 3. Send Web Push to all endpoints
    let successCount = 0;
    let failCount = 0;

    const payloadStr = JSON.stringify({ 
      title: chosenMsg.title, 
      body: chosenMsg.body, 
      data: { type: 'daily-push', url: '/' }
    });

    // Use Promise.allSettled to push concurrently and robustly
    const pushPromises = rows.map(async (row) => {
      try {
        const subscriptionObj = typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription;
        await webpush.sendNotification(subscriptionObj, payloadStr);
        successCount++;
      } catch (err) {
        console.error(`Failed to send push to user ${row.user_id}:`, err);
        failCount++;
        // Delete expired subscription
        if (err.statusCode === 410 || err.statusCode === 404) {
          const deleteUrl = `${supabaseUrl}/rest/v1/push_subscriptions?user_id=eq.${encodeURIComponent(row.user_id)}`;
          await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`
            }
          });
        }
      }
    });

    await Promise.allSettled(pushPromises);

    return res.status(200).json({ 
      status: 'ok', 
      message: 'Daily push completed',
      chosenMessage: chosenMsg,
      sentCount: successCount,
      failedCount: failCount
    });
  } catch (error) {
    console.error('Daily cron push execution error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
