
import { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
// ==========================================
// 1. 테마 아이콘 정의 (strokeWidth 1.25~1.5의 세련된 아웃라인)
// ==========================================
const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
  Pause: () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Heart: ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#DFBA73" : "none"} stroke={filled ? "#DFBA73" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Share: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Music: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Bookmark: ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#DFBA73" : "none"} stroke={filled ? "#DFBA73" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  Volume: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  VolumeX: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>,
  MessageCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Feather: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
};

// ==========================================
// 2. 초기 기획 및 테마성 프리셋 데이터 정의
// ==========================================
/* eslint-disable-next-line no-unused-vars */
const MOCK_FEED_DATA = [
  {
    id: 1,
    text: "여호수아가 또 백성에게 이르되 너희는 자신을 성결하게 하라 여호와께서 내일 너희 가운데에 기이한 일들을 행하시리라 (여호수아 3:5)",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1080&auto=format&fit=crop", 
    audio: "", 
    author: "Grace_Lee",
    likes: 1205,
    userThought: "다가올 한 주의 새 출발을 앞두고 두려운 마음이 앞섭니다. 세상에 물들지 않고 나를 온전히 성결하게 구별하여 주님이 역사하시는 것을 보게 하옵소서.",
    meditation: "우리가 준비해야 할 유일한 전제 조건은 스스로를 정결히 구별하는 것입니다. 상황이나 환경을 주도적으로 바꾸려 애쓰기보다, 주님을 향해 우리의 마음판을 성결하게 지켜낼 때 성경에 새겨진 놀라운 이적들이 우리의 일상 속에 실체화될 것입니다."
  },
  {
    id: 2,
    text: "태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라 (요한복음 1:1)",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1080&auto=format&fit=crop", 
    author: "David_99",
    likes: 342,
    userThought: "매일 넘쳐나는 가짜 뉴스와 자극적인 콘텐츠들 속에 귀를 닫고, 오로지 태초부터 살아 역동해 온 진짜 주님의 말씀만을 심장에 채우게 도와주소서.",
    meditation: "우주 만물의 탄생보다 먼저 존재했던 절대 진리는 곧 하나님의 생명의 말씀입니다. 매일 아침 안개처럼 스러질 인간의 위로에 기대는 대신, 영원히 쇠하지 않는 신성의 주춧돌 위에 인생을 굳게 고정하십시오."
  },
  {
    id: 3,
    text: "마음의 즐거움은 양약이라도 심령의 근심은 뼈를 마르게 하느니라 (잠언 17:22)",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1080&auto=format&fit=crop", 
    author: "Joyful_Soul",
    likes: 89,
    userThought: "원치 않는 질병의 위기와 막막함 속에서 매순간 기도의 에너지가 꺾이고 낙담이 몰려오지만, 그럼에도 불구하고 하늘 기쁨을 길어 올리게 하소서.",
    meditation: "근심은 우리의 몸과 영혼을 안으로부터 좀먹는 파괴적인 독소입니다. 그리스도 안에서 허락된 평안과 약속의 기쁨을 믿음으로 선포하고 받아들이는 순간, 상상치 못했던 회복과 새로운 성령의 역사가 영혼과 육체를 동시에 치유하기 시작할 것입니다."
  }
];

const USER_PROFILES_META = {
  "Grace_Lee": { name: "Grace Lee", desc: "빛의 자녀로 순종하며 걷는 이", verseCount: 1, stars: "1.2k" },
  "David_99": { name: "David Kim", desc: "주의 진리를 묵묵히 탐구하는 청년", verseCount: 1, stars: "342" },
  "Joyful_Soul": { name: "Joyful Soul", desc: "고난 중에도 항상 기뻐하는 자", verseCount: 1, stars: "89" },
  "은혜나눔인": { name: "나의 성서서재", desc: "매일 하늘 양식을 모으는 성소", verseCount: 0, stars: "0" }
};

const FLASHBACK_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400&auto=format&fit=crop"
];

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
  sky: [
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=1080&auto=format&fit=crop"
  ],
  desert: [
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1080&auto=format&fit=crop"
  ]
};

// ==========================================
// 3. 유틸리티 함수 모음
// ==========================================
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes.buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) { view.setUint8(offset + i, string.charCodeAt(i)); }
}

function pcmToWav(pcmData, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  writeString(view, 0, 'RIFF'); view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE'); writeString(view, 12, 'fmt '); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true); view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data'); view.setUint32(40, dataSize, true);
  
  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) { view.setInt16(offset, pcmData[i], true); }
  return new Blob([buffer], { type: 'audio/wav' });
}

function copyTextFallback(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed"; 
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch {
    document.body.removeChild(textArea);
    return false;
  }
}

// ==========================================
// 4. API 통신 모듈 (🚨 에러 원인 제거: 타임아웃 방어 및 완벽 파싱)
// ==========================================
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

async function fetchWithExponentialBackoff(url, options, maxRetries = 5) {
  if (!apiKey) {
    throw new Error("Fatal API Error: API key is missing. Please set VITE_GEMINI_API_KEY in your .env.local file.");
  }
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < maxRetries; i++) {
    try {
      // ⭐️ 무한 버퍼링 차단: 20초 안에 응답이 안 오면 연결을 끊어버립니다(Abort).
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) return response;
      
      // 400번대 에러(파라미터 오류 등)는 재시도해도 실패하므로 Fast Fail
      if (response.status !== 429 && response.status < 500) {
        throw new Error(`Fatal API Error: ${response.status}`);
      }
      if (i === maxRetries - 1) throw new Error(`API Error: ${response.status}`);
    } catch (err) {
      if (err.message.includes('Fatal API Error')) {
        throw err; // 즉각 에러 밖으로 던짐
      }
      if (i === maxRetries - 1) throw err;
    }
    await new Promise(res => setTimeout(res, delays[i]));
  }
}

async function fetchBibleTextFromAI(reference) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'search', reference })
  });
  if (!response.ok) throw new Error("성경 구절 탐색 오류");
  const result = await response.json();
  return result.text || "성경 말씀을 가져오지 못했습니다.";
}

async function analyzeVerseForVisuals(verse) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', verseText: verse })
    });
    if (!response.ok) throw new Error("시각 테마 분석 오류");
    const result = await response.json();
    return {
      visualTheme: result.visualTheme || 'light',
      textConcept: result.textConcept || 'GRACE'
    };
  } catch {
    return { visualTheme: "light", textConcept: "GRACE" };
  }
}

async function generateMeditation(verse, userThought = "") {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'meditate', verseText: verse, userThought })
    });
    if (!response.ok) throw new Error("묵상 생성 오류");
    const result = await response.json();
    return result.text || "은혜 가득한 묵상이 온전하게 수렴되었습니다.";
  } catch {
    return "은혜 가득한 묵상이 온전하게 수렴되었습니다.";
  }
}

function generateVerseImage(visualTheme) {
  const theme = (visualTheme || 'light').toLowerCase().trim();
  const imagesForTheme = CURATED_HOLY_IMAGES[theme] || CURATED_HOLY_IMAGES.light;
  return imagesForTheme[Math.floor(Math.random() * imagesForTheme.length)];
}

async function generateVerseAudio(verse) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'tts', text: verse })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI TTS API Error: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  return `data:audio/mp3;base64,${base64}`;
}

// ==========================================
// 5. 로딩 주마등(Flashback) 컴포넌트
// ==========================================
const LoadingFlashback = ({ loadingStep }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FLASHBACK_IMAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-50 p-6">
      <div className="relative w-48 h-64 rounded-[24px] overflow-hidden shadow-[0_0_50px_rgba(223,186,115,0.18)] mb-10 border border-[#DFBA73]/30 bg-gradient-to-tr from-[#1a1510] to-[#050505]">
        {/* ⭐️ [이미지 깨짐 버그 완전 복구] opacity 강제 초기화 코드를 지우고 안정적인 원본 렌더링 유지 */}
        {FLASHBACK_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${i === activeIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40 pointer-events-none" />
      </div>

      <div className="flex flex-col items-center gap-3 bg-black/60 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md max-w-[90%] text-center">
        <div className="w-5 h-5 border-[2px] border-[#DFBA73]/40 border-t-[#DFBA73] rounded-full animate-spin"></div>
        <p className="text-[#DFBA73] font-myeongjo text-[13px] tracking-wider font-bold animate-pulse">{loadingStep}</p>
      </div>
    </div>
  );
};

// 상대 시간 포맷팅 헬퍼 함수
const formatCommentTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString();
};

// ==========================================
// 6. 개별 피드 카드 컴포넌트 (Canvas 순정 캡처공유 탑재)
// ==========================================
const FeedCard = ({ 
      card, 
      isPreview = false, 
      onShowToast, 
      onToggleSave, 
      isSaved, 
      onNavigateProfile, 
      likedCardsState, 
      onToggleLikeGlobal,
      user,
      nickname,
      onCommentCountChange,
      onDeleteCard,
      userProfiles
    }) => {
const [isPlaying, setIsPlaying] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isThoughtOpen, setIsThoughtOpen] = useState(false);
  const [meditationText, setMeditationText] = useState(card.meditation || "");
  const [isLoadingMeditation, setIsLoadingMeditation] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
const audioRef = useRef(null);
    const cardRef = useRef(null);
    const playCount = useRef(0);
  
    const isLiked = likedCardsState[card.id] || false;
    const likesCount = card.likes;
  
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentsCount, setCommentsCount] = useState(card.commentCount || 0);
    const [prevCommentCount, setPrevCommentCount] = useState(card.commentCount || 0);
    if (card.commentCount !== prevCommentCount) {
      setCommentsCount(card.commentCount || 0);
      setPrevCommentCount(card.commentCount || 0);
    }
    const [replyingTo, setReplyingTo] = useState(null);
    const commentInputRef = useRef(null);
    const [longPressedCommentId, setLongPressedCommentId] = useState(null);
    const longPressTimerRef = useRef(null);

    useEffect(() => {
      if (replyingTo && commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, [replyingTo]);

const handleLike = (e) => {
    e.stopPropagation();
    onToggleLikeGlobal(card.id);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    const copyString = `[말씀의 빛]\n\n${card.text}\n\n* 오늘의 묵상 해설:\n${meditationText || "묵상 가이드를 생성 중입니다."}\n\n${card.userThought ? `* 나의 고백:\n"${card.userThought}"` : ""}`;
    const success = copyTextFallback(copyString);
    if (success) {
      onShowToast("성구와 고백, 묵상이 클립보드에 안전하게 복사되었습니다.", "success");
    } else {
      onShowToast("텍스트 복사에 일시적 오류가 생겼습니다.", "error");
    }
  };

  const handleDeviceShare = async (e) => {
    e.stopPropagation();
    onShowToast("공유 카드를 준비하는 중입니다...", "info");

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.src = card.image;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => {
          ctx.fillStyle = '#0a0806';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          resolve();
        };
      });

      if (img.complete && img.naturalWidth > 0) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (imgAspect > canvasAspect) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
        } else {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      const gradTop = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
      gradTop.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
      gradTop.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradBottom = ctx.createLinearGradient(0, canvas.height * 0.45, 0, canvas.height);
      gradBottom.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      gradBottom.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = gradBottom;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(223, 186, 115, 0.25)';
      ctx.lineWidth = 14;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      ctx.fillStyle = '#DFBA73';
      ctx.font = "bold 32px 'Nanum Myeongjo', serif, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText("LIGHT OF WORD", canvas.width / 2, 160);

      ctx.strokeStyle = 'rgba(223, 186, 115, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, 195);
      ctx.lineTo(canvas.width / 2 + 120, 195);
      ctx.stroke();

      ctx.fillStyle = '#FFFDF9';
      ctx.font = "bold 44px 'Nanum Myeongjo', serif, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      const fullText = card.text;
      const chars = fullText.split('');
      let lines = [];
      let currentLine = '';
      const maxLineWidth = canvas.width - 240; 

      for (let i = 0; i < chars.length; i++) {
        let testLine = currentLine + chars[i];
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth && i > 0) {
          lines.push(currentLine);
          currentLine = chars[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const lineHeight = 80;
      const startY = (canvas.height / 2) - ((lines.length - 1) * lineHeight / 2) + 40;

      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + (index * lineHeight));
      });

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = "28px sans-serif";
      ctx.fillText("말씀의 빛 | 매일 성서 묵상 하우스", canvas.width / 2, canvas.height - 150);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Blob creation failed");
        }
        const file = new File([blob], 'light_of_word.png', { type: 'image/png' });
        const shareData = {
          title: '말씀의 빛',
          text: `[말씀의 빛]\n\n${card.text}\n\n* 오늘의 묵상 해설:\n${meditationText || "묵상 가이드를 준비 중입니다."}`,
          files: [file]
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            onShowToast("말씀 카드 이미지가 대화방으로 은혜롭게 전송되었습니다.", "success");
          } catch (err) {
            if (err.name !== 'AbortError') handleCopy(e); 
          }
        } else {
          handleCopy(e); 
        }
      }, 'image/png');

    } catch (err) {
      console.error(err);
      onShowToast("클린 공유 카드를 생성하지 못해 본문 텍스트를 전송합니다.", "info");
      handleCopy(e);
    }
  };
const handleOpenMeditation = (e) => {
      e.stopPropagation();
      setIsMeditationOpen(true);
      if (!meditationText) {
        setIsLoadingMeditation(true);
        generateMeditation(card.text, card.userThought)
          .then((text) => {
            setMeditationText(text);
            card.meditation = text; 
          })
          .catch(() => {
            setMeditationText("일시적 네트워크 지연입니다. 다시 열어주시면 은혜를 길어오겠습니다.");
          })
          .finally(() => setIsLoadingMeditation(false));
      }
    };
  
    const fetchComments = async () => {
      if (!card.id) return;
      setIsCommentsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('card_id', card.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setIsCommentsLoading(false);
      }
    };
  
    const handleOpenComments = (e) => {
      e.stopPropagation();
      setIsCommentsOpen(true);
      fetchComments();
    };
  
    const handlePostComment = async (e) => {
      e.preventDefault();
      if (!commentInput.trim() || !user || !card.id) return;
      
      const newComment = {
        card_id: card.id,
        user_id: user.id,
        author_nickname: nickname || "성도",
        comment_text: replyingTo && !commentInput.trim().startsWith(`@${replyingTo.nickname}`)
          ? `@${replyingTo.nickname} ${commentInput.trim()}`
          : commentInput.trim(),
        parent_id: replyingTo ? (replyingTo.parent_id || replyingTo.id) : null
      };
      
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert(newComment)
          .select()
          .single();
          
        if (error) throw error;
        setComments(prev => [...prev, data]);
        setCommentInput("");
        setReplyingTo(null);
        
        const nextVal = commentsCount + 1;
        setCommentsCount(nextVal);
        if (onCommentCountChange) onCommentCountChange(card.id, nextVal);
        
        onShowToast("은혜로운 댓글이 등록되었습니다.", "success");
      } catch (err) {
        console.error("Error posting comment:", err);
        onShowToast("댓글 등록에 실패했습니다. 다시 시도해 주세요.", "error");
      }
    };

    const handleDeleteComment = async (commentId) => {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId);
        
        if (error) throw error;
        
        const deletedCount = comments.filter(c => c.id === commentId || c.parent_id === commentId).length;
        setComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId));
        
        const nextVal = Math.max(0, commentsCount - deletedCount);
        setCommentsCount(nextVal);
        if (onCommentCountChange) onCommentCountChange(card.id, nextVal);
        
        onShowToast("댓글이 삭제되었습니다.", "success");
      } catch (err) {
        console.error("Error deleting comment:", err);
        onShowToast("댓글 삭제에 실패했습니다.", "error");
      }
    };
const handleAudioEnded = () => {
    setIsPlaying(false);
    playCount.current = 0; 
    onShowToast("성경 낭독이 완료되었습니다.", "info");
  };

  const speakWebSpeech = (forceUnmute = false) => {
    const activeMuted = forceUnmute ? false : isMuted;
    if (activeMuted) {
      setIsPlaying(true);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko'));
      if (koVoice) utterance.voice = koVoice;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (err) {
      console.error("Web Speech failed:", err);
      setIsPlaying(false);
    }
  };

  const playAudio = () => {
    const isLocalBlobFromDifferentSession = card.audio && card.audio.startsWith('blob:') && !card.audio.includes(window.location.host);
    const useWebSpeech = !card.audio || card.audio === 'web-speech' || isLocalBlobFromDifferentSession;
    
    if (!useWebSpeech && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play failed, falling back to Web Speech:", err);
          speakWebSpeech();
        });
    } else {
      speakWebSpeech();
    }
  };

  useEffect(() => {
    if (isPreview) {
      playCount.current = 0;
      const isLocalBlobFromDifferentSession = card.audio && card.audio.startsWith('blob:') && !card.audio.includes(window.location.host);
      const useWebSpeech = !card.audio || card.audio === 'web-speech' || isLocalBlobFromDifferentSession;

      if (!useWebSpeech && audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Preview audio play failed, falling back to Web Speech:", err);
            speakWebSpeech(true);
          });
      } else {
        speakWebSpeech(true);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playCount.current = 0;
            playAudio();
          } else {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            window.speechSynthesis.cancel();
          }
        });
      },
      { threshold: 0.6 }
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) observer.observe(currentCardRef);
    return () => {
      if (currentCardRef) observer.unobserve(currentCardRef);
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, card.audio, isMuted]);

  const togglePlay = () => {
    if (isMeditationOpen || isThoughtOpen || isCommentsOpen) {
      setIsMeditationOpen(false);
      setIsThoughtOpen(false);
      setIsCommentsOpen(false);
      return;
    }
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    
    if (nextMuted) {
      window.speechSynthesis.cancel();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current && card.audio && card.audio !== 'web-speech' && !card.audio.startsWith('blob:')) {
        audioRef.current.muted = false;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => speakWebSpeech(false));
      } else {
        speakWebSpeech(true);
      }
    }
    onShowToast(nextMuted ? "음소거 되었습니다." : "낭독 성음이 활성화되었습니다.", "info");
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (onNavigateProfile) {
      onNavigateProfile(card.author);
    }
  };

  const getResponsiveFontSize = (text) => {
    if (!text) return 'text-base';
    const len = text.length;
    if (len < 35) return 'text-[22px] sm:text-2xl leading-[1.65]';
    if (len < 70) return 'text-[18px] sm:text-xl leading-[1.7]';
    return 'text-[15px] sm:text-[17px] leading-[1.8]';
  };

  return (
    <div 
      ref={cardRef} 
      className="relative w-full h-full snap-start bg-[#030303] overflow-hidden cursor-pointer select-none" 
      onClick={togglePlay}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out" 
        style={{ backgroundImage: `url(${card.image})`, opacity: 0.52 }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

      {/* 중앙 텍스트 영역 (2단계 성경 말씀) */}
      <div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6 sm:px-10" 
        style={{ 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 8%, black 22%, black 78%, transparent 92%)', 
          maskImage: 'linear-gradient(to bottom, transparent 8%, black 22%, black 78%, transparent 92%)' 
        }}
      >
        <div 
          className="w-full flex flex-col items-center text-center py-20"
          style={{ 
            animation: 'scrollTextUpCenter 14s ease-out forwards', 
            animationPlayState: isPlaying ? 'running' : 'paused' 
          }}
        >
          <p 
            className={`text-[#FFFDF9] font-myeongjo font-bold tracking-[0.04em] whitespace-pre-wrap break-keep devotion-verse-text ${getResponsiveFontSize(card.text)}`}
            style={{ textShadow: '0px 4px 20px rgba(0,0,0,0.95), 0px 1px 3px rgba(0,0,0,0.8)' }}
          >
            {card.text}
          </p>
        </div>
      </div>

      {card.audio && (
        <audio 
          ref={audioRef} 
          src={card.audio} 
          onEnded={handleAudioEnded} 
          muted={isPreview ? false : isMuted}
        />
      )}

      {/* 본인 카드 삭제 버튼 */}
      {user && String(user.id) === String(card.author_id) && !isPreview && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDeleteCard(card.id); }}
          className="absolute top-[calc(114px+env(safe-area-inset-top))] right-4 z-30 p-2.5 rounded-full bg-red-950/50 hover:bg-red-950/80 border border-red-500/20 text-red-400 active:scale-95 transition-all"
          title="말씀 카드 삭제"
        >
          <Icons.Trash />
        </button>
      )}

      {/* 우상단 음소거 제어 */}
      {card.audio && !isPreview && (
        <button 
          onClick={toggleMute}
          className="absolute top-[calc(68px+env(safe-area-inset-top))] right-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white/80 active:scale-95 transition-all"
        >
          {isMuted ? <Icons.VolumeX /> : <Icons.Volume />}
        </button>
      )}

      {/* 피드 하단 메타 정보 및 액션 패널 */}
      {!isPreview && (
        <div className="absolute bottom-[calc(76px+env(safe-area-inset-bottom))] left-4 right-4 flex items-end justify-between z-30 pointer-events-none">
          
          {/* 좌측 콘텐츠 정보 영역 (카카오톡 스타일 디자인 적용) */}
          <div className="flex flex-col gap-3 max-w-[75%] bg-black/35 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-lg pointer-events-auto transition-all duration-300">
            {/* 프로필 바로가기 연동 영역 */}
            <div 
              onClick={handleProfileClick}
              className="flex items-center gap-3 cursor-pointer group"
              title="성서 서재 방문하기"
            >
              {/* 카카오톡 프로필 사진 연동 및 부드러운 스퀘어(Squircle) */}
              <div className="w-10 h-10 rounded-[11px] bg-[#1a1612] flex items-center justify-center text-[#DFBA73] text-[13px] font-bold border border-[#DFBA73]/25 shadow-md group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                {userProfiles && userProfiles[card.author] ? (
                  <img src={userProfiles[card.author]} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  card.author?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex flex-col min-w-0">
                {/* 닉네임만 표시 (@ 제거) */}
                <span className="text-[#FDFBF7] text-[14px] font-bold drop-shadow-md tracking-wide group-hover:text-[#DFBA73] transition-colors truncate">{card.author}</span>
                <span className="text-[9.5px] text-[#DFBA73]/80 tracking-tighter mt-0.5 font-medium">서재 방문하기 &rarr;</span>
              </div>
            </div>

            {/* 3단계 개인 고백 */}
            {card.userThought && (
              <div 
                onClick={(e) => { e.stopPropagation(); setIsThoughtOpen(true); }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 animate-fade-in-up"
              >
                <span className="text-[#DFBA73]"><Icons.Feather /></span>
                <span className="text-[11.5px] text-stone-200 font-medium tracking-wide">오늘의 고백 읽기 &bull;&bull;&bull;</span>
              </div>
            )}
          </div>

          {/* 사이드 액션 패널 */}
          <div className="flex flex-col items-center gap-4.5 pointer-events-auto">
            
            <button 
              onClick={handleOpenMeditation}
              className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                <Icons.Sparkles />
              </div>
              <span className="text-[10px] text-white/80 font-medium tracking-tight">AI 묵상</span>
            </button>
            <button 
                onClick={handleLike} 
                className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                  <Icons.Heart filled={isLiked} />
                </div>
                <span className="text-[10px] text-white/80 font-medium tracking-tight">{likesCount}</span>
              </button>
  
              <button 
                onClick={handleOpenComments}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                  <Icons.MessageCircle />
                </div>
                <span className="text-[10px] text-white/80 font-medium tracking-tight">{commentsCount}</span>
              </button>
  
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(card); }}
className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                <Icons.Bookmark filled={isSaved} />
              </div>
              <span className="text-[10px] text-white/80 font-medium tracking-tight">보관</span>
            </button>

            <button 
              onClick={handleDeviceShare}
              className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                <Icons.Share />
              </div>
              <span className="text-[10px] text-white/80 font-medium tracking-tight">공유</span>
            </button>
            
            <div className="relative mt-2 w-[42px] h-[42px]">
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border border-[#DFBA73]/60 animate-ping opacity-75" />
              )}
              <div className={`w-full h-full rounded-full border-2 border-[#DFBA73]/40 bg-[#121212] overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(223,186,115,0.3)] ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}>
                <img src={card.image} alt="album" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 오늘의 고백 팝업 */}
      <div 
        className={`absolute bottom-[calc(76px+env(safe-area-inset-bottom))] left-0 right-0 bg-[#120f0c]/98 backdrop-blur-3xl border-t border-[#DFBA73]/30 rounded-t-[32px] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-50 p-7 pb-8 flex flex-col gap-4 shadow-[0_-15px_50px_rgba(0,0,0,0.9)] ${isThoughtOpen ? 'translate-y-0 opacity-100' : 'translate-y-[130%] opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsThoughtOpen(false)} 
          className="absolute top-5 right-5 text-[#DFBA73]/60 hover:text-white transition-colors p-1"
        >
          <Icons.Close />
        </button>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 bg-[#DFBA73]/10 rounded-full text-[#DFBA73] border border-[#DFBA73]/20">
            <Icons.Feather />
          </div>
          <div>
            <h3 className="text-[#DFBA73] font-myeongjo font-bold text-lg tracking-wide">성도의 깊은 고백</h3>
            <p className="text-white/40 text-[10px] tracking-tight">주님 앞에 마음 모아 적은 깊은 심령의 실상입니다.</p>
          </div>
        </div>
        
        <div className="text-[#F4EFE6] text-[14px] leading-[1.8] font-myeongjo whitespace-pre-wrap max-h-[30vh] overflow-y-auto hide-scrollbar border-b border-white/5 pb-4">
          <p className="opacity-90 tracking-wide leading-relaxed pl-1 devotion-thought-text">
            "{card.userThought}"
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <button 
            onClick={() => setIsThoughtOpen(false)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-semibold text-[12px] transition-colors active:scale-95"
          >
            마음에 새기기
          </button>
        </div>
      </div>

      {/* AI 묵상 바텀 시트 */}
      <div 
        className={`absolute bottom-[calc(76px+env(safe-area-inset-bottom))] left-0 right-0 bg-[#0c0a08]/98 backdrop-blur-2xl border-t border-[#DFBA73]/30 rounded-t-[32px] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-50 p-7 pb-8 flex flex-col gap-4 shadow-[0_-15px_50px_rgba(0,0,0,0.85)] ${isMeditationOpen ? 'translate-y-0 opacity-100' : 'translate-y-[130%] opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsMeditationOpen(false)} 
          className="absolute top-5 right-5 text-[#DFBA73]/60 hover:text-white transition-colors p-1"
        >
          <Icons.Close />
        </button>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 bg-[#DFBA73]/10 rounded-full text-[#DFBA73] border border-[#DFBA73]/20">
            <Icons.Sparkles />
          </div>
          <div>
            <h3 className="text-[#DFBA73] font-myeongjo font-bold text-lg tracking-wide">AI 하늘빛 깊은 묵상</h3>
            <p className="text-white/40 text-[10px] tracking-tight">성경과 성도의 마음을 주님이 조화롭게 빚어내신 묵상입니다.</p>
          </div>
        </div>
        
        <div className="text-[#F4EFE6] text-[13.5px] leading-[1.8] font-myeongjo whitespace-pre-wrap max-h-[30vh] overflow-y-auto hide-scrollbar pr-1 border-b border-white/5 pb-4">
          {isLoadingMeditation ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-6 h-6 border-[2px] border-[#DFBA73]/20 border-t-[#DFBA73] rounded-full animate-spin"></div>
              <span className="text-white/50 text-[11px] animate-pulse font-sans tracking-wider">하늘빛 고백을 묵상으로 영글어가고 있습니다...</span>
            </div>
          ) : (
            <p className="opacity-90 tracking-wide font-normal devotion-meditation-text">{meditationText}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="flex-1 py-3.5 rounded-xl bg-[#DFBA73]/10 hover:bg-[#DFBA73]/20 border border-[#DFBA73]/30 text-[#DFBA73] text-[12px] font-medium transition-colors active:scale-95"
            >
              텍스트 복사
            </button>
            <button 
              onClick={handleDeviceShare}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[12px] flex items-center justify-center gap-1.5 shadow-[0_5px_15px_rgba(223,186,115,0.2)] active:scale-95 transition-transform"
            >
              <Icons.Share /> 기기로 공유하기
            </button>
          </div>
          <button 
            onClick={() => setIsMeditationOpen(false)}
            className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-[12px] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
      {/* 댓글 바텀 시트 */}
        <div 
          className={`absolute bottom-[calc(76px+env(safe-area-inset-bottom))] left-0 right-0 bg-[#0c0a08]/98 backdrop-blur-2xl border-t border-[#DFBA73]/30 rounded-t-[32px] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-50 p-6 pb-8 flex flex-col gap-4 shadow-[0_-15px_50px_rgba(0,0,0,0.85)] ${isCommentsOpen ? 'translate-y-0 opacity-100' : 'translate-y-[130%] opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { setIsCommentsOpen(false); setReplyingTo(null); }} 
            className="absolute top-5 right-5 text-[#DFBA73]/60 hover:text-white transition-colors p-1"
          >
            <Icons.Close />
          </button>
          
          <div className="flex flex-col items-center mb-2">
            <h3 className="text-[#DFBA73] font-myeongjo font-bold text-lg tracking-wide">은혜의 댓글 나눔</h3>
            <p className="text-white/40 text-[10px] tracking-tight mt-0.5">이 구절을 읽고 함께 나눈 신앙의 고백들입니다.</p>
          </div>
          
          <div className="text-[#F4EFE6] text-[13.5px] leading-[1.8] font-sans max-h-[36vh] overflow-y-auto hide-scrollbar pr-1 border-b border-white/5 pb-4 flex flex-col gap-4">
            {isCommentsLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-6 h-6 border-[2px] border-[#DFBA73]/20 border-t-[#DFBA73] rounded-full animate-spin"></div>
                <span className="text-white/50 text-[11px] animate-pulse">댓글을 불러오고 있습니다...</span>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-white/30 py-8 text-xs font-myeongjo">첫 번째로 은혜의 메시지나 짧은 기도를 남겨보세요.</p>
            ) : (() => {
              const parentComments = comments.filter(c => !c.parent_id);
              const repliesMap = comments.reduce((acc, c) => {
                if (c.parent_id) {
                  if (!acc[c.parent_id]) acc[c.parent_id] = [];
                  acc[c.parent_id].push(c);
                }
                return acc;
              }, {});

              return parentComments.map(parent => (
                <div key={parent.id} className="flex flex-col gap-2.5">
                  {/* 부모 댓글 */}
                  <div 
                    className="relative flex flex-col py-2 px-1"
                    onTouchStart={() => {
                      if (user && String(user.id) === String(parent.user_id)) {
                        longPressTimerRef.current = setTimeout(() => setLongPressedCommentId(parent.id), 400);
                      }
                    }}
                    onTouchEnd={() => clearTimeout(longPressTimerRef.current)}
                    onTouchCancel={() => clearTimeout(longPressTimerRef.current)}
                    onMouseDown={() => {
                      if (user && String(user.id) === String(parent.user_id)) {
                        longPressTimerRef.current = setTimeout(() => setLongPressedCommentId(parent.id), 400);
                      }
                    }}
                    onMouseUp={() => clearTimeout(longPressTimerRef.current)}
                    onMouseLeave={() => clearTimeout(longPressTimerRef.current)}
                  >
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-[#DFBA73] text-[12px] font-bold">{parent.author_nickname}</span>
                      <span className="text-[9.5px] text-white/35">{formatCommentTime(parent.created_at)}</span>
                    </div>
                    <p className="text-stone-200 text-[12.5px] tracking-wide leading-relaxed mt-0.5 break-all devotion-comment-text">
                      {parent.comment_text}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <button 
                        onClick={() => setReplyingTo({ id: parent.id, nickname: parent.author_nickname, parent_id: parent.id })}
                        className="text-[10px] text-white/40 hover:text-[#DFBA73] transition-colors font-semibold"
                      >
                        답글 달기
                      </button>
                    </div>
                    {/* 꽉 누르면 나타나는 삭제 버튼 */}
                    {longPressedCommentId === parent.id && (
                      <div className="absolute top-0 right-0 animate-fade-in z-10">
                        <button 
                          onClick={() => { handleDeleteComment(parent.id); setLongPressedCommentId(null); }}
                          className="bg-red-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg active:scale-95 transition-transform"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 대댓글 목록 (인덴트 처리) */}
                  {repliesMap[parent.id] && repliesMap[parent.id].map(reply => (
                    <div 
                      key={reply.id} 
                      className="relative flex flex-col py-1.5 pl-7 ml-4 border-l border-[#DFBA73]/15"
                      onTouchStart={() => {
                        if (user && String(user.id) === String(reply.user_id)) {
                          longPressTimerRef.current = setTimeout(() => setLongPressedCommentId(reply.id), 400);
                        }
                      }}
                      onTouchEnd={() => clearTimeout(longPressTimerRef.current)}
                      onTouchCancel={() => clearTimeout(longPressTimerRef.current)}
                      onMouseDown={() => {
                        if (user && String(user.id) === String(reply.user_id)) {
                          longPressTimerRef.current = setTimeout(() => setLongPressedCommentId(reply.id), 400);
                        }
                      }}
                      onMouseUp={() => clearTimeout(longPressTimerRef.current)}
                      onMouseLeave={() => clearTimeout(longPressTimerRef.current)}
                    >
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[#DFBA73]/90 text-[11px] font-bold">{reply.author_nickname}</span>
                        <span className="text-[9px] text-white/35">{formatCommentTime(reply.created_at)}</span>
                      </div>
                      <p className="text-stone-300 text-[12px] tracking-wide leading-relaxed mt-0.5 break-all devotion-comment-text">
                        {reply.comment_text}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <button 
                          onClick={() => setReplyingTo({ id: reply.id, nickname: reply.author_nickname, parent_id: parent.id })}
                          className="text-[9.5px] text-white/40 hover:text-[#DFBA73] transition-colors font-semibold"
                        >
                          답글 달기
                        </button>
                      </div>
                      {longPressedCommentId === reply.id && (
                        <div className="absolute top-0 right-0 animate-fade-in z-10">
                          <button 
                            onClick={() => { handleDeleteComment(reply.id); setLongPressedCommentId(null); }}
                            className="bg-red-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg active:scale-95 transition-transform"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
  
          {/* 댓글 입력 영역 */}
          {user ? (
            <div className="flex flex-col w-full mt-1">
              {replyingTo && (
                <div className="flex justify-between items-center bg-[#DFBA73]/10 px-3 py-1.5 rounded-xl border border-[#DFBA73]/20 text-[11px] mb-2 animate-fade-in">
                  <span className="text-[#DFBA73] font-medium text-[11px]">
                    @{replyingTo.nickname}님에게 답글 남기는 중
                  </span>
                  <button 
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-[#DFBA73]/60 hover:text-white transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              )}
              <form onSubmit={handlePostComment} className="flex gap-2 w-full">
                <input 
                  ref={commentInputRef}
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={replyingTo ? `@${replyingTo.nickname}님에게 답글 남기기...` : "아멘, 혹은 은혜의 답글을 남겨주세요"}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#DFBA73]/80 font-sans text-stone-100 placeholder:text-stone-600 text-[16px] md:text-xs transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[11px] px-5 rounded-xl transition-transform active:scale-95 disabled:opacity-40"
                >
                  등록
                </button>
              </form>
            </div>
          ) : (
            <p className="text-center text-[11px] text-white/30 py-2">댓글을 남기려면 먼저 로그인해 주세요.</p>
          )}
        </div>
  
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
<div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md text-white/90 border border-white/20 shadow-2xl scale-95 animate-pulse">
            <div className="ml-1"><Icons.Play /></div>
          </div>
        </div>
      )}
    </div>
  );
};
// ==========================================
// 6.5. 프리미엄 로그인 및 온보딩 뷰
// ==========================================
const LoginView = ({ onKakaoLogin, onGuestLogin }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-[#030202] text-[#F9F7F1] p-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[280px] h-[280px] bg-[#DFBA73] opacity-10 rounded-full blur-[80px]" />
        <div className="absolute top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[#DFBA73]/30 to-transparent" />
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#DFBA73]/15 to-transparent" style={{ top: '40%' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#DFBA73]/60 mb-6" />
        <h2 className="text-[12.5px] font-myeongjo font-extrabold tracking-[0.4em] text-[#DFBA73]">
          LIGHT OF WORD
        </h2>
        <span className="text-[8px] text-white/30 tracking-[0.3em] uppercase mt-2">
          Visual Devotional Sanctuary
        </span>
      </div>

      <div className="relative z-10 text-center my-auto flex flex-col items-center">
        <h1 className="text-3xl font-myeongjo font-bold text-stone-100 tracking-wide leading-snug break-keep">
          매일, 당신만을 위한<br/>
          하늘빛 성경 묵상 공간
        </h1>
        <p className="text-stone-400 text-xs font-sans mt-4 max-w-[80%] leading-relaxed break-keep">
          성경 말씀의 기품 있는 해석과 성화, 성스러운 소리가 깃드는 바이블그램에 오신 것을 환영합니다.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-4 pb-12 w-full">
        <button 
          onClick={onKakaoLogin}
          className="w-full py-4 rounded-xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-bold text-[14.5px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(254,229,0,0.15)]"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.868-.12.431.147.426.314.314.13-.087 2.075-1.409 2.907-1.984C10.372 16.27 11.173 16.3 12 16.3c4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
          </svg>
          카카오 로그인
        </button>
        {/* 게스트 로그인 폐지 완료 */}
      </div>
    </div>
  );
};

const OnboardingView = ({ user, onCompleteOnboarding, onCancel }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const validateNickname = (val) => {
    if (!val) {
      return '닉네임을 입력해 주세요.';
    }
    if (val.length < 2 || val.length > 10) {
      return '닉네임은 2자 이상 10자 이하여야 합니다.';
    }
    const regex = /^[a-zA-Z0-9가-힣]+$/;
    if (!regex.test(val)) {
      return '한글, 영문, 숫자만 사용 가능하며 공백이나 특수문자는 사용할 수 없습니다.';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    if (val) {
      setErrorMsg(validateNickname(val));
    } else {
      setErrorMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateNickname(inputVal);
    if (err) {
      setErrorMsg(err);
      return;
    }
    onCompleteOnboarding(inputVal.trim());
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-[#030202] text-[#F9F7F1] p-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[240px] h-[240px] bg-[#DFBA73] opacity-5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-16">
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#DFBA73]/50 mb-5" />
        <h2 className="text-[11px] font-sans font-bold tracking-[0.3em] text-[#DFBA73]/70 uppercase">
          Profile Setup
        </h2>
        <h1 className="text-xl font-myeongjo font-bold text-stone-100 tracking-wide mt-2">
          닉네임 설정
        </h1>
        <p className="text-white/40 text-[10.5px] mt-1.5 font-sans tracking-wide">
          성경 묵상 서재에서 사용할 필명을 정해 주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col items-center my-auto w-full gap-8">
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#DFBA73] to-[#A37B3F] opacity-30 blur-sm animate-pulse" />
          
          <div className="relative w-20 h-20 rounded-full bg-[#12100e] border border-[#DFBA73]/40 flex items-center justify-center overflow-hidden shadow-lg">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[#DFBA73]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-[11px] text-[#DFBA73]/80 font-bold tracking-wider pl-1 block">
            닉네임 (2자 ~ 10자)
          </label>
          <input 
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder="은혜로운 닉네임을 적어주세요"
            className="w-full bg-[#12100e] border border-white/10 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#DFBA73]/80 font-sans text-stone-100 placeholder:text-stone-600 text-[16px] md:text-[14px] transition-colors shadow-inner text-center"
            autoFocus
          />
          {errorMsg ? (
            <p className="text-[#ef4444] text-[11px] mt-1 text-center font-sans tracking-wide leading-relaxed">
              {errorMsg}
            </p>
          ) : (
            <p className="text-white/20 text-[10px] mt-1 text-center font-sans tracking-wide">
              한글, 영문, 숫자 조합만 사용 가능합니다.
            </p>
          )}
        </div>
      </form>

      <div className="relative z-10 w-full pb-12 flex flex-col gap-3">
        <button 
          onClick={handleSubmit}
          disabled={!!errorMsg || !inputVal}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[14px] tracking-widest disabled:opacity-20 shadow-lg active:scale-[0.98] hover:scale-[1.01] transition-all uppercase"
        >
          입당하기
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="w-full py-3.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 text-stone-400 font-medium text-[12.5px] tracking-wide active:scale-[0.98] transition-all"
        >
          로그인 취소 (처음 화면으로)
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 7. 메인 애플리케이션 컴포넌트
// ==========================================
export default function App() {
const [user, setUser] = useState(() => {
      const saved = localStorage.getItem('biblegram_user');
      try {
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    });
    const [nickname, setNickname] = useState(() => {
      const savedUser = localStorage.getItem('biblegram_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.id) {
            return localStorage.getItem(`biblegram_nickname_${parsed.id}`) || '';
          }
        } catch {
          // ignore
        }
      }
      return localStorage.getItem('biblegram_nickname') || '';
    });
    const [isAuthLoading, setIsAuthLoading] = useState(false);
  
    const [view, setView] = useState('feed'); 
    const [feedCards, setFeedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    
    const [activeProfileUser, setActiveProfileUser] = useState(() => localStorage.getItem('biblegram_nickname') || "은혜나눔인");
    const [savedCards, setSavedCards] = useState([]);
    const [likedCardsState, setLikedCardsState] = useState({});
    const [userProfiles, setUserProfiles] = useState({});
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLargeFont, setIsLargeFont] = useState(() => localStorage.getItem('biblegram_large_font') === 'true');
    const [profileTab, setProfileTab] = useState('created');
    const [otherUserLikedCards, setOtherUserLikedCards] = useState([]);
    const [isFetchingOtherLikes, setIsFetchingOtherLikes] = useState(false);
const [verseRefInput, setVerseRefInput] = useState('');
  const [verseText, setVerseText] = useState('');
  
  const [includeThought, setIncludeThought] = useState(false);
  const [userThought, setUserThought] = useState(''); 
  
  const [isSearching, setIsSearching] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  const [currentResult, setCurrentResult] = useState({ image: null, audio: null, text: '', meditation: '', userThought: '' });

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  };
  const fetchUserProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('nickname, profile_image');
      if (!error && data) {
        const profileMap = {};
        data.forEach(u => {
          if (u.nickname) {
            profileMap[u.nickname] = u.profile_image || '';
          }
        });
        setUserProfiles(profileMap);
      }
    } catch (err) {
      console.error("Error fetching user profiles:", err);
    }
  };

  const fetchFeed = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          id,
          verse_text,
          image_url,
          audio_url,
          meditation,
          user_thought,
          author_nickname,
          author_id,
          likes_count,
          created_at,
          comments (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mapped = (data || []).map(item => ({
        id: item.id,
        text: item.verse_text,
        image: item.image_url,
        audio: item.audio_url || 'web-speech',
        meditation: item.meditation,
        userThought: item.user_thought,
        author: item.author_nickname,
        author_id: item.author_id,
        likes: item.likes_count,
        commentCount: item.comments ? item.comments.length : 0,
        created_at: item.created_at
      }));
      
      // 지능형 은혜 로테이션 알고리즘 적용 (100명 이용 시 쇼츠식 다양성 확보)
      const sorted = mapped.sort((a, b) => {
        // 1순위: 로그인 유저 본인이 작성한 카드는 최상단에 고정 피드백 제공
        const aMine = user && String(a.author_id) === String(user.id) ? 1 : 0;
        const bMine = user && String(b.author_id) === String(user.id) ? 1 : 0;
        if (aMine !== bMine) return bMine - aMine;

        // 2순위: 쇼츠 스타일 지능형 발견 점수 (공감 가중치 + 시간 감쇄 점수 + 무작위 셔플 보너스)
        const aDays = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
        const bDays = (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24);
        
        const aRecency = Math.max(0, 30 / (aDays + 0.5));
        const bRecency = Math.max(0, 30 / (bDays + 0.5));
        
        const aScore = (a.likes || 0) * 10 + aRecency + Math.random() * 15;
        const bScore = (b.likes || 0) * 10 + bRecency + Math.random() * 15;
        return bScore - aScore;
      });
      
      setFeedCards(sorted);
    } catch (err) {
      console.error("Error fetching feed:", err);
      showToast("피드 데이터를 불러오는 데 실패했습니다.", "error");
    }
  };

  const fetchBookmarks = async (targetUser) => {
    const checkUser = targetUser || user;
    if (!checkUser || !checkUser.id) return;
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          card_id,
          cards (
            id,
            verse_text,
            image_url,
            audio_url,
            meditation,
            user_thought,
            author_nickname,
            author_id,
            likes_count,
            comments (id)
          )
        `)
        .eq('user_id', checkUser.id);
      
      if (error) throw error;
      
      const mapped = (data || [])
        .filter(item => item.cards)
        .map(item => ({
          id: item.cards.id,
          text: item.cards.verse_text,
          image: item.cards.image_url,
          audio: item.cards.audio_url || 'web-speech',
          meditation: item.cards.meditation,
          userThought: item.cards.user_thought,
          author: item.cards.author_nickname,
          author_id: item.cards.author_id,
          likes: item.cards.likes_count,
          commentCount: item.cards.comments ? item.cards.comments.length : 0
        }));
      
      setSavedCards(mapped);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  const fetchLikedStates = async (targetUser) => {
    const checkUser = targetUser || user;
    if (!checkUser || !checkUser.id) return;
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('card_id')
        .eq('user_id', checkUser.id);
      
      if (error) throw error;
      
      const likedState = {};
      if (data) {
        data.forEach(item => {
          likedState[item.card_id] = true;
        });
      }
      setLikedCardsState(likedState);
    } catch (err) {
      console.error("Error fetching liked states:", err);
    }
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      await fetchUserProfiles();
      await fetchFeed();
      if (!active) return;
      if (user && user.id) {
        await fetchBookmarks();
        await fetchLikedStates();
      }
    };
    loadData();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const authenticateKakao = async () => {
        setIsAuthLoading(true);
        try {
          const response = await fetch('/api/kakao-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code,
              redirectUri: window.location.origin + '/'
            })
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `로그인 에러: ${response.status}`);
          }

          const userData = await response.json();
          localStorage.setItem('biblegram_user', JSON.stringify(userData));
          setUser(userData);
          
          const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('nickname')
            .eq('id', userData.id)
            .single();

          if (!dbError && dbUser && dbUser.nickname) {
            localStorage.setItem(`biblegram_nickname_${userData.id}`, dbUser.nickname);
            localStorage.setItem('biblegram_nickname', dbUser.nickname);
            setNickname(dbUser.nickname);
            setActiveProfileUser(dbUser.nickname);
            showToast(`카카오 로그인 성공!`, 'success');
            fetchBookmarks(userData);
            fetchLikedStates(userData);
          } else {
            const savedNickname = localStorage.getItem(`biblegram_nickname_${userData.id}`);
            if (savedNickname) {
              setNickname(savedNickname);
              setActiveProfileUser(savedNickname);
              await supabase.from('users').upsert({
                id: userData.id,
                nickname: savedNickname,
                profile_image: userData.profileImage || ''
              });
              showToast(`카카오 로그인 성공!`, 'success');
              fetchBookmarks(userData);
              fetchLikedStates(userData);
            } else {
              setNickname('');
            }
          }
        } catch (err) {
          console.error(err);
          showToast(err.message || '카카오 로그인 처리에 실패했습니다.', 'error');
        } finally {
          setIsAuthLoading(false);
        }
      };
      
      authenticateKakao();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKakaoLogin = () => {
    const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
    if (!apiKey) {
      showToast("카카오 REST API Key가 설정되지 않았습니다. 게스트 로그인을 이용해주세요.", "error");
      return;
    }
    const redirectUri = window.location.origin + '/';
    const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${apiKey.trim()}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  const handleGuestLogin = async () => {
    const guestUser = {
      id: 'guest_local',
      nickname: '게스트',
      profileImage: ''
    };
    localStorage.setItem('biblegram_user', JSON.stringify(guestUser));
    setUser(guestUser);
    
    try {
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', guestUser.id)
        .single();

      if (!dbError && dbUser && dbUser.nickname) {
        localStorage.setItem(`biblegram_nickname_${guestUser.id}`, dbUser.nickname);
        localStorage.setItem('biblegram_nickname', dbUser.nickname);
        setNickname(dbUser.nickname);
        setActiveProfileUser(dbUser.nickname);
        fetchBookmarks(guestUser);
        fetchLikedStates(guestUser);
      } else {
        const savedNickname = localStorage.getItem(`biblegram_nickname_${guestUser.id}`);
        if (savedNickname) {
          setNickname(savedNickname);
          setActiveProfileUser(savedNickname);
          await supabase.from('users').upsert({
            id: guestUser.id,
            nickname: savedNickname,
            profile_image: ''
          });
          fetchBookmarks(guestUser);
          fetchLikedStates(guestUser);
        } else {
          setNickname('');
        }
      }
    } catch {
      setNickname('');
    }
    showToast("게스트 모드로 로그인되었습니다.", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem('biblegram_user');
    setUser(null);
    setNickname('');
    setSavedCards([]);
    setLikedCardsState({});
    setView('feed');
    showToast("로그아웃 되었습니다.", "info");
  };

  const handleCompleteOnboarding = async (nick) => {
    if (!user || !user.id) return;
    
    setIsAuthLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          nickname: nick,
          profile_image: user.profileImage || ''
        });

      if (error) throw error;
      
      localStorage.setItem(`biblegram_nickname_${user.id}`, nick);
      localStorage.setItem('biblegram_nickname', nick);
      setNickname(nick);
      setActiveProfileUser(nick);
      showToast(`반갑습니다, ${nick}님!`, 'success');
      
      fetchBookmarks();
      fetchLikedStates();
    } catch (err) {
      console.error(err);
      showToast("닉네임 등록에 실패했습니다. 다시 시도해 주세요.", "error");
    } finally {
      setIsAuthLoading(false);
    }
  };
const handleToggleLikeGlobal = async (cardId) => {
      if (!user || !user.id) return;
      const isCurrentlyLiked = likedCardsState[cardId] || false;
      const nextLiked = !isCurrentlyLiked;
      
      setLikedCardsState(prev => ({ ...prev, [cardId]: nextLiked }));
      setFeedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (nextLiked ? 1 : -1) } : c));
      
      try {
        if (nextLiked) {
          await supabase.from('likes').insert({ user_id: user.id, card_id: cardId });
          const { data: cardData } = await supabase.from('cards').select('likes_count').eq('id', cardId).single();
          if (cardData) {
            await supabase.from('cards').update({ likes_count: cardData.likes_count + 1 }).eq('id', cardId);
          }
          showToast("은혜로운 말씀에 공감했습니다.", "success");
        } else {
          await supabase.from('likes').delete().eq('user_id', user.id).eq('card_id', cardId);
          const { data: cardData } = await supabase.from('cards').select('likes_count').eq('id', cardId).single();
          if (cardData) {
            await supabase.from('cards').update({ likes_count: Math.max(0, cardData.likes_count - 1) }).eq('id', cardId);
          }
          showToast("말씀 공감을 취소했습니다.", "info");
        }
      } catch (err) {
        console.error("Error toggling like:", err);
        setLikedCardsState(prev => ({ ...prev, [cardId]: isCurrentlyLiked }));
        setFeedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (isCurrentlyLiked ? 1 : -1) } : c));
        showToast("공감 처리에 실패했습니다.", "error");
      }
    };
  
    const handleToggleSave = async (card) => {
      if (!user || !user.id) return;
      const isAlreadySaved = savedCards.some(c => c.id === card.id);
      
      try {
        if (isAlreadySaved) {
          await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('card_id', card.id);
          setSavedCards(prev => prev.filter(c => c.id !== card.id));
          showToast("보관함에서 말씀을 삭제했습니다.", "info");
        } else {
          await supabase.from('bookmarks').insert({ user_id: user.id, card_id: card.id });
          setSavedCards(prev => [...prev, card]);
          showToast("내 묵상 서재에 저장해두었습니다.", "success");
        }
      } catch (err) {
        console.error("Error toggling save:", err);
        showToast("보관 처리에 실패했습니다.", "error");
      }
    };
  
    const handleNavigateProfile = (username) => {
      setActiveProfileUser(username);
      setView('profile');
    };

    const handleCommentCountChangeGlobal = (cardId, newCount) => {
      setFeedCards(prev => prev.map(c => c.id === cardId ? { ...c, commentCount: newCount } : c));
      setSavedCards(prev => prev.map(c => c.id === cardId ? { ...c, commentCount: newCount } : c));
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(prev => ({ ...prev, commentCount: newCount }));
      }
    };

    const handleDeleteCard = async (cardId) => {
      if (!window.confirm("이 말씀 카드를 성전(피드) 및 서재에서 완전히 삭제하시겠습니까?")) return;
      setIsAuthLoading(true);
      try {
        // 외래 키 제약 조건 오류 방지를 위한 관련 데이터 선제 삭제
        await supabase.from('bookmarks').delete().eq('card_id', cardId);
        await supabase.from('comments').delete().eq('card_id', cardId);
        await supabase.from('likes').delete().eq('card_id', cardId);
        
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', cardId);
        
        if (error) throw error;
        
        // 로컬 상태 동기화 처리
        setFeedCards(prev => prev.filter(c => c.id !== cardId));
        setSavedCards(prev => prev.filter(c => c.id !== cardId));
        setSelectedCard(null);
        setView('feed');
        showToast("말씀 카드가 성전과 서재에서 온전히 삭제되었습니다.", "success");
      } catch (err) {
        console.error("Error deleting card:", err);
        showToast("카드 삭제에 실패했습니다. 다시 시도해 주세요.", "error");
      } finally {
        setIsAuthLoading(false);
      }
    };
const handleSearchVerse = async () => {
    if (!verseRefInput.trim()) {
      showToast("장절 주소를 입력하세요 (예: 요한복음 3:16)", "info");
      return;
    }
    setIsSearching(true);
    try {
      const text = await fetchBibleTextFromAI(verseRefInput);
      setVerseText(`${text} (${verseRefInput.trim()})`);
      showToast("성스러운 말씀을 성경에서 올바르게 수령했습니다.", "success");
    } catch {
      showToast("일시적 서버 지연이 있습니다. 직접 수동으로 입력을 완료해 주세요.", "info");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreate = async () => {
    if (!verseText.trim()) {
      showToast("마음에 품을 말씀 구절을 기입해 주세요.", "info");
      return;
    }
    setView('loading');
    try {
      setLoadingStep('하늘의 빛과 지혜를 모아 오늘의 말씀 카드를 융합하는 중...');
      const actualThought = includeThought ? userThought : "";

      // 비동기 API 요청 병렬화로 서버지연 완벽 해소
      const [visualAnalysis, meditationVal, audioUri] = await Promise.all([
        analyzeVerseForVisuals(verseText),
        generateMeditation(verseText, actualThought),
        generateVerseAudio(verseText)
      ]);

      const imageUri = generateVerseImage(visualAnalysis.visualTheme || 'light');

      setCurrentResult({ 
        id: Date.now(), 
        text: verseText, 
        image: imageUri, 
        audio: audioUri, 
        meditation: meditationVal,
        userThought: actualThought,
        likes: 0
      });
      setView('result');
      showToast("성구의 신학적 분위기가 반영된 묵상 카드가 융합되었습니다.", "success");
    } catch (error) {
      console.error("생성 중단 에러:", error);
      // 무한 버퍼링 차단: 에러 발생 시 즉각 토스트 경고 후 창작 뷰로 복귀
      showToast('API 서버 지연 또는 보안 차단이 발생했습니다. 다시 시도해주세요.', 'error');
      setView('create');
    }
  };
const handlePublish = async () => {
      if (!user || !user.id) return;
      
      setIsAuthLoading(true);
      try {
        const newCardData = {
          verse_text: currentResult.text,
          image_url: currentResult.image,
          audio_url: currentResult.audio === "web-speech" ? null : currentResult.audio,
          meditation: currentResult.meditation,
          user_thought: currentResult.userThought,
          author_id: user.id,
          author_nickname: nickname || "은혜나눔인",
          likes_count: 0
        };
        
        const { data, error } = await supabase
          .from('cards')
          .insert(newCardData)
          .select()
          .single();
          
        if (error) throw error;
        
        const mappedCard = {
          id: data.id,
          text: data.verse_text,
          image: data.image_url,
          audio: data.audio_url || 'web-speech',
          meditation: data.meditation,
          userThought: data.user_thought,
          author: data.author_nickname,
          likes: data.likes_count,
          commentCount: 0
        };
        
        setFeedCards(prev => [mappedCard, ...prev]);
        
        await supabase.from('bookmarks').insert({ user_id: user.id, card_id: data.id });
        await fetchBookmarks();
        
        setVerseRefInput('');
        setVerseText('');
        setUserThought('');
        setIncludeThought(false);
        
        setActiveProfileUser(nickname || "은혜나눔인");
        setView('profile');
        showToast("생성된 말씀을 성전에 헌정하여 교우들과 나눕니다.", "success");
      } catch (err) {
        console.error("Error publishing card:", err);
        showToast("성전에 카드를 올리는 데 실패했습니다.", "error");
      } finally {
        setIsAuthLoading(false);
      }
    };
const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "주님의 신비로운 아침 광채 아래서 하루를 묵상해보세요";
    if (hour >= 12 && hour < 18) return "분주한 일상을 내려놓고 말씀이 머무는 성소로 나아오세요";
    return "고요하고 평화로운 밤, 구주의 보혈 같은 따뜻함 속에 깃들 시간입니다";
  };
  const getLikedCardsOfOthers = () => {
    if (!user) return [];
    return feedCards.filter(card => {
      const isLiked = likedCardsState[card.id] === true;
      const isNotOwn = card.author_id !== user.id && card.author !== nickname && card.author !== "은혜나눔인";
      return isLiked && isNotOwn;
    });
  };

  const getCreatedCards = () => {
    const isOwnProfile = activeProfileUser === nickname || activeProfileUser === "은혜나눔인";
    if (isOwnProfile) {
      return savedCards;
    } else {
      return feedCards.filter(c => c.author === activeProfileUser);
    }
  };

  const getProfileDisplayCards = () => {
    const isOwnProfile = activeProfileUser === nickname || activeProfileUser === "은혜나눔인";
    if (profileTab === 'created') {
      return getCreatedCards();
    } else {
      return isOwnProfile ? getLikedCardsOfOthers() : otherUserLikedCards;
    }
  };

  useEffect(() => {
    setProfileTab('created');
    const fetchOtherUserLikes = async () => {
      if (!activeProfileUser || activeProfileUser === nickname || activeProfileUser === "은혜나눔인" || activeProfileUser === "나의 서재") {
        setOtherUserLikedCards([]);
        return;
      }
      setIsFetchingOtherLikes(true);
      try {
        const matchingCard = feedCards.find(c => c.author === activeProfileUser);
        if (!matchingCard || !matchingCard.author_id) {
          setOtherUserLikedCards([]);
          setIsFetchingOtherLikes(false);
          return;
        }
        const targetUserId = matchingCard.author_id;

        const { data, error } = await supabase
          .from('likes')
          .select(`
            card_id,
            cards (
              id,
              verse_text,
              image_url,
              audio_url,
              meditation,
              user_thought,
              author_nickname,
              author_id,
              likes_count,
              created_at
            )
          `)
          .eq('user_id', targetUserId);

        if (error) throw error;

        if (data) {
          const mapped = data
            .filter(item => item.cards !== null)
            .map(item => ({
              id: item.cards.id,
              text: item.cards.verse_text,
              image: item.cards.image_url,
              audio: item.cards.audio_url || 'web-speech',
              meditation: item.cards.meditation,
              userThought: item.cards.user_thought,
              author: item.cards.author_nickname,
              author_id: item.cards.author_id,
              likes: item.cards.likes_count,
              commentCount: 0
            }))
            .filter(c => c.author_id !== targetUserId);
          
          setOtherUserLikedCards(mapped);
        } else {
          setOtherUserLikedCards([]);
        }
      } catch (err) {
        console.error("Error fetching other user likes:", err);
        setOtherUserLikedCards([]);
      } finally {
        setIsFetchingOtherLikes(false);
      }
    };
    fetchOtherUserLikes();
  }, [activeProfileUser, nickname, feedCards]);
  
    const activeMeta = USER_PROFILES_META[activeProfileUser] || { 
      name: activeProfileUser === nickname ? nickname : activeProfileUser, 
      desc: activeProfileUser === nickname ? "매일 하늘 양식을 모으는 성소" : "주님과 조용히 동행하는 성도", 
      stars: "0" 
    };
  
    const getToastStyles = () => {
      switch (toast.type) {
        case 'error':
          return {
            bg: 'rgba(54, 23, 23, 0.98)',
            border: 'rgba(239, 68, 68, 0.4)',
            text: 'text-red-200',
            icon: '#ef4444'
          };
        case 'success':
          return {
            bg: 'rgba(18, 48, 28, 0.98)',
            border: 'rgba(34, 197, 94, 0.4)',
            text: 'text-green-200',
            icon: '#22c55e'
          };
        default: // info
          return {
            bg: 'rgba(22, 18, 14, 0.98)',
            border: 'rgba(223, 186, 115, 0.4)',
            text: 'text-[#FDFBF7]',
            icon: '#DFBA73'
          };
      }
    };
  
    const toastStyle = getToastStyles();
return (
    <div className="flex justify-center items-center min-h-screen bg-[#020202] text-[#F9F7F1] font-sans selection:bg-[#DFBA73]/30">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
        .font-myeongjo { font-family: 'Nanum Myeongjo', serif; }
        
        @keyframes scrollTextUpCenter {
          0% { transform: translateY(40%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-30%); opacity: 0.95; }
        }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @keyframes pulseGoldGlow {
          0% { box-shadow: 0 0 0 0 rgba(223, 186, 115, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(223, 186, 115, 0); }
          100% { box-shadow: 0 0 0 0 rgba(223, 186, 115, 0); }
        }
        .pulse-gold {
          animation: pulseGoldGlow 2.5s infinite;
        }

        /* 어르신들을 위한 큰글씨보기(Large Font) 전역 오버라이드 규칙 */
        .large-font .devotion-verse-text {
          font-size: 24px !important;
          line-height: 1.8 !important;
        }
        .large-font .devotion-meditation-text {
          font-size: 17px !important;
          line-height: 1.75 !important;
        }
        .large-font .devotion-thought-text {
          font-size: 16.5px !important;
          line-height: 1.75 !important;
        }
        .large-font .devotion-comment-text {
          font-size: 15px !important;
          line-height: 1.7 !important;
        }
        
        /* 성화수록 생성 화면 기본값 */
        .devotion-create-title {
          font-size: 23px !important;
        }
        .devotion-create-subtitle {
          font-size: 12px !important;
          line-height: 1.5 !important;
        }
        .devotion-create-label {
          font-size: 13px !important;
        }
        .devotion-create-help {
          font-size: 10.5px !important;
          line-height: 1.5 !important;
        }
        .devotion-create-input {
          font-size: 17px !important;
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
        .devotion-create-btn {
          font-size: 14px !important;
        }
        .devotion-create-textarea {
          font-size: 17px !important;
          line-height: 1.6 !important;
          min-height: 100px !important;
        }
        .devotion-create-option-title {
          font-size: 13.5px !important;
        }
        .devotion-create-option-desc {
          font-size: 10.5px !important;
          line-height: 1.4 !important;
        }
        .devotion-create-cta {
          font-size: 15px !important;
          padding-top: 14px !important;
          padding-bottom: 14px !important;
        }

        /* 성화수록 생성 화면 내 큰글씨(Large Font) ON 오버라이드 규칙 */
        .large-font .devotion-create-title {
          font-size: 27px !important;
        }
        .large-font .devotion-create-subtitle {
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        .large-font .devotion-create-label {
          font-size: 16px !important;
        }
        .large-font .devotion-create-help {
          font-size: 13px !important;
          line-height: 1.5 !important;
        }
        .large-font .devotion-create-input {
          font-size: 21px !important;
          padding-top: 12px !important;
          padding-bottom: 12px !important;
        }
        .large-font .devotion-create-btn {
          font-size: 16px !important;
        }
        .large-font .devotion-create-textarea {
          font-size: 20px !important;
          line-height: 1.6 !important;
          min-height: 130px !important;
        }
        .large-font .devotion-create-option-title {
          font-size: 16.5px !important;
        }
        .large-font .devotion-create-option-desc {
          font-size: 13px !important;
          line-height: 1.4 !important;
        }
        .large-font .devotion-create-cta {
          font-size: 18px !important;
          padding-top: 18px !important;
          padding-bottom: 18px !important;
        }
      `}</style>

      {/* 스마트폰 전용 뷰 포트 시뮬레이션 (sm 미만 모바일에서는 꽉 차게 렌더링하여 경계 배젤 완전히 제거) */}
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-[#050505] flex flex-col md:shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden md:rounded-[48px] md:h-[860px] md:border md:border-white/10 md:my-4 transition-all duration-300">
        
        {isAuthLoading ? (
          <LoadingFlashback loadingStep="카카오 인증 처리 중..." />
        ) : !user ? (
          <LoginView onKakaoLogin={handleKakaoLogin} onGuestLogin={handleGuestLogin} />
        ) : !nickname ? (
          <OnboardingView user={user} onCompleteOnboarding={handleCompleteOnboarding} onCancel={handleLogout} />
        ) : (
          <>
            {/* 성전 상단 프리미엄 헤더 라인 (상단 상태바 시계 영역 겹침 방지 보정 완료 - 피드 뷰 전용) */}
            {view === 'feed' && (
              <div className={`absolute top-0 left-0 right-0 h-[calc(64px+env(safe-area-inset-top))] bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent z-[50] pointer-events-none flex flex-col justify-end pb-2 px-6 pt-[env(safe-area-inset-top)]`}>
                <div className="flex items-center justify-between w-full">
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#DFBA73]/40 to-transparent flex-1 mr-4"></div>
                  <span 
                    className="text-[12.5px] font-myeongjo font-extrabold tracking-[0.25em] text-[#DFBA73]"
                    style={{ textShadow: '0 0 10px rgba(223,186,115,0.4)' }}
                  >
                    LIGHT OF WORD
                  </span>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#DFBA73]/40 to-transparent flex-1 ml-4"></div>
                </div>
                <div className="w-full text-center mt-1">
                  <span className="text-[7.5px] font-sans text-white/30 tracking-[0.3em] uppercase">Visual Devotional Sanctuary</span>
                </div>
              </div>
            )}

            {/* 1. 피드 뷰 영역 */}
            {view === 'feed' && (
              <div className="flex-1 overflow-y-auto snap-y snap-mandatory hide-scrollbar bg-black relative">
                {feedCards.map((card) => (
                  <FeedCard 
                    key={card.id} 
                    card={card} 
                    onShowToast={showToast}
                    onToggleSave={handleToggleSave}
                    isSaved={savedCards.some(c => c.id === card.id)}
                    onNavigateProfile={handleNavigateProfile}
                    likedCardsState={likedCardsState}
                    onToggleLikeGlobal={handleToggleLikeGlobal}
                    user={user}
                    nickname={nickname}
                    onCommentCountChange={handleCommentCountChangeGlobal}
                    onDeleteCard={handleDeleteCard}
                    userProfiles={userProfiles}
                  />
                ))}
              </div>
            )}

            {/* 2. 묵상 생성 및 입력 뷰 영역 */}
            {view === 'create' && (
              <div className={`flex-1 flex flex-col bg-[#FDFBF7] text-[#2C241B] p-6 pt-[calc(10px+env(safe-area-inset-top))] z-10 pb-[calc(76px+env(safe-area-inset-bottom))] overflow-y-auto hide-scrollbar ${isLargeFont ? 'large-font' : ''}`}>
                <div className="flex justify-between items-start mb-3 w-full pt-1.5">
                  <div className="flex-1 mr-2 text-left">
                    <span className="text-[9px] text-[#A37B3F] font-semibold tracking-[0.2em] uppercase">Visual Devotion</span>
                    <h1 className={`font-myeongjo font-extrabold text-[#1A1510] tracking-tight mt-0.5 transition-all ${isLargeFont ? 'text-[27px]' : 'text-[23px]'}`}>성전 성화 수록</h1>
                    <p className={`text-[#8B7D6B] mt-0.5 font-sans transition-all ${isLargeFont ? 'text-[14px]' : 'text-[12px]'}`}>{getGreetingMessage()}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const next = !isLargeFont;
                      setIsLargeFont(next);
                      localStorage.setItem('biblegram_large_font', String(next));
                      showToast(next ? "큰글씨보기가 활성화되었습니다." : "큰글씨보기가 꺼졌습니다.", "success");
                    }}
                    className={`shrink-0 flex items-center justify-center px-3 py-1.5 rounded-full border transition-all duration-300 active:scale-95 text-[10.5px] font-bold mt-1.5 ${
                      isLargeFont 
                        ? 'bg-[#3A3025] border-[#3A3025] text-[#DFBA73] shadow-sm' 
                        : 'bg-[#F4EFE6] border-[#D8CFC0] text-[#8B7D6B] hover:text-[#3A3025]'
                    }`}
                  >
                    <span>큰글씨 보기 {isLargeFont ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
                
                <div className="mb-3.5 text-left">
                  <label className={`text-[#A37B3F] font-bold tracking-wider mb-1 block transition-all ${isLargeFont ? 'text-[16px]' : 'text-[13px]'}`}>1단계: 성서 말씀 탐색</label>
                  <span className={`text-stone-500/90 block mb-1.5 leading-relaxed transition-all ${isLargeFont ? 'text-[13px]' : 'text-[10.5px]'}`}>
                    한 구절만 찾거나(예: <b>요한복음 3:16</b>),
                    <br />
                    여러 구절을 연속해서 한 번에 찾을 수도 있습니다 (예: <b>창세기 1:6~9</b>).
                  </span>
                  <div className="flex space-x-2 w-full">
                    <input 
                      type="text"
                      value={verseRefInput}
                      onChange={(e) => setVerseRefInput(e.target.value)}
                      placeholder="예: 요한복음 3:16 또는 창세기 1:6~9"
                      className={`min-w-0 flex-1 bg-[#F4EFE6] border-b border-[#D8CFC0] rounded-t-xl px-4 focus:outline-none focus:border-[#A37B3F] font-myeongjo placeholder:text-[#C5B9AA] transition-colors ${isLargeFont ? 'text-[21px] py-3' : 'text-[17px] py-2'}`}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchVerse()}
                    />
                    <button 
                      type="button"
                      onClick={handleSearchVerse} 
                      disabled={isSearching} 
                      className={`shrink-0 bg-[#3A3025] hover:bg-[#201A14] text-[#F9F7F1] px-4 rounded-xl font-sans font-medium whitespace-nowrap transition-transform active:scale-95 disabled:opacity-50 ${isLargeFont ? 'text-[16px] py-3' : 'text-[14px] py-2'}`}
                    >
                      {isSearching ? '수렴중...' : '탐색'}
                    </button>
                  </div>
                </div>

                <div className="mb-3 text-left">
                  <label className={`text-[#A37B3F] font-bold tracking-wider mb-1 block transition-all ${isLargeFont ? 'text-[16px]' : 'text-[13px]'}`}>2단계: 마음에 새긴 구절 가다듬기 (성경말씀)</label>
                  <textarea 
                    value={verseText}
                    onChange={(e) => setVerseText(e.target.value)}
                    placeholder="위의 탐색 단추를 이용해 채워 넣거나, 가슴 속에 담아둔 말씀을 이곳에 직접 서술해 주세요..."
                    className={`w-full bg-white/80 border border-[#E8E1D5] rounded-2xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#A37B3F] resize-none font-myeongjo leading-[1.6] tracking-[0.02em] shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] transition-all ${isLargeFont ? 'text-[20px] min-h-[130px]' : 'text-[17px] min-h-[100px]'}`}
                  />
                </div>

                <div className="mb-3.5 text-left">
                  <label className={`text-[#A37B3F] font-bold tracking-wider mb-1.5 block transition-all ${isLargeFont ? 'text-[16px]' : 'text-[13px]'}`}>3단계: 나의 오늘 고백 & 간구 (선택)</label>
                  
                  <div className="flex items-center justify-between bg-[#F4EFE6] px-4 py-2 rounded-2xl border border-[#D8CFC0] mb-2">
                    <div className="flex flex-col text-left">
                      <span className={`font-bold text-[#1A1510] transition-all ${isLargeFont ? 'text-[16.5px]' : 'text-[13.5px]'}`}>오늘의 고백 추가하기</span>
                      <span className={`text-stone-500 devotion-create-option-desc transition-all ${isLargeFont ? 'text-[13px]' : 'text-[10.5px]'}`}>고백 활성화 시 묵상과 성화에 오늘 마음이 융합됩니다.</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIncludeThought(!includeThought)}
                      className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none ${includeThought ? 'bg-[#A37B3F]' : 'bg-stone-300'}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${includeThought ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  {includeThought && (
                    <textarea 
                      value={userThought}
                      onChange={(e) => setUserThought(e.target.value)}
                      placeholder="오늘 내가 마주한 상황, 주님 앞에 뉘우치는 고백, 혹은 간절한 기도의 실상을 적어주세요."
                      className={`w-full bg-white/85 border border-[#E8E1D5] rounded-2xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#A37B3F] resize-none font-sans leading-[1.5] placeholder:text-stone-400 shadow-sm animate-fade-in-up transition-all ${isLargeFont ? 'text-[20px] min-h-[130px]' : 'text-[17px] min-h-[100px]'}`}
                    />
                  )}
                </div>

                <button 
                  onClick={handleCreate}
                  disabled={!verseText.trim()}
                  className={`w-full rounded-xl bg-[#1e1510] hover:bg-[#3A3025] text-[#DFBA73] font-bold tracking-widest disabled:opacity-30 shadow-lg active:scale-[0.98] transition-all uppercase ${isLargeFont ? 'text-[18px] py-4.5 mt-2' : 'text-[15px] py-3.5 mt-1'}`}
                >
                  성화 말씀 카드 창조하기
                </button>
              </div>
            )}

            {/* 3. 영적 주마등 인트로 로딩 */}
            {view === 'loading' && (
              <LoadingFlashback loadingStep={loadingStep} />
            )}

            {/* 4. 생성 결과 프리뷰 */}
            {view === 'result' && (
              <div className="absolute inset-0 bg-black z-40">
                <div className="absolute inset-0 pb-20">
                   <FeedCard 
                    card={{ ...currentResult, author: nickname || "은혜나눔인", likes: 0, commentCount: 0 }} 
                    isPreview={true} 
                    onShowToast={showToast} 
                    likedCardsState={likedCardsState}
                    onToggleLikeGlobal={handleToggleLikeGlobal}
                    user={user}
                    nickname={nickname}
                    onCommentCountChange={handleCommentCountChangeGlobal}
                    onDeleteCard={handleDeleteCard}
                    userProfiles={userProfiles}
                   />
                </div>
                {/* 프리뷰 위 정렬 버튼들 */}
                <div className="absolute bottom-[calc(80px+env(safe-area-inset-bottom))] left-0 right-0 flex flex-col items-center justify-center gap-3 z-50 px-6">
                  <button 
                    onClick={handlePublish}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[13px] flex items-center justify-center gap-2.5 shadow-[0_10px_25px_rgba(223,186,115,0.3)] hover:scale-105 active:scale-95 transition-transform tracking-wider"
                  >
                    <Icons.Check /> 성전에 은혜 올리기
                  </button>
                  <button 
                    onClick={() => setView('create')} 
                    className="text-white/60 text-[11px] underline underline-offset-4 py-2 hover:text-white transition-colors"
                  >
                    다시 묵상하며 수정하기
                  </button>
                </div>
              </div>
            )}

            {/* 5. 보관함 디테일 일품 말씀 */}
            {view === 'detail' && selectedCard && (
              <div className="absolute inset-0 bg-black z-50 flex flex-col">
                <button 
                  onClick={() => { setView('profile'); setSelectedCard(null); }}
                  className="absolute top-16 left-4 z-[60] text-[#DFBA73] p-2.5 flex items-center gap-2 bg-black/40 rounded-full backdrop-blur-md border border-white/10 shadow-lg active:scale-95 transition-transform"
                >
                  <Icons.ArrowLeft />
                </button>
                <div className="flex-1 relative">
                  <FeedCard 
                    card={selectedCard} 
                    isPreview={false} 
                    onShowToast={showToast} 
                    onToggleSave={handleToggleSave}
                    isSaved={savedCards.some(c => c.id === selectedCard.id)}
                    onNavigateProfile={handleNavigateProfile}
                    likedCardsState={likedCardsState}
                    onToggleLikeGlobal={handleToggleLikeGlobal}
                    user={user}
                    nickname={nickname}
                    onCommentCountChange={handleCommentCountChangeGlobal}
                    onDeleteCard={handleDeleteCard}
                    userProfiles={userProfiles}
                  />
                </div>
              </div>
            )}

            {/* 6. 성소 보관 서재 프로필 뷰 (타인 조회 대응 완료) */}
            {view === 'profile' && (
              <div className="flex-1 flex flex-col bg-[#050505] z-10 pb-[calc(96px+env(safe-area-inset-bottom))] overflow-y-auto hide-scrollbar relative">
                
                {/* 다른 유저의 프로필일 때 은혜광장(피드)으로 돌아가는 뒤로가기 버튼 */}
                {activeProfileUser !== nickname && activeProfileUser !== "은혜나눔인" ? (
                  <div className="absolute top-[calc(14px+env(safe-area-inset-top))] left-4 z-20">
                    <button 
                      onClick={() => setView('feed')}
                      className="flex items-center gap-1.5 text-[#DFBA73] text-[10.5px] bg-black/70 border border-white/10 py-1.5 px-3 rounded-full hover:bg-black/95 transition-colors backdrop-blur-md"
                    >
                      <Icons.ArrowLeft /> 돌아가기
                    </button>
                  </div>
                ) : (
                  <div className="absolute top-[calc(16px+env(safe-area-inset-top))] right-4 z-[60]">
                    <button 
                      onClick={() => setIsSettingsOpen(true)}
                      className="w-10 h-10 flex items-center justify-center text-[#DFBA73] hover:text-white bg-[#1a1612]/80 border border-[#DFBA73]/30 rounded-full transition-all duration-300 active:scale-95 backdrop-blur-md shadow-lg"
                      title="설정"
                    >
                      <Icons.Settings />
                    </button>
                  </div>
                )}

                <div className="px-6 border-b border-white/5 bg-gradient-to-b from-[#111111]/70 to-[#050505] flex flex-col items-center text-center pt-[calc(76px+env(safe-area-inset-top))] pb-4.5 relative shrink-0">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 rounded-full border border-[#DFBA73] animate-ping opacity-15" />
                    <div className="w-14 h-14 rounded-full border-2 border-[#DFBA73]/50 flex items-center justify-center bg-gradient-to-tr from-[#1E1812] to-black text-[#DFBA73] shadow-[0_0_15px_rgba(223,186,115,0.2)] overflow-hidden shrink-0">
                      {userProfiles && userProfiles[activeProfileUser] ? (
                        <img src={userProfiles[activeProfileUser]} alt="profile" className="w-full h-full object-cover animate-fade-in" />
                      ) : (activeProfileUser === nickname || activeProfileUser === "은혜나눔인") && user && user.profileImage ? (
                        <img src={user.profileImage} alt="profile" className="w-full h-full object-cover animate-fade-in" />
                      ) : (
                        <Icons.User />
                      )}
                    </div>
                  </div>
                  
                  <h1 className="text-[16px] font-bold text-[#F9F7F1] tracking-wide font-sans">
                    {activeProfileUser === "은혜나눔인" ? "오띵" : activeMeta.name}
                  </h1>
                  <p className="text-[#DFBA73]/85 text-[12px] mt-1 font-myeongjo tracking-[0.03em] px-6 break-keep leading-relaxed max-w-[280px]">
                    {activeMeta.desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3.5 w-full max-w-[230px] mt-4 pt-3 border-t border-white/5 text-center">
                    <button 
                      type="button"
                      onClick={() => setProfileTab('created')}
                      className={`flex flex-col items-center py-1.5 px-2 rounded-xl border transition-all duration-300 active:scale-95 ${
                        profileTab === 'created' 
                          ? 'bg-[#DFBA73]/10 border-[#DFBA73]/40 text-[#DFBA73] shadow-[0_0_10px_rgba(223,186,115,0.05)] scale-105' 
                          : 'bg-transparent border-transparent text-white/50 hover:text-white/80'
                      }`}
                    >
                      <div className="text-[14px] font-extrabold tracking-wide">
                        {activeProfileUser === nickname || activeProfileUser === "은혜나눔인" 
                          ? savedCards.length 
                          : feedCards.filter(c => c.author === activeProfileUser).length
                        }
                      </div>
                      <div className="text-[10px] font-medium mt-0.5">작성/보관 성구</div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProfileTab('liked')}
                      className={`flex flex-col items-center py-1.5 px-2 rounded-xl border transition-all duration-300 active:scale-95 ${
                        profileTab === 'liked' 
                          ? 'bg-[#DFBA73]/10 border-[#DFBA73]/40 text-[#DFBA73] shadow-[0_0_10px_rgba(223,186,115,0.05)] scale-105' 
                          : 'bg-transparent border-transparent text-white/50 hover:text-white/80'
                      }`}
                    >
                      <div className="text-[14px] font-extrabold tracking-wide">
                        {activeProfileUser === nickname || activeProfileUser === "은혜나눔인" 
                          ? getLikedCardsOfOthers().length 
                          : otherUserLikedCards.length
                        }
                      </div>
                      <div className="text-[10px] font-medium mt-0.5">공감 은혜</div>
                    </button>
                  </div>
                </div>
                
                {/* 서재 내부 그리드 표현 */}
                <div className="px-4 py-2.5 flex-1">
                  <h2 className="text-[13px] text-[#DFBA73]/80 font-bold tracking-widest uppercase font-myeongjo mb-2.5 pl-1">
                    {profileTab === 'created' 
                      ? (activeProfileUser === nickname || activeProfileUser === "은혜나눔인" ? "소장한 말씀 카드" : `${activeProfileUser} 님의 묵상 기록`)
                      : (activeProfileUser === nickname || activeProfileUser === "은혜나눔인" ? "공감하고 기뻐한 말씀" : `${activeProfileUser} 님이 공감한 은혜`)
                    }
                  </h2>
                  
                  {getProfileDisplayCards().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                      <p className="text-white/30 text-[14px] font-myeongjo leading-relaxed whitespace-pre-line">
                        {profileTab === 'created' 
                          ? "기록된 묵상 말씀이 없습니다.\n새로운 말씀 카드를 창조해 보세요." 
                          : "아직 다른 피드에 공감(좋아요)한 말씀이 없습니다.\n은혜광장에서 다른 성도의 말씀에 공감을 나누어 보세요."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5 animate-fade-in-up">
                      {getProfileDisplayCards().map(card => (
                        <div 
                          key={card.id || card.text} 
                          className="relative aspect-square bg-[#121212] cursor-pointer group overflow-hidden rounded-[20px] border border-white/5 transition-transform active:scale-95 shadow-md"
                          onClick={() => { setSelectedCard(card); setView('detail'); }}
                        >
                          <img 
                            src={card.image} 
                            alt="thumb" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-70" />
                          <div className="absolute bottom-2 left-2.5 text-[#DFBA73]/85 scale-85">
                            <Icons.Music />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-white/20 text-[11px] tracking-widest text-center pt-6 pb-8 font-sans">
                  오디세이 묵상 하우스 &bull; ALL RIGHTS RESERVED
                </p>
              </div>
            )}

            {/* 7. 프리미엄 도크 바 네비게이션 (바텀 세이프 에어리어 및 수직 중심 칼정렬 보완) */}
            <div className="absolute bottom-0 w-full h-[calc(68px+env(safe-area-inset-bottom))] bg-[#0a0a0a]/90 backdrop-blur-2xl flex justify-around items-center pb-[env(safe-area-inset-bottom)] px-8 z-50 pointer-events-auto border-t border-white/[0.04]">
              <button 
                onClick={() => setView('feed')} 
                className={`flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ${view === 'feed' ? 'text-[#DFBA73] scale-105 drop-shadow-md' : 'text-white/30'}`}
              >
                <div className="flex items-center justify-center h-5.5 w-5.5">
                  <Icons.Home />
                </div>
                <span className="text-[9px] mt-1 font-semibold tracking-wide">은혜광장</span>
              </button>
              
              <div className="flex items-center justify-center h-14">
                <button 
                  onClick={() => { setVerseRefInput(''); setVerseText(''); setView('create'); }} 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 pulse-gold ${
                    view === 'create' 
                      ? 'bg-gradient-to-tr from-[#DFBA73] to-[#F5DCA9] text-black scale-105 border-[3px] border-[#DFBA73]/60 shadow-[0_0_20px_rgba(223,186,115,0.4)]' 
                      : 'bg-[#1c1814] text-[#DFBA73] border-2 border-[#DFBA73]/40 hover:border-[#DFBA73] shadow-[0_4px_16px_rgba(223,186,115,0.2)]'
                  }`}
                >
                  <Icons.Plus />
                </button>
              </div>
              
              <button 
                onClick={() => { setActiveProfileUser(nickname || "은혜나눔인"); setView('profile'); }} 
                className={`flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ${(view === 'profile' || view === 'detail') && (activeProfileUser === nickname || activeProfileUser === '은혜나눔인') ? 'text-[#DFBA73] scale-105 drop-shadow-md' : 'text-white/30'}`}
              >
                <div className="flex items-center justify-center h-5.5 w-5.5">
                  <Icons.User />
                </div>
                <span className="text-[9px] mt-1 font-semibold tracking-wide">내 서재</span>
              </button>
            </div>

            {/* 8. 프리미엄 은혜의 성소 설정 바텀 시트 */}
            {isSettingsOpen && (
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fade-in"
                onClick={() => setIsSettingsOpen(false)}
              >
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#0c0a08]/98 backdrop-blur-3xl border-t border-[#DFBA73]/30 rounded-t-[32px] p-7 pb-[calc(24px+env(safe-area-inset-bottom))] flex flex-col gap-6 shadow-[0_-15px_50px_rgba(0,0,0,0.95)] animate-slide-up pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 드래그 핸들 데코레이션 */}
                  <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-1 shrink-0" />
                  
                  {/* 해더 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#DFBA73]/10 rounded-full text-[#DFBA73] border border-[#DFBA73]/20">
                        <Icons.Settings />
                      </div>
                      <div className="text-left">
                        <h3 className="text-[#DFBA73] font-myeongjo font-bold text-[16px] tracking-wide">설정</h3>
                        <p className="text-white/40 text-[9px] tracking-tight">개인화된 성경 묵상 환경을 구성합니다.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-[#DFBA73]/60 hover:text-white transition-colors p-1"
                    >
                      <Icons.Close />
                    </button>
                  </div>

                  {/* 설정 아이템 리스트 */}
                  <div className="flex flex-col gap-3.5 mt-2">
                    
                    {/* 로그인 정보 표시 */}
                    <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.04] p-4.5 rounded-2xl text-center">
                      <span className="text-[10px] text-stone-500 font-sans uppercase tracking-widest">현재 로그인 플랫폼</span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-[#FEE500] animate-pulse shadow-[0_0_8px_rgba(254,229,0,0.6)]" />
                        <span className="text-[13.5px] font-extrabold text-[#FEE500] font-sans tracking-wide drop-shadow-sm">카카오 계정으로 연동됨</span>
                      </div>
                    </div>

                    {/* 로그아웃 버튼 */}
                    <button 
                      onClick={() => {
                        setIsSettingsOpen(false);
                        handleLogout();
                      }}
                      className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-[#ff4d4d] font-bold text-[13.5px] tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <Icons.LogOut />
                      <span>성소 로그아웃</span>
                    </button>
                    
                  </div>
                </div>
              </div>
            )}

            {/* 8. 프리미엄 인앱 알림 토스트 */}
            <div 
              className={`absolute top-20 left-4 right-4 z-[99] p-3.5 rounded-2xl flex items-center gap-3 shadow-2xl transition-all duration-500 ease-out ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}
              style={{ backgroundColor: toastStyle.bg, borderColor: toastStyle.border }}
            >
              <div style={{ color: toastStyle.icon }}>
                <Icons.Sparkles />
              </div>
              <p className={`text-[12px] font-myeongjo font-semibold flex-1 leading-normal ${toastStyle.text}`}>{toast.message}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}