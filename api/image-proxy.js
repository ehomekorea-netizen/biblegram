// Vercel Serverless Function: CORS 및 fal.ai 이미지 보안 방화벽 100% 우회 스트리밍 프록시 API
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  // 1. URL 디코딩 오류 방지용 안전 가드 (인코딩 문자열 자동 완치)
  let targetUrl = url;
  try {
    if (targetUrl.includes('%3A') || targetUrl.includes('%2F') || targetUrl.includes('%3a') || targetUrl.includes('%2f')) {
      targetUrl = decodeURIComponent(targetUrl);
    }
  } catch (e) {
    console.error('URL Decode error:', e);
  }

  console.log('Final target URL for proxy:', targetUrl);

  try {
    // 2. 모바일 브라우저의 접속인 것처럼 철저하게 위장한 헤더 탑재 (fal.ai 입구컷 회피)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://biblegram.vercel.app/',
        'Origin': 'https://biblegram.vercel.app'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image from source: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // ArrayBuffer로 읽어서 Buffer로 변환 후 전송
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 강력한 캐싱 설정
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1년간 초강력 캐싱
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Image proxy error, launching redirect rescue:', error);
    
    // 3. 만약 백엔드 fetch가 모종의 에러로 실패한 경우, 십자가를 뱉지 않고 
    // 원래의 원본 이미지 주소로 302 리다이렉트(Redirect)를 시켜 카카오톡이 원본을 어떻게든 수집하게 만듭니다.
    return res.redirect(302, targetUrl);
  }
}
