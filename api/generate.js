/* global process, Buffer */
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
      prompt = `사용자가 "${reference}"에 해당하는 성경 구절을 검색하려고 합니다.
개역개정 번역본 기준으로 사용자가 요청한 정확한 장절 범위의 본문만을 찾아 반환해 주세요.

[★ 절대 필수 준수 지침 ★]
1. 단일 절 요청 처리: 사용자가 특정 절 하나만 지정한 경우(예: "창세기 1장 1절", "창세 1:1", "요한복음 3장 16절" 등), 절대로 다른 절(2절, 3절 등)을 붙이지 말고 오직 해당 1개의 절만 완벽하게 반환하십시오.
   - 예: "창세기 1장 1절"을 검색하면 오직 1절 본문인 "태초에 하나님이 천지를 창조하시니라." 한 문장만 반환해야 합니다. 뒤따르는 2절("땅이 혼돈하고 공허하며...")이나 3절은 절대 포함하지 마십시오.
2. 범위 절 요청 처리: 사용자가 명시적인 범위(예: "창세기 1:6~9", "마태복음 7:4~7" 등)를 지정한 경우에만 해당 범위 내의 절들을 빠짐없이 순서대로 합쳐서 반환하십시오.
3. 사설이나 설명, 마크다운 기호를 모두 제외하고 아래 JSON 형식으로만 정확히 응답하십시오:
{
  "text": "정확한 성경 구절 본문"
}`;
      systemInstruction = "당신은 개역개정 성경 구절을 글자 하나 틀리지 않고 정확하게 검색해 주는 정확하고 엄격한 성경 데이터베이스 에이전트입니다. 창작이나 추론, 임의 덧붙임 없이 오직 사용자가 명시한 정확한 장절 본문만을 반환해야 합니다.";
    } else if (action === 'create') {
      if (!verseText) {
        return res.status(400).json({ error: 'Verse text is required for create action' });
      }
      prompt = `다음 성경 구절과 사용자의 고백을 바탕으로 묵상 해설과 신학적 분위기를 분석해 주세요.
성경 구절: ${verseText}
사용자 고백: ${userThought || "없음"}

당신은 영적으로 무척 지혜롭고 자애로운 기독교 묵상 도우미입니다. 경어체를 쓰며, 주님의 온유하고 평화로운 품을 연상시키는 정중하고 부드러운 어조로 위로와 지혜를 안겨주세요. 다음 필수 준수 사항에 맞추어 묵상 해설(2~3문장)과 1줄 온전한 기도문을 작성하고, 구절에 적합한 시각 테마, 이미지 검색용 영어 키워드 및 영단어 개념을 분류하여 JSON으로 반환해 주세요.

[JSON 반환 형식]
{
  "meditation": "은혜롭고 지혜가 가득한 오늘의 묵상 해설(2~3문장)과 1줄 온전한 기도문",
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
          if (unsplashApiKey) {
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
