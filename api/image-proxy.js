/* global fetch, Buffer */
export default async function handler(req, res) {
  // CORS 및 캐시 가속 설정 (1일 동안 카카오 서버 및 에지 브라우징 강력한 캐싱 보장)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    // 1. 전달받은 쿼리 디코딩
    const decodedUrl = decodeURIComponent(url);

    // 2. wsrv.nl을 백그라운드 프록시로 호출하여 1:1 Aspect Fill 크롭 이미지 바이너리 획득
    // wsrv.nl은 무거운 엔진을 에지 단에서 처리해주어 최상의 반응성을 보여줍니다.
    const resizerUrl = `https://wsrv.nl/?url=${encodeURIComponent(decodedUrl)}&w=400&h=400&fit=cover&output=jpg`;
    
    console.log(`ImageProxy: Fetching from wsrv.nl -> ${resizerUrl}`);
    
    const response = await fetch(resizerUrl);
    if (!response.ok) {
      console.warn(`ImageProxy: wsrv.nl failed with status ${response.status}. Falling back to original image streaming.`);
      // 2중 안전 장치: wsrv.nl 실패 시 원래 원본 이미지의 스트림으로 자연스럽게 폴백
      const fallbackResponse = await fetch(decodedUrl);
      if (!fallbackResponse.ok) {
        return res.status(fallbackResponse.status).send('Failed to fetch fallback original image');
      }
      const buffer = await fallbackResponse.arrayBuffer();
      res.setHeader('Content-Type', fallbackResponse.headers.get('Content-Type') || 'image/jpeg');
      return res.status(200).send(Buffer.from(buffer));
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. 카카오 봇의 화이트리스트 도메인 가드를 가뿐하게 관통하도록 당당히 본진 도메인명으로 바이너리 발송!
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('ImageProxy Error:', error);
    return res.status(500).send('Internal Server Error during image proxying');
  }
}
