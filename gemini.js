const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

globalThis.fetch = fetch;
globalThis.Headers = fetch.Headers;

class GeminiHandler {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async getResponse(prompt) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }]
      });

      return {
        success: true,
        text: result.response.text()
      };
    } catch (error) {
      return {
        success: false,
        text: `API Error: ${error.message}`
      };
    }
  }
}

module.exports = GeminiHandler;
