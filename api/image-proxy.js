// Vercel Serverless Function: 카카오 봇의 쿼리 스트링 거부 정책을 무력화하는 정적 이미지 경로 위장(Clean URL) 스트리밍 프록시 API
export default async function handler(req, res) {
  // Vercel로 유입된 온전한 raw URL 파싱
  const requestUrl = req.url || '';
  const urlPath = requestUrl.split('?')[0]; // 예: "/api/image-proxy/fal.media/files/shared/Qj5yWj8nO9sJ4x8Z9y8xZ.png"

  let targetUrl = '';

  // 1. 정적 이미지 위장 경로(/api/image-proxy/호스트/경로) 복원
  const matchIndex = urlPath.indexOf('/api/image-proxy/');
  if (matchIndex !== -1) {
    const rawTarget = urlPath.substring(matchIndex + '/api/image-proxy/'.length);
    if (rawTarget.trim().length > 0) {
      // 2중 프로토콜 가드 처리
      let cleanTarget = rawTarget;
      if (cleanTarget.startsWith('https:/') && !cleanTarget.startsWith('https://')) {
        cleanTarget = cleanTarget.replace('https:/', 'https://');
      } else if (cleanTarget.startsWith('http:/') && !cleanTarget.startsWith('http://')) {
        cleanTarget = cleanTarget.replace('http:/', 'http://');
      } else if (!cleanTarget.startsWith('http://') && !cleanTarget.startsWith('https://')) {
        cleanTarget = 'https://' + cleanTarget;
      }
      targetUrl = cleanTarget;
    }
  }

  // 2. 하위 호환용 쿼리(url) 가드 및 3중 디코딩 복원
  if (!targetUrl && req.query.url) {
    targetUrl = req.query.url;
    try {
      for (let i = 0; i < 3; i++) {
        if (
          targetUrl.includes('%3A') || 
          targetUrl.includes('%2F') || 
          targetUrl.includes('%3a') || 
          targetUrl.includes('%2f') || 
          targetUrl.includes('%25')
        ) {
          targetUrl = decodeURIComponent(targetUrl);
        } else {
          break;
        }
      }
    } catch (e) {
      console.error('Query decode error:', e);
    }
  }

  if (!targetUrl) {
    return res.status(400).send('Missing target image path');
  }

  // 주소 앞머리 슬래시 보정
  if (targetUrl.startsWith('//')) {
    targetUrl = 'https:' + targetUrl;
  }

  console.log('Clean URL resolved target URL for proxy:', targetUrl);

  try {
    // 3. fal.ai 및 Unsplash의 로봇 탐지 필터를 격파하는 모바일 사파리 User-Agent 위장
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://biblegram.vercel.app/',
        'Origin': 'https://biblegram.vercel.app'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image from source: ${response.statusText} (Status: ${response.status})`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // ArrayBuffer로 변환 후 전송
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Vercel Edge/Serverless 단에서 1년간 초강력 캐싱 설정 (재요청 시 무부하 즉시 서빙)
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Image proxy error, initiating redirect safety fallback:', error);
    
    // 4. 프록시 fetch가 처참히 에러 난 경우, 절대 깨진 십자가를 뱉지 않고 
    // 원래의 원본 이미지 주소(targetUrl)로 302 리다이렉트 처리하여 카카오톡 봇이 원본을 직접 수집하도록 유도
    return res.redirect(302, targetUrl);
  }
}
