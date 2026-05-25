
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
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
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
  "https://res.cloudinary.com/dakbczcvo/image/upload/v1779632780/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_11_26_07_c05x4j.png", // 천지창조 원작 (The Creation of Adam)
  "https://res.cloudinary.com/dakbczcvo/image/upload/v1779632507/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_11_21_41_lth8we.png", // 모세 홍해분할 원작 (Moses and the Red Sea)
  "https://res.cloudinary.com/dakbczcvo/image/upload/v1779632435/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_11_20_26_rzgyen.png", // 다윗과 골리앗 원작 (David and Goliath)
  "https://res.cloudinary.com/dakbczcvo/image/upload/v1779632386/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_11_19_37_ey4wgp.png", // 노아의 방주 원작 (Noah's Ark)
  "https://res.cloudinary.com/dakbczcvo/image/upload/v1779632290/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_11_18_02_r52z4x.png", // 선한 목자의 인도 원작 (The Good Shepherd)
  "https://res.cloudinary.com/dakbczcvo/image/upload/v1779632277/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_11_17_47_evf7er.png"  // 아기 예수 성탄의 축복 원작 (The Nativity Star)
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

const fetchWithTimeout = async (url, options = {}, timeout = 6000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

async function fetchBibleTextFromAI(reference) {
  const response = await fetchWithTimeout('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'search', reference })
  }, 6000);
  if (!response.ok) throw new Error("성경 구절 탐색 오류");
  const result = await response.json();
  return result;
}

async function analyzeVerseForVisuals(verse) {
  try {
    const response = await fetchWithTimeout('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', verseText: verse })
    }, 6000);
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
    const response = await fetchWithTimeout('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'meditate', verseText: verse, userThought })
    }, 6000);
    if (!response.ok) throw new Error("묵상 생성 오류");
    const result = await response.json();
    return result.text || "은혜 가득한 묵상이 온전하게 수렴되었습니다.";
  } catch {
    return "은혜 가득한 묵상이 온전하게 수렴되었습니다.";
  }
}

const extractReference = (text) => {
  if (!text) return '';
  const match = text.match(/\(([^)]+)\)\s*$/);
  if (match) {
    return match[1].trim();
  }
  return text.length < 15 ? text : '';
};


const isValidBibleReference = (input) => {
  if (!input) return { valid: false, reason: "장절 주소를 입력하세요 (예: 요한복음 3:16)" };
  const trimmed = input.trim();
  
  // 1. Blacklist check (욕설 및 프롬프트 인젝션 방어)
  const blacklist = [
    '시발', '씨발', '병신', '섹스', '존나', '개새끼', '미친', '지랄', '엠창', '바보', '멍청이', 
    '쓰레기', '좆', '닥쳐', '새끼', 'ignore', 'instruction', 'system', 'override', 'prompt'
  ];
  for (const word of blacklist) {
    if (trimmed.toLowerCase().includes(word)) {
      return { valid: false, reason: "주님의 성소에는 경건하고 바른 표현만 사용해 주세요." };
    }
  }

  // 2. Linear and safe book check
  const books = [
    "창세기", "창", "출애굽기", "출", "레위기", "레", "민수기", "민", "신명기", "신", 
    "여호수아", "여호", "수", "사사기", "사사", "삿", "룻기", "룻", "사무엘상", "삼상", 
    "사무엘하", "삼하", "열왕기상", "왕상", "열왕기하", "왕하", "역대기상", "대상", 
    "역대기하", "대하", "에스라", "스", "느헤미야", "느", "에스더", "에", "욥기", "욥", 
    "시편", "시", "잠언", "잠", "전도서", "전", "아가", "아", "이사야", "사", 
    "예레미야", "렘", "예레미야애가", "예레미야 애가", "애", "렘애", "에스겔", "겔", 
    "다니엘", "단", "호세아", "호", "요엘", "욜", "아모스", "암", "오바댜", "옵", 
    "요나", "욘", "미가", "미", "나훔", "나", "하박국", "합", "스바냐", "습", 
    "학개", "학", "스가랴", "슥", "말라기", "말", "마태복음", "마태", "마", 
    "마가복음", "마가", "막", "누가복음", "누가", "누", "요한복음", "요한", "요", 
    "사도행전", "행", "로마서", "롬", "고린도전서", "고전", "고린도후서", "고후", 
    "갈라디아서", "갈", "에베소서", "엡", "빌립보서", "빌", "골로새서", "골", 
    "데살로니가전서", "살전", "데살로니가후서", "살후", "디모데전서", "딤전", 
    "디모데후서", "딤후", "디도서", "딛", "빌레몬서", "몬", "히브리서", "히", 
    "야고보서", "야", "베드로전서", "벧전", "베드로후서", "벧후", "요한일서", "요일", 
    "요한이서", "요이", "요한삼서", "요삼", "유다서", "유", "요한계시록", "계시록", "계",
    "Genesis", "Gen", "Exodus", "Ex", "Leviticus", "Lev", "Numbers", "Num", "Deuteronomy", "Deut",
    "Joshua", "Josh", "Judges", "Judg", "Ruth", "1 Samuel", "1 Sam", "2 Samuel", "2 Sam",
    "1 Kings", "2 Kings", "1 Chronicles", "1 Chr", "2 Chronicles", "2 Chr",
    "Ezra", "Nehemiah", "Neh", "Esther", "Esth", "Job", "Psalms", "Ps", "Psalm", "Proverbs", "Prov",
    "Ecclesiastes", "Eccles", "Song of Songs", "Song", "Isaiah", "Isa", "Jeremiah", "Jer",
    "Lamentations", "Lam", "Ezekiel", "Ezek", "Daniel", "Dan", "Hosea", "Hos", "Joel", "Amos",
    "Obadiah", "Obad", "Jonah", "Micah", "Mic", "Nahum", "Nah", "Habakkuk", "Hab", "Zephaniah", "Zeph",
    "Haggai", "Hag", "Zechariah", "Zech", "Malachi", "Mal", "Matthew", "Matt", "Mark", "Luke", "John",
    "Acts", "Romans", "Rom", "1 Corinthians", "1 Cor", "2 Corinthians", "2 Cor", "Galatians", "Gal",
    "Ephesians", "Eph", "Philippians", "Phil", "Colossians", "Col", "1 Thessalonians", "1 Thess",
    "2 Thessalonians", "2 Thess", "1 Timothy", "1 Tim", "2 Timothy", "2 Tim", "Titus", "Philemon",
    "Philem", "Hebrews", "Heb", "James", "Jas", "1 Peter", "1 Pet", "2 Peter", "2 Pet", "1 John", "1 Jn",
    "2 John", "2 Jn", "3 John", "3 Jn", "Jude", "Revelation", "Rev"
  ];

  // We find if the trimmed input starts with any of the valid book names, followed by chapter numbers.
  // We sort books by length descending to match full names before abbreviations (e.g. "요한계시록" before "계")
  const sortedBooks = [...books].sort((a, b) => b.length - a.length);
  
  let matchedBook = null;
  for (const book of sortedBooks) {
    const escaped = book.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*${escaped}\\s*\\d+`, 'i');
    if (regex.test(trimmed)) {
      matchedBook = book;
      break;
    }
  }

  if (!matchedBook) {
    return { valid: false, reason: "주님의 성소에는 경건하고 바른 성경 장절 형식만 기입해 주세요. (예: 요한복음 3:16)" };
  }

  // Check if the rest of the string matches chapter:verse pattern safely
  const remaining = trimmed.substring(trimmed.toLowerCase().indexOf(matchedBook.toLowerCase()) + matchedBook.length).trim();
  
  const remainingRegex = /^[0-9장절\s:,\-~]*$/;
  if (remaining && !remainingRegex.test(remaining)) {
    return { valid: false, reason: "주님의 성소에는 경건하고 바른 성경 장절 형식만 기입해 주세요. (예: 요한복음 3:16)" };
  }

  return { valid: true };
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const normalizeBibleReference = (input) => {
  if (!input) return "";
  const trimmed = input.trim();
  const books = [
    "창세기", "창", "출애굽기", "출", "레위기", "레", "민수기", "민", "신명기", "신", 
    "여호수아", "여호", "수", "사사기", "사사", "삿", "룻기", "룻", "사무엘상", "삼상", 
    "사무엘하", "삼하", "열왕기상", "왕상", "열왕기하", "왕하", "역대기상", "대상", 
    "역대기하", "대하", "에스라", "스", "느헤미야", "느", "에스더", "에", "욥기", "욥", 
    "시편", "시", "잠언", "잠", "전도서", "전", "아가", "아", "이사야", "사", 
    "예레미야", "렘", "예레미야애가", "예레미야 애가", "애", "렘애", "에스겔", "겔", 
    "다니엘", "단", "호세아", "호", "요엘", "욜", "아모스", "암", "오바댜", "옵", 
    "요나", "욘", "미가", "미", "나훔", "나", "하박국", "합", "스바냐", "습", 
    "학개", "학", "스가랴", "슥", "말라기", "말", "마태복음", "마태", "마", 
    "마가복음", "마가", "막", "누가복음", "누가", "누", "요한복음", "요한", "요", 
    "사도행전", "행", "로마서", "롬", "고린도전서", "고전", "고린도후서", "고후", 
    "갈라디아서", "갈", "에베소서", "엡", "빌립보서", "빌", "골로새서", "골", 
    "데살로니가전서", "살전", "데살로니가후서", "살후", "디모데전서", "딤전", 
    "디모데후서", "딤후", "디도서", "딛", "빌레몬서", "몬", "히브리서", "히", 
    "야고보서", "야", "베드로전서", "벧전", "베드로후서", "벧후", "요한일서", "요일", 
    "요한이서", "요이", "요한삼서", "요삼", "유다서", "유", "요한계시록", "계시록", "계",
    "Genesis", "Gen", "Exodus", "Ex", "Leviticus", "Lev", "Numbers", "Num", "Deuteronomy", "Deut",
    "Joshua", "Josh", "Judges", "Judg", "Ruth", "1 Samuel", "1 Sam", "2 Samuel", "2 Sam",
    "1 Kings", "2 Kings", "1 Chronicles", "1 Chr", "2 Chronicles", "2 Chr",
    "Ezra", "Nehemiah", "Neh", "Esther", "Esth", "Job", "Psalms", "Ps", "Psalm", "Proverbs", "Prov",
    "Ecclesiastes", "Eccles", "Song of Songs", "Song", "Isaiah", "Isa", "Jeremiah", "Jer",
    "Lamentations", "Lam", "Ezekiel", "Ezek", "Daniel", "Dan", "Hosea", "Hos", "Joel", "Amos",
    "Obadiah", "Obad", "Jonah", "Micah", "Mic", "Nahum", "Nah", "Habakkuk", "Hab", "Zephaniah", "Zeph",
    "Haggai", "Hag", "Zechariah", "Zech", "Malachi", "Mal", "Matthew", "Matt", "Mark", "Luke", "John",
    "Acts", "Romans", "Rom", "1 Corinthians", "1 Cor", "2 Corinthians", "2 Cor", "Galatians", "Gal",
    "Ephesians", "Eph", "Philippians", "Phil", "Colossians", "Col", "1 Thessalonians", "1 Thess",
    "2 Thessalonians", "2 Thess", "1 Timothy", "1 Tim", "2 Timothy", "2 Tim", "Titus", "Philemon",
    "Philem", "Hebrews", "Heb", "James", "Jas", "1 Peter", "1 Pet", "2 Peter", "2 Pet", "1 John", "1 Jn",
    "2 John", "2 Jn", "3 John", "3 Jn", "Jude", "Revelation", "Rev"
  ];
  const sortedBooks = [...books].sort((a, b) => b.length - a.length);
  
  let matchedBook = null;
  for (const book of sortedBooks) {
    const escaped = book.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*${escaped}\\s*\\d+`, 'i');
    if (regex.test(trimmed)) {
      matchedBook = book;
      break;
    }
  }
  
  if (!matchedBook) return trimmed;
  
  const idx = trimmed.toLowerCase().indexOf(matchedBook.toLowerCase());
  const remaining = trimmed.substring(idx + matchedBook.length).trim();
  const digits = remaining.match(/\d+/g);
  if (!digits || digits.length === 0) return trimmed;
  
  const chapter = digits[0];
  if (digits.length === 1) {
    return `${matchedBook} ${chapter}`;
  } else if (digits.length === 2) {
    return `${matchedBook} ${chapter}:${digits[1]}`;
  } else {
    return `${matchedBook} ${chapter}:${digits[1]}-${digits[2]}`;
  }
};

function generateVerseImage(visualTheme) {
  const theme = (visualTheme || 'light').toLowerCase().trim();
  const imagesForTheme = CURATED_HOLY_IMAGES[theme] || CURATED_HOLY_IMAGES.light;
  return imagesForTheme[Math.floor(Math.random() * imagesForTheme.length)];
}

async function generateVerseAudio(verse, voice = 'onyx', isRetry = false) {
  try {
    const response = await fetchWithTimeout('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'tts', text: verse, voice })
    }, 6000);
    
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
  } catch (err) {
    if (!isRetry) {
      console.warn("TTS generation failed, retrying once in 1 second...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateVerseAudio(verse, voice, true);
    }
    console.warn("TTS generation failed twice, falling back to Web Speech:", err);
    return 'web-speech';
  }
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
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='192' height='256' viewBox='0 0 192 256'><rect width='100%' height='100%' fill='%231a1510'/><path d='M96 70 L96 186 M60 110 L132 110' stroke='%23DFBA73' stroke-width='8' stroke-linecap='round' opacity='0.7'/></svg>";
            }}
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
      onShareCountChange,
      onDeleteCard,
      userProfiles,
      isGlobalMuted,
      setIsGlobalMuted,
      openCommentsForCardId,
      onTriggerWebPush
    }) => {
const [isPlaying, setIsPlaying] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isThoughtOpen, setIsThoughtOpen] = useState(false);
  const [isLikingUsersOpen, setIsLikingUsersOpen] = useState(false);
  const [likingUsers, setLikingUsers] = useState([]);
  const [isLikingUsersLoading, setIsLikingUsersLoading] = useState(false);
  const [meditationText, setMeditationText] = useState(card.meditation || "");
  const [isLoadingMeditation, setIsLoadingMeditation] = useState(false);
  const isMuted = isGlobalMuted !== undefined ? isGlobalMuted : false;
  const setIsMuted = setIsGlobalMuted !== undefined ? setIsGlobalMuted : () => {};
const audioRef = useRef(null);
    const cardRef = useRef(null);
    const playCount = useRef(0);

    // v1.5.0 릴스형 인터랙션용 신규 상태 및 Refs
    const clickTimeoutRef = useRef(null);
    const likeLongPressTimerRef = useRef(null);
    const isLikeLongPressActiveRef = useRef(false);
    const [muteOverlay, setMuteOverlay] = useState(null); // 'volume-on' | 'volume-off' | null
    const [doubleTapHearts, setDoubleTapHearts] = useState([]); // [{ id, x, y }]
  
    const isLiked = likedCardsState[card.id] || false;
    const likesCount = card.likes;
  
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentsCount, setCommentsCount] = useState(card.commentCount || 0);
    const [prevCommentCount, setPrevCommentCount] = useState(card.commentCount || 0);
    const currentCommentCount = card.commentCount || 0;
    if (currentCommentCount !== prevCommentCount) {
      setCommentsCount(currentCommentCount);
      setPrevCommentCount(currentCommentCount);
    }
    const [sharesCount, setSharesCount] = useState(card.shareCount || 0);
    const [prevShareCount, setPrevShareCount] = useState(card.shareCount || 0);
    const currentShareCount = card.shareCount || 0;
    if (currentShareCount !== prevShareCount) {
      setSharesCount(currentShareCount);
      setPrevShareCount(currentShareCount);
    }
    const [replyingTo, setReplyingTo] = useState(null);
    const commentInputRef = useRef(null);
    const [longPressedCommentId, setLongPressedCommentId] = useState(null);
    const longPressTimerRef = useRef(null);
    
    // 알림/댓글/롱프레스 인터랙션용 신규 상태 훅
    const [expandedComments, setExpandedComments] = useState({});
    const [selectedNotifComment, setSelectedNotifComment] = useState(null);
    const [holdingCommentId, setHoldingCommentId] = useState(null);
    const [isCommentActionsOpen, setIsCommentActionsOpen] = useState(false);

    // 댓글 더블 탭(빠른 두 번 터치) 감지 참조 맵 및 감지기
    const commentTaps = useRef({});
    const handleCommentDoubleTap = (commentId, e) => {
      e.stopPropagation();
      const now = Date.now();
      const lastTapTime = commentTaps.current[commentId] || 0;
      const DOUBLE_TAP_DELAY = 300; // 300ms 이내 터치 시 더블 탭 감지
      
      if (now - lastTapTime < DOUBLE_TAP_DELAY) {
        // 더블 탭 판별 완료! -> 좋아요 토글 수행
        handleToggleCommentLike(commentId);
        commentTaps.current[commentId] = 0; // 타임스탬프 리셋
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }
      } else {
        commentTaps.current[commentId] = now;
      }
    };

    // 댓글 좋아요 토글 비동기 함수 (DB comments 테이블 우회 활용)
    const handleToggleCommentLike = async (commentId) => {
      if (!user || !user.id) {
        onShowToast("로그인이 필요한 서비스입니다.", "error");
        return;
      }

      try {
        // DB를 직접 조회하여 React 상태 지연(Lag)에 무관하게 실시간 무결 공감 판독 진행
        const { data: existingLikes, error: checkError } = await supabase
          .from('comments')
          .select('id')
          .eq('card_id', card.id)
          .eq('user_id', user.id)
          .eq('comment_text', `__BIBLEGRAM_COMMENT_LIKE__:${commentId}`);

        if (checkError) throw checkError;

        const isCurrentlyLiked = existingLikes && existingLikes.length > 0;

        if (isCurrentlyLiked) {
          // 좋아요 취소: 존재하는 모든 중복 공감 행을 일괄 소멸시켜 적체 방지
          await supabase
            .from('comments')
            .delete()
            .eq('card_id', card.id)
            .eq('user_id', user.id)
            .eq('comment_text', `__BIBLEGRAM_COMMENT_LIKE__:${commentId}`);
            
          // 좋아요 취소 시 기존 알림도 함께 삭제하여 유령 알림 방지 및 불필요한 알림 차단
          const targetComment = (comments || []).find(c => c.id === commentId);
          if (targetComment && targetComment.user_id) {
            await supabase
              .from('comments')
              .delete()
              .eq('card_id', card.id)
              .eq('user_id', user.id)
              .eq('comment_text', `__BIBLEGRAM_NOTIF__:like:${targetComment.user_id}`);
          }
        } else {
          // 좋아요 등록
          await supabase
            .from('comments')
            .insert({
              card_id: card.id,
              user_id: user.id,
              author_nickname: nickname || user.nickname || "성도",
              comment_text: `__BIBLEGRAM_COMMENT_LIKE__:${commentId}`
            });
            
          // 좋아요 알림 insert 발송 (내 댓글에 내가 다는 하트는 제외)
          const targetComment = (comments || []).find(c => c.id === commentId);
          if (targetComment && targetComment.user_id && String(targetComment.user_id) !== String(user.id)) {
            await supabase.from('comments').insert({
              card_id: card.id,
              user_id: user.id,
              author_nickname: nickname || user.nickname || "성도",
              comment_text: `__BIBLEGRAM_NOTIF__:like:${targetComment.user_id}`
            });
            if (onTriggerWebPush) {
              onTriggerWebPush(targetComment.user_id, 'like', '', card.id, card.image);
            }
          }
        }
        await fetchComments();
      } catch (err) {
        console.error("Error toggling comment like:", err);
        onShowToast("공감 처리 중 일시적인 오류가 발생했습니다.", "error");
      }
    };

    useEffect(() => {
      if (replyingTo && commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, [replyingTo]);

    useEffect(() => {
      if (card && card.autoOpenComments) {
        setIsCommentsOpen(true);
        fetchComments();
        try {
          card.autoOpenComments = false;
        } catch (e) {
          console.error("autoOpenComments reset error:", e);
        }
      }
    }, [card, card?.id, card?.autoOpenComments]);

  const fetchLikingUsers = async () => {
    if (isLikingUsersLoading) return;
    setIsLikingUsersLoading(true);
    setLikingUsers([]);
    setIsLikingUsersOpen(true);
    try {
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('user_id')
        .eq('card_id', card.id);
      
      if (likesError) throw likesError;
      
      if (!likesData || likesData.length === 0) {
        setLikingUsers([]);
        return;
      }
      
      const userIds = likesData.map(l => l.user_id);
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, nickname, profile_image')
        .in('id', userIds);
        
      if (usersError) throw usersError;
      
      setLikingUsers(usersData || []);
    } catch (err) {
      console.error("Failed to fetch liking users:", err);
      onShowToast("공감한 성도 목록을 불러오지 못했습니다.", "error");
    } finally {
      setIsLikingUsersLoading(false);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onToggleLikeGlobal(card.id);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLikeLongPressActiveRef.current) {
      isLikeLongPressActiveRef.current = false;
      return;
    }
    handleLike(e);
  };

  const handleLikePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isLikeLongPressActiveRef.current = false;
    
    if (likeLongPressTimerRef.current) {
      clearTimeout(likeLongPressTimerRef.current);
    }
    
    likeLongPressTimerRef.current = setTimeout(() => {
      isLikeLongPressActiveRef.current = true;
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
      fetchLikingUsers();
    }, 700);
  };

  const handleLikePointerUp = (e) => {
    if (likeLongPressTimerRef.current) {
      clearTimeout(likeLongPressTimerRef.current);
      likeLongPressTimerRef.current = null;
    }
  };

  const handleLikePointerLeave = () => {
    if (likeLongPressTimerRef.current) {
      clearTimeout(likeLongPressTimerRef.current);
      likeLongPressTimerRef.current = null;
    }
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

  const handleShareClick = async (e) => {
    e.stopPropagation();
    
    // 기기 공유 UI 트리거
    handleDeviceShare(e);

    // 로그인된 사용자에 한해 1인 1회 카운팅
    if (!user) return;
    
    const localSharedKey = `biblegram_shared_${card.id}_${user.id}`;
    const alreadySharedLocal = localStorage.getItem(localSharedKey) === 'true';
    if (alreadySharedLocal) return;

    try {
      // 1. 이미 DB에 공유 정보(__BIBLEGRAM_SHARE_ACTION__)가 있는지 검색
      const { data: existingShare, error: checkError } = await supabase
        .from('comments')
        .select('id')
        .eq('card_id', card.id)
        .eq('user_id', user.id)
        .eq('comment_text', '__BIBLEGRAM_SHARE_ACTION__')
        .limit(1);

      if (checkError) throw checkError;

      if (existingShare && existingShare.length > 0) {
        localStorage.setItem(localSharedKey, 'true');
        return;
      }

      // 2. DB에 공유 카운트용 특별 댓글 삽입
      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          card_id: card.id,
          user_id: user.id,
          author_nickname: nickname || '은혜나눔인',
          comment_text: '__BIBLEGRAM_SHARE_ACTION__'
        });

      if (insertError) throw insertError;

      // 3. 로컬 및 전역 상태 동기화 및 캐싱
      const nextVal = sharesCount + 1;
      setSharesCount(nextVal);
      localStorage.setItem(localSharedKey, 'true');
      if (onShareCountChange) onShareCountChange(card.id, nextVal);
    } catch (err) {
      console.error("Error updating share count:", err);
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
        const filteredComments = (data || []).filter(c => 
          c.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
          !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__')
        );
        setComments(filteredComments);
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
        
        // 실시간 알림 insert 연동 (기존 DB 구조 우회)
        try {
          if (replyingTo) {
            if (String(replyingTo.user_id) !== String(user.id)) {
              const cleanText = data.comment_text.replace(/@[^\s]+\s?/, '');
              await supabase.from('comments').insert({
                card_id: card.id,
                user_id: user.id,
                author_nickname: nickname || "성도",
                comment_text: `__BIBLEGRAM_NOTIF__:reply:${replyingTo.user_id}:${cleanText}`,
                parent_id: data.id
              });
              if (onTriggerWebPush) {
                onTriggerWebPush(replyingTo.user_id, 'reply', cleanText, card.id, card.image);
              }
            }
          } else {
            if (card.author_id && String(card.author_id) !== String(user.id)) {
              await supabase.from('comments').insert({
                card_id: card.id,
                user_id: user.id,
                author_nickname: nickname || "성도",
                comment_text: `__BIBLEGRAM_NOTIF__:comment:${card.author_id}:${data.comment_text}`
              });
              if (onTriggerWebPush) {
                onTriggerWebPush(card.author_id, 'comment', data.comment_text, card.id, card.image);
              }
            }
          }
        } catch (notifErr) {
          console.error("Failed to insert comment notification:", notifErr);
        }
        
        // 실제 유효 일반 댓글 수 집계 및 DB/로컬 강제 동기화
        const { data: dbComments, error: fetchErr } = await supabase
          .from('comments')
          .select('comment_text')
          .eq('card_id', card.id);
        
        if (!fetchErr && dbComments) {
          const actualCount = dbComments.filter(c => 
            c.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
            !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
            !c.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
          ).length;
          
          await supabase
            .from('cards')
            .update({ comment_count: actualCount })
            .eq('id', card.id);
            
          setCommentsCount(actualCount);
          if (onCommentCountChange) onCommentCountChange(card.id, actualCount);
        } else {
          const nextVal = commentsCount + 1;
          setCommentsCount(nextVal);
          if (onCommentCountChange) onCommentCountChange(card.id, nextVal);
        }
        
        onShowToast("은혜로운 댓글이 등록되었습니다.", "success");
      } catch (err) {
        console.error("Error posting comment:", err);
        onShowToast("댓글 등록에 실패했습니다. 다시 시도해 주세요.", "error");
      }
    };

    const handleDeleteComment = async (commentId) => {
      // 0. 댓글 작성자 또는 게시물 작성자 본인 여부 검증 진행
      const targetComment = comments.find(c => c.id === commentId);
      if (!targetComment) {
        onShowToast("댓글을 찾을 수 없습니다.", "error");
        return;
      }

      const isAdmin = user && (String(user.id) === '4908447829' || user.email === 'wlstlfdl11@kakao.com' || nickname === '오띵');
      const isCommentAuthor = String(targetComment.user_id) === String(user.id);
      const isCardAuthor = String(card.author_id) === String(user.id);

      if (!isCommentAuthor && !isCardAuthor && !isAdmin) {
        onShowToast("댓글 삭제 권한이 없습니다.", "error");
        return;
      }

      // 0. 삭제될 댓글 목록 및 카운트 로컬 선확보
      const deletedCount = comments.filter(c => c.id === commentId || c.parent_id === commentId).length;
      
      // 1. 로컬 UI 상태를 즉시 무소음 선반영 삭제 (게스트 계정/RLS 차단 시에도 화면엔 즉시 삭제 보장!)
      setComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId));

      try {
        // 2. Supabase DB 상에서 동시에 영구 소멸 시도
        const { error } = await supabase
          .from('comments')
          .delete()
          .or(`id.eq.${commentId},parent_id.eq.${commentId}`);
        
        if (error) {
          console.warn("DB RLS Guard triggered, falling back to local deletion:", error);
        }
        
        // 실제 유효 일반 댓글 수 집계 및 DB/로컬 강제 동기화
        const { data: dbComments, error: fetchErr } = await supabase
          .from('comments')
          .select('comment_text')
          .eq('card_id', card.id);
        
        if (!fetchErr && dbComments) {
          const actualCount = dbComments.filter(c => 
            c.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
            !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
            !c.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
          ).length;
          
          await supabase
            .from('cards')
            .update({ comment_count: actualCount })
            .eq('id', card.id);
            
          setCommentsCount(actualCount);
          if (onCommentCountChange) onCommentCountChange(card.id, actualCount);
        } else {
          const nextVal = Math.max(0, commentsCount - deletedCount);
          setCommentsCount(nextVal);
          if (onCommentCountChange) onCommentCountChange(card.id, nextVal);
        }
        
        onShowToast("댓글이 삭제되었습니다.", "success");
      } catch (err) {
        console.error("Error deleting comment:", err);
        // 에러가 나더라도 로컬 상태 카운트는 감차 유지하여 무결화
        const nextVal = Math.max(0, commentsCount - deletedCount);
        setCommentsCount(nextVal);
        if (onCommentCountChange) onCommentCountChange(card.id, nextVal);
        onShowToast("댓글이 삭제되었습니다.", "success");
      }
    };
const handleAudioEnded = () => {
    setIsPlaying(false);
    playCount.current = 0; 
  };

  const speakWebSpeech = (forceUnmute = false) => {
    if (!window.speechSynthesis) {
      console.warn("Web Speech synthesis is not supported in this browser.");
      setIsPlaying(false);
      return;
    }
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
      if (openCommentsForCardId && String(openCommentsForCardId) === String(card.id)) {
        setIsCommentsOpen(true);
        fetchComments();
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }, [openCommentsForCardId, card.id]);

  useEffect(() => {
    if (isPreview) {
      // 결과 미리보기(Preview) 진입 시 강제로 오디오 및 음성(Web Speech)을 재생하려다 
      // 브라우저의 미디어 정책(Autoplay block) 오류로 인해 스크립트 실행이 중단되고 
      // 화면이 블랙아웃되는 치명적인 버그를 해결합니다.
      // 오직 사용자가 직접 재생 버튼을 터치하여 클릭할 때만 소리가 재생되도록 제한합니다.
      setIsPlaying(false);
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
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            // 피드 스크롤 이탈 시 모든 오버레이 서랍 자동 닫기
            setIsCommentsOpen(false);
            setIsThoughtOpen(false);
            setIsMeditationOpen(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) observer.observe(currentCardRef);
    return () => {
      if (currentCardRef) observer.unobserve(currentCardRef);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, card.audio, isMuted]);

  const handlePlayButtonClick = (e) => {
    e.stopPropagation(); // 카드 전체 클릭으로 버블링 차단 ➡️ 음소거 오동작 원천 방지!
    playCount.current = 0;
    playAudio();
  };

  const handleCardClick = (e) => {
    // 오버레이 서랍들(댓글, 고백, 묵상해설)이 열려 있다면, 클릭 시 닫기만 우선 처리 (더블탭/싱글탭 센싱 무시)
    if (isMeditationOpen || isThoughtOpen || isCommentsOpen) {
      setIsMeditationOpen(false);
      setIsThoughtOpen(false);
      setIsCommentsOpen(false);
      return;
    }

    e.stopPropagation();

    // 4번 피드백: 말씀 생성 프리뷰(isPreview)일 때의 동작 격리 (좋아요/더블탭 차단 및 수동 재생/일시정지 복원)
    if (isPreview) {
      if (isPlaying) {
        if (audioRef.current) audioRef.current.pause();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        playAudio();
      }
      return;
    }

    if (clickTimeoutRef.current) {
      // 1. 더블 탭 센싱 성공! -> 좋아요 반영 및 황금빛 입자 효과 트리거
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;

      // 마우스/터치 위치 좌표 계산
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newHeart = { id: Date.now(), x, y };
      setDoubleTapHearts(prev => [...prev, newHeart]);

      // 좋아요 API 및 전역 상태 갱신 발화
      onToggleLikeGlobal(card.id);

      // 미세 햅틱 진동 피드백 (모바일 지원 환경용)
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }

      // 1.4초 후 더블 탭 이펙트 메모리 청소 (Heavenly Gravity Fall 1.4초 비산량에 맞춤)
      setTimeout(() => {
        setDoubleTapHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1400);

    } else {
      // 2. 첫 번째 탭 감지 -> 300ms 딜레이 대기
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;

        // 싱글 탭: 음소거/해제 토글 및 1회 완독 중 멈춤 개입 전면 배제!
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        
        if (audioRef.current) {
          audioRef.current.muted = nextMuted;
        }

        if (isPlaying) {
          // 재생 중일 때는 오디오 타임라인 멈춤 없이 소리만 켜고 끈다.
          if (nextMuted) {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
          } else {
            // 다시 소리를 켤 때 Web Speech 상태 복구
            const useWebSpeech = !card.audio || card.audio === 'web-speech';
            if (useWebSpeech) {
              speakWebSpeech(true);
            }
          }
        } else {
          // 낭독이 완전히 정지된 상태일 때 싱글 탭 시 처음부터 다시 1회 완독 시작
          if (!nextMuted) {
            playAudio();
          }
        }

        // 중앙 볼륨 오버레이 점등 (0.4초간)
        setMuteOverlay(nextMuted ? 'volume-off' : 'volume-on');
        setTimeout(() => {
          setMuteOverlay(null);
        }, 400);
      }, 300);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    
    // 재생 상태일 때는 pause하지 않고 부드럽게 소리 토글만 동기화
    if (isPlaying) {
      if (nextMuted) {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      } else {
        const useWebSpeech = !card.audio || card.audio === 'web-speech';
        if (useWebSpeech) {
          speakWebSpeech(true);
        }
      }
    } else {
      if (!nextMuted) {
        playAudio();
      }
    }

    // 중앙 볼륨 오버레이 점등 (0.4초간)
    setMuteOverlay(nextMuted ? 'volume-off' : 'volume-on');
    setTimeout(() => {
      setMuteOverlay(null);
    }, 400);
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
      id={`card-${card.id}`}
      className="relative w-full h-full snap-start bg-[#030303] overflow-hidden cursor-pointer select-none" 
      onClick={handleCardClick}
    >
      {/* v1.5.0 릴스형 인터랙션 전용 CSS3 하드웨어 가속 스타일 */}
      <style>{`
        @keyframes heart-pop {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          15% { transform: scale(1.3) rotate(0deg); opacity: 1; }
          30% { transform: scale(0.95); opacity: 1; }
          70% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        @keyframes gold-particle {
          0% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
            opacity: 1; 
          }
          35% {
            opacity: 1;
          }
          70% {
            opacity: 0.85;
          }
          100% { 
            transform: translate(calc(var(--dest-x) + var(--sway-x)), calc(var(--dest-y) + var(--fall-y))) scale(0) rotate(360deg); 
            opacity: 0; 
          }
        }
        @keyframes mute-pop {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          15% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
          80% { transform: translate(-50%, -50%) scale(1); opacity: 0.95; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        }
        .animate-heart-pop {
          animation: heart-pop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-gold-particle {
          animation: gold-particle 1.4s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }
        .animate-mute-pop {
          animation: mute-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* 상단 중앙 (Dynamic Island 위치) 0.4초 황금 볼륨 아이콘 배지 (정중앙 겹침 영구 박멸) */}
      {muteOverlay && (
        <div className="absolute top-[calc(76px+env(safe-area-inset-top))] left-1/2 z-50 pointer-events-none animate-mute-pop bg-[#0c0c0ce0] backdrop-blur-2xl border border-[#DFBA73]/40 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-[0_12px_32px_rgba(0,0,0,0.75),_0_0_15px_rgba(223,186,115,0.2)] transition-all">
          <span className="text-[#DFBA73] scale-[1.1] drop-shadow-[0_0_6px_rgba(223,186,115,0.5)]">
            {muteOverlay === 'volume-on' ? <Icons.Volume /> : <Icons.VolumeX />}
          </span>
          <span className="text-[#DFBA73] text-[11.5px] font-sans font-bold tracking-wider">
            {muteOverlay === 'volume-on' ? "소리 켬" : "음소거"}
          </span>
        </div>
      )}

      {/* 낭독 정막(일시정지/정지) 상태이고 프리뷰가 아닐 때 정중앙에 은은하게 황금빛으로 박동하는 플레이 뱃지 (단독 탭 전용 버블링 방어막 탑재) */}
      {!isPlaying && !isPreview && (
        <div 
          onClick={handlePlayButtonClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto cursor-pointer flex items-center justify-center active:scale-90 transition-transform duration-200"
        >
          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-md text-[#DFBA73] border border-[#DFBA73]/30 shadow-2xl scale-95 animate-pulse">
            <div className="ml-0.5"><Icons.Play /></div>
          </div>
        </div>
      )}

      {/* 더블 탭 황금빛 하트 & 파티클 입자 방사 */}
      {doubleTapHearts.map((heart) => (
        <div 
          key={heart.id}
          className="absolute pointer-events-none z-50 flex items-center justify-center"
          style={{ left: heart.x - 50, top: heart.y - 50, width: 100, height: 100 }}
        >
          {/* 중앙 황금빛 하트 */}
          <div className="absolute text-[#DFBA73] animate-heart-pop text-[52px] drop-shadow-[0_0_20px_rgba(223,186,115,0.95)]">
            ❤️
          </div>
          {/* 주변 황금빛 입자들 (28방향 성스러운 낙하 분사) */}
          {[...Array(28)].map((_, i) => {
            const angle = (i * 360) / 28 + (Math.random() * 12 - 6);
            const delay = (i % 4) * 0.04;
            const distance = 40 + Math.random() * 50; // 초기 비산 반경
            const fallY = 90 + Math.random() * 80; // 은혜의 낙하량 대폭 확대
            const swayX = Math.random() * 60 - 30; // 좌우 나풀거림
            const sizeClass = i % 3 === 0 ? 'w-2.5 h-2.5' : i % 3 === 1 ? 'w-1.5 h-1.5' : 'w-1 h-1';
            const angleRad = (angle * Math.PI) / 180;
            const destX = Math.cos(angleRad) * distance;
            const destY = Math.sin(angleRad) * distance;
            const colorClass = i % 3 === 0 
              ? 'from-[#DFBA73] to-[#FFFDF9]' 
              : i % 3 === 1 
              ? 'from-[#FFE5B4] to-[#FFFDF9]' 
              : 'from-[#FFFFFF] to-[#DFBA73]';
            return (
              <div 
                key={i}
                className={`absolute rounded-full bg-gradient-to-r ${colorClass} animate-gold-particle opacity-0 drop-shadow-[0_0_6px_rgba(223,186,115,0.95)] ${sizeClass}`}
                style={{
                  '--dest-x': `${destX}px`,
                  '--dest-y': `${destY}px`,
                  '--fall-y': `${fallY}px`,
                  '--sway-x': `${swayX}px`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>
      ))}

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
      {user && (String(user.id) === String(card.author_id) || String(user.id) === '4908447829' || nickname === '오띵') && !isPreview && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDeleteCard(card.id); }}
          className="absolute top-[calc(114px+env(safe-area-inset-top))] right-4 z-30 p-2.5 rounded-full bg-red-950/50 hover:bg-red-950/80 border border-red-500/20 text-red-400 active:scale-95 transition-all"
          title="말씀 카드 삭제"
        >
          <Icons.Trash />
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
                onClick={handleLikeClick} 
                onPointerDown={handleLikePointerDown}
                onPointerUp={handleLikePointerUp}
                onPointerLeave={handleLikePointerLeave}
                onPointerCancel={handleLikePointerLeave}
                onContextMenu={(e) => e.preventDefault()}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all select-none"
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
                onClick={handleShareClick}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                  <Icons.Share />
                </div>
                <span className="text-[10px] text-white/80 font-medium tracking-tight">{sharesCount}</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(card); }}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-[#DFBA73] active:scale-90 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg hover:border-[#DFBA73]/40">
                  <Icons.Bookmark filled={isSaved} />
                </div>
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
        
        {/* 마음에 새기기 버튼 및 하단 보더를 말끔히 걷어내고, 영적 고백 본문의 패딩과 크기를 기품 있게 최적화 (성도님의 고고한 가독성 확보) */}
        <div className="text-[#FFFDF9] text-[15px] leading-[1.85] font-myeongjo whitespace-pre-wrap max-h-[35vh] overflow-y-auto hide-scrollbar mt-1 pl-1 pr-1">
          <p className="opacity-95 tracking-wide leading-relaxed pl-1.5 border-l-2 border-[#DFBA73]/35 text-stone-200/90 italic devotion-thought-text">
            "{card.userThought}"
          </p>
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
              // 댓글 좋아요 및 일반 댓글 분할 맵핑 알고리즘
              const normalComments = [];
              const commentLikesMap = {};
              const myLikedCommentsMap = {};
              const myIdStr = user ? String(user.id) : '';

              (comments || []).forEach(c => {
                if (c.comment_text && c.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:') && !c.comment_text.includes('__BIBLEGRAM_NOTIF__')) {
                  const commentIdStr = c.comment_text.split(':')[1];
                  const commentId = commentIdStr ? Number(commentIdStr) : null;
                  if (commentId) {
                    commentLikesMap[commentId] = (commentLikesMap[commentId] || 0) + 1;
                    if (String(c.user_id) === myIdStr) {
                      myLikedCommentsMap[commentId] = c.id;
                    }
                  }
                } else if (c.comment_text && !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__')) {
                  normalComments.push(c);
                }
              });

              const parentComments = normalComments.filter(c => !c.parent_id);
              const repliesMap = normalComments.reduce((acc, c) => {
                if (c.parent_id) {
                  if (!acc[c.parent_id]) acc[c.parent_id] = [];
                  acc[c.parent_id].push(c);
                }
                return acc;
              }, {});

              // 롱프레스 감지 헬퍼
              const startLongPress = (cObj) => {
                setHoldingCommentId(cObj.id);
                longPressTimerRef.current = setTimeout(() => {
                  if ('vibrate' in navigator) {
                    navigator.vibrate(15);
                  }
                  setSelectedNotifComment(cObj);
                  setIsCommentActionsOpen(true);
                  setHoldingCommentId(null);
                }, 500);
              };

              const cancelLongPress = () => {
                setHoldingCommentId(null);
                clearTimeout(longPressTimerRef.current);
              };

              return parentComments.map(parent => {
                const replies = repliesMap[parent.id] || [];
                const isExpanded = expandedComments[parent.id] || false;

                return (
                  <div key={parent.id} className="flex flex-col gap-2">
                    {/* 부모 댓글 카드 - 롱프레스 테두리 피드백 걷어내고 심플화 & 더블 탭 단독 매핑 (중복 호출 제거) */}
                    <div 
                      className="relative flex flex-col py-2.5 px-3.5 bg-transparent border border-transparent rounded-2xl select-none"
                      onTouchStart={() => startLongPress(parent)}
                      onTouchEnd={cancelLongPress}
                      onTouchCancel={cancelLongPress}
                      onMouseDown={() => startLongPress(parent)}
                      onMouseUp={cancelLongPress}
                      onMouseLeave={cancelLongPress}
                      onClick={(e) => handleCommentDoubleTap(parent.id, e)}
                    >
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[#DFBA73] text-[12px] font-bold">{parent.author_nickname}</span>
                        <span className="text-[9px] text-white/35 font-sans">{formatCommentTime(parent.created_at)}</span>
                      </div>
                      <p className="text-stone-200 text-[12.5px] tracking-wide leading-relaxed mt-0.5 break-all devotion-comment-text text-left font-sans pr-1 select-none">
                        {parent.comment_text}
                      </p>
                      
                      {/* 댓글 제어 하단 바 (답글 달기 + 하트 공감 평행 배치) */}
                      <div className="flex items-center justify-between mt-1.5 pr-0.5 shrink-0">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyingTo({ id: parent.id, nickname: parent.author_nickname, parent_id: parent.id });
                            }}
                            className="text-[10px] text-white/40 hover:text-[#DFBA73] transition-colors font-bold"
                          >
                            답글 달기
                          </button>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCommentLike(parent.id);
                          }}
                          className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-red-400 active:scale-90 transition-all font-sans font-bold py-1 px-1.5 rounded-lg hover:bg-white/[0.02]"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="11" 
                            height="11" 
                            viewBox="0 0 24 24" 
                            fill={myLikedCommentsMap[parent.id] ? "#ef4444" : "none"} 
                            stroke={myLikedCommentsMap[parent.id] ? "#ef4444" : "currentColor"} 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                          </svg>
                          {commentLikesMap[parent.id] > 0 && (
                            <span className="text-stone-400 font-semibold">{commentLikesMap[parent.id]}</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 대댓글 아코디언 토글 섹션 */}
                    {replies.length > 0 && (
                      <div className="flex flex-col gap-2 mt-0.5">
                        <button
                          type="button"
                          onClick={() => setExpandedComments(prev => ({ ...prev, [parent.id]: !isExpanded }))}
                          className="flex items-center gap-2.5 pl-6 ml-3.5 text-[10px] text-white/35 hover:text-stone-300 font-extrabold py-1.5 transition-colors text-left"
                        >
                          <span className="w-5 h-[1px] bg-white/15 inline-block"></span>
                          <span>{isExpanded ? '답글 숨기기' : `답글 ${replies.length}개 더 보기`}</span>
                        </button>

                        {isExpanded && replies.map(reply => (
                          <div 
                            key={reply.id} 
                            className="relative flex flex-col py-2 px-3 pl-8 ml-6 border-l border-[#DFBA73]/15 bg-transparent rounded-2xl select-none"
                            onTouchStart={() => startLongPress(reply)}
                            onTouchEnd={cancelLongPress}
                            onTouchCancel={cancelLongPress}
                            onMouseDown={() => startLongPress(reply)}
                            onMouseUp={cancelLongPress}
                            onMouseLeave={cancelLongPress}
                            onClick={(e) => handleCommentDoubleTap(reply.id, e)}
                          >
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-[#DFBA73]/90 text-[11px] font-bold">{reply.author_nickname}</span>
                              <span className="text-[9px] text-white/35 font-sans">{formatCommentTime(reply.created_at)}</span>
                            </div>
                            <p className="text-stone-300 text-[12px] tracking-wide leading-relaxed mt-0.5 break-all devotion-comment-text text-left font-sans pr-1">
                              {reply.comment_text}
                            </p>
                            
                            {/* 대댓글 제어 하단 바 (답글 달기 + 하트 공감 평행 배치) */}
                            <div className="flex items-center justify-between mt-1.5 pr-0.5 shrink-0">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReplyingTo({ id: reply.id, nickname: reply.author_nickname, parent_id: parent.id });
                                  }}
                                  className="text-[9.5px] text-white/40 hover:text-[#DFBA73] transition-colors font-bold"
                                >
                                  답글 달기
                                </button>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCommentLike(reply.id);
                                }}
                                className="flex items-center gap-1.5 text-[9.5px] text-white/40 hover:text-red-400 active:scale-90 transition-all font-sans font-bold py-0.5 px-1.5 rounded-lg hover:bg-white/[0.02]"
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="10" 
                                  height="10" 
                                  viewBox="0 0 24 24" 
                                  fill={myLikedCommentsMap[reply.id] ? "#ef4444" : "none"} 
                                  stroke={myLikedCommentsMap[reply.id] ? "#ef4444" : "currentColor"} 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                >
                                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                </svg>
                                {commentLikesMap[reply.id] > 0 && (
                                  <span className="text-stone-400 font-semibold">{commentLikesMap[reply.id]}</span>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              });
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

        {/* 인스타그램식 플로팅 콘텍스트 팝업 박스 (바텀시트 폐기 및 오버레이 박스 격상) */}
        {isCommentActionsOpen && selectedNotifComment && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center pointer-events-auto animate-fade-in"
            onClick={() => {
              setIsCommentActionsOpen(false);
              setSelectedNotifComment(null);
            }}
          >
            <div 
              className="w-64 bg-[#1c1815]/98 border border-[#DFBA73]/30 rounded-[28px] overflow-hidden animate-zoom-in shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {/* 1. 내가 작성한 댓글이거나 게시글 작성자인 경우 삭제 옵션 제공 */}
                {user && (String(user.id) === String(selectedNotifComment.user_id) || String(card.author_id) === String(user.id) || String(user.id) === '4908447829' || nickname === '오띵') && (
                  <button
                    onClick={async () => {
                      setIsCommentActionsOpen(false);
                      await handleDeleteComment(selectedNotifComment.id);
                      setSelectedNotifComment(null);
                    }}
                    className="w-full py-4 text-center text-[#ff4d4d] hover:bg-white/[0.03] active:bg-white/[0.05] border-b border-white/5 text-[13.5px] font-sans font-extrabold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                    </svg>
                    댓글 삭제
                  </button>
                )}

                {/* 2. 신고하기 버튼 (인스타그램 감성) */}
                <button
                  onClick={() => {
                    setIsCommentActionsOpen(false);
                    setSelectedNotifComment(null);
                    onShowToast("해당 댓글이 정상적으로 신고 접수되었습니다. 깨끗한 성소를 위해 신속히 검토하겠습니다.", "success");
                  }}
                  className="w-full py-4 text-center text-[#ff4d4d] hover:bg-white/[0.03] active:bg-white/[0.05] border-b border-white/5 text-[13.5px] font-sans font-extrabold transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  신고
                </button>

                {/* 3. 취소 버튼 */}
                <button
                  onClick={() => {
                    setIsCommentActionsOpen(false);
                    setSelectedNotifComment(null);
                  }}
                  className="w-full py-4 text-center text-stone-300 hover:bg-white/[0.03] active:bg-white/[0.05] text-[13.5px] font-sans font-extrabold transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 말씀 공감 성도 명단 바텀 시트 */}
        <div 
          className={`absolute bottom-[calc(76px+env(safe-area-inset-bottom))] left-0 right-0 bg-[#0c0a08]/98 backdrop-blur-2xl border-t border-[#DFBA73]/30 rounded-t-[32px] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-50 p-6 pb-8 flex flex-col gap-4 shadow-[0_-15px_50px_rgba(0,0,0,0.85)] ${isLikingUsersOpen ? 'translate-y-0 opacity-100' : 'translate-y-[130%] opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setIsLikingUsersOpen(false)} 
            className="absolute top-5 right-5 text-[#DFBA73]/60 hover:text-white transition-colors p-1"
          >
            <Icons.Close />
          </button>
          
          <div className="flex flex-col items-center mb-2">
            <div className="p-2 bg-[#DFBA73]/10 rounded-full text-[#DFBA73] border border-[#DFBA73]/20 mb-1">
              <Icons.Heart filled={true} />
            </div>
            <h3 className="text-[#DFBA73] font-myeongjo font-bold text-lg tracking-wide">공감한 성도님들</h3>
            <p className="text-white/40 text-[10px] tracking-tight mt-0.5">이 말씀 카드에 마음을 모아 공감한 성도 명단입니다.</p>
          </div>
          
          <div className="text-[#F4EFE6] text-[13.5px] leading-[1.8] font-sans max-h-[36vh] overflow-y-auto hide-scrollbar pr-1 border-b border-white/5 pb-4 flex flex-col gap-3">
            {isLikingUsersLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-6 h-6 border-[2px] border-[#DFBA73]/20 border-t-[#DFBA73] rounded-full animate-spin"></div>
                <span className="text-white/50 text-[11px] animate-pulse">명단을 불러오고 있습니다...</span>
              </div>
            ) : likingUsers.length === 0 ? (
              <p className="text-center text-white/30 py-8 text-xs font-myeongjo">아직 공감한 성도가 없습니다.</p>
            ) : (
              likingUsers.map((u) => (
                <div 
                  key={u.id}
                  className="flex items-center gap-3.5 py-2.5 px-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] transition-colors text-left"
                >
                  {u.profile_image ? (
                    <img 
                      src={u.profile_image} 
                      alt={u.nickname} 
                      className="w-9 h-9 rounded-full object-cover border border-[#DFBA73]/30"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/favicon.svg'; }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#DFBA73]/10 border border-[#DFBA73]/20 flex items-center justify-center text-[#DFBA73] font-bold text-sm">
                      {u.nickname ? u.nickname.charAt(0) : "성"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-stone-200 text-sm font-bold tracking-wide">{u.nickname || "은혜의 성도"}</span>
                    <span className="text-[9.5px] text-[#DFBA73]/70 font-sans mt-0.5">말씀의 동반자</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => setIsLikingUsersOpen(false)}
            className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-[12px] transition-colors font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    );
  };
// ==========================================
// 6.4. 성스러운 빛 벡터 SVG 스플래시 오프닝 뷰 (이미지 시안과 100% 일치하는 리마스터 버전)
// ==========================================
const SplashView = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);
  const done = useRef(false);
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate twinkling background stars
    const generatedStars = [...Array(35)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${1 + Math.random() * 2}px`,
      delay: `${Math.random() * -5}s`,
      duration: `${2 + Math.random() * 3}s`
    }));
    setStars(generatedStars);

    // Generate gold rising stardust particles
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      size: `${1.5 + Math.random() * 3}px`,
      delay: `${Math.random() * -6}s`,
      duration: `${4 + Math.random() * 4}s`
    }));
    setParticles(generatedParticles);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    const finishTimer = setTimeout(() => {
      if (!done.current) {
        done.current = true;
        onFinish();
      }
    }, 3800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'radial-gradient(circle at 50% 45%, #18171d 0%, #0d0c10 50%, #050507 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: isExiting ? 0 : 1,
      transform: isExiting ? 'scale(3.5) translateZ(200px)' : 'scale(1) translateZ(0)',
      filter: isExiting ? 'blur(16px)' : 'none',
      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s ease-in-out',
      pointerEvents: 'none',
      perspective: '1000px'
    }}>
      <style>{`
        @keyframes drawOuter {
          0% { stroke-dashoffset: 350; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawInner {
          0% { stroke-dashoffset: 250; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawSpine {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.45; filter: blur(35px); }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.65; filter: blur(45px); }
        }
        @keyframes fadeInSlideUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatParticles {
          0% { transform: translateY(100vh) translateX(0) scale(0.5); opacity: 0; }
          30% { opacity: 0.8; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(40px) scale(1.3); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes book3DOpen {
          0% { transform: rotateX(25deg) rotateY(-35deg) scale(0.8); opacity: 0; }
          45% { transform: rotateX(10deg) rotateY(-10deg) scale(0.95); opacity: 0.9; }
          100% { transform: rotateX(0deg) rotateY(0deg) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Twinkling background stars */}
      {stars.map((star) => (
        <div 
          key={`star-${star.id}`}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            animation: `twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
            opacity: 0.6,
            zIndex: 1
          }}
        />
      ))}

      {/* Floating stardust particles */}
      {particles.map((particle) => (
        <div 
          key={`particle-${particle.id}`}
          style={{
            position: 'absolute',
            left: particle.left,
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, #FFE8C4 0%, rgba(216,175,101,0.2) 100%)',
            borderRadius: '50%',
            filter: 'drop-shadow(0 0 5px #D8AF65)',
            animation: `floatParticles ${particle.duration}s linear infinite`,
            animationDelay: particle.delay,
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
      ))}

      {/* Glow Aura */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(216,175,101,0.24) 0%, rgba(216,175,101,0.06) 45%, rgba(0,0,0,0) 75%)',
        borderRadius: '50%',
        animation: 'glowPulse 4s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transformStyle: 'preserve-3d'
      }}>
        {/* SVG Book Unfolding */}
        <div style={{ 
          marginBottom: '35px', 
          filter: 'drop-shadow(0 0 25px rgba(216,175,101,0.6))',
          animation: 'book3DOpen 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transformOrigin: 'center center'
        }}>
          <svg viewBox="0 0 100 100" width="145" height="145">
            <defs>
              <linearGradient id="goldGradientSplash" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF5DF" />
                <stop offset="30%" stopColor="#EAD2AC" />
                <stop offset="70%" stopColor="#C9A054" />
                <stop offset="100%" stopColor="#8A6421" />
              </linearGradient>
              <filter id="goldGlowSplash" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path 
              d="M 50,40 C 40,32 30,30 20,31 L 20,78 L 43,78 C 46,81 54,81 57,78 L 80,78 L 80,31 C 70,30 60,32 50,40 Z" 
              fill="none" 
              stroke="url(#goldGradientSplash)" 
              strokeWidth="4.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeDasharray="350"
              strokeDashoffset="350"
              style={{ animation: 'drawOuter 2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards' }}
            />
            <path 
              d="M 47,42 C 39,36 31,34 24,35 L 24,73 L 47,73 Z" 
              fill="none" 
              stroke="url(#goldGradientSplash)" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeDasharray="250"
              strokeDashoffset="250"
              style={{ animation: 'drawInner 2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards' }}
            />
            <path 
              d="M 53,42 C 61,36 69,34 76,35 L 76,73 L 53,73 Z" 
              fill="none" 
              stroke="url(#goldGradientSplash)" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeDasharray="250"
              strokeDashoffset="250"
              style={{ animation: 'drawInner 2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards' }}
            />
            <path 
              d="M 50,33 L 50,78" 
              fill="none" 
              stroke="url(#goldGradientSplash)" 
              strokeWidth="3.2" 
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{ animation: 'drawSpine 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards' }}
            />
          </svg>
        </div>

        {/* Text Container */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInSlideUp 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards',
          opacity: 0,
          width: '100%',
          maxWidth: '280px'
        }}>
          {/* Serif English logo with superscript gold cross */}
          <div style={{
            fontFamily: "'Lora', serif",
            fontSize: '44px',
            fontWeight: 500,
            letterSpacing: '0.01em',
            background: 'linear-gradient(135deg, #FFF5DF 0%, #DFBA73 50%, #B68D3C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'baseline',
            position: 'relative',
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))'
          }}>
            Biblegram
            <span style={{ 
              fontFamily: "'Lora', serif",
              fontSize: '24px', 
              fontWeight: 400,
              marginLeft: '2px', 
              transform: 'translateY(-14px)', 
              alignSelf: 'flex-start',
              background: 'linear-gradient(135deg, #FFF5DF 0%, #DFBA73 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 5px rgba(229,194,128,0.7))'
            }}>
              +
            </span>
          </div>

          {/* Right-aligned Noto Sans KR Korean subtitle under gram+ */}
          <div style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #E5C280 0%, #B88E3E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            marginTop: '3px',
            alignSelf: 'flex-end',
            marginRight: '22px',
            opacity: 0.95
          }}>
            바이블그램
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6.5. 프리미엄 로그인 및 온보딩 뷰
// ==========================================
const LoginView = ({ onKakaoLogin, onGuestLogin, onTestLogin }) => {
  // 별똥별 입자들 (Shooting Stars) 10개 정적 생성용 훅
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // 성소 밤하늘 분위기에 맞는 10개의 찬란한 별똥별 입자 좌표/사양 생성 (우상단에서 시작하도록 분포)
    const starArray = [...Array(10)].map((_, i) => ({
      id: i,
      left: `${30 + Math.random() * 80}%`, 
      top: `${-20 + Math.random() * -40}%`,
      size: `${2.2 + Math.random() * 3.5}px`,
      duration: `${8 + Math.random() * 8}s`,
      delay: `${Math.random() * -12}s`
    }));
    setStars(starArray);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-[#030202] text-[#F9F7F1] p-8 overflow-hidden">
      
      {/* CSS3 하드웨어 가속 기법 및 연출 CSS 매핑 */}
      <style>{`
        @keyframes heavenly-glow {
          0% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.12) translate(5px, -10px) rotate(2deg); opacity: 1; }
          100% { transform: scale(0.96) translate(-5px, 5px) rotate(-2deg); opacity: 0.85; }
        }
        @keyframes draw-line-y {
          to { transform: scaleY(1); }
        }
        @keyframes draw-line-x {
          to { transform: scaleX(1); }
        }
        @keyframes button-pulse-kakao {
          0% { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        @keyframes shooting-star {
          0% {
            transform: translate(0, 0) rotate(-45deg) scale(0.4);
            opacity: 0;
            box-shadow: 0 0 4px #FFFDF9;
          }
          8% {
            opacity: 1;
            box-shadow: 0 0 15px #DFBA73, 0 0 25px #FFE5B4;
          }
          45% {
            opacity: 1;
          }
          100% {
            transform: translate(-350px, 700px) rotate(-45deg) scale(1.2);
            opacity: 0;
            box-shadow: 0 0 4px transparent;
          }
        }
        .animate-pulse-kakao {
          position: relative;
        }
        .animate-pulse-kakao::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid #FEE500;
          border-radius: 16px;
          opacity: 0;
          pointer-events: none;
          animation: button-pulse-kakao 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
      `}</style>

      {/* 1. 천상의 빛 번짐 (Heavenly Aura Glow) 그라데이션 호흡 */}
      <div 
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background: 'radial-gradient(circle at 50% -10%, rgba(223, 186, 115, 0.18) 0%, rgba(3, 2, 2, 0) 65%), radial-gradient(circle at 50% 60%, rgba(163, 123, 63, 0.08) 0%, rgba(3, 2, 2, 0) 70%)',
          mixBlendMode: 'screen',
          animation: 'heavenly-glow 10s ease-in-out infinite alternate'
        }}
      />

      {/* 2. 말씀의 골드 라인 드로잉 (Golden Cross Line Drawing) */}
      <div 
        className="absolute w-[1px] z-2 origin-top"
        style={{
          left: '50%',
          top: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(223, 186, 115, 0.35) 45%, rgba(223, 186, 115, 0.35) 55%, transparent)',
          transform: 'scaleY(0)',
          animation: 'draw-line-y 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      />
      <div 
        className="absolute h-[1px] z-2 origin-left"
        style={{
          top: '38%',
          left: 0,
          right: 0,
          background: 'linear-gradient(to right, transparent, rgba(223, 186, 115, 0.35) 45%, rgba(223, 186, 115, 0.35) 55%, transparent)',
          transform: 'scaleX(0)',
          animation: 'draw-line-x 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards'
        }}
      />

      {/* 3. 하늘빛 별똥별 낙하 (Shooting Stars Light Rain) */}
      <div className="absolute inset-0 pointer-events-none z-2">
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              background: 'radial-gradient(circle, #FFFDF9 0%, rgba(223, 186, 115, 0.95) 50%, transparent 100%)',
              animation: `shooting-star ${star.duration} linear infinite`,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center pt-20">
        <div className="h-12 mb-6" />
        <h2 className="text-[12.5px] font-myeongjo font-extrabold tracking-[0.4em] text-[#DFBA73] drop-shadow-[0_0_12px_rgba(223,186,115,0.4)]">
          LIGHT OF WORD
        </h2>
        <span className="text-[8px] text-white/30 tracking-[0.3em] uppercase mt-2">
          Visual Devotional Sanctuary
        </span>
      </div>

      <div className="relative z-10 text-center my-auto flex flex-col items-center">
        <h1 className="text-3xl font-myeongjo font-bold text-stone-100 tracking-wide leading-snug break-keep drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
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
          className="w-full py-4 rounded-xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-bold text-[14.5px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(254,229,0,0.15)] animate-pulse-kakao"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.868-.12.431.147.426.314.314.13-.087 2.075-1.409 2.907-1.984C10.372 16.27 11.173 16.3 12 16.3c4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
          </svg>
          카카오 로그인
        </button>
        
        {onTestLogin && (
          <button 
            type="button"
            onClick={onTestLogin}
            className="w-full py-3.5 rounded-xl bg-[#1c1814] hover:bg-[#2a241e] border border-[#DFBA73]/30 text-[#DFBA73] font-bold text-[12.5px] active:scale-[0.98] transition-all text-center shadow-inner"
          >
            [관리자전용] 테스트 로그인
          </button>
        )}
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
    const [openCommentsForCardId, setOpenCommentsForCardId] = useState(null);
    
    const [activeProfileUser, setActiveProfileUser] = useState(() => localStorage.getItem('biblegram_nickname') || "은혜나눔인");
    const [savedCards, setSavedCards] = useState([]);
    const [myCreatedCards, setMyCreatedCards] = useState([]);
    const [likedCardsState, setLikedCardsState] = useState({});
    const [userProfiles, setUserProfiles] = useState({});
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLargeFont, setIsLargeFont] = useState(() => localStorage.getItem('biblegram_large_font') === 'true');
    const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem('biblegram_selected_voice') || 'onyx');
    const [isGlobalMuted, setIsGlobalMuted] = useState(() => localStorage.getItem('biblegram_global_muted') === 'true');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isConfirmCreateModalOpen, setIsConfirmCreateModalOpen] = useState(false);
    const [isLimitExhaustedExitModalOpen, setIsLimitExhaustedExitModalOpen] = useState(false);
    const [profileTab, setProfileTab] = useState('created');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedCardIds, setSelectedCardIds] = useState([]);
    const profileLongPressTimerRef = useRef(null);
    const isLongPressActive = useRef(false);
    const [dailyCreateCount, setDailyCreateCount] = useState(0);
    const [isPushEnabled, setIsPushEnabled] = useState(() => {
      const saved = localStorage.getItem('biblegram_push_enabled');
      if (saved === null) {
        localStorage.setItem('biblegram_push_enabled', 'true');
        return true;
      }
      return saved === 'true';
    });
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [showPushPromptModal, setShowPushPromptModal] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [inAppNotification, setInAppNotification] = useState(null);

    // 1초 미리듣기용 Audio 캐시 및 재생 제어기
    const voicePreviewCache = useRef({});
    const previewAudioRef = useRef(null);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

    const playVoicePreview = async (voiceId) => {
      // 진행 중인 오디오가 있다면 pause 처리 및 청소
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }

      setIsPreviewPlaying(true);
      const previewText = "여호와는 나의 목자시니";
      
      // 1) 캐시에 존재하면 API 호출 없이 0.1초 만에 즉시 재생 (비용 0원)
      if (voicePreviewCache.current[voiceId]) {
        const audio = new Audio(voicePreviewCache.current[voiceId]);
        previewAudioRef.current = audio;
        audio.play().catch(e => console.warn(e));
        setIsPreviewPlaying(false);
        return;
      }

      // 2) 캐시에 없으면 짧고 은혜로운 예시어 낭독 API 가동 (비용 0.05원 미만)
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'tts', text: previewText, voice: voiceId })
        });
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = window.btoa(binary);
          const dataUri = `data:audio/mp3;base64,${base64}`;
          
          // 메모리 맵 캐싱 처리
          voicePreviewCache.current[voiceId] = dataUri;
          
          const audio = new Audio(dataUri);
          previewAudioRef.current = audio;
          audio.play().catch(e => console.warn(e));
        }
      } catch (err) {
        console.error("Voice preview failed:", err);
      } finally {
        setIsPreviewPlaying(false);
      }
    };

    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartY = useRef(0);
    const isPulling = useRef(false);

    // 내 서재 당겨서 새로고침용 신규 상태 및 참조
    const [isProfileRefreshing, setIsProfileRefreshing] = useState(false);
    const [profilePullDistance, setProfilePullDistance] = useState(0);
    const profileTouchStartY = useRef(0);
    const isProfilePulling = useRef(false);

    const handleProfileTouchStart = (e) => {
      const container = e.currentTarget;
      if (container.scrollTop === 0 && !isProfileRefreshing) {
        profileTouchStartY.current = e.touches[0].clientY;
        isProfilePulling.current = true;
      } else {
        isProfilePulling.current = false;
      }
    };

    const handleProfileTouchMove = (e) => {
      if (!isProfilePulling.current || isProfileRefreshing) return;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - profileTouchStartY.current;
      
      if (deltaY > 0) {
        const distance = Math.min(80, deltaY * 0.45);
        setProfilePullDistance(distance);
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleProfileTouchEnd = async () => {
      if (!isProfilePulling.current || isProfileRefreshing) return;
      isProfilePulling.current = false;
      
      if (profilePullDistance >= 50) {
        setIsProfileRefreshing(true);
        setProfilePullDistance(35);
        try {
          // 토스트 메시지나 배너 없이 은밀하게 Supabase 실시간 동기화
          await Promise.all([
            fetchMyCreatedCards(),
            fetchBookmarks(),
            fetchUserProfiles(),
            fetchFeed()
          ]);
        } catch (err) {
          console.error("Refresh profile failed:", err);
        } finally {
          setIsProfileRefreshing(false);
          setProfilePullDistance(0);
        }
      } else {
        setProfilePullDistance(0);
      }
    };

    const handleTouchStart = (e) => {
      const container = e.currentTarget;
      if (container.scrollTop === 0 && !isRefreshing) {
        touchStartY.current = e.touches[0].clientY;
        isPulling.current = true;
      } else {
        isPulling.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;
      
      if (deltaY > 0) {
        const distance = Math.min(80, deltaY * 0.45);
        setPullDistance(distance);
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current || isRefreshing) return;
      isPulling.current = false;
      
      if (pullDistance >= 50) {
        setIsRefreshing(true);
        setPullDistance(35);
        try {
          await fetchFeed();
          showToast("신비로운 오늘의 말씀 광장이 새로워졌습니다.", "success");
        } catch (err) {
          console.error("Refresh feed failed:", err);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    const [otherUserSavedCards, setOtherUserSavedCards] = useState([]);
    const [isFetchingOtherSaved, setIsFetchingOtherSaved] = useState(false);
const [verseRefInput, setVerseRefInput] = useState(() => localStorage.getItem('biblegram_draft_ref') || '');
  const [verseText, setVerseText] = useState(() => localStorage.getItem('biblegram_draft_text') || '');
  
  const [includeThought, setIncludeThought] = useState(false);
  const [userThought, setUserThought] = useState(''); 
  
  const [isSearching, setIsSearching] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  const [currentResult, setCurrentResult] = useState({ image: null, audio: null, text: '', meditation: '', userThought: '' });

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'info', duration = 2800) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
      toastTimeoutRef.current = null;
    }, duration);
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
          comments (id, comment_text, user_id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mapped = (data || []).map(item => {
        const commentsList = item.comments || [];
        const normalComments = commentsList.filter(c => 
          c.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
          !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
          !c.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
        );
        const shareComments = commentsList.filter(c => c.comment_text === '__BIBLEGRAM_SHARE_ACTION__');
        
        return {
          id: item.id,
          text: item.verse_text,
          image: item.image_url,
          audio: item.audio_url || 'web-speech',
          meditation: item.meditation,
          userThought: item.user_thought,
          author: item.author_nickname,
          author_id: item.author_id,
          likes: item.likes_count,
          commentCount: normalComments.length,
          shareCount: shareComments.length,
          created_at: item.created_at
        };
      });
      
      // 내 게시물 피드 숨김 및 상대 게시물만 노출 (Q2)
      const filtered = user 
        ? mapped.filter(item => String(item.author_id) !== String(user.id))
        : mapped;

      // [대안 A 개편] 하이브리드 피드 셔플 알고리즘 적용
      // 1. 최근 24시간 이내의 카드 선별
      const nowMs = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      const recentCards = filtered.filter(item => {
        const createdAtMs = new Date(item.created_at).getTime();
        return nowMs - createdAtMs <= oneDayMs;
      });
      
      // 2. 최근 24시간 이내 카드를 무작위 셔플 (24시간 내 랜덤 노출)
      const shuffledRecent = [...recentCards];
      for (let i = shuffledRecent.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledRecent[i];
        shuffledRecent[i] = shuffledRecent[j];
        shuffledRecent[j] = temp;
      }
      
      // 3. 나머지 과거 카드 분류 및 후순위 알고리즘 적용 (최신 등록순 정렬)
      const recentIds = new Set(recentCards.map(c => c.id));
      const remainingCards = filtered
        .filter(item => !recentIds.has(item.id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // 4. 24시간 내 랜덤 카드 + 최신순 과거 카드 병합
      const finalFeed = [...shuffledRecent, ...remainingCards];
      
      setFeedCards(finalFeed);
    } catch (err) {
      console.error("Error fetching feed:", err);
      showToast("피드 데이터를 불러오는 데 실패했습니다.", "error");
    }
  };

  const fetchMyCreatedCards = async (targetUser) => {
    const checkUser = targetUser || user;
    if (!checkUser || !checkUser.id) return;
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          comments (id, comment_text, user_id)
        `)
        .eq('author_id', checkUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      const mapped = (data || []).map(c => {
        const commentsList = c.comments || [];
        const normalComments = commentsList.filter(
          com => com.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
                 !com.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
                 !com.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
        );
        return {
          id: c.id,
          text: c.verse_text,
          image: c.image_url,
          audio: c.audio_url || 'web-speech',
          meditation: c.meditation,
          userThought: c.user_thought,
          author: c.author_nickname,
          author_id: c.author_id,
          likes: c.likes_count,
          commentCount: normalComments.length
        };
      });
      setMyCreatedCards(mapped);
    } catch (err) {
      console.error("Error fetching my created cards:", err);
    }
  };

  const fetchNotifications = async (currentUser) => {
    const checkUser = currentUser || user;
    if (!checkUser || !checkUser.id) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .like('comment_text', `__BIBLEGRAM_NOTIF__:%:${checkUser.id}:%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const myNotifs = [];
      const myIdStr = String(checkUser.id);

      (data || []).forEach(com => {
        if (!com.comment_text || !com.comment_text.startsWith('__BIBLEGRAM_NOTIF__')) return;

        const parts = com.comment_text.split(':');
        if (parts.length < 3) return;

        const type = parts[1];
        const targetUserId = parts[2];
        const content = parts.slice(3).join(':') || '';

        if (targetUserId === myIdStr && String(com.user_id) !== myIdStr) {
          const createdTime = new Date(com.created_at);
          const diffMs = Date.now() - createdTime.getTime();
          const diffMins = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let timeStr = '방금';
          if (diffDays > 0) {
            timeStr = `${diffDays}일 전`;
          } else if (diffHours > 0) {
            timeStr = `${diffHours}시간 전`;
          } else if (diffMins > 0) {
            timeStr = `${diffMins}분 전`;
          }

          myNotifs.push({
            id: com.id,
            card_id: com.card_id,
            user_id: com.user_id,
            author_nickname: com.author_nickname,
            type,
            content,
            timeStr,
            raw_created_at: com.created_at
          });
        }
      });

      if (myNotifs.length > 0) {
        const latestNotif = myNotifs[0];
        const lastAlertedNotifId = localStorage.getItem('biblegram_last_alerted_notif');
        if (String(latestNotif.id) !== lastAlertedNotifId) {
          localStorage.setItem('biblegram_last_alerted_notif', String(latestNotif.id));

          let msg = '';
          if (latestNotif.type === 'like') {
            msg = `${latestNotif.author_nickname}님이 회원님의 말씀 카드를 좋아합니다.`;
          } else if (latestNotif.type === 'comment') {
            msg = `${latestNotif.author_nickname}님이 댓글을 남겼습니다: "${latestNotif.content}"`;
          } else if (latestNotif.type === 'reply') {
            msg = `${latestNotif.author_nickname}님이 회원님의 댓글에 답글을 남겼습니다: "${latestNotif.content}"`;
          }

          if (msg) {
            const isAppActive = document.visibilityState === 'visible';

            if (isAppActive) {
              // 1) 인앱 활성화 상태일 때는 오직 인앱 배너만 띄움
              setInAppNotification({ id: latestNotif.id, message: msg });
              setTimeout(() => {
                setInAppNotification(prev => prev && prev.id === latestNotif.id ? null : prev);
              }, 4500);
            } else {
              // 2) 인앱이 아닌 경우(백그라운드)에만 시스템 알림으로 전송
              const isPushLocal = localStorage.getItem('biblegram_push_enabled') === 'true';
              if (isPushLocal && ('Notification' in window) && Notification.permission === 'granted') {
                try {
                  if ('serviceWorker' in navigator) {
                    const reg = await navigator.serviceWorker.ready.catch(() => null);
                    if (reg) {
                      reg.showNotification("성소 하늘빛 알림", {
                        body: msg,
                        icon: "/android-chrome-192x192.png"
                      });
                    } else {
                      new Notification("성소 하늘빛 알림", { body: msg });
                    }
                  } else {
                    new Notification("성소 하늘빛 알림", { body: msg });
                  }
                } catch (e) {
                  new Notification("성소 하늘빛 알림", { body: msg });
                }
              }
            }
          }
        }
      }

      setNotifications(myNotifs);

      const lastReadNotifId = localStorage.getItem('biblegram_last_read_notif') || '0';
      const unreads = myNotifs.filter(n => Number(n.id) > Number(lastReadNotifId)).length;
      setUnreadCount(unreads);

    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const checkUserCooldown = async (userId) => {
    if (!userId) return { allowed: true };
    try {
      const { data, error } = await supabase
        .from('users')
        .select('daily_create_count, cooldown_until')
        .eq('id', userId)
        .single();
        
      if (error || !data) return { allowed: true, count: 0 };
      
      const now = new Date();
      let count = data.daily_create_count || 0;
      setDailyCreateCount(count);
      let cooldownUntil = data.cooldown_until ? new Date(data.cooldown_until) : null;
      
      // 1. 자정 리셋 시점 만료 대조 및 갱신 (1, 2, 3회 소모 상태 공통 자정 초과 시 복원)
      if (cooldownUntil && cooldownUntil <= now) {
        await supabase
          .from('users')
          .update({ daily_create_count: 0, cooldown_until: null })
          .eq('id', userId);
        setDailyCreateCount(0);
        return { allowed: true, count: 0 };
      }
      
      // 2. 자정 쿨타임 유효 가드 대조 (3회 모두 소모 상태일 때만 진입 제어)
      if (cooldownUntil && cooldownUntil > now) {
        if (count >= 3) {
          return { 
            allowed: false, 
            reason: "하루 말씀카드 생성 한도(3회)를 모두 소모하셨습니다. 내일 자정(00:00)에 다시 리셋되어 새롭게 말씀 카드를 창조하실 수 있습니다.",
            count,
            cooldownUntil
          };
        }
      }
      
      // 3. 더블 레이어 안심 가드
      if (count >= 3) {
        const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        await supabase
          .from('users')
          .update({ cooldown_until: nextMidnight.toISOString() })
          .eq('id', userId);
        setDailyCreateCount(3);
        return { 
          allowed: false, 
          reason: "하루 말씀카드 생성 한도(3회)를 모두 소모하셨습니다. 내일 자정(00:00)에 다시 리셋되어 새롭게 말씀 카드를 창조하실 수 있습니다.",
          count,
          cooldownUntil: nextMidnight
        };
      }
      
      return { allowed: true, count };
    } catch (err) {
      console.error("Error checking cooldown:", err);
      return { allowed: true, count: 0 };
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
            comments (id, comment_text, user_id)
          )
        `)
        .eq('user_id', checkUser.id);
      
      if (error) throw error;
      
      const mapped = (data || [])
        .filter(item => item.cards)
        .map(item => {
          const commentsList = item.cards.comments || [];
          const normalComments = commentsList.filter(c => 
            c.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
            !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
            !c.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
          );
          const shareComments = commentsList.filter(c => c.comment_text === '__BIBLEGRAM_SHARE_ACTION__');

          return {
            id: item.cards.id,
            text: item.cards.verse_text,
            image: item.cards.image_url,
            audio: item.cards.audio_url || 'web-speech',
            meditation: item.cards.meditation,
            userThought: item.cards.user_thought,
            author: item.cards.author_nickname,
            author_id: item.cards.author_id,
            likes: item.cards.likes_count,
            commentCount: normalComments.length,
            shareCount: shareComments.length
          };
        });
      
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
    // Supabase Realtime Subscription 바인딩
    const realtimeChannel = supabase
      .channel('realtime-biblegram-feed-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cards' },
        (payload) => {
          const updatedCard = payload.new;
          if (!updatedCard) return;
          
          // 실시간으로 좋아요 수 동기화
          setFeedCards(prev => prev.map(c => c.id === updatedCard.id ? { 
            ...c, 
            likes: updatedCard.likes_count ?? c.likes
          } : c));

          setMyCreatedCards(prev => prev.map(c => c.id === updatedCard.id ? { 
            ...c, 
            likes: updatedCard.likes_count ?? c.likes
          } : c));

          setSavedCards(prev => prev.map(c => c.id === updatedCard.id ? { 
            ...c, 
            likes: updatedCard.likes_count ?? c.likes
          } : c));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        async (payload) => {
          // 댓글 테이블의 추가/삭제/변경이 생기면 백그라운드 fetch 대신 로컬 상태로 무결하게 동기화
          const isInsert = payload.eventType === 'INSERT';
          const isDelete = payload.eventType === 'DELETE';
          const com = isInsert ? payload.new : (isDelete ? payload.old : null);
          
          if (!com || !com.card_id) return;
          
          // 알림이나 공유 액션 등 정상 댓글이 아닌 특수 댓글은 피드 댓글 수 카운트에서 제외
          const isNormalComment = com.comment_text && 
            com.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
            !com.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
            !com.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:');
            
          if (!isNormalComment) return;

          const diff = isInsert ? 1 : (isDelete ? -1 : 0);
          if (diff === 0) return;

          setFeedCards(prev => prev.map(c => c.id === com.card_id ? {
            ...c,
            commentCount: Math.max(0, (c.commentCount || 0) + diff)
          } : c));

          setMyCreatedCards(prev => prev.map(c => c.id === com.card_id ? {
            ...c,
            commentCount: Math.max(0, (c.commentCount || 0) + diff)
          } : c));

          setSavedCards(prev => prev.map(c => c.id === com.card_id ? {
            ...c,
            commentCount: Math.max(0, (c.commentCount || 0) + diff)
          } : c));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      await fetchUserProfiles();
      await fetchFeed();
      if (!active) return;
      if (user && user.id) {
        await fetchBookmarks();
        await fetchLikedStates();
        await fetchMyCreatedCards();
        
        // 일일 말씀 생성 횟수 초기 셋팅 동기화
        supabase
          .from('users')
          .select('daily_create_count')
          .eq('id', user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setDailyCreateCount(data.daily_create_count || 0);
            }
          });
      }
    };
    loadData();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleNotificationNavigation = (cardId, type) => {
    if (!cardId) return;
    
    setView('feed');
    setSelectedCard(null);
    
    const foundCardIndex = feedCards.findIndex(c => String(c.id) === String(cardId));
    if (foundCardIndex !== -1) {
      const cardEl = document.getElementById(`card-${cardId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (type === 'comment' || type === 'reply') {
        setOpenCommentsForCardId(String(cardId));
      }
    } else {
      console.log("Card not found in active feed list, querying directly from Supabase...");
      supabase
        .from('cards')
        .select(`
          *,
          comments (id, comment_text, user_id)
        `)
        .eq('id', cardId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            const mappedCard = {
              id: data.id,
              text: data.verse_text,
              image: data.image_url,
              audio: data.audio_url || 'web-speech',
              meditation: data.meditation,
              userThought: data.user_thought,
              author: data.author_nickname,
              likes: data.likes_count,
              commentCount: (data.comments || []).filter(c => 
                c.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
                !c.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
                !c.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
              ).length
            };
            
            setFeedCards(prev => {
              if (prev.some(c => c.id === mappedCard.id)) return prev;
              return [mappedCard, ...prev];
            });
            
            setTimeout(() => {
              const cardEl = document.getElementById(`card-${cardId}`);
              if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              if (type === 'comment' || type === 'reply') {
                setOpenCommentsForCardId(String(cardId));
              }
            }, 300);
          }
        });
    }
  };

  // PWA 서비스 워커 등록 및 백그라운드 푸시 자동 활성화 장치
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log("PWA Service Worker registered scoping:", reg.scope);
          const isPushLocal = localStorage.getItem('biblegram_push_enabled') === 'true';
          if (isPushLocal && user && user.id) {
            registerPushSubscription(reg);
          }
        })
        .catch((err) => {
          console.error("PWA Service Worker registration failed:", err);
        });
    }
  }, [user]);

  const [pendingNotif, setPendingNotif] = useState(null);

  // 푸시 배너 선택 시 딥링킹(NAVIGATE_NOTIF) 이벤트 리스너 이식
  useEffect(() => {
    const handleSWMessage = (e) => {
      if (e.data && e.data.type === 'NAVIGATE_NOTIF') {
        console.log("Received NAVIGATE_NOTIF from Service Worker:", e.data);
        handleNotificationNavigation(e.data.cardId, e.data.notifType);
      }
    };
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    }
  }, [feedCards]);

  // 홈 화면 최초 실행 시 쿼리 파라미터 기반 딥링킹 인입 청취 훅 (레이스 컨디션 차단 마운트 대기 등록)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('notifCardId');
    const type = params.get('notifType');
    if (cardId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("Deep link query params detected, saving to pending:", { cardId, type });
      setPendingNotif({ cardId, type });
    }
  }, []);

  // 피드가 로드 완료(feedCards가 최소 1개 이상 존재)되면 대기 중인 딥링크를 안전하게 기동하는 훅
  useEffect(() => {
    if (pendingNotif && feedCards.length > 0) {
      const { cardId, type } = pendingNotif;
      setPendingNotif(null);
      console.log("Executing pending notification deep link:", { cardId, type });
      setTimeout(() => {
        handleNotificationNavigation(cardId, type);
      }, 800);
    }
  }, [feedCards, pendingNotif]);

  // 1. 알림 권한 실시간 감지 센서 훅
  useEffect(() => {
    const checkPermission = () => {
      if ('Notification' in window) {
        const isGranted = Notification.permission === 'granted';
        const isLocalEnabled = localStorage.getItem('biblegram_push_enabled') === 'true';
        setIsPushEnabled(isGranted && isLocalEnabled);
      }
    };
    
    checkPermission();
    window.addEventListener('focus', checkPermission);
    return () => {
      window.removeEventListener('focus', checkPermission);
    };
  }, []);

  // 2. 실시간 알림 폴링 루프 (10초 주기 가동)
  useEffect(() => {
    if (!user || !user.id) return;
    
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // 3. 내 서재 뷰 전환 즉시 동기화 센서 훅
  useEffect(() => {
    if (view === 'profile' && user && user.id) {
      fetchMyCreatedCards();
    }
  }, [view, user]);

  const triggerNotificationPermissionPrompt = async (targetUser) => {
    if (!('Notification' in window) || !targetUser) return;
    
    // Enforce default push setting to ON ('true') in localStorage and state
    localStorage.setItem('biblegram_push_enabled', 'true');
    setIsPushEnabled(true);
    
    if (Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready.catch(() => null);
            if (reg) {
              await registerPushSubscription(reg);
              reg.showNotification("하늘빛 알림 활성화", {
                body: "기도와 말씀의 은혜가 함께하는 성소 알림이 정상적으로 연동되었습니다.",
                icon: new URL('/favicon.svg', window.location.origin).href
              });
            }
          }
          showToast("하늘빛 알림 설정이 연동되었습니다!", "success");
        } else {
          showToast("알림 권한이 보류되었습니다. 설정 탭에서 활성화하실 수 있습니다.", "info");
        }
      } catch (err) {
        console.error("Auto notification prompt failed:", err);
      }
    } else if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready.catch(() => null);
        if (reg) {
          await registerPushSubscription(reg);
        }
      }
    }
  };

  useEffect(() => {
    if (user && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPushPromptModal(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleAcceptPushPermission = async () => {
    setShowPushPromptModal(false);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsPushEnabled(true);
        localStorage.setItem('biblegram_push_enabled', 'true');
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready.catch(() => null);
          if (reg) {
            await registerPushSubscription(reg);
            reg.showNotification("하늘빛 알림 활성화", {
              body: "기도와 말씀의 은혜가 함께하는 성소 알림이 정상적으로 연동되었습니다.",
              icon: new URL('/favicon.svg', window.location.origin).href
            });
          }
        }
        showToast("하늘빛 알림 설정이 즉시 활성화되었습니다!", "success");
      } else {
        showToast("알림 권한 승인이 보류되었습니다. 필요시 설정에서 켜주세요.", "info");
      }
    } catch (err) {
      console.error("Manual push permission trigger failed:", err);
      showToast("알림 연동에 실패했습니다.", "error");
    }
  };

  const handleDeclinePushPermission = () => {
    setShowPushPromptModal(false);
    showToast("알림 설정이 보류되었습니다. 설정 탭에서 언제든 켜실 수 있습니다.", "info");
  };

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
            triggerNotificationPermissionPrompt(userData);
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
              triggerNotificationPermissionPrompt(userData);
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

  const sha256 = async (message) => {
    // Pure JS SHA-256 implementation for Secure Context independent environments (like Kakao In-App Browser)
    const ch = (x, y, z) => (x & y) ^ (~x & z);
    const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
    const sigma0 = (x) => ((x >>> 2) | (x << 30)) ^ ((x >>> 13) | (x << 19)) ^ ((x >>> 22) | (x << 10));
    const sigma1 = (x) => ((x >>> 6) | (x << 26)) ^ ((x >>> 11) | (x << 21)) ^ ((x >>> 25) | (x << 7));
    const gamma0 = (x) => ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
    const gamma1 = (x) => ((x >>> 17) | (x << 15)) ^ ((x >>> 19) | (x << 13)) ^ (x >>> 10);

    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const words = [];
    const utf8 = unescape(encodeURIComponent(message));
    for (let i = 0; i < utf8.length; i++) {
      words[i >>> 2] |= utf8.charCodeAt(i) << (24 - (i % 4) * 8);
    }
    const lengthBits = utf8.length * 8;
    words[utf8.length >>> 2] |= 0x80 << (24 - (utf8.length % 4) * 8);
    
    while (((words.length + 2) * 4) % 64 !== 0) {
      words.push(0);
    }
    words.push(0);
    words.push(lengthBits);

    for (let i = 0; i < words.length; i += 16) {
      const w = new Array(64);
      for (let t = 0; t < 16; t++) {
        w[t] = words[i + t];
      }
      for (let t = 16; t < 64; t++) {
        w[t] = (gamma1(w[t - 2]) + w[t - 7] + gamma0(w[t - 15]) + w[t - 16]) | 0;
      }

      let a = H[0];
      let b = H[1];
      let c = H[2];
      let d = H[3];
      let e = H[4];
      let f = H[5];
      let g = H[6];
      let h = H[7];

      for (let t = 0; t < 64; t++) {
        const T1 = (h + sigma1(e) + ch(e, f, g) + K[t] + w[t]) | 0;
        const T2 = (sigma0(a) + maj(a, b, c)) | 0;
        h = g;
        g = f;
        f = e;
        e = (d + T1) | 0;
        d = c;
        c = b;
        b = a;
        a = (T1 + T2) | 0;
      }

      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }

    const hex = [];
    for (let i = 0; i < 8; i++) {
      let word = H[i];
      if (word < 0) {
        word += 0x100000000;
      }
      hex.push(word.toString(16).padStart(8, '0'));
    }
    return hex.join('');
  };

  const handleTestLogin = async () => {
    // 1. 성소 관리자전용 비밀번호 검증 (SHA-256 일방향 물리 보안 가드 발화)
    const passwordInput = prompt("성소의 문지기님, 관리자전용 비밀번호를 입력해 주십시오.");
    if (!passwordInput) return; // 취소/입력 없음 시 즉각 차단

    setIsAuthLoading(true);
    try {
      const hashedInput = await sha256(passwordInput.trim());
      const correctHash = "6b2d968b6b70578bb8aaa3fe3cda067ef412355c8ed8d29bec95f106c052950d"; // 1064010 의 SHA-256 지문

      if (hashedInput !== correctHash) {
        showToast("비밀번호가 일치하지 않습니다. 접근 권한이 없습니다.", "error");
        setIsAuthLoading(false);
        return;
      }

      // 2. 실제 요한 님의 카카오 인프라와 100% 분리 격리된 순수 테스트계정 (ID: 9999999999)
      const testUser = {
        id: '9999999999',
        nickname: '테스트',
        profileImage: ''
      };
      
      localStorage.setItem('biblegram_user', JSON.stringify(testUser));
      setUser(testUser);
      
      // Supabase users 테이블에 동기화 등록하여 말씀 생성, 댓글, 좋아요 완벽 동작 보장
      await supabase.from('users').upsert({
        id: testUser.id,
        nickname: '테스트',
        profile_image: ''
      });
      
      const resolvedNickname = '테스트';
      
      localStorage.setItem(`biblegram_nickname_${testUser.id}`, resolvedNickname);
      localStorage.setItem('biblegram_nickname', resolvedNickname);
      setNickname(resolvedNickname);
      setActiveProfileUser(resolvedNickname);
      
      fetchBookmarks(testUser);
      fetchLikedStates(testUser);
      fetchMyCreatedCards(testUser);
      
      const cooldownStatus = await checkUserCooldown(testUser.id);
      if (cooldownStatus.allowed) {
        setDailyCreateCount(cooldownStatus.count || 0);
      }
      
      showToast("관리자 테스트 계정으로 신성한 예배당에 입장했습니다.", "success");
    } catch (err) {
      console.error(err);
      showToast("테스터 로그인 중 오류가 생겼습니다.", "error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForceResetCooldown = async () => {
    if (!user || !user.id) return;
    setIsAuthLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ daily_create_count: 0, cooldown_until: null })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setDailyCreateCount(0);
      showToast("[임시] 오늘 말씀 창조 횟수가 성공적으로 초기화(0/3)되었습니다.", "success");
    } catch (err) {
      console.error("강제 초기화 실패:", err);
      showToast("초기화 처리 중 에러가 발생했습니다.", "error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const registerPushSubscription = async (reg) => {
    try {
      if (!user || !user.id) return;
      const VAPID_PUBLIC_KEY = 'BBKn6U7kjRk4ZTVaLdxtGJ0yVnG6OjGxwL1VFB0bhm0NTPl2CLfElNl00IUxhbPBuNkF3H28MHMNcW10QnHLGFQ';
      
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription: JSON.stringify(subscription),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        
      if (error) {
        console.warn("Failed to store push subscription in database:", error.message);
      } else {
        console.log("Successfully stored push subscription in Supabase.");
      }
    } catch (err) {
      console.error("Failed to register Web Push Subscription:", err);
    }
  };

  const getPushThumbnailUrl = (url) => {
    if (!url) return '';
    if (url.includes('unsplash.com')) {
      let cleanUrl = url;
      // Force standard JPG format for perfect native mobile OS push notification support
      if (cleanUrl.includes('fm=')) {
        cleanUrl = cleanUrl.replace(/fm=[a-zA-Z0-9]+/, 'fm=jpg');
      } else {
        cleanUrl += '&fm=jpg';
      }
      // Replace auto=format with auto=compress to avoid OS-level WebP parse errors outside sandboxed browser contexts
      if (cleanUrl.includes('auto=')) {
        cleanUrl = cleanUrl.replace(/auto=[a-zA-Z0-9,]+/g, 'auto=compress');
      }
      // Shrink dimensions & quality for ultra-fast background caching
      if (cleanUrl.includes('w=')) {
        cleanUrl = cleanUrl.replace(/w=\d+/, 'w=200');
      } else {
        cleanUrl += '&w=200';
      }
      if (cleanUrl.includes('q=')) {
        cleanUrl = cleanUrl.replace(/q=\d+/, 'q=60');
      } else {
        cleanUrl += '&q=60';
      }
      return cleanUrl;
    }
    return url;
  };

  const triggerWebPush = async (recipientId, type, content, cardId, imageUrl) => {
    try {
      if (!recipientId || String(recipientId) === String(user.id)) return;
      
      const optimizedImage = getPushThumbnailUrl(imageUrl);
      const payload = {
        action: 'push',
        targetUserId: String(recipientId),
        title: type === 'like' ? '은혜로운 공감' : (type === 'reply' ? '은혜로운 답글' : '은혜로운 댓글'),
        body: `${nickname || "성도"}님이 ${type === 'like' ? '말씀 카드에 공감하셨습니다.' : (type === 'reply' ? '답글을 남기셨습니다.' : '댓글을 남기셨습니다.')}`,
        image: optimizedImage,
        data: {
          cardId: String(cardId),
          type: type,
          image: optimizedImage
        }
      };
      
      await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed to trigger web push:", err);
    }
  };

  const handleTogglePush = async () => {
    if (!isPushEnabled) {
      if (!('Notification' in window)) {
        showToast("이 브라우저는 푸시 알림을 지원하지 않습니다.", "error");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setIsPushEnabled(true);
          localStorage.setItem('biblegram_push_enabled', 'true');
          showToast("하늘빛 알림 동의가 설정되었습니다! 실시간 은혜를 전해드립니다.", "success");
          
          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready.catch(() => null);
            if (reg) {
              await registerPushSubscription(reg);
              
              reg.showNotification("하늘빛 알림 활성화", {
                body: "기도와 말씀의 은혜가 함께하는 성소 알림이 정상적으로 연동되었습니다.",
                icon: "/android-chrome-192x192.png"
              });
            } else {
              new Notification("하늘빛 알림 활성화", {
                body: "기도와 말씀의 은혜가 함께하는 성소 알림이 정상적으로 연동되었습니다."
              });
            }
          } else {
            new Notification("하늘빛 알림 활성화", {
              body: "기도와 말씀의 은혜가 함께하는 성소 알림이 정상적으로 연동되었습니다."
            });
          }
        } else {
          showToast("알림 권한이 거부되었습니다. 기기 또는 브라우저 설정에서 권한을 허용해주세요.", "error");
        }
      } catch (err) {
        console.error("푸시 동의 설정 중 에러:", err);
        showToast("알림 동의 설정 중 오류가 발생했습니다.", "error");
      }
    } else {
      setIsPushEnabled(false);
      localStorage.setItem('biblegram_push_enabled', 'false');
      
      if (user && user.id) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id);
      }
      showToast("하늘빛 알림 수신 동의가 해제되었습니다.", "info");
    }
  };

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
        fetchMyCreatedCards(guestUser);
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
          fetchMyCreatedCards(guestUser);
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
      triggerNotificationPermissionPrompt(user);
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
      setMyCreatedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (nextLiked ? 1 : -1) } : c));
      setSavedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (nextLiked ? 1 : -1) } : c));
      
      try {
        if (nextLiked) {
          await supabase.from('likes').insert({ user_id: user.id, card_id: cardId });
          const { data: cardData } = await supabase.from('cards').select('likes_count, author_id, image_url').eq('id', cardId).single();
          if (cardData) {
            await supabase.from('cards').update({ likes_count: cardData.likes_count + 1 }).eq('id', cardId);
            
            // 상대방 게시물인 경우 실시간 알림 insert
            if (cardData.author_id && String(cardData.author_id) !== String(user.id)) {
              await supabase.from('comments').insert({
                card_id: cardId,
                user_id: user.id,
                author_nickname: nickname || user.nickname || "은혜나눔인",
                comment_text: `__BIBLEGRAM_NOTIF__:like:${cardData.author_id}`
              });
              triggerWebPush(cardData.author_id, 'like', '', cardId, cardData.image_url);
            }
          }
          showToast("은혜로운 말씀에 공감했습니다.", "success", 1500);
        } else {
          await supabase.from('likes').delete().eq('user_id', user.id).eq('card_id', cardId);
          const { data: cardData } = await supabase.from('cards').select('likes_count, author_id').eq('id', cardId).single();
          if (cardData) {
            await supabase.from('cards').update({ likes_count: Math.max(0, cardData.likes_count - 1) }).eq('id', cardId);
            // 좋아요 취소 시 기존 알림도 함께 삭제하여 유령 알림 방지 및 불필요한 알림 차단
            if (cardData.author_id) {
              await supabase
                .from('comments')
                .delete()
                .eq('card_id', cardId)
                .eq('user_id', user.id)
                .eq('comment_text', `__BIBLEGRAM_NOTIF__:like:${cardData.author_id}`);
            }
          }
          showToast("말씀 공감을 취소했습니다.", "info", 1500);
        }
      } catch (err) {
        console.error("Error toggling like:", err);
        setLikedCardsState(prev => ({ ...prev, [cardId]: isCurrentlyLiked }));
        setFeedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (isCurrentlyLiked ? 1 : -1) } : c));
        setMyCreatedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (isCurrentlyLiked ? 1 : -1) } : c));
        setSavedCards(prev => prev.map(c => c.id === cardId ? { ...c, likes: c.likes + (isCurrentlyLiked ? 1 : -1) } : c));
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
          showToast("보관함에서 말씀을 삭제했습니다.", "info", 1500);
        } else {
          await supabase.from('bookmarks').insert({ user_id: user.id, card_id: card.id });
          setSavedCards(prev => [...prev, card]);
          showToast("내 묵상 서재에 저장해두었습니다.", "success", 1500);
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
      setMyCreatedCards(prev => prev.map(c => c.id === cardId ? { ...c, commentCount: newCount } : c));
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(prev => ({ ...prev, commentCount: newCount }));
      }
    };

    const handleShareCountChangeGlobal = (cardId, newCount) => {
      setFeedCards(prev => prev.map(c => c.id === cardId ? { ...c, shareCount: newCount } : c));
      setSavedCards(prev => prev.map(c => c.id === cardId ? { ...c, shareCount: newCount } : c));
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(prev => ({ ...prev, shareCount: newCount }));
      }
    };

    const handleDeleteCard = async (cardId) => {
      if (!window.confirm("이 말씀 카드를 성전(피드) 및 서재에서 완전히 삭제하시겠습니까?")) return;
      setIsAuthLoading(true);
      try {
        // DB 직접 조회를 통한 원천적 게시물 작성자 권한 실시간 검증
        const { data: cardData, error: fetchErr } = await supabase
          .from('cards')
          .select('author_id')
          .eq('id', cardId)
          .single();

        if (fetchErr || !cardData) {
          showToast("말씀 카드를 찾을 수 없습니다.", "error");
          setIsAuthLoading(false);
          return;
        }

        const isAdmin = user && (String(user.id) === '4908447829' || user.email === 'wlstlfdl11@kakao.com' || nickname === '오띵');
        if (String(cardData.author_id) !== String(user.id) && !isAdmin) {
          showToast("게시물 삭제 권한이 없습니다.", "error");
          setIsAuthLoading(false);
          return;
        }

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

    const handleDeleteCardsBulk = async () => {
      if (selectedCardIds.length === 0) {
        showToast("삭제할 카드를 선택해 주세요.", "info");
        return;
      }
      
      const confirmMsg = "이 카드는 DB에서 영구 삭제되어 타인의 피드에서도 소멸하며, 복구할 수 없습니다. 정말 일괄 삭제하시겠습니까?";
      if (!window.confirm(confirmMsg)) return;

      setIsAuthLoading(true);
      try {
        // DB 직접 조회를 통한 일괄 삭제 권한 실시간 검증
        const { data: cardsData, error: fetchErr } = await supabase
          .from('cards')
          .select('id, author_id')
          .in('id', selectedCardIds);

        if (fetchErr || !cardsData) {
          showToast("말씀 카드를 찾을 수 없습니다.", "error");
          setIsAuthLoading(false);
          return;
        }

        const isAdmin = user && (String(user.id) === '4908447829' || user.email === 'wlstlfdl11@kakao.com' || nickname === '오띵');
        const hasUnauthorizedCard = cardsData.some(c => String(c.author_id) !== String(user.id) && !isAdmin);
        if (hasUnauthorizedCard) {
          showToast("본인의 게시물만 삭제할 수 있습니다.", "error");
          setIsAuthLoading(false);
          return;
        }

        // 외래 키 제약 조건 오류 방지를 위한 관련 데이터 일괄 선제 삭제
        await supabase.from('bookmarks').delete().in('card_id', selectedCardIds);
        await supabase.from('comments').delete().in('card_id', selectedCardIds);
        await supabase.from('likes').delete().in('card_id', selectedCardIds);
        
        const { error } = await supabase
          .from('cards')
          .delete()
          .in('id', selectedCardIds);
        
        if (error) throw error;
        
        // 로컬 상태 동기화 처리
        setFeedCards(prev => prev.filter(c => !selectedCardIds.includes(c.id)));
        setSavedCards(prev => prev.filter(c => !selectedCardIds.includes(c.id)));
        setMyCreatedCards(prev => prev.filter(c => !selectedCardIds.includes(c.id)));
        
        if (selectedCard && selectedCardIds.includes(selectedCard.id)) {
          setSelectedCard(null);
          setView('feed');
        }
        
        setIsSelectionMode(false);
        setSelectedCardIds([]);
        showToast("선택하신 말씀 카드가 모두 온전히 영구 삭제되었습니다.", "success");
      } catch (err) {
        console.error("Error bulk deleting cards:", err);
        showToast("카드 일괄 삭제에 실패했습니다. 다시 시도해 주세요.", "error");
      } finally {
        setIsAuthLoading(false);
      }
    };

    const handleThumbnailTouchStart = (cardId) => {
      isLongPressActive.current = false;
      if (isSelectionMode) return;
      
      profileLongPressTimerRef.current = setTimeout(() => {
        isLongPressActive.current = true;
        setIsSelectionMode(true);
        setSelectedCardIds([cardId]);
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 2000);
    };

    const handleThumbnailTouchEnd = () => {
      clearTimeout(profileLongPressTimerRef.current);
    };

    const handleThumbnailClick = (card) => {
      if (isSelectionMode) {
        setSelectedCardIds(prev => 
          prev.includes(card.id) 
            ? prev.filter(id => id !== card.id) 
            : [...prev, card.id]
        );
      } else {
        if (!isLongPressActive.current) {
          setSelectedCard(card);
          setView('detail');
        }
      }
      isLongPressActive.current = false;
    };

const handleSearchVerse = async () => {
    if (!verseRefInput.trim()) {
      showToast("장절 주소를 입력하세요 (예: 요한복음 3:16)", "info");
      return;
    }
    const guard = isValidBibleReference(verseRefInput);
    if (!guard.valid) {
      showToast(guard.reason, "error");
      return;
    }
    
    // 1. 성경 구절 입력값 정규화 (예: 이사야 18장 9절 -> 이사야 18:9)
    const normalizedRef = normalizeBibleReference(verseRefInput);
    
    setIsSearching(true);
    try {
      const searchResult = await fetchBibleTextFromAI(normalizedRef);
      
      // 2. 존재하지 않는 구절 감지 및 차단
      if (searchResult.exists === false) {
        showToast(searchResult.error || `${normalizedRef}은(는) 존재하지 않는 구절입니다.`, "error");
        setIsSearching(false);
        return;
      }
      
      const text = searchResult.text || "성경 말씀을 가져오지 못했습니다.";
      const combined = `${text} (${normalizedRef})`;
      
      setVerseText(combined);
      // 정규화된 주소를 UI 입력창과 스토리지에 역동기화
      setVerseRefInput(normalizedRef);
      localStorage.setItem('biblegram_draft_ref', normalizedRef);
      localStorage.setItem('biblegram_draft_text', combined);
      showToast("성스러운 말씀을 성경에서 올바르게 수령했습니다.", "success");
    } catch {
      showToast("일시적 서버 지연이 있습니다. 직접 수동으로 입력을 완료해 주세요.", "info");
    } finally {
      setIsSearching(false);
    }
  };

  const chargeOpportunity = async () => {
    if (user && user.id) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('daily_create_count')
          .eq('id', user.id)
          .single();
          
        if (!userError && userData) {
          const nextCount = (userData.daily_create_count || 0) + 1;
          const now = new Date();
          const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
          
          // 매 생성 시점마다 다음 자정(00:00:00)을 쿨타임 만료일로 지정하여 자정 강제 리셋 연동
          const updates = { 
            daily_create_count: nextCount,
            cooldown_until: nextMidnight.toISOString()
          };
          
          setDailyCreateCount(nextCount); // 프론트엔드 UI 상태 즉시 연동!
          
          await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id);
        }
      } catch (cooldownErr) {
        console.error("Failed to update daily create count:", cooldownErr);
      }
    }
  };

  const handleCreate = async () => {
    if (!verseText.trim()) {
      showToast("마음에 품을 말씀 구절을 기입해 주세요.", "info");
      return;
    }
    
    // 하루 3회 말씀카드 생성 및 12시간 쿨타임 제한 검증
    if (user && user.id) {
      setIsAuthLoading(true);
      const cooldownStatus = await checkUserCooldown(user.id);
      setIsAuthLoading(false);
      
      if (!cooldownStatus.allowed) {
        showToast(cooldownStatus.reason, "error");
        return;
      }
    }
    
    setView('loading');
    const actualThought = includeThought ? userThought : "";
    
    let visualAnalysis = { visualTheme: "light", textConcept: "GRACE" };
    let meditationVal = "주님의 깊은 은혜가 마음에 가득하길 빕니다.";
    let audioUri = "web-speech";
    
    try {
      // 1단계: 시각화 분석
      setLoadingStep('성구의 신학적 분위기를 조율하는 중 (시각 테마 분석)...');
      try {
        visualAnalysis = await analyzeVerseForVisuals(verseText);
      } catch (err) {
        console.warn("Visual analysis failed, using fallback:", err);
      }
      
      // 2단계: 묵상 분석
      setLoadingStep('구주의 보혈 같은 지혜의 해석을 기록하는 중 (해설 융합)...');
      try {
        meditationVal = await generateMeditation(verseText, actualThought);
      } catch (err) {
        console.warn("Meditation generation failed, using fallback:", err);
      }
      
      // 3단계: 성구 낭독 음성 생성
      setLoadingStep('성전에 울릴 거룩한 낭독음을 조율하는 중 (음성 합성)...');
      try {
        audioUri = await generateVerseAudio(verseText, selectedVoice);
      } catch (err) {
        console.warn("TTS audio generation failed, using fallback:", err);
      }
      
      // 성화 이미지 최종 지정
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
      
      await chargeOpportunity();
      setView('result');
      showToast("성구의 신학적 분위기가 반영된 묵상 카드가 융합되었습니다.", "success");
    } catch (error) {
      console.error("생성 치명적 중단 에러:", error);
      showToast('성전 카드 생성 중 지연이 발생하여 기본 테마로 안전하게 우회합니다.', 'info');
      
      // 모든 것이 통째로 깨져도 가장 안전한 기본값으로 강제 복구하여 진입
      const fallbackImage = generateVerseImage('light');
      setCurrentResult({
        id: Date.now(),
        text: verseText,
        image: fallbackImage,
        audio: 'web-speech',
        meditation: "주님의 신비롭고 깊은 은혜가 마음의 성소에 항상 가득하기를 기원합니다.",
        userThought: actualThought,
        likes: 0
      });
      await chargeOpportunity();
      setView('result');
    }
  };
const base64ToBlob = (base64Data, contentType = 'audio/mp3') => {
  const sliceSize = 512;
  let pureBase64 = base64Data;
  if (base64Data.includes(';base64,')) {
    pureBase64 = base64Data.split(';base64,')[1];
  }
  const byteCharacters = window.atob(pureBase64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

const uploadAudioToStorage = async (base64Data, userId) => {
  try {
    const blob = base64ToBlob(base64Data, 'audio/mp3');
    const fileName = `audio_${userId || 'anon'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.mp3`;
    const { data, error } = await supabase.storage
      .from('audio')
      .upload(fileName, blob, {
        contentType: 'audio/mp3',
        cacheControl: 'max-age=31536000, public, immutable',
        upsert: false
      });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from('audio')
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Failed to upload audio to Supabase Storage:", err);
    return null;
  }
};

const handlePublish = async () => {
      if (!user || !user.id) return;
      
      setIsAuthLoading(true);
      try {
        let finalAudioUrl = null;
        if (currentResult.audio && currentResult.audio !== 'web-speech') {
          // Upload the Base64 audio to Supabase Storage and get the public streaming URL
          const uploadedUrl = await uploadAudioToStorage(currentResult.audio, user.id);
          if (uploadedUrl) {
            finalAudioUrl = uploadedUrl;
          } else {
            console.warn("Storage upload failed, falling back to Base64 data URI in DB");
            finalAudioUrl = currentResult.audio;
          }
        }
        
        const newCardData = {
          verse_text: currentResult.text,
          image_url: currentResult.image,
          audio_url: finalAudioUrl,
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
        
        // 성도 교우들의 활발한 활동 알림 트리거 (성물 10개 단위 누적 시 자동 푸시 전송)
        fetch('/api/activity-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorId: user.id,
            authorNickname: nickname || "은혜나눔인"
          })
        }).catch(err => console.error("Activity push trigger failed:", err));
        
        const mappedCard = {
          id: data.id,
          text: data.verse_text,
          image: data.image_url,
          audio: data.audio_url || 'web-speech',
          meditation: data.meditation,
          userThought: data.user_thought,
          author: data.author_nickname,
          author_id: data.author_id,
          likes: data.likes_count,
          commentCount: 0
        };
        
        setFeedCards(prev => [mappedCard, ...prev]);
        setMyCreatedCards(prev => [mappedCard, ...prev]);
        

        
        await supabase.from('bookmarks').insert({ user_id: user.id, card_id: data.id });
        await fetchBookmarks();
        
        localStorage.removeItem('biblegram_draft_ref');
        localStorage.removeItem('biblegram_draft_text');
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
  const isMyCard = (c) => {
    if (!c) return false;
    const authorIdMatches = user && c.author_id === user.id;
    const nicknameMatches = nickname && c.author === nickname;
    const defaultAuthorMatches = c.author === "은혜나눔인";
    return !!(authorIdMatches || nicknameMatches || defaultAuthorMatches);
  };

  const getSavedCardsOfOthers = () => {
    if (!user) return [];
    return savedCards.filter(c => !isMyCard(c));
  };

  const getCreatedCards = () => {
    const isOwnProfile = activeProfileUser === nickname || activeProfileUser === "은혜나눔인";
    if (isOwnProfile) {
      return myCreatedCards;
    } else {
      return feedCards.filter(c => c.author === activeProfileUser);
    }
  };

  const getProfileDisplayCards = () => {
    const isOwnProfile = activeProfileUser === nickname || activeProfileUser === "은혜나눔인";
    if (profileTab === 'created') {
      return getCreatedCards();
    } else {
      return isOwnProfile ? getSavedCardsOfOthers() : otherUserSavedCards;
    }
  };

  useEffect(() => {
    setProfileTab('created');
    const fetchOtherUserSaved = async () => {
      if (!activeProfileUser || activeProfileUser === nickname || activeProfileUser === "은혜나눔인" || activeProfileUser === "나의 서재") {
        setOtherUserSavedCards([]);
        return;
      }
      setIsFetchingOtherSaved(true);
      try {
        const matchingCard = feedCards.find(c => c.author === activeProfileUser);
        if (!matchingCard || !matchingCard.author_id) {
          setOtherUserSavedCards([]);
          setIsFetchingOtherSaved(false);
          return;
        }
        const targetUserId = matchingCard.author_id;

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
          
          setOtherUserSavedCards(mapped);
        } else {
          setOtherUserSavedCards([]);
        }
      } catch (err) {
        console.error("Error fetching other user saved cards:", err);
        setOtherUserSavedCards([]);
      } finally {
        setIsFetchingOtherSaved(false);
      }
    };
    fetchOtherUserSaved();
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
        
        {showSplash && <SplashView onFinish={() => setShowSplash(false)} />}

        {isAuthLoading ? (
          <LoadingFlashback loadingStep="카카오 인증 처리 중..." />
        ) : !user ? (
          <LoginView onKakaoLogin={handleKakaoLogin} onGuestLogin={handleGuestLogin} onTestLogin={handleTestLogin} />
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
              <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="flex-1 overflow-y-auto snap-y snap-mandatory hide-scrollbar bg-black relative"
              >
                {/* 인스타 스타일 당겨서 새로고침 골드 스피너 */}
                {(pullDistance > 0 || isRefreshing) && (
                  <div 
                    className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-150"
                    style={{ 
                      height: `${pullDistance}px`, 
                      opacity: Math.min(1, pullDistance / 40),
                      transform: `translateY(${Math.max(-20, pullDistance - 40)}px)`
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 pt-4">
                      <div className={`w-6 h-6 rounded-full border-2 border-[#DFBA73]/20 border-t-[#DFBA73] ${isRefreshing ? 'animate-spin' : ''}`} />
                      {pullDistance >= 50 && !isRefreshing && (
                        <span className="text-[7.5px] font-sans text-[#DFBA73] tracking-[0.2em] uppercase font-bold">놓아서 새로고침</span>
                      )}
                    </div>
                  </div>
                )}

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
                    onShareCountChange={handleShareCountChangeGlobal}
                    onDeleteCard={handleDeleteCard}
                    userProfiles={userProfiles}
                    isGlobalMuted={isGlobalMuted}
                    setIsGlobalMuted={setIsGlobalMuted}
                    openCommentsForCardId={openCommentsForCardId}
                    onTriggerWebPush={triggerWebPush}
                  />
                ))}
              </div>
            )}

            {/* 2. 묵상 생성 및 입력 뷰 영역 */}
            {view === 'create' && (
              <div className={`flex-1 flex flex-col bg-[#FDFBF7] text-[#2C241B] p-6 pt-[calc(10px+env(safe-area-inset-top))] z-10 pb-[calc(200px+env(safe-area-inset-bottom))] overflow-y-auto hide-scrollbar ${isLargeFont ? 'large-font' : ''}`}>
                <div className="relative mb-6 w-full pt-1.5 flex flex-col items-center text-center">
                  <span className="text-[9px] text-[#A37B3F] font-semibold tracking-[0.2em] uppercase mb-0.5 block">Visual Devotion</span>
                  <h1 className={`font-myeongjo font-extrabold text-[#1A1510] tracking-tight transition-all text-center w-[80%] mx-auto ${isLargeFont ? 'text-[26px]' : 'text-[22px]'}`}>
                    성화 말씀카드 창조하기
                  </h1>
                </div>
                
                <div className="mb-3.5 text-left">
                  {/* 1단계 헤더와 리디자인된 큰글씨 제어기 가로 정밀 정렬 */}
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-[#A37B3F] font-extrabold tracking-wider transition-all ${isLargeFont ? 'text-[16px]' : 'text-[13px]'}`}>
                      1단계: 성서 말씀 탐색
                    </label>
                    
                    {/* 성도님의 가독성을 위한 수려하고 볼드한 둥근 사각형 큰글씨 제어 버튼 */}
                    <button 
                      type="button"
                      onClick={() => {
                        const next = !isLargeFont;
                        setIsLargeFont(next);
                        localStorage.setItem('biblegram_large_font', String(next));
                        showToast(next ? "큰글씨보기가 활성화되었습니다." : "큰글씨보기가 꺼졌습니다.", "success");
                      }}
                      className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border-2 transition-all duration-300 active:scale-95 text-[11px] font-black tracking-wider shadow-md ${
                        isLargeFont 
                          ? 'bg-[#3A3025] border-[#3A3025] text-[#DFBA73]' 
                          : 'bg-[#FAF7F0] border-[#8B7D6B] text-[#5C5346] hover:bg-[#F4EFE6] hover:border-[#3A3025]'
                      }`}
                    >
                      <span>🔍 큰글씨 {isLargeFont ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                  
                  <span className={`text-stone-500/90 block mb-1.5 leading-relaxed transition-all ${isLargeFont ? 'text-[13px]' : 'text-[10.5px]'}`}>
                    한 구절만 찾거나(예: <b>요한복음 3:16</b>),
                    <br />
                    여러 구절을 연속해서 한 번에 찾을 수도 있습니다 (예: <b>창세기 1:6~9</b>).
                  </span>
                  <div className="flex space-x-2 w-full">
                    <input 
                      type="text"
                      value={verseRefInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVerseRefInput(val);
                        localStorage.setItem('biblegram_draft_ref', val);
                      }}
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
                  <label className={`text-[#A37B3F] font-bold tracking-wider mb-1 block transition-all ${isLargeFont ? 'text-[16px]' : 'text-[13px]'}`}>2단계: 성서 말씀 확인 (자동 입력 전용)</label>
                  <textarea 
                    value={verseText}
                    readOnly={true}
                    placeholder="위의 1단계 탐색을 완료하시면 거룩한 말씀의 실상이 이곳에 자동으로 입력됩니다. (자동 입력 전용)"
                    className={`w-full bg-[#F4EFE6]/60 text-stone-700 border border-[#D8CFC0] border-dashed rounded-2xl p-3.5 focus:outline-none cursor-not-allowed font-myeongjo leading-[1.6] tracking-[0.02em] shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] transition-all ${isLargeFont ? 'text-[20px] min-h-[130px]' : 'text-[17px] min-h-[100px]'}`}
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

                {/* 오늘 창조 가능 : x회 남음 배지 (제출 버튼 바로 아래에 정렬하여 가시성 대격상) */}
                {user && user.id && (
                  <div className="mt-4 flex justify-center w-full">
                    <span className={`inline-flex items-center gap-1.5 bg-[#F6EFE2] border border-[#DFBA73]/45 px-5 py-2 rounded-full shadow-[0_3px_12px_rgba(223,186,115,0.15)] font-sans font-black tracking-wide text-[#7C5A26] transition-all animate-pulse duration-[2000ms] text-center justify-center w-[90%] sm:w-auto ${isLargeFont ? 'text-[14px]' : 'text-[12.5px]'}`}>
                      {dailyCreateCount >= 3 
                        ? "🔔 오늘 창조 한도 초과 (내일 생성 가능)" 
                        : `✨ 오늘 창조 가능 : ${3 - dailyCreateCount}회 남음`}
                    </span>
                  </div>
                )}

                {/* 3회 모두 소모한 분들을 위한 다음 자정 초기화 은혜로운 가이드 */}
                {dailyCreateCount >= 3 && (
                  <p className="text-[#ef4444] text-[10.5px] font-sans text-center mt-3 tracking-wide leading-relaxed animate-pulse max-w-[95%] mx-auto break-keep">
                    🔔 하루 말씀카드 생성 한도(3회)를 모두 소모하셨습니다. 내일 자정 (00:00)에 다시 리셋되어 새롭게 말씀 카드를 창조하실 수 있습니다.
                  </p>
                )}

                {/* A계정(오띵) 전용 강제 초기화 임시 버튼 탑재 (UUID/PK 기반 물리 보안 장벽 완비) */}
                {user && String(user.id) === '4908447829' && (
                  <button 
                    type="button"
                    onClick={handleForceResetCooldown}
                    className="w-full py-2.5 mt-3 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] font-bold tracking-wider active:scale-[0.98] transition-transform text-center shadow-md"
                  >
                    [임시] 오늘 말씀 창조 횟수 강제 초기화하기 (0/3)
                  </button>
                )}
                {/* 하단 도크 바 가림 방지 여백 */}
                <div className="h-16 shrink-0" />
              </div>
            )}

            {/* 3. 영적 주마등 인트로 로딩 */}
            {view === 'loading' && (
              <LoadingFlashback loadingStep={loadingStep} />
            )}

            {/* 4. 생성 결과 프리뷰 */}
            {view === 'result' && currentResult && (
              <div className="absolute inset-0 bg-black z-40">
                <div className="absolute inset-0 pb-20">
                   <FeedCard 
                    card={{ ...currentResult, author: nickname || "은혜나눔인", likes: 0, commentCount: 0, shareCount: 0 }} 
                    isPreview={true} 
                    onShowToast={showToast} 
                    likedCardsState={likedCardsState}
                    onToggleLikeGlobal={handleToggleLikeGlobal}
                    user={user}
                    nickname={nickname}
                    onCommentCountChange={handleCommentCountChangeGlobal}
                    onShareCountChange={handleShareCountChangeGlobal}
                    onDeleteCard={handleDeleteCard}
                    userProfiles={userProfiles}
                    isGlobalMuted={isGlobalMuted}
                    setIsGlobalMuted={setIsGlobalMuted}
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
                    onClick={() => {
                      if (dailyCreateCount >= 3) {
                        setIsLimitExhaustedExitModalOpen(true);
                        return;
                      }
                      setIsConfirmCreateModalOpen(true);
                    }} 
                    className="text-[11.5px] font-bold py-2 transition-all tracking-wide text-[#DFBA73]/80 underline underline-offset-4 hover:text-[#DFBA73] active:scale-95"
                  >
                    다른 말씀 선택하기
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
                    onShareCountChange={handleShareCountChangeGlobal}
                    onDeleteCard={handleDeleteCard}
                    userProfiles={userProfiles}
                    isGlobalMuted={isGlobalMuted}
                    setIsGlobalMuted={setIsGlobalMuted}
                    openCommentsForCardId={openCommentsForCardId}
                    onTriggerWebPush={triggerWebPush}
                  />
                </div>
              </div>
            )}

            {/* 6. 성소 보관 서재 프로필 뷰 (타인 조회 대응 완료) */}
            {view === 'profile' && (
              <div 
                onTouchStart={handleProfileTouchStart}
                onTouchMove={handleProfileTouchMove}
                onTouchEnd={handleProfileTouchEnd}
                style={{
                  transform: profilePullDistance > 0 ? `translateY(${profilePullDistance}px)` : 'none',
                  transition: profilePullDistance === 0 ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
                }}
                className="flex-1 flex flex-col bg-[#050505] z-10 pb-[calc(72px+env(safe-area-inset-bottom))] overflow-y-auto hide-scrollbar relative"
              >
                {/* 내 서재 당겨서 새로고침 미니 인디케이터 (토스트 배너 없는 시각 효과) */}
                {profilePullDistance > 0 && (
                  <div 
                    style={{ 
                      opacity: Math.min(1, profilePullDistance / 50),
                      transform: `scale(${Math.min(1, profilePullDistance / 50)})`
                    }}
                    className="absolute top-[calc(80px+env(safe-area-inset-top))] left-0 right-0 z-50 flex justify-center pointer-events-none transition-all"
                  >
                    <div className="bg-[#1a1612]/95 border border-[#DFBA73]/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 scale-90">
                      <div 
                        style={{ transform: `rotate(${profilePullDistance * 4.5}deg)` }}
                        className="w-3.5 h-3.5 border-2 border-[#DFBA73]/20 border-t-[#DFBA73] rounded-full"
                      />
                      <span className="text-[9.5px] text-[#DFBA73]/90 font-sans font-bold tracking-wider">당겨서 은혜 길어오기</span>
                    </div>
                  </div>
                )}
                
                {isProfileRefreshing && (
                  <div className="absolute top-[calc(80px+env(safe-area-inset-top))] left-0 right-0 z-50 flex justify-center pointer-events-none animate-fade-in">
                    <div className="bg-[#1a1612]/95 border border-[#DFBA73]/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 scale-90">
                      <div className="w-3.5 h-3.5 border-2 border-[#DFBA73]/20 border-t-[#DFBA73] rounded-full animate-spin"></div>
                      <span className="text-[9.5px] text-[#DFBA73]/90 font-sans font-bold tracking-wider">은혜 소식 길어오는 중...</span>
                    </div>
                  </div>
                )}
                
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
                  <div className="absolute top-[calc(16px+env(safe-area-inset-top))] right-4 z-[60] flex items-center gap-2">
                    {/* 알림 종 버튼 */}
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(true);
                        const latestId = notifications.length > 0 ? String(notifications[0].id) : '0';
                        localStorage.setItem('biblegram_last_read_notif', latestId);
                        setUnreadCount(0);
                      }}
                      className="w-10 h-10 flex items-center justify-center text-[#DFBA73] hover:text-white bg-[#1a1612]/80 border border-[#DFBA73]/30 rounded-full transition-all duration-300 active:scale-95 backdrop-blur-md shadow-lg relative"
                      title="알림 센터"
                    >
                      <Icons.Bell />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border border-black animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                      )}
                    </button>

                    {/* 설정 톱니바퀴 버튼 */}
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
                          ? myCreatedCards.length 
                          : feedCards.filter(c => c.author === activeProfileUser).length
                        }
                      </div>
                      <div className="text-[10px] font-medium mt-0.5">내가 빚은 말씀</div>
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
                          ? savedCards.filter(c => !isMyCard(c)).length 
                          : otherUserSavedCards.length
                        }
                      </div>
                      <div className="text-[10px] font-medium mt-0.5">소장한 은혜 말씀</div>
                    </button>
                  </div>
                </div>
                
                 {/* 서재 내부 그리드 표현 */}
                 <div className="px-4 py-2.5 flex-1">
                   <div className="flex items-center justify-between mb-2.5 pl-1 min-h-[28px]">
                     <h2 className="text-[13px] text-[#DFBA73]/80 font-bold tracking-widest uppercase font-myeongjo">
                       {profileTab === 'created' 
                         ? (activeProfileUser === nickname || activeProfileUser === "은혜나눔인" ? "내가 빚은 말씀 카드" : `${activeProfileUser} 님의 묵상 기록`)
                         : (activeProfileUser === nickname || activeProfileUser === "은혜나눔인" ? "소장한 말씀 카드" : `${activeProfileUser} 님이 소장한 은혜`)
                       }
                     </h2>
                     {isSelectionMode && profileTab === 'created' && (activeProfileUser === nickname || activeProfileUser === "은혜나눔인") && (
                       <div className="flex items-center gap-1.5 animate-fade-in">
                         <span className="text-[10px] text-[#DFBA73]/60 font-sans">{selectedCardIds.length}개 선택됨</span>
                         <button
                           type="button"
                           onClick={handleDeleteCardsBulk}
                           className="px-2.5 py-0.5 bg-[#ef4444]/15 border border-[#ef4444]/30 hover:bg-[#ef4444]/25 hover:border-[#ef4444]/50 text-[#ef4444] rounded-md text-[10px] font-bold transition-all active:scale-95 shadow-sm"
                         >
                           일괄 삭제
                         </button>
                         <button
                           type="button"
                           onClick={() => {
                             setIsSelectionMode(false);
                             setSelectedCardIds([]);
                           }}
                           className="px-2 py-0.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 rounded-md text-[10px] font-bold transition-all active:scale-95"
                         >
                           취소
                         </button>
                       </div>
                     )}
                   </div>
                   
                   {getProfileDisplayCards().length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                       <p className="text-white/30 text-[14px] font-myeongjo leading-relaxed whitespace-pre-line">
                         {profileTab === 'created' 
                           ? "기록된 말씀 카드가 없습니다.\n새로운 말씀 카드를 창조해 보세요." 
                           : "소장한 말씀 카드가 없습니다.\n은혜광장에서 다른 성도의 말씀 카드를 보관해 보세요."
                         }
                       </p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-3 gap-2.5 animate-fade-in-up">
                       {getProfileDisplayCards().map(card => {
                         const reference = extractReference(card.text);
                         const isSelected = selectedCardIds.includes(card.id);
                         const isMyCreatedSection = profileTab === 'created' && (activeProfileUser === nickname || activeProfileUser === "은혜나눔인");
                         
                         return (
                           <div 
                             key={card.id || card.text} 
                             className={`relative aspect-square bg-[#121212] cursor-pointer group overflow-hidden rounded-[20px] transition-all duration-300 active:scale-95 shadow-md ${
                               isSelected && isSelectionMode
                                 ? 'border-2 border-[#DFBA73] shadow-[0_0_15px_rgba(223,186,115,0.35)] scale-95'
                                 : 'border border-white/5'
                             }`}
                             onTouchStart={() => isMyCreatedSection && handleThumbnailTouchStart(card.id)}
                             onTouchEnd={() => isMyCreatedSection && handleThumbnailTouchEnd()}
                             onMouseDown={() => isMyCreatedSection && handleThumbnailTouchStart(card.id)}
                             onMouseUp={() => isMyCreatedSection && handleThumbnailTouchEnd()}
                             onMouseLeave={() => isMyCreatedSection && handleThumbnailTouchEnd()}
                             onClick={() => handleThumbnailClick(card)}
                           >
                             <img 
                               src={card.image} 
                               alt="thumb" 
                               className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                                 isSelectionMode 
                                   ? (isSelected ? 'opacity-65' : 'opacity-20')
                                   : 'opacity-40 group-hover:opacity-75'
                               }`} 
                             />
                             
                             {/* 체크박스 오버레이 */}
                             {isSelectionMode && isMyCreatedSection && (
                               <div className="absolute top-2 left-2.5 z-10 pointer-events-none">
                                 {isSelected ? (
                                   <div className="w-5 h-5 rounded-full bg-[#DFBA73] border border-white/10 flex items-center justify-center shadow-lg transition-transform duration-200 scale-110">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                       <polyline points="20 6 9 17 4 12"></polyline>
                                     </svg>
                                   </div>
                                 ) : (
                                   <div className="w-5 h-5 rounded-full bg-black/40 border border-white/30 flex items-center justify-center shadow-lg">
                                   </div>
                                 )}
                               </div>
                             )}
                             
                             {/* 성구 썸네일 가운데 한글 성경구절 강조 오버레이 */}
                            <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center p-2 text-center pointer-events-none">
                              <span className="text-[#DFBA73] font-myeongjo font-bold text-[11.5px] leading-snug tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] bg-black/60 px-2 py-1 rounded-lg border border-[#DFBA73]/15">
                                {reference || "묵상 말씀"}
                              </span>
                            </div>
                            
                            {/* 우측 하단 빨간색 하트 & 흰색 말풍선 댓글 레이아웃 (가로 병렬 배치) */}
                            {(card.likes > 0 || (card.commentCount > 0 && profileTab !== 'liked')) && (
                              <div className="absolute bottom-2 right-2.5 flex items-center gap-2 bg-black/75 px-1.5 py-0.5 rounded-md border border-white/5 shadow-sm scale-90 pointer-events-none">
                                {/* 1. 빨간색 하트와 좋아요 개수 */}
                                {card.likes > 0 && (
                                  <div className="flex items-center gap-1 text-red-500">
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      width="9.5" 
                                      height="9.5" 
                                      viewBox="0 0 24 24" 
                                      fill="#ef4444" 
                                      stroke="#ef4444" 
                                      strokeWidth="1"
                                    >
                                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                    </svg>
                                    <span className="text-white/80 font-sans font-extrabold text-[9px] tracking-tight">{card.likes}</span>
                                  </div>
                                )}
                                
                                {/* 2. 흰색 댓글(말풍선)과 댓글/대댓글 개수 (내가 소장한 말씀 탭인 경우 노출 차단) */}
                                {card.commentCount > 0 && profileTab !== 'liked' && (
                                  <div className="flex items-center gap-1 text-stone-200">
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      width="9.5" 
                                      height="9.5" 
                                      viewBox="0 0 24 24" 
                                      fill="currentColor" 
                                      stroke="none"
                                    >
                                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                    </svg>
                                    <span className="text-white/80 font-sans font-extrabold text-[9px] tracking-tight">{card.commentCount}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-white/20 text-[11px] tracking-widest text-center pt-6 pb-2.5 font-sans">
                  오디세이 묵상 하우스 &bull; ALL RIGHTS RESERVED
                </p>
              </div>
            )}

            {/* 7. 프리미엄 도크 바 네비게이션 (바텀 세이프 에어리어 및 수직 중심 칼정렬 보완) */}
            {view !== 'loading' && view !== 'result' && (
              <div className="absolute bottom-0 w-full h-[calc(68px+env(safe-area-inset-bottom))] bg-[#0a0a0a]/90 backdrop-blur-2xl flex justify-around items-center pb-[env(safe-area-inset-bottom)] px-8 z-50 pointer-events-auto border-t border-white/[0.04]">
                <button 
                  onClick={() => { setIsSelectionMode(false); setSelectedCardIds([]); setView('feed'); }} 
                  className={`flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ${view === 'feed' ? 'text-[#DFBA73] scale-105 drop-shadow-md' : 'text-white/30'}`}
                >
                  <div className="flex items-center justify-center h-5.5 w-5.5">
                    <Icons.Home />
                  </div>
                  <span className="text-[9px] mt-1 font-semibold tracking-wide">은혜광장</span>
                </button>
                
                <div className="flex items-center justify-center h-14">
                  <button 
                    onClick={() => { setIsSelectionMode(false); setSelectedCardIds([]); setView('create'); }} 
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
            )}

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
                    
                    {/* 성소 소식 및 버전 정보 */}
                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-4.5 rounded-2xl">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2.5 bg-[#DFBA73]/10 text-[#DFBA73] rounded-xl border border-[#DFBA73]/20 text-[18px] flex items-center justify-center shrink-0 w-[42px] h-[42px]">
                          📜
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13.5px] font-bold text-stone-200 font-sans tracking-wide">성소 소식 및 버전 정보</span>
                          <span className="text-[9.5px] text-stone-500 font-sans leading-normal">
                            현재 버전: v1.6.1
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="py-2 px-3.5 rounded-xl border border-[#DFBA73]/30 hover:border-[#DFBA73] bg-[#DFBA73]/5 hover:bg-[#DFBA73]/10 text-[#DFBA73] text-[11px] font-bold transition-all active:scale-[0.98]"
                      >
                        업데이트 내역
                      </button>
                    </div>

                    {/* 하늘빛 알림 동의 */}
                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-4.5 rounded-2xl">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2.5 bg-[#DFBA73]/10 text-[#DFBA73] rounded-xl border border-[#DFBA73]/20 text-[18px] flex items-center justify-center shrink-0 w-[42px] h-[42px]">
                          🔔
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13.5px] font-bold text-stone-200 font-sans tracking-wide">하늘빛 알림 수신</span>
                          <span className="text-[9.5px] text-stone-500 font-sans leading-normal">
                            댓글, 좋아요 및 은혜 소식을 기기 밖 알림으로 받습니다.
                          </span>
                        </div>
                      </div>
                      
                      {/* ON/OFF 세그먼티드 골드 캡슐 버튼 */}
                      <div 
                        onClick={handleTogglePush}
                        className="relative flex items-center bg-black/40 border border-[#DFBA73]/25 w-[100px] h-8.5 rounded-xl p-0.5 cursor-pointer select-none transition-all duration-300 hover:border-[#DFBA73]/50 shrink-0"
                      >
                        {/* 활성화된 배경 골드 슬라이더 */}
                        <div 
                          style={{
                            background: 'linear-gradient(135deg, #E6C587 0%, #C99E50 100%)',
                            boxShadow: '0 2px 8px rgba(223, 186, 115, 0.3)',
                            left: isPushEnabled ? 'calc(50% - 1px)' : '2px',
                            width: 'calc(50% - 1px)'
                          }}
                          className="absolute top-[2px] bottom-[2px] rounded-[10px] transition-all duration-300 ease-out"
                        />
                        
                        {/* OFF 텍스트 영역 */}
                        <div className={`flex-1 text-center text-[10.5px] font-sans font-extrabold z-10 transition-colors duration-300 ${!isPushEnabled ? 'text-[#0c0a08]' : 'text-stone-400'}`}>
                          OFF
                        </div>
                        
                        {/* ON 텍스트 영역 */}
                        <div className={`flex-1 text-center text-[10.5px] font-sans font-extrabold z-10 transition-colors duration-300 ${isPushEnabled ? 'text-[#0c0a08]' : 'text-stone-400'}`}>
                          ON
                        </div>
                      </div>
                    </div>

                    {/* 성경 낭독 목소리 설정 */}
                    <div className="flex flex-col gap-4.5 bg-white/[0.02] border border-white/[0.04] p-4.5 rounded-2xl">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2.5 bg-[#DFBA73]/10 text-[#DFBA73] rounded-xl border border-[#DFBA73]/20 text-[18px] flex items-center justify-center shrink-0 w-[42px] h-[42px]">
                          🎙️
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13.5px] font-bold text-stone-200 font-sans tracking-wide">내가 빚을 말씀 낭독 목소리</span>
                          <span className="text-[9.5px] text-stone-500 font-sans leading-normal">
                            생성할 말씀 카드에 적용될 고품질 낭독음입니다.
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-0.5">
                        {[
                          { id: 'onyx', name: '하늘 깊은 남성음' },
                          { id: 'echo', name: '따뜻한 은혜 남성음' },
                          { id: 'fable', name: '지혜로운 해설 남성음' },
                          { id: 'alloy', name: '단정한 평온음' },
                          { id: 'nova', name: '맑고 고운 여성음' },
                          { id: 'shimmer', name: '지적인 평화 여성음' }
                        ].map((voiceOption) => (
                          <button
                            key={voiceOption.id}
                            type="button"
                            onClick={() => {
                              setSelectedVoice(voiceOption.id);
                              localStorage.setItem('biblegram_selected_voice', voiceOption.id);
                              showToast(`[${voiceOption.name}]이 선택되었습니다. (미리듣기 재생)`, "success");
                              playVoicePreview(voiceOption.id);
                            }}
                            className={`py-3 px-2.5 rounded-xl border text-[11.5px] font-bold transition-all active:scale-[0.98] ${
                              selectedVoice === voiceOption.id
                                ? 'bg-[#DFBA73]/10 border-[#DFBA73] text-[#DFBA73] shadow-[0_0_12px_rgba(223,186,115,0.15)] font-extrabold animate-pulse'
                                : 'bg-transparent border-white/5 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {voiceOption.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 카카오 계정 연동 상태 표시 */}
                    <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl">
                      <span className="w-2 h-2 rounded-full bg-[#FEE500] animate-pulse shadow-[0_0_8px_rgba(254,229,0,0.6)]" />
                      <span className="text-[13.5px] font-extrabold text-[#FEE500] font-sans tracking-wide drop-shadow-sm">카카오계정 연동됨</span>
                    </div>

                    {/* 로그아웃 버튼 */}
                    <button 
                      onClick={() => {
                        setIsSettingsOpen(false);
                        handleLogout();
                      }}
                      className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-[#ff4d4d] font-bold text-[13.5px] tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 "
                    >
                      <Icons.LogOut />
                      <span>성소 로그아웃</span>
                    </button>



                    
                  </div>
                </div>
              </div>
            )}

            {/* 프리미엄 알림 센터 모달 (인스타그램 하이라이트 기록 뷰 완벽 벤치마킹) */}
            {isNotificationsOpen && (() => {
              const now = new Date();
              const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
              const startOf7DaysAgo = startOfToday - 6 * 24 * 60 * 60 * 1000;
              const startOf30DaysAgo = startOfToday - 29 * 24 * 60 * 60 * 1000;

              const todayGroup = [];
              const yesterdayGroup = [];
              const recent7Group = [];
              const recent30Group = [];
              const olderGroup = [];

              notifications.forEach(n => {
                const t = new Date(n.raw_created_at).getTime();
                if (t >= startOfToday) {
                  todayGroup.push(n);
                } else if (t >= startOfYesterday) {
                  yesterdayGroup.push(n);
                } else if (t >= startOf7DaysAgo) {
                  recent7Group.push(n);
                } else if (t >= startOf30DaysAgo) {
                  recent30Group.push(n);
                } else {
                  olderGroup.push(n);
                }
              });

              const handleNotifClick = async (notif) => {
                setIsNotificationsOpen(false);
                setIsAuthLoading(true);
                try {
                  const { data, error } = await supabase
                    .from('cards')
                    .select(`
                      *,
                      comments (id, comment_text, user_id)
                    `)
                    .eq('id', notif.card_id)
                    .single();
                  
                  if (!error && data) {
                    const commentsList = data.comments || [];
                    const normalComments = commentsList.filter(
                      com => com.comment_text !== '__BIBLEGRAM_SHARE_ACTION__' && 
                             !com.comment_text.startsWith('__BIBLEGRAM_NOTIF__') &&
                             !com.comment_text.startsWith('__BIBLEGRAM_COMMENT_LIKE__:')
                    );
                    
                    const cardDetail = {
                      id: data.id,
                      text: data.verse_text,
                      image: data.image_url,
                      audio: data.audio_url || 'web-speech',
                      meditation: data.meditation,
                      userThought: data.user_thought,
                      author: data.author_nickname,
                      author_id: data.author_id,
                      likes: data.likes_count,
                      commentCount: normalComments.length,
                      autoOpenComments: notif.type === 'comment' || notif.type === 'reply'
                    };
                    
                    setSelectedCard(cardDetail);
                    setView('detail');
                  } else {
                    showToast("게시물이 삭제되었거나 이동할 수 없습니다.", "error");
                  }
                } catch (e) {
                  console.error(e);
                  showToast("카드 조회 중 오류가 생겼습니다.", "error");
                } finally {
                  setIsAuthLoading(false);
                }
              };

              const renderNotifItem = (n) => {
                const avatar = userProfiles[n.author_nickname] || '';
                const cardObj = feedCards.find(c => c.id === n.card_id) || myCreatedCards.find(c => c.id === n.card_id);
                const thumbnail = cardObj ? cardObj.image : '';

                return (
                  <div 
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className="flex items-center justify-between py-3 px-1.5 hover:bg-white/[0.03] rounded-2xl active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-stone-900 overflow-hidden shrink-0">
                        {avatar ? (
                          <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Icons.User />
                        )}
                      </div>
                      
                      <div className="flex-1 text-left min-w-0 text-[12.5px] leading-snug">
                        <span className="font-bold text-stone-200">{n.author_nickname}</span>
                        <span className="text-stone-300 font-sans ml-1">
                          {n.type === 'like' && '님이 회원님의 성화 카드를 좋아합니다.'}
                          {n.type === 'comment' && `님이 댓글을 남겼습니다: "${n.content}"`}
                          {n.type === 'reply' && `님이 댓글에 답글을 남겼습니다: "${n.content}"`}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans ml-2 whitespace-nowrap">{n.timeStr}</span>
                      </div>
                    </div>

                    <div className="w-11 h-11 rounded-lg border border-white/10 bg-stone-950 overflow-hidden shrink-0">
                      {thumbnail ? (
                        <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-stone-600 bg-stone-900 font-serif">†</div>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <div 
                  className="fixed inset-0 bg-black/75 backdrop-blur-md z-[120] animate-fade-in pointer-events-auto"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  <div 
                    className="absolute inset-x-0 bottom-0 top-[10%] bg-[#080706]/98 backdrop-blur-3xl border-t border-[#DFBA73]/30 rounded-t-[32px] p-6 pb-[calc(20px+env(safe-area-inset-bottom))] flex flex-col gap-5 shadow-[0_-15px_50px_rgba(0,0,0,0.95)] animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-10 h-1 bg-white/15 rounded-full mx-auto shrink-0" />

                    <div className="flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#DFBA73]/15 rounded-xl text-[#DFBA73] border border-[#DFBA73]/25 animate-pulse">
                          🔔
                        </div>
                        <h3 className="text-[#DFBA73] font-myeongjo font-bold text-[16px] tracking-wide">하늘빛 알림 센터</h3>
                      </div>
                      <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-[#DFBA73]/60 hover:text-white transition-colors p-1.5"
                      >
                        <Icons.Close />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="my-auto py-12 flex flex-col items-center gap-3 text-stone-500 font-sans text-[12.5px]">
                          <span className="text-[28px] opacity-40">🕊️</span>
                          <span>아직 도착한 하늘빛 소식이 없습니다.</span>
                        </div>
                      ) : (
                        <>
                          {todayGroup.length > 0 && (
                            <div className="flex flex-col gap-1.5 text-left">
                              <h4 className="text-[12px] font-extrabold text-[#DFBA73]/80 px-1">오늘</h4>
                              <div className="flex flex-col gap-1">{todayGroup.map(renderNotifItem)}</div>
                            </div>
                          )}

                          {yesterdayGroup.length > 0 && (
                            <div className="flex flex-col gap-1.5 text-left">
                              <h4 className="text-[12px] font-extrabold text-stone-500 px-1">어제</h4>
                              <div className="flex flex-col gap-1">{yesterdayGroup.map(renderNotifItem)}</div>
                            </div>
                          )}

                          {recent7Group.length > 0 && (
                            <div className="flex flex-col gap-1.5 text-left">
                              <h4 className="text-[12px] font-extrabold text-stone-500 px-1">최근 7일</h4>
                              <div className="flex flex-col gap-1">{recent7Group.map(renderNotifItem)}</div>
                            </div>
                          )}

                          {recent30Group.length > 0 && (
                            <div className="flex flex-col gap-1.5 text-left">
                              <h4 className="text-[12px] font-extrabold text-stone-500 px-1">최근 30일</h4>
                              <div className="flex flex-col gap-1">{recent30Group.map(renderNotifItem)}</div>
                            </div>
                          )}

                          {olderGroup.length > 0 && (
                            <div className="flex flex-col gap-1.5 text-left">
                              <h4 className="text-[12px] font-extrabold text-stone-500 px-1">오래된 알림</h4>
                              <div className="flex flex-col gap-1">{olderGroup.map(renderNotifItem)}</div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 실시간 인앱 알림 슬라이드 다운 배너 UI */}
            {inAppNotification && (
              <div className="fixed top-12 left-4 right-4 bg-[#080706]/96 backdrop-blur-xl border border-[#DFBA73]/40 p-4.5 rounded-2xl z-[150] shadow-[0_15px_35px_rgba(0,0,0,0.85)] flex items-center gap-3.5 animate-slide-down pointer-events-auto">
                <div className="p-2.5 bg-[#DFBA73]/15 text-[#DFBA73] rounded-xl border border-[#DFBA73]/25 text-[18px]">
                  🔔
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-[11px] font-extrabold text-[#DFBA73] block tracking-wider uppercase">새 하늘빛 소식</span>
                  <span className="text-[13px] text-stone-200 block font-sans mt-0.5 leading-snug truncate">
                    {inAppNotification.message}
                  </span>
                </div>
                <button 
                  onClick={() => setInAppNotification(null)}
                  className="text-[#DFBA73]/60 hover:text-white transition-colors p-1.5 shrink-0"
                >
                  <Icons.Close />
                </button>
              </div>
            )}

            {/* 9. 프리미엄 업데이트 내역 모달 */}
            {isUpdateModalOpen && (
              <div 
                className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in pointer-events-auto"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                <div 
                  className="bg-[#0c0a08] border border-[#DFBA73]/40 rounded-[28px] w-full max-w-[340px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-5 animate-scale-up max-h-[80vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-[#DFBA73]/20">
                    <h3 className="text-[#DFBA73] font-myeongjo font-bold text-[16px] tracking-wide">업데이트 내역 (v1.7.0)</h3>
                    <button 
                      onClick={() => setIsUpdateModalOpen(false)}
                      className="text-[#DFBA73]/60 hover:text-white transition-colors"
                    >
                      <Icons.Close />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4.5 text-left text-[12.5px] text-stone-300 font-sans leading-relaxed max-h-[50vh] scrollbar-thin">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-[#DFBA73]/20 text-[#DFBA73] border border-[#DFBA73]/30">v1.7.0</span>
                        <span className="text-[10px] text-stone-500 font-medium">2026.05.25</span>
                      </div>
                      <p className="font-bold text-stone-200 text-[13px] mb-1">성소 브랜딩 및 로직 대개편</p>
                      <ul className="list-disc list-inside pl-1 text-[11px] text-stone-400 flex flex-col gap-1">
                        <li>홈 화면 추가 시 한국어 이름 '바이블그램' 및 황금 십자가 PWA 고화질 엠블럼을 정식 탑재했습니다.</li>
                        <li>음성 오디오 영구 브라우저 캐싱(1년 만기)을 적용하여 기기 용량 부담 없이 다운로드 데이터 트래픽 소모를 차단했습니다.</li>
                        <li>모바일 브라우저 보안 제약을 완벽히 우회하는 수동 클릭 제스처 기반 '하늘빛 알림 연동' 모달을 이식했습니다.</li>
                        <li>내가 생성한 말씀 카드에 달린 타인의 모든 댓글을 카드 주인으로서 직접 영구 삭제 관리할 수 있도록 권한을 완치했습니다.</li>
                        <li>오디오 자동 재생이 제한될 시 화면을 방해하던 모든 연결 지연 토스트 알림을 청소하여 쾌적한 감상을 보장합니다.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-stone-800 text-stone-400 border border-stone-700">v1.6.1</span>
                        <span className="text-[10px] text-stone-500 font-medium">2026.05.25</span>
                      </div>
                      <p className="font-bold text-stone-200 text-[13px] mb-1">성소 복원력 보강 및 낭독 안정화</p>
                      <ul className="list-disc list-inside pl-1 text-[11px] text-stone-400 flex flex-col gap-1">
                        <li>말씀 낭독 음향의 클라우드 저장 최적화 및 로컬 백업 이식으로 재생 무결성을 극대화하였습니다.</li>
                        <li>지연 시 대체 낭독 토스트 안내 노출을 1.3초로 조율하고, 서서히 사라지는 Fade 애니메이션을 적용해 감성 가독성을 보호하였습니다.</li>
                        <li>성소 마스터 계정을 위한 통합 관리 권한 정립 및 삭제 권한 동기화를 완치하였습니다.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-stone-800 text-stone-400 border border-stone-700">v1.6.0</span>
                        <span className="text-[10px] text-stone-500 font-medium">2026.05.25</span>
                      </div>
                      <p className="font-bold text-stone-200 text-[13px] mb-1">성소 권한 정립 및 공감 안정화</p>
                      <ul className="list-disc list-inside pl-1 text-[11px] text-stone-400 flex flex-col gap-1">
                        <li>댓글 더블탭 및 하트 터치 시 공감 카운팅이 한층 더 부드럽고 확실하게 작동하도록 개선하였습니다.</li>
                        <li>공감 취소 시 상대방 성도님께 가 있던 알림까지 깨끗이 회수되어 불필요한 흔적이 남지 않습니다.</li>
                        <li>본인이 작성한 말씀 카드만 성전(피드) 및 서재에서 영구 삭제 가능하도록 보안을 강화하였습니다.</li>
                        <li>내가 올린 말씀 카드에 달린 타인의 댓글은 게시물 주인으로서 직접 지워 관리할 수 있도록 합리적으로 정돈하였습니다.</li>
                        <li>성소 소식 및 버전 정보가 설정 목록 최상단의 📜 카드 메뉴로 보기 좋게 재구성되었습니다.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-stone-800 text-stone-400 border border-stone-700">v1.5.4</span>
                        <span className="text-[10px] text-stone-500 font-medium">2026.05.25</span>
                      </div>
                      <p className="font-bold text-stone-200 text-[13px] mb-1">서재 관리 및 로그인 안정화</p>
                      <ul className="list-disc list-inside pl-1 text-[11px] text-stone-400 flex flex-col gap-1">
                        <li>내 서재에서 직접 만든 말씀 카드를 꾹 눌러 다중 선택 후 일괄 삭제할 수 있습니다.</li>
                        <li>일부 모바일 브라우저 환경에서 로그인이 안 되던 문제를 해결하였습니다.</li>
                        <li>로그인 화면의 비주얼 연출이 더욱 세련되게 개선되었습니다.</li>
                        <li>설정 화면 레이아웃이 보기 좋게 정돈되었습니다.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-stone-800 text-stone-400 border border-stone-700">v1.4.0</span>
                        <span className="text-[10px] text-stone-500 font-medium">2026.05.23</span>
                      </div>
                      <p className="font-bold text-stone-300 text-[13px] mb-1">성경 낭독 목소리 선택 및 편의성 개선</p>
                      <ul className="list-disc list-inside pl-1 text-[11px] text-stone-400 flex flex-col gap-1">
                        <li>6가지 고품질 낭독 목소리를 설정에서 직접 고르고 미리 들을 수 있습니다.</li>
                        <li>서재 썸네일에 성경 장절이 표시되어 한눈에 구별할 수 있습니다.</li>
                        <li>음소거 설정이 피드 전체에서 유지됩니다.</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[12.5px] tracking-wide active:scale-[0.98] transition-all"
                  >
                    은혜의 성소로 돌아가기
                  </button>
                </div>
              </div>
            )}

            {/* 10. 말씀 카드 재창조 확인 모달 */}
            {isConfirmCreateModalOpen && (
              <div 
                className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in pointer-events-auto"
                onClick={() => setIsConfirmCreateModalOpen(false)}
              >
                <div 
                  className="bg-[#0c0a08] border border-[#DFBA73]/40 rounded-[28px] w-full max-w-[320px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-5 animate-scale-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="text-[28px]">📜</span>
                    <h3 className="text-[#DFBA73] font-myeongjo font-bold text-[16px] tracking-wide mt-1">말씀 새롭게 창조하기</h3>
                    <p className="text-[12.5px] text-stone-300 font-sans leading-relaxed mt-1 whitespace-pre-line">
                      방금 창조하신 말씀 카드에 1회의 창조 기회가 사용되었습니다.
                      {"\n\n"}
                      새로운 말씀 카드를 다시 창조하시겠습니까?
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={() => {
                        setView('create');
                        setIsConfirmCreateModalOpen(false);
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[12.5px] tracking-wide active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(223,186,115,0.2)]"
                    >
                      네, 새롭게 창조할게요
                    </button>
                    <button
                      onClick={() => setIsConfirmCreateModalOpen(false)}
                      className="w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-stone-300 font-bold text-[12.5px] tracking-wide active:scale-[0.98] transition-all hover:bg-white/[0.06]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* 11. 생성 한도 초과 시 서재 이동 확인 모달 */}
            {isLimitExhaustedExitModalOpen && (
              <div 
                className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in pointer-events-auto"
                onClick={() => setIsLimitExhaustedExitModalOpen(false)}
              >
                <div 
                  className="bg-[#0c0a08] border border-[#DFBA73]/40 rounded-[28px] w-full max-w-[320px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-5 animate-scale-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="text-[28px]">🚪</span>
                    <h3 className="text-[#DFBA73] font-myeongjo font-bold text-[16px] tracking-wide mt-1">오늘의 기회 모두 소모</h3>
                    <p className="text-[12.5px] text-stone-300 font-sans leading-relaxed mt-1 whitespace-pre-line">
                      오늘 3회의 창조 기회가 모두 사용되었습니다.
                      {"\n\n"}
                      내 서재로 돌아가시겠습니까?
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={() => {
                        setView('profile');
                        setIsLimitExhaustedExitModalOpen(false);
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[12.5px] tracking-wide active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(223,186,115,0.2)]"
                    >
                      네, 내 서재로 갈게요
                    </button>
                    <button
                      onClick={() => setIsLimitExhaustedExitModalOpen(false)}
                      className="w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-stone-300 font-bold text-[12.5px] tracking-wide active:scale-[0.98] transition-all hover:bg-white/[0.06]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. 하늘빛 알림 권한 연동 모달 */}
            {showPushPromptModal && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-fade-in pointer-events-auto">
                <div 
                  className="bg-[#0c0a08]/98 border border-[#DFBA73]/40 rounded-[28px] w-full max-w-[320px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-5 animate-scale-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center gap-3.5 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#DFBA73]/10 border border-[#DFBA73]/20 flex items-center justify-center text-[#DFBA73]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </div>
                    <h3 className="text-[#DFBA73] font-myeongjo font-bold text-[16px] tracking-wide mt-1">하늘빛 실시간 알림 연동</h3>
                    <p className="text-[12px] text-stone-300 font-sans leading-relaxed mt-1 whitespace-pre-line text-center">
                      말씀 성소의 새로운 말씀 공감과 댓글 소식을 백그라운드 푸시 알림으로 즉각 전해 드립니다.
                      {"\n\n"}
                      실시간 소통을 위해 알림을 허용해 주시겠습니까?
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full mt-1">
                    <button
                      onClick={handleAcceptPushPermission}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-black font-extrabold text-[12.5px] tracking-wide active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(223,186,115,0.2)]"
                    >
                      알림 활성화하기
                    </button>
                    <button
                      onClick={handleDeclinePushPermission}
                      className="w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-stone-400 font-bold text-[12.5px] tracking-wide active:scale-[0.98] transition-all hover:bg-white/[0.06]"
                    >
                      나중에 하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. 프리미엄 인앱 알림 토스트 */}
            <div 
              className={`absolute top-20 left-4 right-4 z-[99] p-3.5 rounded-2xl flex items-center gap-3 shadow-2xl transition-all duration-500 ease-in-out ${toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-1 opacity-0 scale-98 pointer-events-none'}`}
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