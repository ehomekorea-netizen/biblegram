/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import generateHandler from './api/generate.js'
import kakaoLoginHandler from './api/kakao-login.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env files in the current working directory.
  // The third parameter '' loads all environment variables, including those without the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Inject the API key into process.env so that api/generate.js can read it.
  const rawKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = rawKey ? rawKey.trim().replace(/[\r\n]/g, '') : '';
  process.env.VITE_GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const rawUnsplash = env.UNSPLASH_ACCESS_KEY || env.VITE_UNSPLASH_ACCESS_KEY;
  process.env.UNSPLASH_ACCESS_KEY = rawUnsplash ? rawUnsplash.trim().replace(/[\r\n]/g, '') : '';

  const rawOpenAI = env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = rawOpenAI ? rawOpenAI.trim().replace(/[\r\n]/g, '') : '';

  const rawKakao = env.KAKAO_REST_API_KEY || env.VITE_KAKAO_REST_API_KEY;
  process.env.KAKAO_REST_API_KEY = rawKakao ? rawKakao.trim().replace(/[\r\n]/g, '') : '';
  process.env.VITE_KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

  console.log("Vite Config raw env keys:", Object.keys(env).filter(k => k.includes('GEMINI') || k.includes('OPENAI') || k.includes('UNSPLASH') || k.includes('KAKAO')));
  console.log("UNSPLASH_ACCESS_KEY raw type/val:", typeof env.UNSPLASH_ACCESS_KEY, env.UNSPLASH_ACCESS_KEY ? env.UNSPLASH_ACCESS_KEY.length : "empty");
  console.log("OPENAI_API_KEY raw type/val:", typeof env.OPENAI_API_KEY, env.OPENAI_API_KEY ? env.OPENAI_API_KEY.length : "empty");
  console.log("KAKAO_REST_API_KEY raw type/val:", typeof env.KAKAO_REST_API_KEY, env.KAKAO_REST_API_KEY ? env.KAKAO_REST_API_KEY.length : "empty");
  console.log("Injected process.env: GEMINI=", !!process.env.GEMINI_API_KEY, "UNSPLASH=", !!process.env.UNSPLASH_ACCESS_KEY, "OPENAI=", !!process.env.OPENAI_API_KEY, "KAKAO=", !!process.env.KAKAO_REST_API_KEY);

  return {
    plugins: [
      react(),
      {
        name: 'api-gateway',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/api/generate')) {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsedBody = body ? JSON.parse(body) : {};
                  req.body = parsedBody;
                  
                  const mockRes = {
                    statusCode: 200,
                    setHeader(name, value) {
                      res.setHeader(name, value);
                      return this;
                    },
                    status(code) {
                      this.statusCode = code;
                      res.statusCode = code;
                      return this;
                    },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json');
                      res.writeHead(this.statusCode);
                      res.end(JSON.stringify(data));
                    },
                    send(data) {
                      res.writeHead(this.statusCode);
                      res.end(data);
                    },
                    end(data) {
                      res.writeHead(this.statusCode);
                      res.end(data);
                    }
                  };

                  await generateHandler(req, mockRes);
                } catch (err) {
                  console.error("Vite API Middleware Error:", err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            } else if (req.url && req.url.startsWith('/api/kakao-login')) {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsedBody = body ? JSON.parse(body) : {};
                  req.body = parsedBody;
                  
                  const mockRes = {
                    statusCode: 200,
                    setHeader(name, value) {
                      res.setHeader(name, value);
                      return this;
                    },
                    status(code) {
                      this.statusCode = code;
                      res.statusCode = code;
                      return this;
                    },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json');
                      res.writeHead(this.statusCode);
                      res.end(JSON.stringify(data));
                    },
                    send(data) {
                      res.writeHead(this.statusCode);
                      res.end(data);
                    },
                    end(data) {
                      res.writeHead(this.statusCode);
                      res.end(data);
                    }
                  };

                  await kakaoLoginHandler(req, mockRes);
                } catch (err) {
                  console.error("Vite Kakao API Middleware Error:", err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ]
  }
})
// Trigger restart 2 - force Vercel rebuild with correct Kakao JS key
