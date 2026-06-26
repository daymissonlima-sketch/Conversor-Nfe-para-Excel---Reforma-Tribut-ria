import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON and urlencoded parser with generous limits
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API Route: Smart parsing of unstructured RFB text using Gemini
  app.post("/api/gemini/parse-debt", async (req, res) => {
    try {
      const { text, category } = req.body;
      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "O texto do relatório não pode estar vazio." });
      }

      if (!ai) {
        return res.status(503).json({
          error: "O serviço de IA (Gemini API) não está configurado. Verifique as credenciais no painel de Configurações."
        });
      }

      const systemInstruction = `Você é um assistente especializado em auditoria e contabilidade fiscal no Brasil.
Seu objetivo é extrair informações de relatórios de débitos fiscais (como Diagnóstico Fiscal da Receita Federal do Brasil, SIEF, etc.) fornecidos em formato de texto bruto.

Extraia as seguintes informações do texto:
1. Dados do Cliente:
   - CNPJ (apenas números e caracteres de formatação, ex: 56.159.752/0001-54)
   - Nome/Razão Social da empresa (ex: ENCHRIDION TECH LTDA)

2. Lista de Débitos / Pendências:
   Para cada linha ou item de débito listado na seção "Pendência - Débito" ou similar, extraia:
   - code: Código da receita se houver (ex: "1099-01", "4406-01", "5440-01"). Caso não haja código explícito, deixe vazio ou null.
   - categoryRaw: Descrição/tipo do débito ou receita (ex: "CP-SEGUR.", "MAED - PGDAS-D", "SIMPLES NACIONAL", "MULTA").
   - period: Período de apuração (PA/Exercício) no formato "MM/AAAA" (ex: "07/2025").
   - dueDate: Data de vencimento no formato "DD/MM/AAAA" (ex: "20/08/2025").
   - principal: Valor original ou principal (número decimal).
   - penalty: Valor da multa (número decimal).
   - interest: Valor dos juros (número decimal).
   - total: Valor do saldo devedor consolidado ou total (número decimal).
   - status: Situação/status do débito (ex: "DEVEDOR", "SUSPENSO", "A VENCER").

Instruções importantes:
- Ignore linhas de cabeçalho, rodapés, nomes de sócios ou administradores, e outras informações irrelevantes na lista de débitos.
- Converta valores numéricos monetários (que vêm com pontos e vírgulas, ex: "333,96" ou "1.234,56") para números decimais corretos de JS (ex: 333.96, 1234.56).
- Se faltar algum campo de valor (como Multa ou Juros), use 0.
- Se o formato estiver um pouco deslocado ou fora de padrão, use seu raciocínio contextual para alinhar as colunas corretamente. Por exemplo, a coluna "Receita" costuma conter o código (como 1099-01) e a descrição (como CP-SEGUR.).${
  category
    ? `\n\nATENÇÃO ESPECIAL: O usuário selecionou especificamente a categoria de débito "${category}". Todos os débitos listados no texto enviado pertencem exclusivamente a essa categoria ou tributo. Atribua e alinhe a descrição/categoria de cada débito de forma correspondente ou consistente com "${category}".`
    : ""
}`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          clientInfo: {
            type: Type.OBJECT,
            properties: {
              cnpj: { type: Type.STRING },
              name: { type: Type.STRING }
            },
            required: ["cnpj", "name"]
          },
          debts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING, description: "Código da receita, ex: 1099-01" },
                categoryRaw: { type: Type.STRING, description: "Descrição ou sigla do tributo, ex: CP-SEGUR" },
                period: { type: Type.STRING, description: "PA / Exercício, ex: 07/2025" },
                dueDate: { type: Type.STRING, description: "Data de vencimento, ex: 20/08/2025" },
                principal: { type: Type.NUMBER, description: "Valor original ou principal" },
                penalty: { type: Type.NUMBER, description: "Valor de multa" },
                interest: { type: Type.NUMBER, description: "Valor de juros" },
                total: { type: Type.NUMBER, description: "Valor total / consolidado" },
                status: { type: Type.STRING, description: "Status, ex: DEVEDOR, SUSPENSO, A VENCER" }
              },
              required: ["categoryRaw", "period", "principal", "penalty", "interest", "total"]
            }
          }
        },
        required: ["clientInfo", "debts"]
      };

      // Try to generate content with gemini-3.5-flash (highest quota, modern), and fall back to other highly available models if any face high demand or quota issues.
      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
      let result = null;
      let lastError = null;

      for (const model of modelsToTry) {
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`[Parse Debt] Trying model ${model} (attempt ${attempts}/${maxAttempts})...`);
            const response = await ai.models.generateContent({
              model: model,
              contents: text,
              config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
              }
            });
            result = response;
            break;
          } catch (err: any) {
            lastError = err;
            console.error(`[Parse Debt] Model ${model} attempt ${attempts} failed:`, err?.message || err);
            if (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
        if (result) break;
      }

      if (!result) {
        throw lastError || new Error("Não foi possível obter resposta de nenhuma das instâncias da IA.");
      }

      const parsedJSON = JSON.parse(result.text || "{}");
      res.json(parsedJSON);

    } catch (error: any) {
      console.error("Gemini Parse Error:", error);
      res.status(500).json({ error: error?.message || "Erro ao processar as informações através da IA." });
    }
  });

  // Serve static client files in production, use Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
