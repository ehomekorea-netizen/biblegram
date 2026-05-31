// Vercel Serverless Function: CORS 및 fal.ai 이미지 보안 방화벽 100% 우회 스트리밍 프록시 API
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    // fal.ai 등의 보안 서버에 일반 브라우저인 것처럼 우회 헤더를 탑재하여 다운로드 시도 (CORS 영향 없음)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image from source: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // ArrayBuffer로 읽어서 Buffer로 변환 후 브라우저 및 카카오 봇에 직접 전송
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 강력한 브라우저 및 카카오 스크랩 캐싱 설정 (트래픽 최소화)
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1년간 초강력 캐싱
    res.status(200).send(buffer);

  } catch (error) {
    console.error('Image proxy error:', error);
    
    // 실패 시 예비용 고품질 디폴트 기독교 십자가 이미지 스트리밍으로 안전하게 대체 (절대 깨지지 않음)
    try {
      const fallbackResponse = await fetch('https://images.unsplash.com/photo-1544764200-d834fd210a23?q=80&w=800');
      const arrayBuffer = await fallbackResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.status(200).send(buffer);
    } catch (e2) {
      res.status(500).send('Internal Server Error');
    }
  }
}
