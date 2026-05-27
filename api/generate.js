/* global process, Buffer */
import bibleData from './bible-ko.json' with { type: 'json' };
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

      try {
        // 1. 성경 책과 장절 파싱 (예: "요한복음 3:16", "역대상 3:8", "창세기 1:1-2", "창세기 1:1 ~ 1:3")
        const trimmedRef = reference.trim();
        
        let bookNameInput = "";
        let chapterNum = 1;
        let verseInput = "";
        let startVerse = 1;
        let endVerse = 1;
        let isRange = false;

        // 패턴 A: "창세기 1:1 ~ 1:3" 처럼 장 번호가 양쪽에 중복 기재된 범위 형태 파싱
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
          // 패턴 B: "창세기 1:1-2" 또는 "요한복음 3:16" 처럼 장이 한 번만 표기된 단일/범위 형태 파싱
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
          verseInput = refMatch[3].trim();
        }

        // 성경 책 정경 순서 맵핑 테이블 (0 ~ 65)
        const BIBLE_BOOKS = [
          "창세기", "출애굽기", "레위기", "민수기", "신명기", "여호수아", "사사기", "룻기", 
          "사무엘상", "사무엘하", "열왕기상", "열왕기하", "역대기상", "역대기하", "에스라", 
          "느헤미야", "에스더", "욥기", "시편", "잠언", "전도서", "아가", "이사야", "예레미야", 
          "예레미야애가", "에스겔", "다니엘", "호세아", "요엘", "아모스", "오바댜", "요나", 
          "미가", "나훔", "하박국", "스바냐", "학개", "스가랴", "말라기", "마태복음", "마가복음", 
          "누가복음", "요한복음", "사도행전", "로마서", "고린도전서", "고린도후서", "갈라디아서", 
          "에베소서", "빌립보서", "골로새서", "데살로니가전서", "데살로니가후서", "디모데전서", 
          "디모데후서", "디도서", "빌레몬서", "히브리서", "야고보서", "베드로전서", "베드로후서", 
          "요한일서", "요한이서", "요한삼서", "유다서", "요한계시록"
        ];

        const BIBLE_MAP = {
          "창": "창세기", "출": "출애굽기", "레": "레위기", "민": "민수기", "신": "신명기",
          "수": "여호수아", "여호": "여호수아", "삿": "사사기", "사사": "사사기", "룻": "룻기",
          "삼상": "사무엘상", "삼하": "사무엘하", "왕상": "열왕기상", "왕하": "열왕기하",
          "대상": "역대기상", "역대상": "역대기상", "대하": "역대기하", "역대하": "역대기하",
          "스": "에스라", "느": "느헤미야", "에": "에스더", "욥": "욥기", "시": "시편",
          "잠": "잠언", "전": "전도서", "아": "아가", "사": "이사야", "렘": "예레미야",
          "애": "예레미야애가", "렘애": "예레미야애가", "겔": "에스겔", "단": "다니엘",
          "호": "호세아", "욜": "요엘", "암": "아모스", "옵": "오바댜",
          "욘": "요나", "미": "미가", "나": "나훔", "합": "하박국", "습": "스바냐",
          "학": "학개", "슥": "스가랴", "말": "말라기", "마": "마태복음", "마태": "마태복음",
          "막": "마가복음", "마가": "마가복음", "누": "누가복음", "누가": "누가복음",
          "요": "요한복음", "요한": "요한복음", "행": "사도행전", "롬": "로마서",
          "고전": "고린도전서", "고후": "고린도후서", "갈": "갈라디아서", "엡": "에베소서",
          "빌": "빌립보서", "골": "골로새서", "살전": "데살로니가전서", "살후": "데살로니가후서",
          "딤전": "디모데전서", "딤후": "디모데후서", "딛": "디도서", "몬": "빌레몬서",
          "히": "히브리서", "야": "야고보서", "벧전": "베드로전서", "벧후": "베드로후서",
          "요일": "요한일서", "요이": "요한이서", "요삼": "요한삼서", "유": "유다서",
          "계": "요한계시록", "계시록": "요한계시록"
        };

        const standardBookName = BIBLE_MAP[bookNameInput] || bookNameInput;
        const bookIdx = BIBLE_BOOKS.indexOf(standardBookName);

        if (bookIdx === -1) {
          return res.status(200).json({
            exists: false,
            text: "",
            error: `"${bookNameInput}"은(는) 성경 66권 목록에 존재하지 않는 이름입니다.`
          });
        }

        const bookData = bibleData[bookIdx];
        const chapters = bookData.chapters;

        // 장 범위 유효성 체크
        if (chapterNum < 1 || chapterNum > chapters.length) {
          return res.status(200).json({
            exists: false,
            text: "",
            error: `${standardBookName} ${chapterNum}장은 존재하지 않는 구절 범위입니다.`
          });
        }

        const verses = chapters[chapterNum - 1]; // 0-indexed

        // 2. 절 범위 가드 및 2개 절 초과 차단
        if (!complexMatch) {
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
        } else {
          // complexMatch일 때는 선행 파서에서 이미 startVerse, endVerse, isRange를 전부 계산 및 한도 검증 완료함
        }

        if (isNaN(startVerse) || startVerse < 1 || startVerse > verses.length || endVerse < startVerse || endVerse > verses.length) {
          return res.status(200).json({
            exists: false,
            text: "",
            error: `${standardBookName} ${chapterNum}장 ${startVerse}절 ~ ${endVerse}절은 존재하지 않는 범위입니다.`
          });
        }

        // 3. 본문 텍스트 합치기 및 추출
        let matchedText = "";
        if (isRange) {
          const textSegments = [];
          for (let v = startVerse; v <= endVerse; v++) {
            const cleanText = verses[v - 1].replace(/\s+/g, ' ').replace(/ !/g, '!').trim();
            textSegments.push(cleanText);
          }
          matchedText = textSegments.join(" ");
        } else {
          matchedText = verses[startVerse - 1].replace(/\s+/g, ' ').replace(/ !/g, '!').trim();
        }

        // [비주얼 & TTS 비용 가드] 총 글자 수 160자 제한
        if (matchedText.length > 160) {
          return res.status(200).json({
            exists: false,
            text: "",
            error: "성경 구절의 총 분량이 말씀 카드 미학 규격(최대 160자)을 초과합니다. 조금 더 정제된 구절로 묵상해 보세요."
          });
        }

        return res.status(200).json({
          exists: true,
          text: matchedText,
          error: ""
        });
      } catch (err) {
        console.error("Local Bible DB search failed:", err);
        return res.status(500).json({ error: "성경 데이터베이스 검색 도중 치명적인 에러가 발생했습니다." });
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
