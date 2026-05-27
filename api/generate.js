/* global process, Buffer */
import bibleData from './bible-ko.json' with { type: 'json' };
const rateLimitMap = new Map();
const CURATED_HOLY_IMAGES = {
  cross: [
    "https://images.unsplash.com/photo-1544764200-d834fd210a23?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?q=80&w=1080&auto=format&fit=crop"
  ],
  light: [
    "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1080&auto=format&fit=crop"
  ],
  nature: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1080&auto=format&fit=crop"
  ],
  water: [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=1080&auto=format&fit=crop"
  ],
  night: [
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517242027094-631f8c218a0f?q=80&w=1080&auto=format&fit=crop"
  ],
  mountain: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1080&auto=format&fit=crop"
  ],
  love: [
    "https://images.unsplash.com/photo-1461530751191-4446b858f484?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1080&auto=format&fit=crop"
  ],
  snow: [
    "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496307653780-3aee777597b1?q=80&w=1080&auto=format&fit=crop"
  ]
};

export default async function handler(req, res) {
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

  let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
  }
  apiKey = apiKey.trim().replace(/[\r\n]/g, '');

  let openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (openaiApiKey) {
    openaiApiKey = openaiApiKey.trim().replace(/[\r\n]/g, '');
  }

  let unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY || process.env.VITE_UNSPLASH_ACCESS_KEY;
  if (unsplashApiKey) {
    unsplashApiKey = unsplashApiKey.trim().replace(/[\r\n]/g, '');
  }

  const { action, reference, verseText, userThought } = req.body;

  try {
    // 0. 웹 푸시 처리
    if (action === 'push') {
      const { targetUserId, title, body, data, image } = req.body;
      if (!targetUserId || !title || !body) {
        return res.status(400).json({ error: 'targetUserId, title, and body are required for push' });
      }

      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({ error: 'Supabase configuration keys missing in API env' });
      }

      const webpush = (await import('web-push')).default;
      webpush.setVapidDetails(
        'mailto:wlstlfdl11@kakao.com',
        'BBKn6U7kjRk4ZTVaLdxtGJ0yVnG6OjGxwL1VFB0bhm0NTPl2CLfElNl00IUxhbPBuNkF3H28MHMNcW10QnHLGFQ',
        'V65_m9sYALojbT25wB1AdGkNIE4M7OBY1w7Wl1_6-t4'
      );

      const subUrl = `${supabaseUrl}/rest/v1/push_subscriptions?user_id=eq.${encodeURIComponent(targetUserId)}&select=subscription`;
      const subResponse = await fetch(subUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });

      if (!subResponse.ok) {
        console.error("Failed to query subscription from Supabase:", await subResponse.text());
        return res.status(200).json({ status: 'ignored', reason: 'db_query_failed' });
      }

      const rows = await subResponse.json();
      if (!rows || rows.length === 0) {
        console.log(`No push subscription found for user: ${targetUserId}`);
        return res.status(200).json({ status: 'ignored', reason: 'no_subscription_found' });
      }

      let successCount = 0;
      for (const row of rows) {
        try {
          const subscriptionObj = typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription;
          const payloadStr = JSON.stringify({ 
            title, 
            body, 
            data: { ...data, image: image || (data && data.image) },
            image: image || (data && data.image) 
          });
          
          await webpush.sendNotification(subscriptionObj, payloadStr);
          successCount++;
        } catch (err) {
          console.error("Failed to send web push to client endpoint:", err);
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log("Push subscription expired, deleting...");
            const deleteUrl = `${supabaseUrl}/rest/v1/push_subscriptions?user_id=eq.${encodeURIComponent(targetUserId)}`;
            await fetch(deleteUrl, {
              method: 'DELETE',
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
              }
            });
          }
        }
      }

      return res.status(200).json({ status: 'ok', sent: successCount });
    }

    // 1. OpenAI TTS 처리
    if (action === 'tts') {
      const textToSpeak = verseText || req.body.text;
      if (!textToSpeak) {
        return res.status(400).json({ error: 'Text is required for TTS action' });
      }

      if (!openaiApiKey) {
        return res.status(400).json({ error: 'OpenAI API key is missing.' });
      }

      const ttsUrl = 'https://api.openai.com/v1/audio/speech';
      const voice = req.body.voice || 'onyx';
      const ttsPayload = {
        model: 'tts-1',
        input: textToSpeak,
        voice: voice,
        response_format: 'mp3'
      };

      const ttsResponse = await fetch(ttsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ttsPayload)
      });

      if (!ttsResponse.ok) {
        const errText = await ttsResponse.text();
        console.error(`OpenAI TTS API returned error: ${ttsResponse.status} - ${errText}`);
        return res.status(ttsResponse.status).json({ error: `OpenAI TTS error: ${ttsResponse.statusText}` });
      }

      const arrayBuffer = await ttsResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', buffer.length);
      return res.status(200).send(buffer);
    }

    // 2. 성경 찾기, 묵상 분석 등은 고가용성/가성비 모델인 OpenAI gpt-4o-mini를 프록시로 안전하게 호출
    let prompt = '';
    let systemInstruction = "당신은 영적으로 무척 지혜롭고 자애로운 기독교 묵상 도우미입니다. 경어체를 쓰며, 주님의 온유하고 평화로운 품을 연상시키는 정중하고 부드러운 어조로 위로와 지혜를 안겨주세요.";
    let isJson = true;

    if (action === 'search') {
      if (!reference) {
        return res.status(400).json({ error: 'Reference is required for search action' });
      }

      // [Vercel IP Rate Limiter] 동일 IP에서 1분당 최대 10회 요청 제한
      const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || 'anonymous';
      const now = Date.now();
      const ipData = rateLimitMap.get(clientIp);

      if (!ipData || now > ipData.resetTime) {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + 60000 });
      } else {
        ipData.count++;
        if (ipData.count > 10) {
          return res.status(200).json({
            exists: false,
            text: "",
            error: "성도님, 단시간 내에 너무 많은 탐색 요청이 감지되었습니다. 1분 후 평온한 마음으로 다시 시도해 주세요."
          });
        }
      }

      try {
        const trimmedRef = reference.trim();
        
        // 1. 선행 가드: 3개 절 이상 및 서로 다른 장 범위인지 정규식으로 기계적 검증 (프론트/백 이중 방어)
        let bookNameInput = "";
        let chapterNum = 1;
        let startVerse = 1;
        let endVerse = 1;
        let isRange = false;

        const complexMatch = trimmedRef.match(/^(.+?)\s+(\d+)\s*:\s*(\d+)\s*[\-~]\s*(\d+)\s*:\s*(\d+)$/);
        
        if (complexMatch) {
          bookNameInput = complexMatch[1].trim();
          const startChap = parseInt(complexMatch[2], 10);
          startVerse = parseInt(complexMatch[3], 10);
          const endChap = parseInt(complexMatch[4], 10);
          endVerse = parseInt(complexMatch[5], 10);
          
          if (startChap !== endChap) {
            return res.status(200).json({
              exists: false,
              text: "",
              error: "성도님, 깊은 집중을 위해 성경 말씀은 같은 장(Chapter) 내에서만 연속 탐색이 가능합니다."
            });
          }
          if (endVerse - startVerse > 1 || endVerse < startVerse) {
            return res.status(200).json({
              exists: false,
              text: "",
              error: "성도님, 말씀 카드의 수려한 황금 비율과 깊은 묵상을 위해 한 번에 최대 2개 절까지만 탐색이 가능합니다."
            });
          }
          chapterNum = startChap;
          isRange = startVerse !== endVerse;
        } else {
          const refMatch = trimmedRef.match(/^(.+?)\s+(\d+)\s*:\s*([0-9\s\-~,]+)$/);
          if (!refMatch) {
            return res.status(200).json({
              exists: false,
              text: "",
              error: `올바른 성경 장절 형식(예: 요한복음 3:16 또는 창세기 1:1~2)으로 기입해 주세요.`
            });
          }

          bookNameInput = refMatch[1].trim();
          chapterNum = parseInt(refMatch[2], 10);
          const verseInput = refMatch[3].trim();

          const rangeMatch = verseInput.match(/^(\d+)\s*[\-~]\s*(\d+)$/);
          if (rangeMatch) {
            startVerse = parseInt(rangeMatch[1], 10);
            endVerse = parseInt(rangeMatch[2], 10);
            isRange = true;
            
            if (endVerse - startVerse > 1 || endVerse < startVerse) {
              return res.status(200).json({
                exists: false,
                text: "",
                error: "성도님, 말씀 카드의 수려한 황금 비율과 깊은 묵상을 위해 한 번에 최대 2개 절까지만 탐색이 가능합니다."
              });
            }
          } else {
            startVerse = parseInt(verseInput, 10);
            endVerse = startVerse;
          }
        }

        // 2. OpenAI GPT-4o-mini에게 "개역개정" 판본의 정확한 성구 요청
        const searchPrompt = `대한성서공회의 공식 [개역개정] 성경 번역본에서 아래 지정된 장절 범위의 본문 텍스트를 정확하게 추출해 주세요.
성경 구절 범위: ${trimmedRef}

[중요 지침]
1. 반드시 대한민국 개신교 교단에서 공식 사용하는 [개역개정] 번역본의 원본 본문 텍스트여야 합니다. (개역한글의 '패괴', '강포' 대신 '부패', '포악' 등으로 올바르게 수정된 개역개정 텍스트여야 합니다.)
2. 다중 절 범위(예: 요한복음 1:1-2)인 경우, 절 번호 접두사(예: '1절', '2절' 또는 '1.', '2.')를 절대로 텍스트에 포함하지 말고, 두 절의 본문만 자연스러운 하나의 공백으로 연결하여 하나의 완전한 텍스트로 합쳐 주십시오.
3. 구절이 실제로 존재하지 않는 경우, "exists": false로 설정하십시오.
4. 만약 검색된 성경 구절의 총 글자 수가 160자를 넘어가면 "error": "성경 구절의 총 분량이 말씀 카드 미학 규격(최대 160자)을 초과합니다. 조금 더 정제된 구절로 묵상해 보세요.", "exists": false를 반환하십시오.

[JSON 반환 형식]
{
  "exists": true 또는 false,
  "text": "절 번호가 완전히 배제된 자연스럽게 결합된 개역개정 본문 텍스트",
  "error": "오류 발생 시에만 기입하는 안내 메시지 (정상 작동 시에는 빈 문자열)"
}`;

        const messages = [
          { role: 'system', content: "당신은 대한성서공회의 공식 [개역개정] 성경 본문을 완벽하게 기억하고 있는 신뢰할 수 있는 성서 데이터 제공 서버입니다. 오직 지정된 JSON 형식으로만 응답하며 본문의 글자 하나, 쉼표 하나까지 개역개정 판본의 텍스트와 100% 일치해야 합니다." },
          { role: 'user', content: searchPrompt }
        ];

        const openaiPayload = {
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.0,
          response_format: { type: 'json_object' }
        };

        const url = 'https://api.openai.com/v1/chat/completions';
        const apiResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(openaiPayload)
        });

        if (!apiResponse.ok) {
          throw new Error(`OpenAI API error: ${apiResponse.statusText}`);
        }

        const result = await apiResponse.json();
        let rawText = result.choices[0].message.content.trim();
        rawText = rawText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawText);

        return res.status(200).json(parsed);
      } catch (err) {
        console.error("OpenAI Bible search failed:", err);
        return res.status(200).json({
          exists: false,
          text: "",
          error: "성경 구절을 탐색하는 도중 서버 지연이 발생했습니다. 다시 시도해 주시거나 수동으로 기입해 주세요."
        });
      }
    } else if (action === 'create') {
      if (!verseText) {
        return res.status(400).json({ error: 'Verse text is required for create action' });
      }
      prompt = `다음 성경 구절과 사용자의 고백을 바탕으로 깊이 있고 은혜로운 묵상 해설과 신학적 분위기를 정밀 분석해 주세요.
성경 구절: ${verseText}
사용자 고백: ${userThought || "없음"}

당신은 영적으로 무척 지혜롭고 자애로운 기독교 묵상 도우미입니다. 경어체를 쓰며, 주님의 온유하고 평화로운 품을 연상시키는 정중하고 부드러운 어조로 위로와 지혜를 안겨주세요.

[★ 묵상(meditation) 작성 지침 ★]
1. 분량 준수: 절대로 극도로 짧거나 간결하게 요약하지 마십시오. 성도님이 아침과 저녁으로 충분히 깊은 영적 묵상을 즐기실 수 있도록, 묵상 해설 본문을 반드시 최소 3문장 이상 4문장 이하의 충실하고 풍성한 깊이로 서술해 주십시오.
2. 기도문 병합: 해설 본문 서술을 모두 마친 뒤에는, 반드시 행바꿈(\\n\\n)을 두 번 넣은 뒤, 성경 구절 및 고백에 연계된 정성스럽고 은혜로운 '오늘의 기도: [기도 내용]' 형태의 1줄 온전한 기도문을 추가하십시오.
3. 기계적이고 조급한 요약 생성을 강력히 금지합니다. 성도님의 마음에 따스한 위안과 은혜의 교제가 꽉 들어차도록 해설을 성실하게 구성해 주세요.

[JSON 반환 형식]
{
  "meditation": "풍성하고 은혜로운 묵상 해설(최소 3~4문장)과 그 뒤에 줄바꿈(\\n\\n) 후 이어진 오늘의 기도문",
  "textConcept": "구절의 신학적 메시지를 요약한 영단어 1개 (예: GRACE, FAITH, HOPE, LOVE, PEACE, GLORY, COMFORT, SALVATION)",
  "visualTheme": "구절의 영적/신학적 분위기에 어울리는 테마 단어 하나 (반드시 다음 중 하나여야 함: 'cross', 'light', 'nature', 'water', 'night', 'mountain', 'love', 'snow')",
  "visualKeywords": "Unsplash에서 고품질 배경 사진 검색에 사용할 영어 쉼표로 구분된 키워드 2~3개 (예: 'calm christian light, soft cross' 또는 'peaceful sunrise, holy prayer')"
}`;
    } else if (action === 'meditate') {
      if (!verseText) {
        return res.status(400).json({ error: 'Verse text is required for meditate action' });
      }
      prompt = `다음 성경 구절을 바탕으로 은혜롭고 지혜가 가득한 오늘의 묵상 해설(2~3문장)과 1줄 온전한 기도문을 작성해 주세요.
구절: ${verseText}
사용자 고백: ${userThought || "없음"}`;
      isJson = false;
    } else {
      return res.status(400).json({ error: 'Invalid action specified' });
    }

    if (!openaiApiKey) {
      return res.status(400).json({ error: 'Server configuration error: OpenAI API key is missing.' });
    }

    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ];

    const openaiPayload = {
      model: 'gpt-4o-mini',
      messages,
      temperature: action === 'search' ? 0.0 : 0.7
    };

    if (isJson) {
      openaiPayload.response_format = { type: 'json_object' };
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openaiPayload)
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error(`OpenAI Chat completions API returned error: ${apiResponse.status} - ${errText}`);
      return res.status(apiResponse.status).json({ error: `OpenAI API error: ${apiResponse.statusText}` });
    }

    const result = await apiResponse.json();

    try {
      let rawText = result.choices[0].message.content;
      
      if (isJson) {
        rawText = rawText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawText);

        // If it's a create action, fetch dynamic image
        if (action === 'create') {
          let imageUrl = '';
          if (false && unsplashApiKey) {
            try {
              const query = parsed.visualKeywords || parsed.visualTheme || 'bible';
              const unsplashUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=portrait&client_id=${unsplashApiKey}`;
              console.log(`Fetching random image from Unsplash with query: ${query}`);
              const unsplashResponse = await fetch(unsplashUrl);
              if (unsplashResponse.ok) {
                const unsplashData = await unsplashResponse.json();
                if (unsplashData && unsplashData.urls && unsplashData.urls.regular) {
                  imageUrl = unsplashData.urls.regular;
                  console.log(`Successfully fetched image from Unsplash: ${imageUrl}`);
                }
              } else {
                console.warn(`Unsplash API responded with status: ${unsplashResponse.status}`);
              }
            } catch (err) {
              console.error("Unsplash image fetch failed:", err);
            }
          }

          // Fallback to local CURATED_HOLY_IMAGES if unsplash fetch failed or key is missing
          if (!imageUrl) {
            const theme = (parsed.visualTheme || 'light').toLowerCase().trim();
            const imagesForTheme = CURATED_HOLY_IMAGES[theme] || CURATED_HOLY_IMAGES['light'];
            const randomIdx = Math.floor(Math.random() * imagesForTheme.length);
            imageUrl = imagesForTheme[randomIdx];
            console.log(`Using fallback curated image for theme ${theme}: ${imageUrl}`);
          }
          parsed.image = imageUrl;
        }

        return res.status(200).json(parsed);
      } else {
        return res.status(200).json({ text: rawText });
      }
    } catch (e) {
      console.error('Error parsing response from OpenAI:', e);
      return res.status(500).json({ error: 'Failed to parse OpenAI response' });
    }
  } catch (error) {
    console.error('API execution error:', error);
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
}
