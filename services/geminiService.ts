import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, AuditResult, SeoIssue, KeywordData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_FAST = 'gemini-2.5-flash';

// Helper to clean JSON string if Gemini adds markdown code blocks
const cleanJson = (text: string) => {
  let clean = text.replace(/```json/g, '').replace(/```/g, '');
  return clean.trim();
};

export const generateAudit = async (profile: BusinessProfile): Promise<AuditResult> => {
  const prompt = `
    You are an expert Technical SEO Auditor. Analyze the hypothetical SEO status for this business:
    Business: ${profile.businessName}
    URL: ${profile.websiteUrl}
    Industry: ${profile.industry}
    
    Simulate a realistic SEO audit. Return a JSON object with this exact schema:
    {
      "score": number (0-100),
      "summary": "Short executive summary of findings",
      "issues": [
        {
          "id": "string (unique)",
          "type": "CRITICAL" | "WARNING" | "NOTICE",
          "category": "ON_PAGE" | "TECHNICAL",
          "title": "Issue title",
          "description": "What is wrong",
          "recommendation": "How to fix it"
        }
      ]
    }
    Generate at least 6 varied issues tailored to the industry.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(cleanJson(text)) as AuditResult;
  } catch (error) {
    console.error("Audit Generation Error", error);
    return {
      score: 50,
      summary: "Could not generate audit. Please check API key.",
      issues: []
    };
  }
};

export const generateKeywords = async (profile: BusinessProfile): Promise<KeywordData[]> => {
  const prompt = `
    You are a Keyword Research Specialist. Generate a list of high-value SEO keywords for:
    Business: ${profile.businessName}
    Industry: ${profile.industry}
    Location: ${profile.location}
    Core Topic: ${profile.primaryKeywords}

    Return a JSON array of objects:
    [
      {
        "keyword": "string",
        "intent": "Transactional" | "Informational" | "Local" | "Navigational",
        "volume": "string (e.g. '1.2k')",
        "difficulty": number (0-100)
      }
    ]
    Generate 10-15 keywords.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
  } catch (error) {
    console.error("Keyword Generation Error", error);
    return [];
  }
};

export const generateBlogPost = async (topic: string, profile: BusinessProfile) => {
  const prompt = `
    You are an expert SEO Content Writer. Write a comprehensive blog post about "${topic}".
    Context:
    Business: ${profile.businessName}
    Location: ${profile.location}
    
    Requirements:
    - Use Markdown format.
    - SEO Optimized Title (H1).
    - Engaging Introduction.
    - Several H2 and H3 subheadings.
    - An FAQ section (AEO optimized).
    - A conclusion with a Call to Action.
    - Approx 800 words.
    - Tone: Professional but accessible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Content Generation Error", error);
    return "Error generating content. Please try again.";
  }
};

export const fixIssueWithAI = async (issue: SeoIssue, profile: BusinessProfile): Promise<string> => {
    const prompt = `
      You are an SEO technician. Provide the specific code fix or text rewrite for this issue:
      Issue: ${issue.title}
      Description: ${issue.description}
      Context: Business "${profile.businessName}" in "${profile.industry}".
      
      Provide ONLY the solution (e.g., the new Meta Tag, the rewritten H1, or the robots.txt snippet). No conversational filler.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: prompt,
      });
      return response.text || "Could not generate fix.";
    } catch (error) {
      return "Error generating fix.";
    }
  };

export const generateLocalStrategy = async (profile: BusinessProfile) => {
    const prompt = `
      Create a Local SEO Strategy for:
      Business: ${profile.businessName}
      Location: ${profile.location}
      Type: ${profile.industry}

      Return a JSON object:
      {
        "googleBusinessProfile": {
            "description": "Optimized 750 char description",
            "posts": ["Post Idea 1", "Post Idea 2", "Post Idea 3"]
        },
        "landingPageStructure": {
            "h1": "string",
            "sections": ["string", "string"]
        },
        "localKeywords": ["string", "string", "string"]
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_FAST,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        return null;
    }
}

export const generateBacklinkStrategy = async (profile: BusinessProfile) => {
    const prompt = `
      Create a Backlink Outreach Strategy for:
      Business: ${profile.businessName}
      Competitors: ${profile.competitors}
      
      Return a JSON object:
      {
          "opportunities": [
              {"type": "Guest Post", "target": "Industry Blogs", "potential": "High"},
              {"type": "Directory", "target": "Local Listings", "potential": "Medium"}
          ],
          "emailTemplate": "Subject: ... Body: ..."
      }
    `;
    try {
        const response = await ai.models.generateContent({
            model: MODEL_FAST,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        return null;
    }
}