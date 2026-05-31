import { createClient } from '@supabase/supabase-js';
import { Jimp } from 'jimp';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl, cardId } = req.body;

  if (!imageUrl || !cardId) {
    return res.status(400).json({ error: 'Missing imageUrl or cardId' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase credentials missing on server' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let cleanUrl = imageUrl;
    if (cleanUrl.startsWith('//')) {
      cleanUrl = 'https:' + cleanUrl;
    }

    console.log(`[Server Thumbnail] Processing Card ${cardId} with URL: ${cleanUrl}`);

    // 1. Jimp로 원본 이미지 로드 (서버 사이드 로더는 CORS 보안 제약 전면 통과 우회!)
    const image = await Jimp.read(cleanUrl);

    // 2. 1:1 Aspect Fill (Cover) 크롭 기법 적용
    image.cover({ w: 400, h: 400 });

    // 3. JPEG Buffer 추출
    const buffer = await image.getBuffer('image/jpeg');

    // 4. Supabase 'thumbnails' 버킷에 업로드
    const fileName = `thumb_${cardId}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        cacheControl: 'max-age=31536000, public, immutable',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    console.log(`[Server Thumbnail] Successfully uploaded 1:1 crop to thumbnails/thumb_${cardId}.jpg`);
    return res.status(200).json({ success: true, fileName });
  } catch (err) {
    console.error('[Server Thumbnail Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
