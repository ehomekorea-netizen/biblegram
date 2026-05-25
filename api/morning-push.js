/* global process */

const MORNING_MESSAGES = [
  { 
    title: "🌅 새벽이슬 같은 오늘의 말씀", 
    body: "주님께서 예비하신 새 아침입니다. 오늘 하루를 인도할 은혜로운 말씀 카드가 성도님을 기다립니다." 
  },
  { 
    title: "☀️ 주님과 함께 시작하는 하루", 
    body: "좋은 아침입니다, 성도님. 말씀의 빛으로 오늘 하루를 밝혀 보세요. 바이블그램에서 아침 묵상이 준비되어 있습니다." 
  },
  { 
    title: "🕊️ 오늘도 주의 날개 아래에서", 
    body: "새벽을 여시는 주님의 은혜가 오늘도 성도님과 함께합니다. 말씀 한 절로 하루를 시작해 보세요." 
  },
  { 
    title: "📖 말씀으로 깨어나는 아침", 
    body: "눈을 뜨는 순간부터 주님과 동행하세요. 오늘의 은혜로운 말씀이 바이블그램에서 기다리고 있습니다." 
  },
  { 
    title: "✨ 아침의 첫 열매를 주님께", 
    body: "하루의 첫 시간을 주님께 드리는 것은 가장 아름다운 예배입니다. 오늘의 말씀 카드를 확인해 보세요." 
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

    // 2. Select a random message from the Morning copy catalog
    const randomIdx = Math.floor(Math.random() * MORNING_MESSAGES.length);
    const chosenMsg = MORNING_MESSAGES[randomIdx];

    // 3. Send Web Push to all endpoints
    let successCount = 0;
    let failCount = 0;

    const payloadStr = JSON.stringify({ 
      title: chosenMsg.title, 
      body: chosenMsg.body, 
      data: { type: 'morning-push', url: '/' }
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
      message: 'Morning push completed',
      chosenMessage: chosenMsg,
      sentCount: successCount,
      failedCount: failCount
    });
  } catch (error) {
    console.error('Morning push execution error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
