/* global process */

const ACTIVITY_MESSAGES = [
  { 
    title: "🕊️ 말씀 제단에 켜진 새로운 등불", 
    body: "지금 바이블그램 성소에 은혜로운 말씀 등불 10개가 새롭게 켜졌습니다. 성도들이 정성껏 빚어낸 묵상 속에 동참해 보세요." 
  },
  { 
    title: "✨ 성스러운 활성화 교제 초대", 
    body: "주님의 향기로 가득한 은혜의 나눔터. 지금 성도들이 뜨겁게 교제하며 말씀의 역사를 빚어내고 있습니다. 지금 확인해 보세요!" 
  },
  { 
    title: "📖 은혜의 고리가 이어지고 있습니다", 
    body: "나눌수록 풍성해지는 하늘의 은총. 바이블그램 성도들의 활발한 기도의 고리가 이어지고 있습니다. 주님의 평안을 함께 나누러 가요." 
  },
  { 
    title: "🌌 영롱한 말씀 카드가 봉헌되었습니다", 
    body: "방금 성도들의 신비롭고 영롱한 신앙 묵상들이 새롭게 봉헌되었습니다. 지금 가볍게 터치하여 말씀의 샘물을 길어 올려 보세요." 
  }
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Only POST requests are allowed' });
  }

  const { authorId, authorNickname } = req.body;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Supabase configuration keys missing in API env' });
  }

  try {
    // 1. Fetch total count of cards to check if we hit a 10-milestone
    const countUrl = `${supabaseUrl}/rest/v1/cards?select=id`;
    const countResponse = await fetch(countUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!countResponse.ok) {
      console.error("Failed to query cards for activity count:", await countResponse.text());
      return res.status(500).json({ error: 'Failed to count cards in DB' });
    }

    const cards = await countResponse.json();
    const totalCards = cards ? cards.length : 0;

    // Trigger only when total count of cards in DB is a multiple of 5
    const shouldTrigger = totalCards > 0 && totalCards % 5 === 0;

    if (!shouldTrigger) {
      return res.status(200).json({ 
        status: 'ignored', 
        reason: 'milestone_not_hit', 
        totalCards 
      });
    }

    // 2. Query all push subscriptions to broadcast
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
      return res.status(500).json({ error: 'Failed to query subscriptions' });
    }

    const rows = await subResponse.json();
    if (!rows || rows.length === 0) {
      return res.status(200).json({ status: 'ignored', reason: 'no_subscriptions' });
    }

    const webpush = (await import('web-push')).default;
    webpush.setVapidDetails(
      'mailto:wlstlfdl11@kakao.com',
      'BBKn6U7kjRk4ZTVaLdxtGJ0yVnG6OjGxwL1VFB0bhm0NTPl2CLfElNl00IUxhbPBuNkF3H28MHMNcW10QnHLGFQ',
      'V65_m9sYALojbT25wB1AdGkNIE4M7OBY1w7Wl1_6-t4'
    );

    // 3. Choose a random activity message
    const randomIdx = Math.floor(Math.random() * ACTIVITY_MESSAGES.length);
    const chosenMsg = ACTIVITY_MESSAGES[randomIdx];

    const payloadStr = JSON.stringify({ 
      title: chosenMsg.title, 
      body: chosenMsg.body, 
      data: { type: 'activity-push', url: '/' }
    });

    let successCount = 0;
    let failCount = 0;

    // Send push to all subscriptions, excluding the author who just posted
    const pushPromises = rows.map(async (row) => {
      // Skip the author
      if (authorId && String(row.user_id) === String(authorId)) {
        return;
      }

      try {
        const subscriptionObj = typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription;
        await webpush.sendNotification(subscriptionObj, payloadStr);
        successCount++;
      } catch (err) {
        console.error(`Failed to send activity push to user ${row.user_id}:`, err);
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
      message: `Activity push triggered for milestone ${totalCards}`,
      chosenMessage: chosenMsg,
      sentCount: successCount,
      failedCount: failCount,
      totalCards
    });
  } catch (error) {
    console.error('Activity push trigger error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
