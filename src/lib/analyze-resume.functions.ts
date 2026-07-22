import { createServerFn } from "@tanstack/react-start";

export type ResumeAnalysis = {
  ats_score: number;
  score_rationale: string;
  summary: string;
  strengths: string[];
  missing_keywords: string[];
  suggestions: { title: string; detail: string }[];
};

type Input = {
  pdfBase64: string;
  fileName: string;
  jobDescription?: string;
};

const SYSTEM = `You are an expert resume reviewer and ATS specialist. You give clear, supportive, specific feedback to job seekers. Return ONLY valid JSON matching the requested schema, no prose, no code fences.`;

function buildPrompt(jd?: string) {
  const jdBlock = jd?.trim()
    ? `\n\nTARGET JOB DESCRIPTION:\n"""\n${jd.trim().slice(0, 6000)}\n"""\nTailor keyword and suggestion analysis to this role.`
    : `\n\nNo job description was provided, evaluate the resume generally against modern ATS best practices.`;

  return `Analyze the attached resume PDF and return a JSON object with this exact shape:
{
  "ats_score": number (0-100, how well this resume would pass a typical ATS parse and keyword match),
  "score_rationale": string (1-2 sentences explaining the score),
  "summary": string (2-3 sentence professional summary of the candidate),
  "strengths": string[] (3-5 concrete strengths from the resume),
  "missing_keywords": string[] (5-12 keywords/skills that would strengthen this resume${jd ? " for the target role" : ""}),
  "suggestions": [ { "title": string, "detail": string } ] (4-6 specific, actionable improvements)
}${jdBlock}

Be specific and reference actual content from the resume. Avoid generic advice.`;
}

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const data = input as Input;
    if (!data?.pdfBase64 || typeof data.pdfBase64 !== "string") {
      throw new Error("Missing PDF data");
    }
    return data;
  })
  .handler(async ({ data }): Promise<ResumeAnalysis> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const body = {
      model: "google/gemini-3.6-flash",
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: buildPrompt(data.jobDescription) },
            {
              type: "file",
              file: {
                filename: data.fileName || "resume.pdf",
                file_data: `data:application/pdf;base64,${data.pdfBase64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) {
        throw new Error("Rate limit reached. Please try again in a moment.");
      }
      if (res.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
      throw new Error(`Analysis failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    let parsed: ResumeAnalysis;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from the content
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse AI response");
      parsed = JSON.parse(match[0]);
    }

    return {
      ats_score: Math.max(0, Math.min(100, Number(parsed.ats_score) || 0)),
      score_rationale: String(parsed.score_rationale ?? ""),
      summary: String(parsed.summary ?? ""),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String).slice(0, 8) : [],
      missing_keywords: Array.isArray(parsed.missing_keywords)
        ? parsed.missing_keywords.map(String).slice(0, 15)
        : [],
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions
            .filter((s: any) => s && (s.title || s.detail))
            .map((s: any) => ({ title: String(s.title ?? ""), detail: String(s.detail ?? "") }))
            .slice(0, 8)
        : [],
    };
  });
