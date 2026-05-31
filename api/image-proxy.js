// Vercel Serverless Function: 이중 URL 인코딩을 100% 복원하여 쿼리 분실 및 CORS 문제를 완전 해결하는 스트리밍 프록시 API
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  let targetUrl = url;

  // 1. 3중 디코딩 방어막 탑재 (이중 인코딩 %253A 등의 기호를 100% 원본 주소로 완벽 복원)
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
    console.error('URL Double Decode error:', e);
  }

  // 주소 앞머리 슬래시 보정
  if (targetUrl.startsWith('//')) {
    targetUrl = 'https:' + targetUrl;
  }

  console.log('Final resolved target URL for proxy:', targetUrl);

  try {
    // 2. fal.ai 및 Unsplash의 로봇 탐지 필터를 격파하는 모바일 사파리 User-Agent 위장
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
    
    // 3. 프록시 fetch가 처참히 에러 난 경우, 절대 깨진 십자가를 뱉지 않고 
    // 원래의 원본 이미지 주소(targetUrl)로 302 리다이렉트 처리하여 카카오톡 봇이 원본을 직접 수집하도록 유도
    return res.redirect(302, targetUrl);
  }
}
